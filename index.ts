require('dotenv').config();

const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage } = require('@langchain/core/messages');

const chat = new ChatOpenAI({
  temperature: 0.7,
  apiKey: process.env.OPENAI_API_KEY_IV,
});

(async () => {
  const res = await chat.invoke([
    new HumanMessage("Qual é a capital da Alemanha?")
  ]);
  console.log("Resposta:", res.content);
})();
