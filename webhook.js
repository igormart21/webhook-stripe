// Rota para receber os eventos da Stripe
app.post('/webhook', async (req, res) => {
  const event = req.body;

  // Verificar se o evento é do tipo checkout.session.completed
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Verificação adicional para garantir que o email do cliente existe
    const customerEmail = session.customer_email;
    if (!customerEmail) {
      console.error('Erro: O email do cliente não foi fornecido');
      return res.status(400).send('Email do cliente não encontrado');
    }

    const productId = session.metadata.product_id;  // Pega o ID do produto
    const productName = session.metadata.product_name;  // Pega o nome do produto, se disponível

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
        console.error('Erro: URL da Hotmart não configurada');
        return res.status(500).send('Erro de configuração da Hotmart');
      }

      const response = await axios.post(hotmartApiUrl, {
        customerEmail: customerEmail,  // Passando os dados para a Hotmart
        productId: productId,          // Passando o ID do produto
      });

      if (response.status === 200) {
        console.log('Acesso ao produto liberado:', response.data);
        return res.status(200).send('Pagamento processado com sucesso');
      } else {
        console.error('Erro ao liberar acesso ao produto:', response.data);
        return res.status(500).send('Erro ao liberar acesso ao produto');
      }
    } catch (error) {
      console.error('Erro ao integrar com o Stripe ou Hotmart:', error);
      return res.status(500).send('Erro ao processar o pagamento');
    }
  } else {
    // Se o evento não for esperado, retornar erro
    return res.status(400).send('Evento inválido');
  }
});
