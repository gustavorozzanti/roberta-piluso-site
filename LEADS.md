# Registro de leads na planilha (Google Sheets)

Cada envio dos formulários (palestras e mentoria) vira uma linha numa planilha, com uma coluna 1/0 para cada interesse. Assim a contagem de leads por tema ou área é exata, mesmo quando a pessoa marca mais de um.

## Configuração (uns 5 minutos, na conta Google da Roberta)

1. Crie uma planilha nova em sheets.google.com (nome sugerido: "Leads site Roberta Piluso").
2. Menu **Extensões > Apps Script**. Apague o conteúdo e cole o arquivo `apps-script/Code.gs`. Salve.
3. Na barra superior, escolha a função **configurar** e clique em **Executar**. Autorize o acesso quando o Google pedir. Isso cria as abas **Leads** e **Resumo**.
4. **Implantar > Nova implantação > tipo "App da Web"**:
   - Executar como: **Eu**
   - Quem tem acesso: **Qualquer pessoa**
   - Clique em **Implantar** e copie a **URL do app da Web**.
5. Em `script.js`, cole a URL na constante `LEADS_URL` e publique (commit e push).

## Como ler os dados

- Aba **Leads:** uma linha por contato, com data/hora, origem (`palestras` ou `mentoria`), dados do formulário e as colunas de interesse.
- Aba **Resumo:** total de leads, leads por origem e leads por interesse, atualizados sozinhos.
- Campanhas: se o link divulgado tiver `?utm_source=instagram`, a origem da campanha também é gravada.

## Observações

- A URL do app da Web fica visível no código do site. Por isso o formulário tem um campo escondido contra robôs, mas ela não é secreta. Se aparecer spam, basta gerar uma nova implantação e trocar a URL.
- Se mudar as opções dos formulários, atualize a lista `INTERESSES` no `Code.gs` (e as colunas novas na aba Leads).
- Se `WHATSAPP` estiver vazio e `LEADS_URL` preenchido, o lead é registrado e o visitante vê "Recebido!". Com os dois preenchidos, registra e abre o WhatsApp.
