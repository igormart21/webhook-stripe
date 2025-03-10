const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY); // Adicione sua chave secreta aqui
const app = express();

app.use(express.json()); // Para que o Express possa interpretar JSON no corpo da requisição

// Rota para receber os eventos da Stripe
app.post('/webhook', async (req, res) => {
  const event = req.body;

  // Verificar se o evento é do tipo checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const customerEmail = session.customer_email;
    const productId = session.metadata.product_id;
    const productName = session.metadata.product_name;

    console.log(`Pagamento aprovado para o produto ${productName}, cliente: ${customerEmail}`);

    try {
      // Criar o cliente no Stripe usando o e-mail do cliente
      const customer = await stripe.customers.create({
        email: customerEmail,
        description: `Cliente Stripe - Produto: ${productName}`,
      });

      // Fazer a chamada para a Hotmart API para liberar o acesso ao produto
      const hotmartApiUrl = process.env.HOTMART_API_URL;
      if (!hotmartApiUrl) {
        console.error("A URL da Hotmart não está definida");
        return res.status(500).send('Erro de configuração da Hotmart API');
      }

      const response = await axios.post(hotmartApiUrl, {
        customerEmail: customerEmail,
      });

      console.log('Acesso ao produto liberado:', response.data);

      res.status(200).send('Pagamento processado com sucesso');
    } catch (error) {
      console.error('Erro ao integrar com o Stripe ou Hotmart:', error);
      res.status(500).send('Erro ao processar o pagamento');
    }
  } else {
    res.status(400).send('Evento inválido');
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
