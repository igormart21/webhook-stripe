const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

// 🔹 Middleware para capturar RAW BODY (necessário para Stripe)
app.use(bodyParser.raw({ type: 'application/json' }));

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const isProduction = process.env.NODE_ENV === 'production';

// ✅ Rota para criar sessão de checkout do Stripe
app.post('/create-checkout-session', async (req, res) => {
  try {
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
        customer_email: req.body.email // 🔹 Captura o e-mail enviado pelo front-end
      }
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('❌ Erro ao criar sessão do Stripe:', error);
    res.status(500).send('Erro ao criar sessão de pagamento.');
  }
});

// ✅ Webhook para eventos do Stripe
app.post('/webhook', async (req, res) => {
  console.log("🟡 Webhook recebido!");

  const sig = req.headers['stripe-signature'];
  let event;

  if (isProduction && !sig) {
    console.error("❌ Erro: stripe-signature ausente no ambiente de produção.");
    return res.status(400).send("Erro: Assinatura do Stripe ausente.");
  }

  try {
    if (sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } else {
      event = JSON.parse(req.body.toString());
      console.warn("⚠️ Assinatura não fornecida. Webhook sendo processado sem validação.");
    }
  } catch (err) {
    console.error("❌ Erro ao verificar a assinatura:", err.message);
    return res.status(400).send("Erro: Assinatura inválida.");
  }

  console.log(`✅ Evento recebido: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    console.log("🔹 Dados da sessão:", JSON.stringify(session, null, 2));

    const customerEmail = session.customer_email || session.customer_details?.email;
    const metadata = session.metadata || {};
    console.log("🔍 Metadados recebidos:", JSON.stringify(metadata, null, 2));
    
    let productId = metadata.product_id ? parseInt(metadata.product_id, 10) : null;

    if (!customerEmail) {
      console.error('❌ Erro: Email do cliente não encontrado na sessão.');
    }
    if (!productId) {
      console.error('❌ Erro: ID do produto não encontrado nos metadados. Verifique Stripe.');
    }

    if (!customerEmail || !productId) {
      return res.status(400).send('Erro: Email e ID do produto são obrigatórios.');
    }

    console.log(`✅ Pagamento aprovado! Cliente: ${customerEmail}, Produto ID: ${productId}`);

    try {
      const hotmartApiUrl = process.env.HOTMART_API_URL;
      const hotmartApiToken = process.env.HOTMART_API_TOKEN;

      if (!hotmartApiUrl || !hotmartApiToken) {
        console.error('⚠️ Erro de configuração da API Hotmart.');
        return res.status(500).send('Erro de configuração da Hotmart API.');
      }

      const uniqueId = crypto.randomUUID();

      const payload = {
        id: uniqueId,
        creation_date: Date.now(),
        event: "PURCHASE_APPROVED",
        version: "2.0.0",
        data: {
          product: {
            id: productId,
            name: metadata.product_name || "Produto sem nome"
          },
          user: {
            name: metadata.customer_name || "Cliente sem nome",
            email: customerEmail
          }
        }
      };

      console.log("🟢 Enviando requisição para Hotmart...");
      console.log("Payload:", JSON.stringify(payload, null, 2));

      const response = await axios.post(hotmartApiUrl, payload, {
        headers: {
          Authorization: `Bearer ${hotmartApiToken}`,
          "Content-Type": "application/json"
        }
      });

      console.log('✅ Acesso ao produto liberado:', response.data);
      res.status(200).send('Pagamento processado com sucesso.');
    } catch (error) {
      console.error('❌ Erro ao integrar com a Hotmart:');
      if (error.response) {
        console.error("🛑 Status:", error.response.status);
        console.error("🛑 Resposta:", JSON.stringify(error.response.data, null, 2));
      } else {
        console.error(error.message);
      }
      res.status(500).send('Erro ao processar o pagamento.');
    }
  } else {
    console.error(`❌ Evento não reconhecido: ${event.type}`);
    return res.status(400).send(`Evento inválido: ${event.type}`);
  }
});

// Configuração da porta
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
