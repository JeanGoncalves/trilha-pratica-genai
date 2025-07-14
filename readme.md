**Trilha Prática GenAI com TypeScript: Da Teoria ao Código com LLMs**

**Objetivo:** Transformar seu aprendizado em experiência prática com LLMs e GenAI usando TypeScript. A trilha é composta por 3 "mini cursos" com aplicação real, nível crescente e tudo explicadinho: instalação, código, comandos, organização, deploy e aprendizado aplicado.

---

## 🧱 Nível 1: "Hello, LLM!" – Primeiros Passos com OpenAI API e TypeScript

**Objetivo:** Aprender a integrar um modelo de linguagem (ChatGPT) com um script TypeScript simples.

### Pré-requisitos:

- Node.js 18+
- Conta na OpenAI ([https://platform.openai.com/](https://platform.openai.com/))

### Instalação:

```bash
mkdir hello-llm && cd hello-llm
npm init -y
npm install openai dotenv
npm install --save-dev typescript ts-node @types/node
npx tsc --init
```

### Organização de pastas:

```
hello-llm/
├── .env
├── index.ts
├── tsconfig.json
└── package.json
```

### Arquivo `.env`:

```
OPENAI_API_KEY=sua-chave-aqui
```

### Código `index.ts`:

```ts
import { config } from 'dotenv';
import readline from 'readline';
import OpenAI from 'openai';

config();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function perguntar(prompt: string): void {
  rl.question(prompt, async (input) => {
    const chat = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: input }],
    });
    console.log('\nResposta:\n', chat.choices[0].message.content);
    perguntar('Você: ');
  });
}

perguntar('Você: ');
```

### Rodar:

```bash
npx ts-node index.ts
```

### Desafio prático:

- Faça o modelo responder a mesma pergunta com temperatura 0.2 e 0.9 (adicione o parâmetro).
- Teste comandos como: "Explique RAG como se eu tivesse 5 anos".

---

## ⚙️ Nível 2: "Meu Primeiro Mini Agente" – Criando uma API com Express + OpenAI

**Objetivo:** Criar uma API em Express com um endpoint que se comunica com o LLM.

### Instalação:

```bash
mkdir mini-agent && cd mini-agent
npm init -y
npm install express openai dotenv
npm install --save-dev typescript ts-node nodemon @types/node @types/express
npx tsc --init
```

### Estrutura de pastas:

```
mini-agent/
├── .env
├── src/
│   └── index.ts
├── tsconfig.json
└── package.json
```

### Código `src/index.ts`:

```ts
import express from 'express';
import { config } from 'dotenv';
import OpenAI from 'openai';

config();
const app = express();
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.post('/ask', async (req, res) => {
  const { question } = req.body;
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: question }],
  });
  res.json({ resposta: completion.choices[0].message.content });
});

app.listen(3000, () => console.log('Servidor rodando em http://localhost:3000'));
```

### Rodar servidor:

```bash
npx ts-node src/index.ts
```

### Testar:

- Via Postman ou curl:

```bash
curl -X POST http://localhost:3000/ask \
-H "Content-Type: application/json" \
-d '{ "question": "O que é GenAI?" }'
```

### Desafio prático:

- Adicione uma rota `/resumir` que aceita um texto grande e retorna um resumo via LLM.

---

## 🧠 Nível 3: "Agente com Memória + Contexto" – Construindo Agente com LangChain.js

**Objetivo:** Criar um agente com memória de conversa e uso de contexto de documentos.

### Instalação:

```bash
npm install langchain openai dotenv
```

### Organização:

```
agente-contexto/
├── .env
├── src/
│   ├── index.ts
│   └── artigo.txt
```

### Código `src/index.ts` (exemplo com memória):

```ts
import { config } from 'dotenv';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { BufferMemory } from 'langchain/memory';
import { ConversationChain } from 'langchain/chains';
import readline from 'readline';

config();
const llm = new ChatOpenAI({ modelName: 'gpt-3.5-turbo', temperature: 0 });
const memory = new BufferMemory();
const chain = new ConversationChain({ llm, memory });

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function prompt() {
  rl.question('Você: ', async (input) => {
    const response = await chain.run(input);
    console.log('Agente:', response);
    prompt();
  });
}
prompt();
```

### Desafio prático:

- Faça ele lembrar do nome do usuário ou preferências ("me chame de Jean")
- Adicione um documento `.txt` e use como base de contexto com `DocumentLoader`

---

## Próximos Passos

-

Se quiser, posso montar esse curso também como workspace em Notion com etapas marcáveis, código e links. Só dar o sinal!

