# 🍼 Chá de Bebê do Daiki

Bem-vindo ao repositório do projeto do Chá de Bebê do Daiki! Esta é uma aplicação web moderna criada como um convite interativo e uma plataforma de crowdfunding para celebrar a chegada de uma nova vida.

---

### ✨ **Acesse a Aplicação Online** ✨

O site está no ar e totalmente funcional! Você pode visitá-lo aqui:

**[https://chadodaiki.vercel.app/](https://chadodaiki.vercel.app/)**

---

## 🚀 Funcionalidades Principais

Este projeto foi desenvolvido com uma série de funcionalidades para criar uma experiência completa e carinhosa para os convidados:

* **Convite Interativo por Abas:** Navegação intuitiva que separa as seções de Início, Confirmação de Presença, Presentes e Mural de Recados.
* **Confirmação de Presença (RSVP):** Um formulário para os convidados confirmarem presença, informando o número de adultos e crianças. Os dados são salvos em tempo real no banco de dados.
* **Sistema de Presentes (Crowdfunding):** Uma aba dedicada onde os convidados podem presentear com valores monetários, com o objetivo de alcançar uma meta para a compra de itens para o bebê.
* **Integração de Pagamento Real:** O fluxo de pagamento é processado de forma segura através da API do **Mercado Pago**.
* **Mural de Recados em Tempo Real:** Uma área interativa onde os convidados podem deixar mensagens de carinho, que aparecem na tela para todos instantaneamente, sem a necessidade de recarregar a página.
* **Contador de Semanas:** Um componente visual que calcula e exibe a semana atual da gestação.
* **Design Responsivo:** A interface foi construída para se adaptar perfeitamente a qualquer tamanho de tela, seja em computadores, tablets ou celulares.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com um stack de tecnologias moderno e robusto:

* **Framework Front-end:** [Next.js](https://nextjs.org/) (com React e TypeScript)
* **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
* **Banco de Dados:** [Google Firestore](https://firebase.google.com/docs/firestore) (para RSVP e Mural de Recados)
* **Pagamentos:** [SDK do Mercado Pago](https://www.mercadopago.com.br/developers)
* **Hospedagem e Deploy:** [Vercel](https://vercel.com/)
* **Controle de Versão:** [Git](https://git-scm.com/) e [GitHub](https://github.com/)

## 💻 Como Rodar o Projeto Localmente

Para rodar este projeto no seu próprio computador, siga os passos abaixo:

1.  **Clone o Repositório**
    ```bash
    git clone [https://github.com/AlexSan369/Cha-do-Daiki.git](https://github.com/AlexSan369/Cha-do-Daiki.git)
    ```

2.  **Navegue até a Pasta do Projeto**
    ```bash
    cd Cha-do-Daiki
    ```

3.  **Instale as Dependências**
    ```bash
    npm install
    ```

4.  **Configure as Variáveis de Ambiente**
    * Crie um arquivo chamado `.env.local` na raiz do projeto.
    * Preencha o arquivo com suas chaves do Firebase e do Mercado Pago, seguindo o exemplo do arquivo `.env.example` (que você pode criar a partir do nosso `.env.local`).

5.  **Rode o Servidor de Desenvolvimento**
    ```bash
    npm run dev
    ```

    Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado.

---
_Este projeto foi desenvolvido com muito carinho para celebrar a chegada do Daiki._