require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const axios = require('axios');

const app = express();
app.use(express.json());

// Função para obter token de acesso da Hotmart
async function getHotmartAccessToken() {
  try {
    const response = await axios.post('https://developers.hotmart.com/security/oauth/token', {
      grant_type: 'client_credentials',
      client_id: process.env.HOTMART_CLIENT_ID,
      client_secret: process.env.HOTMART_CLIENT_SECRET
    });
    return response.data.access_token;
  } catch (error) {
    console.error('Erro ao obter token da Hotmart:', error);
    throw error;
  }
}

// Função para adicionar membro à área de membros da Hotmart
async function addMemberToHotmart(email, name) {
  try {
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
    
    return response.data;
  } catch (error) {
    console.error('Erro ao adicionar membro à Hotmart:', error);
    throw error;
  }
}

// Webhook do Stripe
app.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Erro na assinatura do webhook:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Lidar com o evento de pagamento bem-sucedido
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
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
  }

  res.json({received: true});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
}); 