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

  // Verifica se o evento é do tipo checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Garante que o email do cliente seja capturado corretamente
    const customerEmail = session.customer_email || session.customer_details?.email || null;
    
    // Evita erro caso session.metadata seja undefined
    const metadata = session.metadata || {};
    const productId = metadata.product_id || 'Desconhecido';
    const productName = metadata.product_name || 'Produto sem nome';

    if (!customerEmail) {
      console.error('Erro: Email do cliente não encontrado.');
      return res.status(400).send('Erro: Email do cliente é obrigatório.');
    }

    console.log(`Pagamento aprovado para o produto ${productName}, cliente: ${customerEmail}`);

    try {
      // Criar o cliente no Stripe
      const customer = await stripe.customers.create({
        email: customerEmail,
        description: `Cliente Stripe - Produto: ${productName}`,
      });

      // Verifica se a URL da Hotmart está configurada corretamente
      const hotmartApiUrl = process.env.HOTMART_API_URL;
      const hotmartApiToken = process.env.HOTMART_API_TOKEN;
      if (!hotmartApiUrl || !hotmartApiToken) {
        console.error("A URL ou o Token da Hotmart não estão definidos.");
        return res.status(500).send('Erro de configuração da Hotmart API.');
      }

      // Envia a solicitação para liberar acesso ao produto na Hotmart
      const response = await axios.post(hotmartApiUrl, {
        buyer_email: customerEmail,
        product_id: productId
      }, {
        headers: {
          Authorization: `Bearer ${hotmartApiToken}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Acesso ao produto liberado:', response.data);
      res.status(200).send('Pagamento processado com sucesso.');
    } catch (error) {
      console.error('Erro ao integrar com o Stripe ou Hotmart:', error);
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
