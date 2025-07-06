# AppTesteBeta: Gerenciamento de Despesas Familiares

Este é um aplicativo web para gerenciamento colaborativo de despesas familiares, permitindo que membros de um grupo familiar registrem e acompanhem gastos, visualizem totais e divisões por pessoa, e gerenciem o grupo.

## Funcionalidades Principais

-   **Autenticação de Usuários:** Sistema de login e registro para acesso seguro.
-   **Gerenciamento de Grupos Familiares:**
    -   Criação e junção a grupos familiares.
    -   Visualização de membros do grupo.
    -   Painel de administração para gerenciar membros (apenas para administradores).
-   **Registro e Acompanhamento de Despesas:**
    -   Adição de novas despesas com descrição, valor, categoria e responsável.
    -   Listagem de despesas registradas.
    -   Fechamento de fatura para reiniciar o ciclo de despesas.
-   **Dashboards e Relatórios:**
    -   Visualização de totais de despesas.
    -   **Divisão por Pessoa:** Acompanhamento dos gastos individuais de cada membro do grupo, acessível via modal no menu superior.
    -   Gráficos de categorias (se implementado).
-   **Interface de Usuário:**
    -   Modo claro/escuro (Light/Dark Mode).
    -   Notificações de sistema (toasts) para feedback ao usuário.
    -   Modais de confirmação para ações importantes.

## Tecnologias Utilizadas

-   **Frontend:** React.js
-   **Estilização:** CSS Modules, CSS puro com variáveis para temas.
-   **Gerenciamento de Estado:** React Context API
-   **Autenticação e Banco de Dados:** Firebase (Firestore, Authentication)
-   **Notificações:** `react-toastify`

## Como Rodar o Projeto Localmente

Para configurar e rodar este projeto em sua máquina local, siga os passos abaixo:

1.  **Clone o Repositório:**
    ```bash
    git clone <URL_DO_SEU_REPOSITORIO>
    cd AppTesteBeta/client
    ```

2.  **Instale as Dependências:**
    ```bash
    npm install
    ```

3.  **Configuração do Firebase:**
    -   Crie um projeto no [Firebase Console](https://console.firebase.google.com/).
    -   Configure a autenticação (Email/Senha) e o Firestore Database.
    -   Crie um arquivo `firebaseConfig.js` dentro de `client/src/` com suas credenciais do Firebase:

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

4.  **Inicie o Servidor de Desenvolvimento:**
    ```bash
    npm start
    ```

    O aplicativo será aberto em `http://localhost:3000` no seu navegador padrão.

## Estrutura do Projeto

```
AppTesteBeta/
├───client/                 # Frontend da aplicação React
│   ├───public/             # Arquivos estáticos
│   ├───src/                # Código fonte da aplicação
│   │   ├───App.js          # Componente principal da aplicação
│   │   ├───App.css         # Estilos globais
│   │   ├───firebaseConfig.js # Configurações do Firebase
│   │   ├───index.js        # Ponto de entrada da aplicação
│   │   ├───components/     # Componentes reutilizáveis da UI
│   │   │   ├───AdminPanel.js
│   │   │   ├───AuthForms.js
│   │   │   ├───ExpenseForm.js
│   │   │   ├───ExpenseList.js
│   │   │   ├───FamilyGroupManager.js
│   │   │   ├───HeaderMenu.js
│   │   │   ├───Modal.js
│   │   │   ├───PersonTotalsDashboard.js
│   │   │   └───TotalsDashboard.js
│   │   ├───contexts/       # Contextos React para gerenciamento de estado global
│   │   │   ├───AuthContext.js
│   │   │   ├───ExpenseContext.js
│   │   │   ├───FamilyContext.js
│   │   │   └───ThemeContext.js
│   │   └───hooks/          # Hooks personalizados
│   │       └───usePersonTotals.js
│   └───package.json        # Dependências e scripts do projeto React
└───README.md               # Este arquivo
```

## Contribuição

Sinta-se à vontade para contribuir com o projeto. Por favor, siga as boas práticas de desenvolvimento e abra um pull request para suas alterações.

## Licença

Este projeto está licenciado sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes. (Se aplicável)
