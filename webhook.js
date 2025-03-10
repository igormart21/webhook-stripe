// Carregar variáveis de ambiente do arquivo .env
require('dotenv').config();

// Importar as dependências
const express = require('express');
const bodyParser = require('body-parser');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// Criar o servidor Express
const app = express();

// Middleware para parsear o corpo das requisições em JSON
app.use(bodyParser.json());

// Definir a porta onde o servidor vai rodar
const PORT = process.env.PORT || 8080; // Alterei para 8080

// Rota para receber os eventos da Hotmart
app.post('/webhook', async (req, res) => {
  const event = req.body;

  // Verificar se o evento da Hotmart é de pagamento aprovado
  if (event.type === 'payment.approved') {
    const paymentData = event.data;
    const customerEmail = paymentData.customer_email;
    const productId = paymentData.product.id;
    const productName = paymentData.product.name;

    console.log(`Pagamento aprovado para o produto ${productName}, cliente: ${customerEmail}`);

    try {
      // Criar o cliente no Stripe usando o e-mail do cliente
      const customer = await stripe.customers.create({
        email: customerEmail,
        description: `Cliente Hotmart - Produto: ${productName}`,
      });

      // Você pode adicionar lógica para criar uma assinatura ou cobrar um pagamento aqui, se necessário.

      // Retornar uma resposta de sucesso
      res.status(200).send('Pagamento processado com sucesso');
    } catch (error) {
      console.error('Erro ao integrar com o Stripe:', error);
      res.status(500).send('Erro ao processar o pagamento');
    }
  } else {
    // Se o evento não for esperado, retornar erro
    res.status(400).send('Evento inválido');
  }
});

// Iniciar o servidor
app.get('/', (req, res) => {
  res.status(200).send('Servidor funcionando!');
});

