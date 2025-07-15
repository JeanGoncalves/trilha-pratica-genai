# Wrapper ChatCompletion

Este wrapper simplifica o uso da OpenAI API, processando as tools automaticamente para ficar mais parecido com a abordagem do Ollama.

## Funcionalidades

- ✅ Executa tools automaticamente
- ✅ Processa múltiplas tools em paralelo
- ✅ **Execução sequencial** - Uma tool pode usar resultado de outra
- ✅ Mantém o histórico de mensagens atualizado
- ✅ Trata erros das tools automaticamente
- ✅ Suporte a todas as configurações da OpenAI

## Uso

```typescript
import { chatCompletion } from './utils/chatCompletion';
import { tools } from './tools';

const response = await chatCompletion({
    openai,
    model: 'gpt-4.1-mini',
    messages: [
        { role: 'system', content: 'Você é um assistente útil' },
        { role: 'user', content: 'Qual a temperatura do CEP 01001000?' }
    ],
    tools,
    temperature: 0.7,
    toolChoice: 'auto'
});

console.log(response.content); // Resposta final do modelo
console.log(response.messages); // Histórico completo atualizado
console.log(response.iterations); // Número de iterações (chamadas à API)
```

## Parâmetros

- `openai`: Instância da OpenAI
- `model`: Modelo a ser usado (ex: 'gpt-4.1-mini')
- `messages`: Array de mensagens do chat
- `tools`: Array de ferramentas disponíveis (opcional)
- `temperature`: Criatividade da resposta (0-1)
- `maxTokens`: Limite de tokens da resposta (opcional)
- `toolChoice`: Como usar as tools ('auto', 'none', 'required')
- `maxIterations`: Limite de iterações para tools sequenciais (padrão: 5)

## Retorno

```typescript
interface ChatCompletionResponse {
    content: string;        // Resposta final do modelo
    messages: any[];        // Histórico completo atualizado
    toolCalls?: any[];      // Todas as tool calls executadas
    iterations: number;     // Número de iterações realizadas
}
```

## 🔄 Execução Sequencial de Tools

O wrapper suporta execução sequencial onde uma tool pode usar o resultado de outra:

### Exemplo 1: CEP → Weather
```typescript
// Pergunta: "Qual a temperatura do CEP 01001000?"
// Execução:
// 1. Chama tool 'cep' para obter a cidade
// 2. Usa o resultado para chamar tool 'weather' com a cidade
// 3. Retorna resposta final com temperatura

🔧 Executando tool: cep
🔧 Executando tool: weather
✅ Concluído em 3 iterações
```

### Exemplo 2: Paralelo vs Sequencial
```typescript
// Paralelo (independentes):
"Quanto é 100 * 50 e o tempo em São Paulo?"
🔧 Executando 2 tools em paralelo:
🔧 Tool 1/2: calculator
🔧 Tool 2/2: weather

// Sequencial (dependentes):
"Qual a temperatura do CEP 01001000?"
🔧 Executando tool: cep
🔧 Executando tool: weather
✅ Concluído em 3 iterações
```

## Logs e Monitoramento

O wrapper fornece logs detalhados para monitoramento:

- **Tool única**: `🔧 Executando tool: calculator`
- **Múltiplas tools**: `🔧 Executando 2 tools em paralelo:`
- **Iterações**: `✅ Concluído em 3 iterações`
- **Limite excedido**: `⚠️ Limite de 5 iterações atingido`

## Vantagens do Wrapper

### Antes (OpenAI puro)
```typescript
const response = await openai.chat.completions.create({...});
const message = response.choices[0].message;

if (message.tool_calls) {
    // Executa tools manualmente
    // Não suporta execução sequencial
    // Precisa gerenciar iterações manualmente
}
```

### Depois (Com o wrapper)
```typescript
const response = await chatCompletion({
    openai,
    model: MODEL,
    messages,
    tools,
    temperature: 0.7,
    toolChoice: 'auto'
});

console.log(response.content); // Pronto!
// Suporta execução sequencial automaticamente
```

## Configurações Avançadas

### Limite de Iterações
```typescript
const response = await chatCompletion({
    // ... outras configs
    maxIterations: 10 // Permite até 10 iterações sequenciais
});
```

### Monitoramento de Performance
```typescript
const response = await chatCompletion({...});

console.log(`Executou ${response.toolCalls?.length || 0} tools`);
console.log(`Completou em ${response.iterations} iterações`);
```

## Diferenças das APIs

| Aspecto | Ollama | OpenAI (Puro) | OpenAI (Wrapper) |
|---------|---------|---------------|------------------|
| Execução de Tools | Automática | Manual | Automática |
| Tools Sequenciais | Limitado | Muito complexo | Automático |
| Chamadas de API | 1 | 1-2 | 1-N (automático) |
| Código necessário | Simples | Complexo | Simples |
| Controle de erros | Limitado | Total | Automático |

O wrapper mantém o controle total sobre as execuções das tools (segurança), mas simplifica drasticamente o código necessário para usar a OpenAI API com tools, incluindo suporte nativo para execução sequencial. 