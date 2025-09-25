# Projeto de Análise de Dados Meteorológicos

Este projeto consiste em um script desenvolvido em TypeScript que lê dados meteorológicos de um arquivo CSV, os armazena em um banco de dados MongoDB utilizando Mongoose e realiza diversas análises estatísticas sobre os dados.

## Funcionalidades

O script realiza as seguintes análises:

-   Lista os 5 dias com as temperaturas mais altas.
-   Calcula a média de todas as temperaturas registradas.
-   Calcula a média geral das médias de velocidade do vento.
-   Lista os 3 dias com as maiores medições de pressão atmosférica.
-   Calcula a média geral do percentual de umidade do ar.

## Tecnologias Utilizadas

-   **Backend:** Node.js
-   **Linguagem:** TypeScript
-   **Banco de Dados:** MongoDB
-   **ODM (Object Data Modeling):** Mongoose
-   **Parser de CSV:** csv-parser

## Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
-   [Node.js](https://nodejs.org/en/) (versão 14 ou superior)
-   [MongoDB Server](https://www.mongodb.com/try/download/community) (instalado e em execução)

## Instalação e Configuração

1.  Clone este repositório ou baixe os arquivos do projeto.

2.  Navegue até a pasta raiz do projeto pelo terminal:
    ```bash
    cd caminho/para/o/seu-projeto
    ```

3.  Instale as dependências necessárias com o NPM:
    ```bash
    npm install
    ```

4.  **Arquivo de Dados**: Coloque o arquivo de dados CSV na pasta raiz do projeto com o nome `Desafio_Dados_Meteorologicos.csv`.

5.  **Banco de Dados**: O script se conecta a um banco MongoDB local por padrão (`mongodb://localhost:27017/desafio-meteorologico`). Caso sua configuração seja diferente, altere a string de conexão no arquivo `src/index.ts`.

## Como Executar

Para rodar o script e realizar a importação e análise dos dados, execute o seguinte comando no terminal:

```bash
npx ts-node src/index.ts
