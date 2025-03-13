const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json()); // Habilita JSON no corpo da requisição

// Rota para testar se o servidor está rodando
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Rota para receber os eventos da Hotmart
app.post('/webhook', async (req, res) => {
  console.log('🔹 Webhook recebido:', JSON.stringify(req.body, null, 2));

  if (!req.body || typeof req.body !== 'object') {
    console.error('❌ Erro: JSON inválido ou corpo da requisição vazio.');
    return res.status(400).send('Erro: JSON inválido ou corpo da requisição vazio.');
  }

  const { event, data } = req.body;

  if (!event) {
    console.error('❌ Erro: Evento não possui um tipo definido.');
    return res.status(400).send('Erro: Evento indefinido.');
  }

  if (!data || !data.product || !data.user) {
    console.error('❌ Erro: Estrutura do JSON inválida.');
    return res.status(400).send('Erro: Estrutura do JSON inválida.');
  }

  const productId = data.product.id;
  const productName = data.product.name;
  const customerEmail = data.user.email;
  const customerName = data.user.name;

  console.log(`✔️ Evento reconhecido: ${event}`);
  console.log(`📦 Produto: ${productName} (ID: ${productId})`);
  console.log(`👤 Cliente: ${customerName} - ${customerEmail}`);

  try {
    const hotmartApiUrl = process.env.HOTMART_API_URL;
    const hotmartApiToken = process.env.HOTMART_API_TOKEN;

    if (!hotmartApiUrl || !hotmartApiToken) {
      console.error('❌ Erro: A URL ou o Token da Hotmart não estão definidos.');
      return res.status(500).send('Erro de configuração da Hotmart API.');
    }

    // Enviar requisição para liberar acesso ao produto
    const response = await axios.post(hotmartApiUrl, {
      buyer_email: customerEmail,
      product_id: productId
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
});

// Configuração da porta para rodar no Railway corretamente
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
const express = require('express');
const axios = require('axios');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const app = express();
app.use(express.json()); // Habilita JSON no corpo da requisição

// Rota para testar se o servidor está rodando
app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

// Rota para receber os eventos da Hotmart
app.post('/webhook', async (req, res) => {
  console.log('🔹 Webhook recebido:', JSON.stringify(req.body, null, 2));

  if (!req.body || typeof req.body !== 'object') {
    console.error('❌ Erro: JSON inválido ou corpo da requisição vazio.');
    return res.status(400).send('Erro: JSON inválido ou corpo da requisição vazio.');
  }

  const { event, data } = req.body;

  if (!event) {
    console.error('❌ Erro: Evento não possui um tipo definido.');
    return res.status(400).send('Erro: Evento indefinido.');
  }

  if (!data || !data.product || !data.user) {
    console.error('❌ Erro: Estrutura do JSON inválida.');
    return res.status(400).send('Erro: Estrutura do JSON inválida.');
  }

  const productId = data.product.id;
  const productName = data.product.name;
  const customerEmail = data.user.email;
  const customerName = data.user.name;

  console.log(`✔️ Evento reconhecido: ${event}`);
  console.log(`📦 Produto: ${productName} (ID: ${productId})`);
  console.log(`👤 Cliente: ${customerName} - ${customerEmail}`);

  try {
    const hotmartApiUrl = process.env.HOTMART_API_URL;
    const hotmartApiToken = process.env.HOTMART_API_TOKEN;

    if (!hotmartApiUrl || !hotmartApiToken) {
      console.error('❌ Erro: A URL ou o Token da Hotmart não estão definidos.');
      return res.status(500).send('Erro de configuração da Hotmart API.');
    }

    // Enviar requisição para liberar acesso ao produto
    const response = await axios.post(hotmartApiUrl, {
      buyer_email: customerEmail,
      product_id: productId
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
});

// Configuração da porta para rodar no Railway corretamente
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`🚀 Servidor rodando na porta ${port}`);
});
