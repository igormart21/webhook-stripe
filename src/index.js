require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

const app = express();

// Middleware para log de todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Configuração do express para webhook
app.use('/webhook', express.raw({type: 'application/json'}));
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ status: 'Webhook está funcionando!' });
});

// Função para obter token de acesso da Hotmart
async function getHotmartAccessToken() {
  try {
    console.log('Tentando obter token da Hotmart...');
    const response = await axios.post('https://developers.hotmart.com/security/oauth/token', {
      grant_type: 'client_credentials',
      client_id: process.env.HOTMART_CLIENT_ID,
      client_secret: process.env.HOTMART_CLIENT_SECRET
    });
    console.log('Token obtido com sucesso');
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token da Hotmart:', error.response?.data || error.message);
    throw error;
  }
}

// Função para adicionar membro à área de membros da Hotmart
async function addMemberToHotmart(email, name) {
  try {
    console.log(`Tentando adicionar membro: ${email}`);
    const accessToken = await getHotmartAccessToken();
    
    const response = await axios.post(
      `https://developers.hotmart.com/payments/api/v1/sales/history`,
      {
        product_id: process.env.HOTMART_PRODUCT_ID,
        email: email,
        name: name,
        status: 'APPROVED'
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Resposta da Hotmart:', response.data);
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar membro à Hotmart:', error.response?.data || error.message);
    throw error;
  }
}

// Webhook do Stripe
app.post('/webhook', async (req, res) => {
  console.log('Webhook recebido');
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    console.log('Tentando verificar assinatura do webhook...');
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    console.log('Assinatura verificada com sucesso');
  } catch (err) {
    console.error('Erro na assinatura do webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Lidar com o evento de pagamento bem-sucedido
  if (event.type === 'checkout.session.completed') {
    console.log('Evento checkout.session.completed recebido');
    const session = event.data.object;
    console.log('Dados da sessão:', JSON.stringify(session, null, 2));
    
    try {
      // Adicionar membro à Hotmart
      await addMemberToHotmart(
        session.customer_details.email,
        session.customer_details.name
      );
      
      console.log('Membro adicionado com sucesso à Hotmart');
    } catch (error) {
      console.error('Erro ao processar pagamento:', error);
      return res.status(500).json({ error: 'Erro ao processar pagamento' });
    }
  } else {
    console.log('Evento recebido:', event.type);
  }

  res.json({received: true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
  console.log('Variáveis de ambiente carregadas:');
  console.log('- STRIPE_SECRET_KEY:', process.env.STRIPE_SECRET_KEY ? 'Configurada' : 'Não configurada');
  console.log('- STRIPE_WEBHOOK_SECRET:', process.env.STRIPE_WEBHOOK_SECRET ? 'Configurada' : 'Não configurada');
  console.log('- HOTMART_CLIENT_ID:', process.env.HOTMART_CLIENT_ID ? 'Configurada' : 'Não configurada');
  console.log('- HOTMART_CLIENT_SECRET:', process.env.HOTMART_CLIENT_SECRET ? 'Configurada' : 'Não configurada');
  console.log('- HOTMART_PRODUCT_ID:', process.env.HOTMART_PRODUCT_ID ? 'Configurada' : 'Não configurada');
}); 