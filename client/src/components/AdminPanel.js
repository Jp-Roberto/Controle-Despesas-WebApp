import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';
import styles from './AdminPanel.module.css';
import Button from './ui/Button';
import Avatar from './ui/Avatar';
import { FiUserPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi';

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
        <div style={{ display: 'flex', gap: '0.7rem', alignItems: 'center' }}>
          <input
            type="email"
            placeholder="E-mail do novo membro"
            value={memberEmail}
            onChange={(e) => setMemberEmail(e.target.value)}
            required
            style={{ flex: 1 }}
          />
          <Button type="submit" disabled={!familyGroup || !memberEmail} variant="primary" aria-label="Adicionar membro">
            <FiUserPlus style={{ marginRight: 8 }} /> Adicionar
          </Button>
        </div>
      </form>

      {familyGroup && familyMembers && familyMembers.length > 0 && (
        <div className={styles['current-members']}>
          <h3>Membros Atuais do Grupo:</h3>
          <ul>
            {familyMembers.map(member => (
              <li key={member.uid} style={{ gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={member.name || member.email} size={40} />
                  <span>{member.name || member.email}</span>
                </div>
                {member.uid !== currentUser.uid && (
                  <Button
                    className={styles['remove-button']}
                    variant="ghost"
                    aria-label={`Remover ${member.name || member.email}`}
                    onClick={() => handleRemoveMember(member.uid, member.name || member.email)}
                  >
                    <FiTrash2 style={{ marginRight: 6 }} /> Remover
                  </Button>
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
              <li key={request.id} style={{ gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <Avatar name={request.requesterEmail} size={36} />
                  <span>{request.requesterEmail} solicitou entrar em "{request.groupName}"</span>
                </div>
                <div className={styles['request-actions']}>
                  <Button
                    className={styles['accept-button']}
                    variant="primary"
                    aria-label={`Aceitar solicitação de ${request.requesterEmail}`}
                    onClick={() => handleAcceptRequest(request.id, request.requesterUid, request.groupId, request.requesterEmail)}
                  >
                    <FiCheck style={{ marginRight: 4 }} /> Aceitar
                  </Button>
                  <Button
                    className={styles['reject-button']}
                    variant="ghost"
                    aria-label={`Recusar solicitação de ${request.requesterEmail}`}
                    onClick={() => handleRejectRequest(request.id, request.requesterEmail)}
                  >
                    <FiX style={{ marginRight: 4 }} /> Recusar
                  </Button>
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