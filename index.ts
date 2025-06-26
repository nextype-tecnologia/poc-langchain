const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage } = require('@langchain/core/messages');

try { 

    // Caminho para o arquivo .png
    const imagePath = path.join('./files_examples/energiaeletrica.png');
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString('base64');

    //console.log(base64Image);
    //throw new Error();

    const chat = new ChatOpenAI({
      temperature: 0.1,
      apiKey: process.env.OPENAI_API_KEY,      
      modelName: 'gpt-4o', // 👈 Modelo correto com suporte a imagem
    });

    (async () => {
      const res = await chat.invoke([
        new HumanMessage({
          content: [
            { type: 'text', text: 'O que há nesta imagem?' },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/png;base64,${base64Image}`,
              },
            },
          ],
        })
      ]);
      console.log("Resposta:", res.content);
    })();

} catch (error) {
    console.error('❌ Erro capturado:', error);
  }
