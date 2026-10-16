# AndradeTech Demo

Demonstração pública independente do sistema AndradeTech01, com as telas originais adaptadas para um ambiente local de testes. O repositório e o banco de produção não são alterados.

## Testar
Entre em **Entrar na demonstração**, sem cadastro. Todos os módulos estão disponíveis: painel, ordens, orçamentos, clientes, PDV, faturamento, usuários e configurações. Dados fictícios já vêm preenchidos. O botão **Restaurar exemplos** remove as alterações locais e recupera os exemplos.

## Isolamento
- Dados salvos em localStorage apenas neste navegador e nesta origem. Outras pessoas em outros navegadores não recebem essas alterações.
- Sem Supabase, variáveis de produção, endpoints de pagamento ou APIs do sistema original.
- Política CSP com connect-src 'none', impedindo conexões de dados externas no navegador.
- Usuários e permissões são uma simulação; não criam contas reais e não salvam senhas.
- WhatsApp apenas prepara uma simulação copiável. Não envia mensagens.
- PIX apenas mostra um modal de pagamento simulado. Não existe chave, QR Code ou cobrança real.
- Consulta de CEP usa endereço de exemplo. A consulta de orçamento funciona somente no mesmo navegador.
- Documentos impressos são marcados como demonstração, sem validade fiscal.
- Limite de 500 registros por módulo. Use somente dados fictícios.

## Desenvolvimento
Node.js 22.18+ (24 recomendado). Execute npm ci, npm run dev, npm test e npm run build. Next.js 16, React 19, TypeScript e Tailwind 4. A interface foi derivada do src/App.tsx de M4RC3L002/AndradeTech01; o cliente de dados foi substituído por um adaptador local explícito.

A pasta node_modules local é uma junction para dependências já instaladas. Não remova o destino. Checkouts normais usam npm ci e dependências próprias.

## Vercel
Projeto exclusivo, ligado a este repositório. Preset Next.js, instalação npm ci, build npm run build. Não adicionar variáveis do ambiente original.
