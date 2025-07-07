import React, { useState } from 'react';
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from './contexts/AuthContext';
import { useFamily } from './contexts/FamilyContext';
import AuthForms from './components/AuthForms';
import FamilyGroupManager from './components/FamilyGroupManager';
import AdminPanel from './components/AdminPanel';
import ExpenseForm from './components/ExpenseForm';
import TotalsDashboard from './components/TotalsDashboard';
import ExpenseList from './components/ExpenseList';
import PersonTotalsDashboard from './components/PersonTotalsDashboard';
import Modal from './components/Modal';
// Novos componentes visuais
import Sidebar from './components/ui/Sidebar';
import BottomBar from './components/ui/BottomBar';
import Card from './components/ui/Card';
import Button from './components/ui/Button';
import Avatar from './components/ui/Avatar';
import { FiHome, FiUsers, FiPieChart, FiUser, FiLogOut, FiList, FiPlus } from 'react-icons/fi';

// --- Componente Principal ---

function App() {
  const { currentUser, logout } = useAuth();
  const { familyGroup, loadingFamily } = useFamily();

  // Estado para navegação
  const [currentMainScreen, setCurrentMainScreen] = useState('dashboard');
  const [activeDashboardTab, setActiveDashboardTab] = useState('expenses');
  const [showPersonTotalsModal, setShowPersonTotalsModal] = useState(false);
  const [showExpenseFormModal, setShowExpenseFormModal] = useState(false);

  // Menu lateral e bottom bar
  const menuItems = [
    { key: 'dashboard', label: 'Dashboard', icon: <FiHome /> },
    { key: 'expenses', label: 'Despesas', icon: <FiList /> },
    { key: 'add', label: 'Adicionar', icon: <FiPlus /> },
    ...(currentUser?.isAdmin ? [{ key: 'family', label: 'Família', icon: <FiUsers /> }] : []),
    ...(currentUser?.isAdmin ? [{ key: 'admin', label: 'Admin', icon: <FiUser /> }] : []),
    { key: 'logout', label: 'Sair', icon: <FiLogOut /> },
  ];

  const handleMenuClick = (key) => {
    if (key === 'logout') {
      logout();
      return;
    }
    if (key === 'add') {
      setShowExpenseFormModal(true);
      return;
    }
    setCurrentMainScreen(key);
  };

  // Lógica para telas iniciais
  if (!currentUser) {
    return (
      <div className="App app-bg-gradient">
        <div className="centered-content-wrapper">
          <AuthForms />
        </div>
      </div>
    );
  }

  if (loadingFamily) {
    return (
      <div className="App app-bg-gradient">
        <div className="loading-container">Carregando informações da família...</div>
      </div>
    );
  }

  if (!familyGroup) {
    return (
      <div className="App app-bg-gradient">
        <div className="centered-content-wrapper">
          <FamilyGroupManager />
        </div>
      </div>
    );
  }

  // Layout principal
  return (
    <div className="App app-bg-gradient" style={{ minHeight: '100vh', display: 'flex' }}>
      {/* Sidebar (desktop) */}
      <Sidebar
        user={currentUser}
        menuItems={menuItems}
        onMenuClick={handleMenuClick}
        activeItem={currentMainScreen}
        className="hidden-mobile"
      />

      {/* Conteúdo principal */}
      <div className="main-content-area">
        <div className="main-content-inner">
          {/* Cabeçalho mobile (avatar e nome) */}
          <div className="mobile-header hidden-desktop">
            <Avatar name={currentUser?.name} src={currentUser?.avatar} size={48} />
            <span className="mobile-header-username">{currentUser?.name || 'Usuário'}</span>
          </div>

          {/* Dashboard */}
          {currentMainScreen === 'dashboard' && (
            <>
              <div className="dashboard-cards-row">
                <Card>
                  <TotalsDashboard />
                </Card>
              </div>
            </>
          )}

          {/* Despesas Recentes */}
          {currentMainScreen === 'expenses' && (
            <>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
                <Button variant="secondary" onClick={() => setShowPersonTotalsModal(true)}>
                  Ver divisão por pessoa
                </Button>
              </div>
              <Card>
                <ExpenseList />
              </Card>
            </>
          )}

          {/* Gerenciar Família */}
          {currentMainScreen === 'family' && currentUser?.isAdmin && (
            <Card>
              <FamilyGroupManager />
            </Card>
          )}

          {/* Painel Admin */}
          {currentMainScreen === 'admin' && currentUser.isAdmin && (
            <Card>
              <AdminPanel />
            </Card>
          )}
        </div>
      </div>

      {/* BottomBar (mobile) */}
      <BottomBar
        items={menuItems}
        activeItem={currentMainScreen}
        onMenuClick={handleMenuClick}
        className="hidden-desktop"
      />

      {/* Modal de divisão por pessoa */}
      <Modal
        isOpen={showPersonTotalsModal}
        onClose={() => setShowPersonTotalsModal(false)}
        title="Divisão por Pessoa"
      >
        <PersonTotalsDashboard />
      </Modal>

      {/* Modal de adicionar despesa - sempre disponível */}
      <Modal
        isOpen={showExpenseFormModal}
        onClose={() => setShowExpenseFormModal(false)}
        title="Adicionar Nova Despesa"
      >
        <ExpenseForm />
      </Modal>

      <ToastContainer position="bottom-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </div>
  );
}

export default App;