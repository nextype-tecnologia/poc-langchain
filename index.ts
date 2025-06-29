const fs = require('fs');
const path = require('path');
require('dotenv').config();

const Tesseract = require('tesseract.js');
const { ChatOpenAI } = require('@langchain/openai');
const { HumanMessage } = require('@langchain/core/messages');
const { exec } = require('child_process');
const im = require('imagemagick');

async function ConverterPDFImg (linkImagem = ''){

  const inputPath = linkImagem;
  const outputPath = './files_examples/temp/saida.png';

  //im.convert([`${inputPath}[0]`, '-density', '300', '-quality', '100', outputPath], function(err, stdout){
  //if (err) {
  //  throw err;
  //}
  //console.log('PDF convertido com sucesso!');

  await exec(`magick convert -density 300 ${inputPath}[0] ${outputPath}`, (err, stdout, stderr) => {
      if (err) {
        throw err;
      }
      console.log('Conversão concluída!');

      return outputPath;
  });
 
  return outputPath;
}

async function processarImagem(linkArquivo = '') {
  try {

    let linkImagem = null;
    if (path.extname(linkArquivo).toLowerCase() === '.pdf') {
      linkImagem = await ConverterPDFImg (linkArquivo);
    }else{
      linkImagem = linkArquivo;
    }

    
    console.log(linkImagem);

    const { data: { text } } = await Tesseract.recognize(
      path.join(linkImagem),
      'por'
    );

    return text;
  } catch (err) {
    console.error('Erro no OCR:', err);
  }
}

async function EnviaLangChain (leituraOCR = ''){

  const chat = new ChatOpenAI({
    temperature: 0.1,
    apiKey: process.env.OPENAI_API_KEY,      
    modelName: 'gpt-4o', // 👈 Modelo correto com suporte a imagem
  });

  const promptInicial = 'Me ajude a classificar a mensagem a seguir. Preciso que me retorne: data do vencimento, data da competência, valor da conta, nome do fornecedor e determine um plano de contas';

  const res = await chat.invoke([

      new HumanMessage({
        content: [
          { 
            type: 'text', 
            text: promptInicial
          },
          { 
            type: 'text', 
            text: leituraOCR
          },
          //{
          //  type: 'image_url',
          //  image_url: {
          //    url: `data:image/png;base64,${base64Image}`,
          //  },
          //},
        ],
      })
    ]);

    return res;
    //console.log("Resposta:", res.content);
}

async function main() {
  try {
    const leituraOCR = await processarImagem('./files_examples/contadeagua.pdf');

    //console.log('\nTexto extraído da imagem:\n');
    //console.log(leituraOCR);

    const res = await EnviaLangChain (leituraOCR);
    console.log("Resposta:", res.content);

  } catch (error) {
    console.error('❌ Erro capturado na main:', error);
  }
}

main();