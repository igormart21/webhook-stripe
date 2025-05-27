require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

const app = express();

// Middleware para log de todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  next();
});

// Configuração do express para webhook
app.use('/webhook', express.raw({type: 'application/json'}));
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ status: 'Webhook está funcionando!' });
});

// Rota de teste para webhook
app.post('/webhook-test', (req, res) => {
  console.log('Teste de webhook recebido');
  console.log('Headers:', JSON.stringify(req.headers, null, 2));
  console.log('Body:', JSON.stringify(req.body, null, 2));
  res.json({ status: 'Teste recebido com sucesso' });
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
    
    // Primeiro, vamos verificar se o produto existe
    console.log('Verificando produto na Hotmart...');
    const productResponse = await axios.get(
      `https://developers.hotmart.com/payments/api/v1/products/${process.env.HOTMART_PRODUCT_ID}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    console.log('Produto encontrado:', productResponse.data);

    // Agora vamos adicionar o membro usando a API de assinaturas
    console.log('Adicionando membro à Hotmart...');
    const response = await axios.post(
      `https://developers.hotmart.com/payments/api/v1/subscriptions`,
      {
        product_id: process.env.HOTMART_PRODUCT_ID,
        subscriber: {
          email: email,
          name: name
        },
        payment: {
          status: 'APPROVED',
          payment_type: 'CREDITCARD',
          payment_date: new Date().toISOString(),
          price: {
            currency: 'BRL',
            value: 10.00
          }
        },
        source: 'API',
        status: 'ACTIVE'
      },
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('Resposta completa da Hotmart:', JSON.stringify(response.data, null, 2));
    
    if (response.data && (response.data.subscription || response.data.purchase)) {
      console.log('Assinatura/Compra registrada com sucesso:', response.data.subscription || response.data.purchase);
      return response.data;
    } else {
      console.error('Resposta inesperada da Hotmart:', response.data);
      throw new Error('Resposta da Hotmart não contém dados de assinatura/compra');
    }
  } catch (error) {
    console.error('Erro detalhado ao adicionar membro à Hotmart:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
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
    console.log('Tipo do evento:', event.type);
    console.log('Modo do evento:', event.livemode ? 'Live' : 'Test');
    console.log('Dados do evento:', JSON.stringify(event.data.object, null, 2));

    // Verificar se o modo do evento corresponde ao modo da chave
    const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
    if (event.livemode !== !isTestMode) {
      console.error('Erro: Modo do evento não corresponde ao modo da chave');
      return res.status(400).json({ error: 'Modo do evento não corresponde ao modo da chave' });
    }
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
  } else if (event.type === 'payment_method.created') {
    console.log('Evento payment_method.created recebido');
    const paymentMethod = event.data.object;
    
    // Verificar se é um cartão de teste
    if (paymentMethod.card && paymentMethod.card.last4 === '4242') {
      console.log('Cartão de teste detectado');
    }
    
    // Aqui você pode adicionar lógica adicional para lidar com o método de pagamento
    console.log('Dados do método de pagamento:', JSON.stringify(paymentMethod, null, 2));
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