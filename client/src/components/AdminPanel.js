import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';
import styles from './AdminPanel.module.css';

function AdminPanel() {
  const { currentUser } = useAuth();
  const { familyGroup, familyMembers, addMemberToFamilyGroup, removeMemberFromFamilyGroup, pendingJoinRequests, acceptJoinRequest, rejectJoinRequest } = useFamily();
  const [memberEmail, setMemberEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleAddMember = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!memberEmail) {
      setError('Por favor, insira o e-mail do membro.');
      return;
    }

    if (!familyGroup) {
      setError('Você precisa estar em um grupo familiar para adicionar membros.');
      return;
    }

    try {
      await addMemberToFamilyGroup(familyGroup.id, memberEmail);
      setMessage(`Membro ${memberEmail} adicionado ao grupo ${familyGroup.name} com sucesso!`);
      setMemberEmail('');
    } catch (err) {
      setError('Erro ao adicionar membro: ' + err.message);
    }
  };

  const handleRemoveMember = async (memberUid, memberNameOrEmail) => {
    setMessage('');
    setError('');
    if (window.confirm(`Tem certeza que deseja remover ${memberNameOrEmail} do grupo?`)) {
      try {
        await removeMemberFromFamilyGroup(memberUid);
        setMessage(`${memberNameOrEmail} foi removido do grupo com sucesso!`);
      } catch (err) {
        setError('Erro ao remover membro: ' + err.message);
      }
    }
  };

  const handleAcceptRequest = async (requestId, requesterUid, groupId, requesterEmail) => {
    setMessage('');
    setError('');
    if (window.confirm(`Tem certeza que deseja aceitar a solicitação de ${requesterEmail}?`)) {
      try {
        await acceptJoinRequest(requestId, requesterUid, groupId);
        setMessage(`Solicitação de ${requesterEmail} aceita com sucesso!`);
      } catch (err) {
        setError('Erro ao aceitar solicitação: ' + err.message);
      }
    }
  };

  const handleRejectRequest = async (requestId, requesterEmail) => {
    setMessage('');
    setError('');
    if (window.confirm(`Tem certeza que deseja recusar a solicitação de ${requesterEmail}?`)) {
      try {
        await rejectJoinRequest(requestId);
        setMessage(`Solicitação de ${requesterEmail} recusada.`);
      } catch (err) {
        setError('Erro ao recusar solicitação: ' + err.message);
      }
    }
  };

  if (!currentUser || !currentUser.isAdmin) {
    return <p>Acesso negado. Você não é um administrador.</p>;
  }

  return (
    <div className={styles['admin-panel-container']}>
      <h2>Painel de Administração do Grupo</h2>
      {familyGroup ? (
        <p>Gerenciando membros para o grupo: <strong>{familyGroup.name}</strong> (ID: {familyGroup.id})</p>
      ) : (
        <p>Você não está em um grupo familiar ativo. Crie ou entre em um para gerenciar membros.</p>
      )}

      {error && <p className={styles['error-message']}>{error}</p>}
      {message && <p className={styles['success-message']}>{message}</p>}

      <form onSubmit={handleAddMember} className={styles['add-member-form']}>
        <h3>Adicionar Novo Membro por E-mail</h3>
        <input
          type="email"
          placeholder="E-mail do novo membro"
          value={memberEmail}
          onChange={(e) => setMemberEmail(e.target.value)}
          required
        />
        <button type="submit" disabled={!familyGroup}>Adicionar Membro</button>
      </form>

      {familyGroup && familyMembers && familyMembers.length > 0 && (
        <div className={styles['current-members']}>
          <h3>Membros Atuais do Grupo:</h3>
          <ul>
            {familyMembers.map(member => (
              <li key={member.uid}>
                {member.name || member.email}
                {member.uid !== currentUser.uid && (
                  <button
                    className={styles['remove-button']}
                    onClick={() => handleRemoveMember(member.uid, member.name || member.email)}
                  >
                    Remover
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}

      {familyGroup && pendingJoinRequests.length > 0 && (
        <div className={styles['pending-requests']}>
          <h3>Solicitações de Entrada Pendentes:</h3>
          <ul>
            {pendingJoinRequests.map(request => (
              <li key={request.id}>
                {request.requesterEmail} solicitou entrar em "{request.groupName}"
                <div className={styles['request-actions']}>
                  <button
                    className={styles['accept-button']}
                    onClick={() => handleAcceptRequest(request.id, request.requesterUid, request.groupId, request.requesterEmail)}
                  >
                    Aceitar
                  </button>
                  <button
                    className={styles['reject-button']}
                    onClick={() => handleRejectRequest(request.id, request.requesterEmail)}
                  >
                    Recusar
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;