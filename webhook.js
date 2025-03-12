const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json()); // Habilita JSON no corpo da requisição

// Rota para testar se o servidor está rodando
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Rota para receber os eventos da Stripe
app.post('/webhook', async (req, res) => {
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const customerEmail = session.customer_email || session.customer_details?.email || null;
    const metadata = session.metadata || {};
    const productId = parseInt(metadata.product_id, 10); // Converte para número

    if (!customerEmail || !productId) {
      console.error('Erro: Email do cliente ou ID do produto ausente.');
      return res.status(400).send('Erro: Dados obrigatórios ausentes.');
    }

    console.log(`✅ Pagamento aprovado! Cliente: ${customerEmail}, Produto ID: ${productId}`);

    try {
      const hotmartApiUrl = process.env.HOTMART_API_URL;
      const hotmartApiToken = process.env.HOTMART_API_TOKEN;

      if (!hotmartApiUrl || !hotmartApiToken) {
        console.error('Erro: Configuração da API Hotmart ausente.');
        return res.status(500).send('Erro de configuração da Hotmart API.');
      }

      // Criar o payload conforme esperado pela Hotmart
      const payload = {
        event: "CLUB_FIRST_ACCESS",
        version: "2.0.0",
        data: {
          product: {
            id: productId
          },
          user: {
            email: customerEmail
          }
        }
      };

      console.log("🟢 Enviando requisição para Hotmart:");
      console.log("URL:", hotmartApiUrl);
      console.log("Headers:", {
        Authorization: `Bearer ${hotmartApiToken}`,
        "Content-Type": "application/json"
      });
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
      console.error('❌ Erro ao integrar com a Hotmart:', error.response?.data || error.message);
      res.status(500).send('Erro ao processar o pagamento.');
    }
  } else {
    res.status(400).send('Evento inválido.');
  }
});

// Configuração da porta para rodar no Railway corretamente
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
