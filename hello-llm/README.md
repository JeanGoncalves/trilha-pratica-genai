# Chat com OpenAI

Este é um chatbot que utiliza a OpenAI API com suporte a tools/functions.

## Configuração

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
OPENAI_API_KEY=sua-chave-da-openai-aqui
OPENAI_MODEL=gpt-4.1-mini
```

### Modelos suportados

O chatbot funciona com qualquer modelo da OpenAI que suporte function calling:

#### ✅ **Modelos recomendados:**
- `gpt-4.1` - **Mais recente** - Melhor em codificação e instruções (1M tokens)
- `gpt-4.1-mini` - **Padrão** - Excelente custo/benefício (1M tokens)
- `gpt-4.1-nano` - **Mais rápido** - Ideal para apps com recursos limitados (1M tokens)
- `gpt-4o` - Versão anterior, ainda muito bom
- `gpt-4o-mini` - Versão anterior, econômica
- `gpt-3.5-turbo` - Mais barato, performance básica

#### ❌ **Modelos NÃO suportados:**
- `gpt-3.5-turbo-instruct` - Não suporta function calling
- Modelos mais antigos

## Como usar

```bash
# Usar modelo padrão (gpt-4.1-mini)
npm run chat

# Usar modelo específico
OPENAI_MODEL=gpt-4.1 npm run chat

# Ou definir no .env
echo "OPENAI_MODEL=gpt-4.1" >> .env
npm run chat
```

## Preços (por 1M tokens)

| Modelo | Input | Output | Melhor para |
|--------|-------|--------|-------------|
| gpt-4.1 | $2.00 | $8.00 | Máxima qualidade |
| gpt-4.1-mini | $0.40 | $1.60 | **Custo-benefício** |
| gpt-4.1-nano | $0.10 | $0.40 | Máxima eficiência |
| gpt-4o | $2.50 | $10.00 | Modelo anterior |
| gpt-4o-mini | $0.15 | $0.60 | Modelo anterior |

## Tools disponíveis

1. **calculator** - Realiza operações matemáticas
2. **weather** - Busca previsão do tempo
3. **dataAtual** - Retorna data atual
4. **cep** - Busca informações de CEP

## Diferenças entre modelos

| Modelo | Contexto | Velocidade | Custo | Qualidade Tools | Recomendado para |
|--------|----------|-----------|-------|-----------------|------------------|
| gpt-4.1 | 1M tokens | Média | Alto | **Excelente** | Coding, instruções complexas |
| gpt-4.1-mini | 1M tokens | Rápida | Baixo | **Muito boa** | **Uso geral** |
| gpt-4.1-nano | 1M tokens | Muito rápida | Muito baixo | Boa | Apps móveis, autocompletar |
| gpt-4o | 128K tokens | Média | Alto | Excelente | Aplicações críticas |
| gpt-4o-mini | 128K tokens | Rápida | Baixo | Boa | Uso geral anterior |
| gpt-3.5-turbo | 16K tokens | Muito rápida | Muito baixo | Básica | Testes/desenvolvimento |

## Instalação

```bash
npm install
npm run chat
``` 