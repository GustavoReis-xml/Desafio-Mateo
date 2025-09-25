import mongoose from 'mongoose';
import fs from 'fs';
import csv from 'csv-parser';
import Meteo from './models/Meteo';

// --- 1. CONEXÃO COM O BANCO DE DADOS ---
async function connectToDatabase() {
  try {
    await mongoose.connect('mongodb://localhost:27017/desafio-meteorologico');
    console.log('Conexão com o MongoDB estabelecida com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar com o MongoDB:', error);
    process.exit(1);
  }
}

// --- 2. LEITURA E INSERÇÃO DOS DADOS DO CSV ---
async function populateDatabase() {
  return new Promise((resolve, reject) => {
    const results: any[] = [];
    const filePath = 'Desafio_Dados_Meteorologicos.csv';

    console.log(`Iniciando leitura do arquivo: ${filePath}...`);
    fs.createReadStream(filePath)
      .pipe(csv({
        separator: ';',
        // Esta função renomeia os cabeçalhos para remover o caractere TENEBROSO QUE O WINDOWS COLOCOU
        mapHeaders: ({ header }) => header.trim()
      }))
      .on('data', (data) => {
        if (!data.Date || !data.Time) {
          return; // Pula linhas em branco
        }

        // Função auxiliar para converter strings com vírgula para número
        const parseFloatComma = (value: string) => {
            if (typeof value !== 'string') return value || 0;
            return parseFloat(value.replace(',', '.')) || 0;
        };

        const mappedData = {
          Date: data.Date,
          Time: data.Time,
          // Usando a nova função para converter os números corretamente
          Temp_C: parseFloatComma(data.Temp_C),
          // A coluna Hum não tem o '%', então ajustado aqui
          Hum_Per: parseFloatComma(data.Hum),
          Press_Bar: parseFloatComma(data.Press_Bar),
          WindSpeed_Avg: parseFloatComma(data.WindSpeed_Avg),
          WindDir_Avg: parseFloatComma(data.WindDir_Avg),
        };
        results.push(mappedData);
      })
      .on('end', async () => {
        try {
          if (results.length === 0) {
            console.error('Nenhum dado válido foi lido.');
            return reject('Nenhum dado lido.');
          }
          console.log(`Leitura do arquivo CSV concluída. ${results.length} registros válidos encontrados.`);

          console.log('Limpando dados antigos da coleção...');
          await Meteo.deleteMany({});

          console.log('Inserindo novos registros...');
          await Meteo.insertMany(results);
          console.log('Banco de dados populado com sucesso!');
          resolve(true);
        } catch (error) {
          console.error('Erro ao inserir dados no MongoDB:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('Erro ao ler o arquivo CSV:', error);
        reject(error);
      });
  });
}

// --- 3. FUNÇÕES DE ANÁLISE (sem alterações) ---

// c. 5 dias com as temperaturas mais altas
async function getTop5HighestTemperatures() {
  console.log('\nc. 5 dias com as temperaturas mais altas:');
  const results = await Meteo.find({})
    .sort({ Temp_C: -1, Date: 1 })
    .limit(5);

  results.forEach(record => {
    console.log(`- Data: ${record.Date}, Temperatura: ${record.Temp_C.toFixed(2)}°C`);
  });
}

// d. Média de todas as temperaturas
async function getAverageTemperature() {
  console.log('\nd. Média de todas as temperaturas cadastradas:');
  const result = await Meteo.aggregate([
    { $group: { _id: null, avgTemp: { $avg: '$Temp_C' } } }
  ]);

  if (result.length > 0) {
    console.log(`- Média geral: ${result[0].avgTemp.toFixed(2)}°C`);
  }
}

// e. Média geral das médias de vento
async function getAverageWindSpeed() {
  console.log('\ne. Média geral das médias de vento cadastradas:');
  const result = await Meteo.aggregate([
    { $group: { _id: null, avgWindSpeed: { $avg: '$WindSpeed_Avg' } } }
  ]);

  if (result.length > 0) {
    console.log(`- Média geral da velocidade do vento: ${result[0].avgWindSpeed.toFixed(2)} m/s`);
  }
}

// f. Três dias com as maiores medições de pressão atmosférica
async function getTop3HighestPressure() {
  console.log('\nf. Três dias com as maiores medições de pressão atmosférica:');
  const results = await Meteo.find({})
    .sort({ Press_Bar: -1, Date: 1 })
    .limit(3);

  results.forEach(record => {
    console.log(`- Data: ${record.Date}, Pressão: ${record.Press_Bar.toFixed(4)} Bar`);
  });
}

// g. Média geral da umidade do ar
async function getAverageHumidity() {
  console.log('\ng. Média geral da medição do percentual de umidade do ar:');
  const result = await Meteo.aggregate([
    { $group: { _id: null, avgHumidity: { $avg: '$Hum_Per' } } }
  ]);

  if (result.length > 0) {
    console.log(`- Média geral da umidade: ${result[0].avgHumidity.toFixed(2)}%`);
  }
}


// --- 4. FUNÇÃO PRINCIPAL ---
async function main() {
  await connectToDatabase();
  await populateDatabase();

  console.log('\n--- Iniciando Análise de Dados Meteorológicos ---');

  await getTop5HighestTemperatures();
  await getAverageTemperature();
  await getAverageWindSpeed();
  await getTop3HighestPressure();
  await getAverageHumidity();

  console.log('\n--- Análise Concluída ---');

  await mongoose.disconnect();
  console.log('\nDesconectado do MongoDB.');
}

// Executa o programa
main().catch(err => {
    console.error("Ocorreu um erro na execução principal:", err);
    mongoose.disconnect();
});