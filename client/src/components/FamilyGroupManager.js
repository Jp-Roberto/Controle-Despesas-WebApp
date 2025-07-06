import React, { useState } from 'react';
import { useFamily } from '../contexts/FamilyContext';
import { useAuth } from '../contexts/AuthContext'; // Importar useAuth para verificar se é admin
import styles from './FamilyGroupManager.module.css';

function FamilyGroupManager() {
  const { createFamilyGroup, joinFamilyGroup, loadingFamily, availableGroups, loadingGroups, sendJoinRequest } = useFamily();
  const { currentUser } = useAuth(); // Obter o usuário atual para verificar se é admin
  const [groupName, setGroupName] = useState('');
  const [groupId, setGroupId] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState('');
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

  const handleJoinGroup = async (e, idToJoin = null) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const finalGroupId = idToJoin || groupId; // Usa idToJoin se fornecido, senão usa groupId do estado

    try {
      if (currentUser && currentUser.isAdmin) {
        await joinFamilyGroup(finalGroupId);
        setMessage('Você entrou no grupo com sucesso!');
      } else {
        await sendJoinRequest(finalGroupId);
        setMessage('Solicitação de entrada enviada com sucesso!');
      }
      setGroupId('');
      setSelectedGroupId(''); // Limpa o grupo selecionado após entrar
    } catch (err) {
      setError('Erro: ' + err.message);
    }
  };

  if (loadingFamily || loadingGroups) {
    return <div className={styles['family-manager-container']}>Carregando informações da família...</div>;
  }

  return (
    <div className={styles['family-manager-container']}>
      <h2>Gerenciar Grupo Familiar</h2>
      {error && <p className={styles['error-message']}>{error}</p>}
      {message && <p className={styles['success-message']}>{message}</p>}

      {currentUser && currentUser.isAdmin && (
        <div className={styles['family-form-section']}>
          <h3>Criar Novo Grupo</h3>
          <form onSubmit={handleCreateGroup} className={styles['family-form']}>
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
      )}

      <div className={styles['family-form-section']}>
        <h3>Entrar em Grupo Existente</h3>
        <form onSubmit={handleJoinGroup} className={styles['family-form']}>
          <input
            type="text"
            placeholder="ID do Grupo Familiar"
            value={groupId}
            onChange={(e) => setGroupId(e.target.value)}
          />
          <button type="submit">{currentUser && currentUser.isAdmin ? 'Entrar no Grupo por ID' : 'Enviar Solicitação por ID'}</button>
        </form>
        
        {availableGroups.length > 0 && (
          <div className={styles['available-groups-list']}>
            <h4>Ou selecione um grupo existente:</h4>
            <ul>
              {availableGroups.map(group => (
                <li key={group.id} onClick={() => setSelectedGroupId(group.id)}
                    className={selectedGroupId === group.id ? styles['selected-group-item'] : ''}>
                  {group.name} (ID: {group.id})
                </li>
              ))}
            </ul>
            {selectedGroupId && (
              <button onClick={() => handleJoinGroup({ preventDefault: () => {} }, selectedGroupId)}>
                {currentUser && currentUser.isAdmin ? 'Entrar no Grupo Selecionado' : 'Enviar Solicitação para Grupo Selecionado'}
              </button>
            )}
          </div>
        )}
        {availableGroups.length === 0 && !loadingGroups && (
          <p>Nenhum grupo disponível para entrar. Crie um novo!</p>
        )}
      </div>
    </div>
  );
}

export default FamilyGroupManager;