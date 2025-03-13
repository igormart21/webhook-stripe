const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const bodyParser = require('body-parser');
const crypto = require('crypto');

const app = express();

// 🔹 Middleware para capturar JSON e RAW BODY (necessário para Stripe)
app.use(bodyParser.raw({ type: 'application/json' }));

// Chave secreta do Stripe para validar a assinatura do webhook
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Webhook para eventos do Stripe
app.post('/webhook', async (req, res) => {
  console.log("🟡 Webhook recebido!");

  // 🔍 Captura e exibe o corpo da requisição para depuração
  console.log("📩 Corpo da requisição recebido:", req.body);

  // 🔴 Verifica a assinatura do evento
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error("❌ Erro ao verificar a assinatura:", err.message);
    return res.status(400).send(`Erro: Assinatura inválida.`);
  }

  // 🔴 Verifica se o evento contém um tipo válido
  if (!event.type) {
    console.error("❌ Erro: Evento não possui um tipo definido.");
    return res.status(400).send("Erro: Evento inválido.");
  }

  console.log(`✅ Evento recebido: ${event.type}`);

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_email || session.customer_details?.email;
    const metadata = session.metadata || {};
    const productId = parseInt(metadata.product_id, 10);

    if (!customerEmail || !productId) {
      console.error('❌ Erro: Dados obrigatórios ausentes.');
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

      // Estrutura correta do JSON para a Hotmart
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
