import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useFamily } from '../contexts/FamilyContext';

function AdminPanel() {
  const { currentUser } = useAuth();
  const { familyGroup, addMemberToFamilyGroup } = useFamily();
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

  if (!currentUser || !currentUser.isAdmin) {
    return <p>Acesso negado. Você não é um administrador.</p>;
  }

  return (
    <div className="admin-panel-container">
      <h2>Painel de Administração do Grupo</h2>
      {familyGroup ? (
        <p>Gerenciando membros para o grupo: <strong>{familyGroup.name}</strong> (ID: {familyGroup.id})</p>
      ) : (
        <p>Você não está em um grupo familiar ativo. Crie ou entre em um para gerenciar membros.</p>
      )}

      {error && <p className="error-message">{error}</p>}
      {message && <p className="success-message">{message}</p>}

      <form onSubmit={handleAddMember} className="add-member-form">
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

      {familyGroup && familyGroup.members && (
        <div className="current-members">
          <h3>Membros Atuais do Grupo:</h3>
          <ul>
            {familyGroup.members.map(memberUid => (
              <li key={memberUid}>{memberUid}</li> // Exibir UIDs por enquanto, pode ser melhorado para emails/nomes
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;