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

    // Captura o email corretamente
    const customerEmail = session.customer_email || session.customer_details?.email || null;
    
    // Captura os metadados do produto
    const metadata = session.metadata || {};
    const productId = metadata.product_id || 'Desconhecido';
    const productName = metadata.product_name || 'Produto sem nome';

    if (!customerEmail) {
      console.error('Erro: Email do cliente não encontrado.');
      return res.status(400).json({ error: 'Email do cliente é obrigatório.' });
    }

    console.log(`Pagamento aprovado para o produto ${productName} (ID: ${productId}), cliente: ${customerEmail}`);

    try {
      // Criar o cliente no Stripe
      const customer = await stripe.customers.create({
        email: customerEmail,
        description: `Cliente Stripe - Produto: ${productName}`,
      });

      console.log('Cliente criado no Stripe:', customer.id);

      // Verifica se a URL da Hotmart está configurada corretamente
      const hotmartApiUrl = process.env.HOTMART_API_URL;
      if (!hotmartApiUrl) {
        console.error("Erro: A URL da Hotmart não está definida.");
        return res.status(500).json({ error: 'Erro de configuração da Hotmart API.' });
      }

      console.log("Chamando Hotmart API na URL:", hotmartApiUrl);

      // Envia a solicitação para liberar acesso ao produto na Hotmart
      const response = await axios.post(hotmartApiUrl, {
        customerEmail: customerEmail,
        productId: productId,
      });

      console.log('Acesso ao produto liberado na Hotmart:', response.data);
      res.status(200).json({ message: 'Pagamento processado com sucesso.', hotmartResponse: response.data });
    } catch (error) {
      if (error.response) {
        console.error(`Erro na Hotmart API - Código: ${error.response.status}`, error.response.data);
      } else {
        console.error("Erro inesperado ao chamar Hotmart:", error.message);
      }
      res.status(500).json({ error: 'Erro ao processar o pagamento.' });
    }
  } else {
    res.status(400).json({ error: 'Evento inválido.' });
  }
});

// Configuração da porta para rodar no Railway corretamente
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});
