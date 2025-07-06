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

  const promptInicial = `Tenha em mente os seguintes planos de contas:
Código	Nome	Tipo
1.1	Taxa condominial	Receita
1.2	Fundo de reserva	Receita
1.3	Água	Receita
1.5	Gás	Receita
1.6	Energia elétrica	Receita
1.7	Energia elétrica área comum	Receita
1.8	Juros	Receita
1.9	Multas	Receita
1.10	Multa condominial	Receita
1.11	Rateios	Receita
1.12	Fundo de obras	Receita
1.13	Rendimento Poupança	Receita
1.14	Rendimento de investimentos	Receita
1.15	Correção monetária	Receita
1.16	Transferência entre contas	Receita
1.17	Pagamento duplicado	Receita
1.18	Cobrança	Receita
1.19	Crédito	Receita
1.20	Estorno	Receita
1.21	Acordo	Receita
1.22	Honorários	Receita
1.23	Seguro obrigatório	Receita
1.24	Taxa de lixo	Receita
1.25	Garagem	Receita
1.26	Tarifa bancária	Receita
1.27	Salão de festas	Receita
1.28	Internet	Receita
1.29	Taxa de mudança	Receita
1.30	Espaço gourmet	Receita
1.31	Saldo inicial	Receita
1.32	Tag e Controle	Receita
1.33	Luz e energia	Receita
1.34	Água mineral	Receita
1.35	Estorno taxa de resgate	Receita
1.36	Honorários	Receita
1.37	Reserva de dependência	Receita
1.38	Reembolso/Desconto	Receita
1.39	Seguro fiança	Receita
1.40	Distribuição de lucro cooperativa	Receita
1.41	Indenização sinistro condominial	Receita
2	Despesas	Despesa
2.1	Encargos Sociais	Despesa
2.1.1	INSS	Despesa
2.1.2	IRRF	Despesa
2.1.3	DARF 	Despesa
2.1.4	FGTS	Despesa
2.1.5	PIS	Despesa
2.2	Honorários Profissionais	Despesa
2.2.1	Administração condominial	Despesa
2.2.2	Honorários advocatícios	Despesa
2.2.3	Pró-labore síndico 	Despesa
2.2.4	Pró-labore subsíndico	Despesa
2.2.5	Pró-labore síndico profissional	Despesa
2.2.6	Renovação da LAO	Despesa
2.3	Concessionárias	Despesa
2.3.1	Água	Despesa
2.3.2	Concessionárias	Despesa
2.3.3	Gás	Despesa
2.3.4	Energia elétrica	Despesa
2.3.5	Telefone/Internet	Despesa
2.4	Impostos e Taxas	Despesa
2.4.1	ISS - Imposto sobre serviço	Despesa
2.4.2	Taxa de alvará - Bombeiros	Despesa
2.4.3	DARF	Despesa
2.4.4	INSS	Despesa
2.4.5	DARF Previdenciária	Despesa
2.4.6	LAO - Licença ambiental	Despesa
2.5	Serviços de Manutenção e Conservação	Despesa
2.5.1	Manutenção bombas	Despesa
2.5.2	Manutenção portas e portões	Despesa
2.5.3	Serviço de jardinagem	Despesa
2.5.4	Serviço de limpeza	Despesa
2.5.5	Serviços eletrônicos	Despesa
2.5.6	Serviços elétricos	Despesa
2.5.7	Manutenção das piscinas	Despesa
2.5.8	Recolhimento de lixo/entulho	Despesa
2.5.9	Manutenção de caixa de gordura/fossa	Despesa
2.5.10	Serviços de serralheria	Despesa
2.5.11	Serviço manutenção e conservação	Despesa
2.5.12	Serviço de pintura	Despesa
2.5.13	Manutenção do elevador	Despesa
2.5.14	Serviços de chaveiro	Despesa
2.5.15	Manutenção do gerador	Despesa
2.5.16	Manutenção da academia	Despesa
2.5.17	Serviços de dedetização 	Despesa
2.5.18	Manutenção ETE	Despesa
2.5.19	Analise Laboratorial	Despesa
2.5.21	Manutenção Extintores	Despesa
2.5.22	Dedetização e Limpeza Caixa D' agua	Despesa
2.5.23	Manutenção nas antenas	Despesa
2.5.24	Manutenção Sauna	Despesa
2.5.25	Manutenção ar condicionado	Despesa
2.5.26	Serviços hidráulicos	Despesa
2.6	Serviços Terceirizados	Despesa
2.6.1	Serviços de zeladoria	Despesa
2.6.2	Serviços de vigilância	Despesa
2.6.3	Serviços de monitoramento	Despesa
2.6.4	Serviços de auditoria	Despesa
2.6.5	Cobrança garantida	Despesa
2.6.6	Serviço de portaria	Despesa
2.6.7	Portaria remota	Despesa
2.6.8	Serviços de Zeladoria, Portaria e Limpeza	Despesa
2.6.9	Conserto de máquinas e equipamentos	Despesa
2.6.10	Aparelho de TV	Despesa
2.6.11	Serviço de limpeza do salão de festas	Despesa
2.7	Materiais para Manutenção e Conservação 	Despesa
2.7.1	Materiais p/ limpeza	Despesa
2.7.2	Materiais p/ pintura	Despesa
2.7.3	Materiais elétricos	Despesa
2.7.4	Materiais eletrônicos	Despesa
2.7.5	Materiais para construção e reforma	Despesa
2.7.6	Materiais p/ jardim	Despesa
2.7.7	Materiais p/ piscinas	Despesa
2.7.8	Materiais p/ elevador	Despesa
2.7.9	Materiais p/ manutenção e conservação	Despesa
2.7.10	Placas de Sinalização	Despesa
2.7.11	Materiais Químicos 	Despesa
2.7.12	Materiais hospitalares	Despesa
2.7.13	Materiais p/ academia 	Despesa
2.7.14	Materiais hidráulicos	Despesa
2.8	Despesas Administrativas	Despesa
2.8.1	Despesas com combustível	Despesa
2.8.2	Material de expediente	Despesa
2.8.3	Tags e Controles	Despesa
2.8.4	Locação de equipamentos	Despesa
2.8.5	Despesas Gráficas	Despesa
2.8.6	Cartório	Despesa
2.8.7	Correio	Despesa
2.8.8	Água mineral	Despesa
2.8.9	Depósito judicial	Despesa
2.8.10	Certificado digital	Despesa
2.9	Despesas Financeiras	Despesa
2.9.1	Tarifas bancárias	Despesa
2.9.2	Tarifas	Despesa
2.9.3	Juros/Multa	Despesa
2.9.4	IRRF	Despesa
2.9.5	Descontos e Reembolsos	Despesa
2.9.6	Ajuste de saldo	Despesa
2.9.7	Juros	Despesa
2.9.8	Multa	Despesa
2.10	Benfeitorias e Recuperação	Despesa
2.10.1	Reformas	Despesa
2.10.2	Pintura	Despesa
2.10.3	Benfeitorias e recuperação do prédio	Despesa
2.11	Imobilizado	Despesa
2.11.1	Máquinas e equipamentos	Despesa
2.11.2	Utensílios p/ salão de festas	Despesa
2.11.3	Móveis para salão de festas	Despesa
2.11.4	Utensílios eletrônicos	Despesa
2.11.5	Utensílios elétricos	Despesa
2.11.6	Móveis e utensílios	Despesa
2.11.7	Utensílios condominiais	Despesa
2.12	Despesas eventuais	Despesa
2.12.1	Decoração	Despesa
2.12.2	Despesas diversas	Despesa
2.12.3	Presentes	Despesa
2.12.4	Cesta básica	Despesa
2.13	Seguro	Despesa
2.13.1	Seguro obrigatório área comum	Despesa
2.14	Pessoal	Despesa
2.14.1	Vale alimentação	Despesa
2.14.2	Vale transporte	Despesa
2.14.3	Vale combustível	Despesa
2.14.4	Gratificação	Despesa
2.14.5	Salário funcionário(a)	Despesa
2.14.6	13° salário funcionário(a)	Despesa
2.14.7	Férias funcionário(a)	Despesa
2.14.8	Medicina ocupacional - PCMSO	Despesa
2.14.9	Acordo trabalhista	Despesa
  
Agora me ajude a classificar a mensagem a seguir. Preciso que me retorne: 

Tipo	Categoria	Conta	Descrição	Data do vencimento	Valor	Data da liquidação	Valor liquidado	Multa	Juros	Bloco	Apartamento	Fornecedor	Referência	Observações

Quero o retorno em JSON. Mas crie um campo de observações gerais no JSON se necessário.
`;

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
    const leituraOCR = await processarImagem('./files_examples/energiaeletrica.png');

    //console.log('\nTexto extraído da imagem:\n');
    //console.log(leituraOCR);

    const res = await EnviaLangChain (leituraOCR);
    console.log("Resposta:", res.content);

  } catch (error) {
    console.error('❌ Erro capturado na main:', error);
  }
}

main();