const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

// 🔹 Middleware para capturar RAW BODY (necessário para Stripe)
app.use(bodyParser.json());

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

// ✅ Rota para criar sessão de checkout do Stripe
app.post('/create-checkout-session', async (req, res) => {
  try {
    const { email } = req.body; // Captura o email do cliente enviado no request

    if (!email) {
      return res.status(400).json({ error: 'O e-mail do cliente é obrigatório' });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'preco_do_stripe', // Substitua pelo preço real configurado no Stripe
          quantity: 1
        }
      ],
      mode: 'payment',
      success_url: 'URL_DE_SUCESSO',
      cancel_url: 'URL_DE_CANCELAMENTO',
      metadata: {
        product_id: '4532677', // 🔹 ID do produto da Hotmart
        customer_email: email // 🔹 Salva o e-mail do cliente nos metadados
      }
    });

    console.log("✅ Sessão de checkout criada com sucesso:", session.id);
    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Erro ao criar sessão do Stripe:', error);
    res.status(500).send('Erro ao criar sessão de pagamento.');
  }
});

// ✅ Webhook para eventos do Stripe
app.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  console.log("🟡 Webhook recebido!");

  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Erro ao verificar a assinatura:", err.message);
    return res.status(400).send("Erro: Assinatura inválida.");
  }

  console.log(`✅ Evento recebido: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    // 📌 Log para depuração
    console.log("📌 Metadados recebidos:", JSON.stringify(session.metadata, null, 2));

    const customerEmail = session.metadata?.customer_email || null;
    const productId = session.metadata?.product_id || null;

    if (!customerEmail || !productId) {
      console.error(`❌ Erro: Dados ausentes. Metadata: ${JSON.stringify(session.metadata, null, 2)}`);
      return res.status(400).send('Erro: Email e ID do produto são obrigatórios.');
    }

    console.log(`✅ Pagamento confirmado! Cliente: ${customerEmail}, Produto ID: ${productId}`);
    
    // Aqui você pode chamar a API da Hotmart ou realizar outras ações
  }

  res.status(200).send();
});

// Configuração da porta
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
