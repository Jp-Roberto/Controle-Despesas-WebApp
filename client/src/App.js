import React, { useState } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './contexts/AuthContext';
import { useFamily } from './contexts/FamilyContext';
import { useTheme } from './contexts/ThemeContext';
import AuthForms from './components/AuthForms';
import FamilyGroupManager from './components/FamilyGroupManager';
import AdminPanel from './components/AdminPanel';
import ExpenseForm from './components/ExpenseForm';
import TotalsDashboard from './components/TotalsDashboard';
import ExpenseList from './components/ExpenseList';
import PersonTotalsDashboard from './components/PersonTotalsDashboard';
import HeaderMenu from './components/HeaderMenu';
import Modal from './components/Modal';

// --- Componente Principal ---

function App() {
  const { currentUser, logout } = useAuth();
  const { familyGroup, loadingFamily } = useFamily();
  const { theme, toggleTheme } = useTheme();

  // Novo estado para controlar a visualização principal: 'dashboard', 'family', 'admin'
  const [currentMainScreen, setCurrentMainScreen] = useState('dashboard');
  // Estado para controlar a sub-aba dentro da visualização 'dashboard'
  const [activeDashboardTab, setActiveDashboardTab] = useState('expenses');
  // Estado para controlar a visibilidade do modal de divisão por pessoa
  const [showPersonTotalsModal, setShowPersonTotalsModal] = useState(false);

  // Lógica para telas iniciais (autenticação, carregamento, sem grupo familiar)
  if (!currentUser) {
    return (
      <div className="App">
        <div className="centered-content-wrapper">
          <AuthForms />
        </div>
      </div>
    );
  }

  if (loadingFamily) {
    return (
      <div className="App">
        <div className="loading-container">Carregando informações da família...</div>
      </div>
    );
  }

  // Se o usuário estiver logado mas não em um grupo familiar, força a tela de gerenciamento de grupo
  if (!familyGroup) {
    return (
      <div className="App">
        <div className="centered-content-wrapper">
          <FamilyGroupManager />
        </div>
      </div>
    );
  }

  // Conteúdo principal da aplicação quando o usuário está logado e em um grupo familiar
  return (
    <div className="App">
      {/* Nova Navegação Principal */}
      <nav className="main-nav">
        {currentUser && <HeaderMenu onShowPersonTotals={() => setShowPersonTotalsModal(true)} />}
        <div className="main-nav-buttons-group">
          <button
            className={`main-nav-button ${currentMainScreen === 'dashboard' ? 'active' : ''}`}
            onClick={() => setCurrentMainScreen('dashboard')}
          >
            Despesas
          </button>
          <button
            className={`main-nav-button ${currentMainScreen === 'family' ? 'active' : ''}`}
            onClick={() => setCurrentMainScreen('family')}
          >
            Gerenciar Família
          </button>
          {currentUser.isAdmin && (
            <button
              className={`main-nav-button ${currentMainScreen === 'admin' ? 'active' : ''}`}
              onClick={() => setCurrentMainScreen('admin')}
            >
              Painel Admin
            </button>
          )}
        </div>
      </nav>

      <main className="app-main-content"> {/* Classe renomeada para clareza */}
        {currentMainScreen === 'dashboard' && (
          <>
            {/* Sub-navegação para as abas do Dashboard */}
            <div className="tab-navigation">
              <button
                className={`tab-button ${activeDashboardTab === 'expenses' ? 'active' : ''}`}
                onClick={() => setActiveDashboardTab('expenses')}
              >
                Resumo e Lançamentos
              </button>
              {/* Removido o botão de Divisão por Pessoa daqui, agora é um modal */}
            </div>

            {activeDashboardTab === 'expenses' && (
              <div className="dashboard-grid-container"> {/* NOVO: Container para o layout de grid */}
                <TotalsDashboard />
                <ExpenseForm />
                <ExpenseList />
              </div>
            )}
            {/* PersonTotalsDashboard não é mais renderizado diretamente aqui */}
          </>
        )}

        {currentMainScreen === 'family' && (
          <div className="centered-content-wrapper"> {/* Reutilizando wrapper para centralização */}
            <FamilyGroupManager />
          </div>
        )}

        {currentMainScreen === 'admin' && currentUser.isAdmin && (
          <div className="centered-content-wrapper"> {/* Reutilizando wrapper para centralização */}
            <AdminPanel />
          </div>
        )}
      </main>

      {showPersonTotalsModal && (
        <Modal
          isOpen={showPersonTotalsModal}
          onClose={() => setShowPersonTotalsModal(false)}
          title="Divisão por Pessoa"
        >
          <PersonTotalsDashboard />
        </Modal>
      )}

      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default App;