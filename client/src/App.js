
import React from 'react';
import './App.css';
import { useAuth } from './contexts/AuthContext';
import { useFamily } from './contexts/FamilyContext';
import AuthForms from './components/AuthForms';
import FamilyGroupManager from './components/FamilyGroupManager';
import AdminPanel from './components/AdminPanel';
import ExpenseForm from './components/ExpenseForm';
import TotalsDashboard from './components/TotalsDashboard';
import ExpenseList from './components/ExpenseList';

// --- Componente Principal ---

function App() {
  const { currentUser, logout } = useAuth();
  const { familyGroup, loadingFamily } = useFamily();
  const [showAdminPanel, setShowAdminPanel] = React.useState(false);

  if (!currentUser) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Controle de Despesas Familiares</h1>
        </header>
        <AuthForms />
      </div>
    );
  }

  if (loadingFamily) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Controle de Despesas Familiares</h1>
          {currentUser && <button onClick={logout} className="logout-btn">Sair</button>}
        </header>
        <div className="loading-container">Carregando informações da família...</div>
      </div>
    );
  }

  if (!familyGroup) {
    return (
      <div className="App">
        <header className="App-header">
          <h1>Controle de Despesas Familiares</h1>
          {currentUser && <button onClick={logout} className="logout-btn">Sair</button>}
        </header>
        <FamilyGroupManager />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Controle de Despesas Familiares</h1>
        {currentUser && (
          <div className="header-buttons">
            <button onClick={logout} className="logout-btn">Sair</button>
            {currentUser.isAdmin && (
              <button onClick={() => setShowAdminPanel(!showAdminPanel)} className="admin-panel-toggle-btn">
                {showAdminPanel ? 'Voltar para Despesas' : 'Painel Admin'}
              </button>
            )}
          </div>
        )}
      </header>
      <main>
        {showAdminPanel && currentUser.isAdmin ? (
          <AdminPanel />
        ) : (
          <>
            <TotalsDashboard />
            <ExpenseForm />
            <ExpenseList />
          </>
        )}
      </main>
    </div>
  );
}

export default App;
