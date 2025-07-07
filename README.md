# App Família Despesas

![GitHub repo size](https://img.shields.io/github/repo-size/Jp-Roberto/Controle-Despesas-WebApp)
![GitHub stars](https://img.shields.io/github/stars/Jp-Roberto/Controle-Despesas-WebApp?style=social)
![GitHub license](https://img.shields.io/github/license/Jp-Roberto/Controle-Despesas-WebApp)

Um aplicativo moderno e fácil de usar para controle de despesas familiares, com visual bonito, responsivo e recursos de administração para grupos.

---

## 📑 Tabela de Conteúdos
- [O que é este app?](#-o-que-é-este-app)
- [Principais recursos](#-principais-recursos)
- [Tecnologias utilizadas](#-tecnologias-utilizadas)
- [Pré-requisitos](#️-pré-requisitos)
- [Como instalar e rodar](#️-como-instalar-e-rodar)
- [Como usar](#-como-usar)
- [Segurança](#️-segurança)
- [Responsividade](#-responsividade)
- [Dicas para iniciantes](#-dicas-para-iniciantes)
- [Personalização](#-personalização)
- [Build para produção](#-build-para-produção)
- [Como contribuir](#-como-contribuir)
- [FAQ](#faq)
- [Licença](#-licença)

---

## ✨ O que é este app?

O **App Família Despesas** permite que famílias ou grupos controlem juntos seus gastos, visualizem resumos, gráficos, divisão por pessoa e mantenham tudo organizado de forma colaborativa e segura.

## 🚀 Principais recursos
- Cadastro e login de usuários
- Criação e administração de grupos familiares
- Adição, visualização e exclusão de despesas
- Resumo da fatura do mês com gráficos
- Divisão de gastos por pessoa
- Permissões: admin e usuário comum
- Visual moderno, responsivo e com dark mode

## 🛠️ Tecnologias utilizadas
- React.js (frontend)
- Firebase Authentication & Firestore (backend)
- CSS Modules para estilização
- Chart.js para gráficos
- Deploy fácil em Vercel, Netlify ou Firebase Hosting

## 🖥️ Pré-requisitos
- [Node.js](https://nodejs.org/) (recomendado v18+)
- [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)
- Conta no [Firebase](https://firebase.google.com/) (Firestore)

## ⚙️ Como instalar e rodar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Jp-Roberto/Controle-Despesas-WebApp.git
   cd app-familia-despesas/client
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

3. **Configuração do Firebase:**
   - Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
   - Configure a autenticação (Email/Senha) e o Firestore Database.
   - Crie um arquivo `firebaseConfig.js` dentro de `client/src/` com suas credenciais do Firebase:

     ```javascript
     // client/src/firebaseConfig.js
     import { initializeApp } from "firebase/app";
     import { getAuth } from "firebase/auth";
     import { getFirestore } from "firebase/firestore";

     const firebaseConfig = {
       apiKey: "SUA_API_KEY",
       authDomain: "SEU_AUTH_DOMAIN",
       projectId: "SEU_PROJECT_ID",
       storageBucket: "SEU_STORAGE_BUCKET",
       messagingSenderId: "SEU_MESSAGING_SENDER_ID",
       appId: "SEU_APP_ID"
     };

     const app = initializeApp(firebaseConfig);
     const auth = getAuth(app);
     const db = getFirestore(app);

     export { auth, db };
     ```

4. **Rode o app localmente:**
   ```bash
   npm start
   # ou
   yarn start
   ```
   O app abrirá em `http://localhost:3000`

## 👨‍👩‍👧‍👦 Como usar

1. **Cadastre-se** com seu e-mail e senha.
2. **Crie um grupo familiar** (se for admin) ou peça para ser adicionado.
3. **Adicione despesas** facilmente pelo botão "Adicionar".
4. **Veja o resumo da fatura**, gráficos e divisão por pessoa.
5. **Admins** podem gerenciar membros, aceitar solicitações e fechar a fatura.
6. **Usuários comuns** só podem ver/adicionar suas próprias despesas.

## 🛡️ Segurança

- **Autenticação e Banco de Dados:**
  - Utiliza Firebase Authentication (e-mail/senha) para login seguro.
  - Todas as informações são salvas no Firestore, banco de dados em nuvem do Firebase.

- **Regras de Permissão:**
  - O acesso aos dados é controlado por regras do Firestore, separando claramente o que é permitido para administradores e usuários comuns.
  - Apenas membros do grupo podem visualizar as despesas do grupo.
  - Apenas administradores podem adicionar/remover membros, fechar fatura e acessar o painel de administração.

- **Boas Práticas:**
  - Senhas nunca ficam visíveis nem são salvas no banco de dados.
  - O frontend esconde menus e botões de admin para usuários comuns, mas a segurança real é garantida pelas regras do backend (Firestore).
  - Todas as ações sensíveis são validadas tanto no frontend quanto no backend.

## 📱 Responsividade
- Funciona perfeitamente em celulares, tablets e computadores
- Menu inferior adaptado para mobile

## 💡 Dicas para iniciantes
- Se não conseguir acessar um recurso, verifique se você é admin
- Use o botão de "Adicionar" para registrar novas despesas
- O dark mode pode ser ativado automaticamente pelo sistema
- Para dúvidas, consulte este README ou peça ajuda!

## 📝 Personalização
- Você pode alterar as cores, categorias e textos editando os arquivos em `src/`
- Para mudar regras de permissão, ajuste no console do Firebase (Firestore Rules)

## 📦 Build para produção
```bash
npm run build
# ou
yarn build
```
Os arquivos otimizados ficarão na pasta `build/`.

## 🤝 Como contribuir
1. Faça um fork deste repositório
2. Crie uma branch: `git checkout -b minha-feature`
3. Faça suas alterações e commit: `git commit -m 'Minha nova feature'`
4. Envie para o seu fork: `git push origin minha-feature`
5. Abra um Pull Request explicando suas mudanças

## 📸 Exemplos visuais
> Adicione aqui prints de tela do app rodando (exemplo abaixo):

![Tela de login](https://user-images.githubusercontent.com/0000000/000000000-00000000-0000-0000-0000-000000000000.png)
![Dashboard](https://user-images.githubusercontent.com/0000000/000000000-00000000-0000-0000-0000-000000000000.png)

## FAQ
**1. O app é gratuito?**
Sim, totalmente open-source!

**2. Preciso de conta no Firebase?**
Sim, para rodar localmente ou em produção.

**3. Posso usar outro backend?**
O app foi feito para Firebase, mas pode ser adaptado.

**4. Como reportar bugs?**
Abra uma issue no GitHub.

## 📄 Licença
Este projeto é open-source e pode ser adaptado livremente.

---

**Dúvidas? Sugestões?**
Abra uma issue ou entre em contato!
