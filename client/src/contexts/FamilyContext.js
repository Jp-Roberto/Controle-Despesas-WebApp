import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  query,
  where,
  onSnapshot,
  getDocs
} from 'firebase/firestore';
import { useAuth } from './AuthContext';
import { notifySuccess, notifyError, notifyInfo } from '../utils/notifications';

const FamilyContext = createContext();

export function useFamily() {
  return useContext(FamilyContext);
}

export function FamilyProvider({ children }) {
  const { currentUser } = useAuth();
  const [familyGroup, setFamilyGroup] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loadingFamily, setLoadingFamily] = useState(true);
  const [loadingMembers, setLoadingMembers] = useState(true); // Novo estado de carregamento para membros
  const [availableGroups, setAvailableGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);

  // Efeito para carregar o grupo familiar do usuário
  useEffect(() => {
    let unsubscribeUser = () => {}; // Para o listener do documento do usuário

    const setupUserListener = async () => {
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await setDoc(userRef, {}, { merge: true }); // Garante que o documento do usuário exista

        unsubscribeUser = onSnapshot(userRef, async (docSnap) => {
          if (docSnap.exists() && docSnap.data().familyGroupId) {
            const groupId = docSnap.data().familyGroupId;
            if (groupId && groupId !== '') {
              // Busca os dados do grupo familiar uma única vez, não configura um listener aqui
              const groupSnap = await getDoc(doc(db, 'familyGroups', groupId));
              if (groupSnap.exists()) {
                setFamilyGroup({ id: groupSnap.id, ...groupSnap.data() });
              } else {
                setFamilyGroup(null); // Grupo não encontrado
              }
            } else {
              setFamilyGroup(null); // Sem familyGroupId
            }
          } else {
            setFamilyGroup(null); // Documento do usuário não existe ou sem familyGroupId
          }
          setLoadingFamily(false); // Define loading como false após processar o documento do usuário
        });
      } else {
        // Se não houver usuário atual, redefine o estado da família e o loading
        setFamilyGroup(null);
        setFamilyMembers([]);
        setLoadingFamily(false);
      }
    };

    setupUserListener();

    // Função de limpeza para o listener do usuário
    return () => {
      unsubscribeUser();
    };
  }, [currentUser]);

  // Efeito para carregar os membros do grupo familiar E o próprio grupo em tempo real
  useEffect(() => {
    let unsubscribeMembers = () => {};
    setLoadingMembers(true); // Inicia o carregamento dos membros

    if (familyGroup && typeof familyGroup.id === 'string' && familyGroup.id.length > 0) {
      // Listener para os membros da família
      const q = query(collection(db, 'users'), where('familyGroupId', '==', familyGroup.id));
      unsubscribeMembers = onSnapshot(q, (snapshot) => {
        if (!familyGroup || !familyGroup.id) {
          setLoadingMembers(false); // Define como false mesmo se não houver grupo
          return;
        }
        const members = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));
        setFamilyMembers(members);
        setLoadingMembers(false); // Finaliza o carregamento dos membros
      }, (error) => {
        console.error("Error fetching family members:", error);
        setLoadingMembers(false); // Finaliza o carregamento em caso de erro
      });

    } else {
      setFamilyMembers([]);
      setLoadingMembers(false); // Finaliza o carregamento se não houver familyGroup
    }

    // Função de limpeza para este useEffect
    return () => {
      unsubscribeMembers();
    };
  }, [familyGroup]); // Este useEffect depende de familyGroup

  // Efeito para carregar todos os grupos familiares disponíveis
  useEffect(() => {
    const q = query(collection(db, 'familyGroups'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const groupsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAvailableGroups(groupsData);
      setLoadingGroups(false);
    }, (error) => {
      console.error("Error fetching available groups:", error);
      setLoadingGroups(false);
    });

    return () => unsubscribe();
  }, []);

  

  const createFamilyGroup = async (groupName) => {
    if (!currentUser) {
      notifyError('Usuário não autenticado.');
      throw new Error('Usuário não autenticado.');
    }
    try {
      const newGroupRef = doc(collection(db, 'familyGroups'));
      await setDoc(newGroupRef, {
        name: groupName,
        adminId: currentUser.uid,
        members: [currentUser.uid],
      });

      // Atualizar o documento do usuário para incluir o familyGroupId
      await setDoc(doc(db, 'users', currentUser.uid), {
        familyGroupId: newGroupRef.id,
      }, { merge: true });

      notifySuccess(`Grupo "${groupName}" criado com sucesso! ID: ${newGroupRef.id}`);
      return newGroupRef.id;
    } catch (error) {
      notifyError("Erro ao criar grupo: " + error.message);
      throw error;
    }
  };

  const joinFamilyGroup = async (groupId) => {
    if (!currentUser) {
      notifyError('Usuário não autenticado.');
      throw new Error('Usuário não autenticado.');
    }

    const groupRef = doc(db, 'familyGroups', groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      notifyError('Grupo familiar não encontrado.');
      throw new Error('Grupo familiar não encontrado.');
    }

    // Adicionar o usuário ao array de membros do grupo
    await updateDoc(groupRef, {
      members: arrayUnion(currentUser.uid),
    });

    // Atualizar o documento do usuário para incluir o familyGroupId
    await setDoc(doc(db, 'users', currentUser.uid), {
      familyGroupId: groupId,
    }, { merge: true });
    notifySuccess("Você entrou no grupo com sucesso!");
  };

  const addMemberToFamilyGroup = async (groupId, memberEmail) => {
    if (!currentUser || !currentUser.isAdmin) {
      notifyError('Apenas administradores podem adicionar membros.');
      throw new Error('Apenas administradores podem adicionar membros.');
    }

    const groupRef = doc(db, 'familyGroups', groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      notifyError('Grupo familiar não encontrado.');
      throw new Error('Grupo familiar não encontrado.');
    }

    // Verifica se o usuário logado é o admin do grupo
    if (groupSnap.data().adminId !== currentUser.uid) {
      notifyError('Você não é o administrador deste grupo.');
      throw new Error('Você não é o administrador deste grupo.');
    }

    // Busca o UID do membro pelo email
    const usersQuery = query(collection(db, 'users'), where('email', '==', memberEmail));
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      notifyError('Usuário com este e-mail não encontrado.');
      throw new Error('Usuário com este e-mail não encontrado.');
    }

    const memberUid = usersSnapshot.docs[0].id;

    // Verifica se o membro já está no grupo
    if (groupSnap.data().members.includes(memberUid)) {
      notifyInfo('Este membro já faz parte do grupo.');
      throw new Error('Este membro já faz parte do grupo.');
    }

    // Adiciona o membro ao array de membros do grupo
    await updateDoc(groupRef, {
      members: arrayUnion(memberUid),
    });

    // Atualiza o documento do membro para incluir o familyGroupId
    await setDoc(doc(db, 'users', memberUid), {
      familyGroupId: groupId,
    }, { merge: true });

    notifySuccess(`Membro ${memberEmail} adicionado com sucesso!`);
    return memberUid;
  };

  const value = {
    familyGroup,
    familyMembers,
    loadingFamily,
    loadingMembers, // Adiciona loadingMembers ao valor do contexto
    availableGroups,
    loadingGroups,
    createFamilyGroup,
    joinFamilyGroup,
    addMemberToFamilyGroup,
  };

  return (
    <FamilyContext.Provider value={value}>
      {!loadingFamily && children}
    </FamilyContext.Provider>
  );
}