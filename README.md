# Oficina de Hardware

Jogo 3D educativo: a dupla percorre um laboratório e conserta 12 computadores com defeitos de hardware.

## Uso em sala de aula
- Antes de ver as alternativas, a dupla registra uma hipótese e depois justifica a escolha com base nos testes.
- Cada caso oferece duas dicas graduais, feedback para respostas incorretas e um desafio conceitual.
- Ao concluir o caso, a dupla reflete sobre a pista decisiva e qual teste faria primeiro em um computador real.
- Ao concluir o último caso, a dupla pode baixar um CSV com as hipóteses, testes, reparos, respostas conceituais e reflexões para enviar ao professor. O relatório também pode ser exportado em **Missões**.
- Depois de concluir os 12 casos, a tela de envio/baixar permanece aberta mesmo após atualizar a página. Para jogar novamente, é necessário escolher **Reiniciar turno**, que apaga o progresso e as respostas salvas naquele navegador.
- O progresso e as respostas são armazenados no navegador usado para jogar. Exporte o relatório antes de trocar de dispositivo ou limpar os dados do navegador.

## Publicar na Vercel
1. Envie esta pasta para um repositório no GitHub, ou use `vercel` na pasta.
2. Framework Preset: **Other**. Build Command e Output Directory: deixe vazios.
3. Deploy. O site é estático (index.html + three.min.js).
4. No Google Cloud Console, crie um projeto, habilite a **Gmail API**, configure a tela de consentimento OAuth e crie credenciais OAuth 2.0. Use o escopo `https://www.googleapis.com/auth/gmail.send`. Autorize a conta `janielgomes9@gmail.com`; o remetente do e-mail é fixo nessa conta.
5. Na Vercel, configure estas variáveis para **Production**:
   - `GOOGLE_CLIENT_ID`: ID do cliente OAuth.
   - `GOOGLE_CLIENT_SECRET`: segredo do cliente OAuth; marque como **Secret**.
   - `GOOGLE_REFRESH_TOKEN`: token de atualização OAuth concedido pela conta do professor; marque como **Secret**.
   - `APP_ORIGIN`: origem exata do site, sem barra final (por exemplo, `https://oficina-de-hardware.vercel.app`).
6. Faça um novo deploy. A função `api/send-report.js` renova o token e envia o CSV pela API do Gmail para `janielgomes9@gmail.com`.

Para obter o refresh token, pode-se usar o OAuth 2.0 Playground com as credenciais do próprio cliente OAuth. Configure no cliente OAuth o redirect URI `https://developers.google.com/oauthplayground`, marque **Use your own OAuth credentials** no Playground, solicite o escopo `https://www.googleapis.com/auth/gmail.send`, autorize a conta do professor e troque o código por tokens. Guarde o refresh token como segredo na Vercel e nunca o publique no GitHub ou compartilhe em capturas de tela.

Se a tela de consentimento estiver em modo **Testing**, o refresh token pode expirar após 7 dias para esse escopo; será necessário autorizar novamente. Para uso contínuo, configure a publicação/verificação OAuth apropriada no Google. As respostas dos alunos são enviadas pelo Gmail do professor; informe a turma antes da atividade. O endpoint valida a origem configurada e limita o tamanho do relatório. Para uma implantação pública, configure também rate limiting no Vercel Firewall.

Para testar localmente, abra `index.html` no navegador (precisa de internet só para a fonte do Google Fonts).
