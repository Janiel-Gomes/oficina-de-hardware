# Oficina de Hardware

Jogo 3D educativo: a dupla percorre um laboratório e conserta 12 computadores com defeitos de hardware.

## Uso em sala de aula
- Antes de ver as alternativas, a dupla registra uma hipótese e depois justifica a escolha com base nos testes.
- Cada caso oferece duas dicas graduais, feedback para respostas incorretas e um desafio conceitual.
- Ao concluir o caso, a dupla reflete sobre a pista decisiva e qual teste faria primeiro em um computador real.
- Ao concluir o último caso, a dupla pode baixar um CSV com as hipóteses, testes, reparos, respostas conceituais e reflexões para enviar ao professor. O relatório também pode ser exportado em **Missões**.
- O progresso e as respostas são armazenados no navegador usado para jogar. Exporte o relatório antes de trocar de dispositivo ou limpar os dados do navegador.

## Publicar na Vercel
1. Envie esta pasta para um repositório no GitHub, ou use `vercel` na pasta.
2. Framework Preset: **Other**. Build Command e Output Directory: deixe vazios.
3. Deploy. O site é estático (index.html + three.min.js).
4. No painel do projeto na Vercel, configure estas variáveis de ambiente e faça um novo deploy:
   - `RESEND_API_KEY`: chave privada criada na conta Resend. Não a coloque no HTML ou em variáveis `VITE_`/`NEXT_PUBLIC_`.
   - `RESEND_FROM_EMAIL`: endereço de remetente verificado no Resend (por exemplo, `Oficina <oficina@seudominio.com>`).
   - `APP_ORIGIN`: origem exata do site publicado, sem barra final (por exemplo, `https://oficina.seudominio.com`).
5. Em **Environment Variables**, aplique-as aos ambientes que usar. A função `api/send-report.js` envia o CSV ao endereço do professor configurado no código.

O envio só funciona no site publicado na Vercel com essas variáveis configuradas. As respostas dos alunos são transmitidas ao Resend para entrega por e-mail; informe a turma antes da atividade. O endpoint aceita apenas a origem configurada e limita o tamanho do relatório. Para uma implantação pública, configure também uma regra de rate limiting no Vercel Firewall.

Para testar localmente, abra `index.html` no navegador (precisa de internet só para a fonte do Google Fonts).
