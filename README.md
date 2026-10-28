# Oficina de Hardware

Jogo 3D educativo: a dupla percorre um laboratório e conserta 12 computadores com defeitos de hardware.

## Uso em sala de aula
- Antes de ver as alternativas, a dupla registra uma hipótese e depois justifica a escolha com base nos testes.
- Cada caso oferece duas dicas graduais, feedback para respostas incorretas e um desafio conceitual.
- Ao concluir o caso, a dupla reflete sobre a pista decisiva e qual teste faria primeiro em um computador real.
- Ao concluir o último caso, a dupla pode baixar um CSV com as hipóteses, testes, reparos, respostas conceituais e reflexões para enviar manualmente ao professor. O relatório também pode ser baixado em **Missões**.
- Depois de concluir os 12 casos, a tela de baixar relatório/reiniciar permanece aberta mesmo após atualizar a página. Para jogar novamente, é necessário escolher **Reiniciar turno**, que apaga o progresso e as respostas salvas naquele navegador.
- O progresso e as respostas são armazenados no navegador usado para jogar. Exporte o relatório antes de trocar de dispositivo ou limpar os dados do navegador.

## Publicar na Vercel
1. Envie esta pasta para um repositório no GitHub, ou use `vercel` na pasta.
2. Framework Preset: **Other**. Build Command e Output Directory: deixe vazios.
3. Deploy. O site é estático (index.html + three.min.js).
O jogo é uma aplicação estática e não envia e-mails automaticamente. A dupla baixa o CSV e o envia manualmente pelo e-mail ou plataforma que a escola utiliza.

Para testar localmente, abra `index.html` no navegador (precisa de internet só para a fonte do Google Fonts).
