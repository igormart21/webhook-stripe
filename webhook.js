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
    const productId = metadata.product_id; // Apenas para verificação, não é enviado na Hotmart

    if (!customerEmail) {
      console.error('Erro: Email do cliente não encontrado.');
      return res.status(400).send('Erro: Email do cliente é obrigatório.');
    }

    console.log(`Pagamento aprovado! Cliente: ${customerEmail}, Produto ID: ${productId}`);

    try {
      const hotmartApiUrl = process.env.HOTMART_API_URL;
      const hotmartApiToken = process.env.HOTMART_API_TOKEN;

      if (!hotmartApiUrl || !hotmartApiToken) {
        console.error('Erro: Configuração da API Hotmart ausente.');
        return res.status(500).send('Erro de configuração da Hotmart API.');
      }

      console.log(`🟢 Enviando requisição para Hotmart: ${hotmartApiUrl}`);
      console.log(`Payload: { buyer_email: ${customerEmail} }`);

      const response = await axios.post(hotmartApiUrl, {
        buyer_email: customerEmail
      }, {
        headers: {
          Authorization: `Bearer ${hotmartApiToken}`,
          'Content-Type': 'application/json'
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
  console.log(`Servidor rodando na porta ${port}`);
});
