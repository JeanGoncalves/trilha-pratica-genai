# Chat com OpenAI

Este é um chatbot que utiliza a OpenAI API com suporte a tools/functions.

## Configuração

### Variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
OPENAI_API_KEY=sua-chave-da-openai-aqui
OPENAI_MODEL=gpt-4o-mini
```

### Modelos suportados

O chatbot funciona com qualquer modelo da OpenAI que suporte function calling:

#### ✅ **Modelos recomendados:**
- `gpt-4o` - Mais avançado, melhor compreensão de tools
- `gpt-4o-mini` - **Padrão** - Boa relação custo/benefício
- `gpt-4-turbo` - Muito bom com tools
- `gpt-3.5-turbo` - Mais barato, performance básica

#### ❌ **Modelos NÃO suportados:**
- `gpt-3.5-turbo-instruct` - Não suporta function calling
- Modelos mais antigos

## Como usar

```bash
# Usar modelo padrão (gpt-4o-mini)
npm run chat

# Usar modelo específico
OPENAI_MODEL=gpt-4o npm run chat

# Ou definir no .env
echo "OPENAI_MODEL=gpt-4o" >> .env
npm run chat
```

## Tools disponíveis

1. **calculator** - Realiza operações matemáticas
2. **weather** - Busca previsão do tempo
3. **dataAtual** - Retorna data atual
4. **cep** - Busca informações de CEP

## Diferenças entre modelos

| Modelo | Velocidade | Custo | Qualidade Tools | Recomendado para |
|--------|-----------|-------|-----------------|------------------|
| gpt-4o | Média | Alto | Excelente | Aplicações críticas |
| gpt-4o-mini | Rápida | Baixo | Boa | **Uso geral** |
| gpt-4-turbo | Lenta | Alto | Excelente | Tarefas complexas |
| gpt-3.5-turbo | Muito rápida | Muito baixo | Básica | Testes/desenvolvimento |

## Instalação

```bash
npm install
npm run chat
``` 