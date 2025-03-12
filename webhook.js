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
    const productId = metadata.product_id;
    const productName = metadata.product_name || 'Produto sem nome';

    if (!customerEmail) {
      console.error('Erro: Email do cliente não encontrado.');
      return res.status(400).send('Erro: Email do cliente é obrigatório.');
    }

    if (!productId) {
      console.error('Erro: Product ID não encontrado ou inválido.');
      return res.status(400).send('Erro: Product ID é obrigatório.');
    }

    console.log(`Pagamento aprovado para ${productName}, Cliente: ${customerEmail}, Produto ID: ${productId}`);

    try {
      // Criar o cliente no Stripe
      const customer = await stripe.customers.create({
        email: customerEmail,
        description: `Cliente Stripe - Produto: ${productName}`,
      });

      const hotmartApiUrl = process.env.HOTMART_API_URL;
      const hotmartApiToken = process.env.HOTMART_API_TOKEN;

      if (!hotmartApiUrl || !hotmartApiToken) {
        console.error('Erro: Configuração da API Hotmart ausente.');
        return res.status(500).send('Erro de configuração da Hotmart API.');
      }

      console.log(`Enviando requisição para Hotmart: ${hotmartApiUrl}`);
      console.log(`Payload: { email: ${customerEmail}, prod: ${productId} }`);

      const response = await axios.post(hotmartApiUrl, {
        email: customerEmail,
        prod: productId
      }, {
        headers: {
          Authorization: `Bearer ${hotmartApiToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Acesso ao produto liberado:', response.data);
      res.status(200).send('Pagamento processado com sucesso.');
    } catch (error) {
      console.error('Erro ao integrar com a Hotmart:', error.response?.data || error.message);
      res.status(500).send('Erro ao processar o pagamento.');
    }
  } else {
    res.status(400).send('Evento inválido.');
  }
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});