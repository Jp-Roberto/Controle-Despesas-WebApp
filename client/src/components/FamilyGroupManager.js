import React, { useState } from 'react';
import { useFamily } from '../contexts/FamilyContext';

function FamilyGroupManager() {
  const { createFamilyGroup, joinFamilyGroup, loadingFamily } = useFamily();
  const [groupName, setGroupName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleCreateGroup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      const newGroupId = await createFamilyGroup(groupName);
      setMessage(`Grupo "${groupName}" criado com sucesso! ID: ${newGroupId}`);
      setGroupName('');
    } catch (err) {
      setError('Erro ao criar grupo: ' + err.message);
    }
  };

  const handleJoinGroup = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    try {
      await joinFamilyGroup(groupId);
      setMessage('Você entrou no grupo com sucesso!');
      setGroupId('');
    } catch (err) {
      setError('Erro ao entrar no grupo: ' + err.message);
    }
  };

  if (loadingFamily) {
    return <div className="family-manager-container">Carregando informações da família...</div>;
  }

  return (
    <div className="family-manager-container">
      <h2>Gerenciar Grupo Familiar</h2>
      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <div className="family-form-section">
        <h3>Criar Novo Grupo</h3>
        <form onSubmit={handleCreateGroup} className="family-form">
          <input
            type="text"
            placeholder="Nome do Grupo Familiar"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          />
          <button type="submit">Criar Grupo</button>
        </form>
      </div>

      <div className="family-form-section">
        <h3>Entrar em Grupo Existente</h3>
        <form onSubmit={handleJoinGroup} className="family-form">
          <input
            type="text"
            placeholder="ID do Grupo Familiar"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
            required
          />
          <button type="submit">Entrar no Grupo</button>
        </form>
      </div>
    </div>
  );
}

export default FamilyGroupManager;