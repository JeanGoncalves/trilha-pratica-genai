# Hello LLM

Um chatbot simples usando Ollama para executar modelos de linguagem localmente e de forma gratuita.

## Pré-requisitos

- Node.js e npm
- Ollama instalado no sistema

## Instalação

1. Instale o Ollama:
```bash
brew install ollama
```

2. Inicie o serviço do Ollama:
```bash
brew services start ollama
```

3. Baixe um modelo (exemplo: Llama 3.2):
```bash
ollama pull llama3.2
```

4. Instale as dependências do projeto:
```bash
npm install
```

## Como usar

### Versão simples (uma pergunta por vez):
```bash
npm start
# ou
npx ts-node index.ts
```

### Versão interativa (múltiplas perguntas):
```bash
npm run chat
# ou
npx ts-node chat.ts
```

Digite sua pergunta e pressione Enter para obter uma resposta. Na versão interativa, digite "sair" para encerrar.

## Modelos disponíveis

Você pode usar diferentes modelos alterando o valor do `model` no código:

- `llama3.2` (padrão)
- `llama3.1`
- `codellama`
- `mistral`
- `gemma`

Para ver todos os modelos disponíveis:
```bash
ollama list
```

Para baixar um novo modelo:
```bash
ollama pull nome-do-modelo
```

## Vantagens do Ollama

- **Gratuito**: Todos os modelos são gratuitos
- **Privacidade**: Roda localmente, seus dados não saem do seu computador
- **Sem limites**: Não há limites de uso ou quotas
- **Offline**: Funciona sem internet após baixar o modelo 