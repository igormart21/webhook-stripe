# Webhook Stripe + Hotmart

Este projeto implementa um webhook que integra pagamentos do Stripe com a área de membros da Hotmart.

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente no arquivo `.env`:
```
STRIPE_SECRET_KEY=sua_chave_secreta_do_stripe
STRIPE_WEBHOOK_SECRET=seu_webhook_secret_do_stripe
HOTMART_CLIENT_ID=seu_client_id_da_hotmart
HOTMART_CLIENT_SECRET=seu_client_secret_da_hotmart
HOTMART_PRODUCT_ID=id_do_produto_hotmart
```

## Como usar

1. Inicie o servidor:
```bash
npm run dev
```

2. Configure o webhook no Stripe:
   - Acesse o painel do Stripe
   - Vá para Developers > Webhooks
   - Adicione um novo endpoint: `https://seu-dominio.com/webhook`
   - Selecione o evento `checkout.session.completed`

3. Quando um pagamento for concluído no Stripe, o webhook automaticamente:
   - Verifica a assinatura do webhook
   - Obtém um token de acesso da Hotmart
   - Adiciona o comprador à área de membros da Hotmart

## Observações

- Certifique-se de que o servidor está acessível publicamente para receber os webhooks do Stripe
- Use um serviço como ngrok para testes locais
- Mantenha suas chaves de API seguras e nunca as compartilhe 