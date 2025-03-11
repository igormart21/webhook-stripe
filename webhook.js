const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const app = express();

app.use(express.json()); // Habilita o Express para interpretar JSON

// Rota para receber os eventos da Stripe
app.post('/webhook', async (req, res) => {
  const event = req.body;

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Pegar o e-mail corretamente
    const customerEmail = session.customer_email || (session.customer_details ? session.customer_details.email : 'Email não encontrado');

    // Garantir que os metadados existam antes de acessá-los
    const productId = session.metadata ? session.metadata.product_id : 'Produto não definido';
    const productName = session.metadata ? session.metadata.product_name : 'Nome do produto não definido';

    console.log(`Pagamento aprovado para o produto ${productName}, cliente: ${customerEmail}`);

    try {
      // Criar o cliente no Stripe
      const customer = await stripe.customers.create({
        email: customerEmail,
        description: `Cliente Stripe - Produto: ${productName}`,
      });

      // Verificar se a URL da Hotmart está configurada
      const hotmartApiUrl = process.env.HOTMART_API_URL;
      if (!hotmartApiUrl) {
        console.error("A URL da Hotmart não está definida.");
        return res.status(500).send('Erro de configuração da Hotmart API');
      }

      // Enviar a solicitação para a Hotmart
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

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
