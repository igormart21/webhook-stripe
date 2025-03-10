// Rota para receber os eventos da Stripe
app.post('/webhook', async (req, res) => {
  const event = req.body;

  // Verificar se o evento é do tipo checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    const customerEmail = session.customer_email;
    const productId = session.metadata.product_id;  // Aqui você pode adicionar a lógica para pegar o ID do produto
    const productName = session.metadata.product_name;  // E o nome do produto, se estiver disponível

    console.log(`Pagamento aprovado para o produto ${productName}, cliente: ${customerEmail}`);

    try {
      // Criar o cliente no Stripe usando o e-mail do cliente
      const customer = await stripe.customers.create({
        email: customerEmail,
        description: `Cliente Stripe - Produto: ${productName}`,
      });

      // Fazer a chamada para a Hotmart API para liberar o acesso ao produto
      const hotmartApiUrl = process.env.HOTMART_API_URL;
      const response = await axios.post(hotmartApiUrl, {
        customerEmail: customerEmail, // Passando os dados para Hotmart
      });

      console.log('Acesso ao produto liberado:', response.data);

      // Retornar uma resposta de sucesso
      res.status(200).send('Pagamento processado com sucesso');
    } catch (error) {
      console.error('Erro ao integrar com o Stripe ou Hotmart:', error);
      res.status(500).send('Erro ao processar o pagamento');
    }
  } else {
    // Se o evento não for esperado, retornar erro
    res.status(400).send('Evento inválido');
  }
});
