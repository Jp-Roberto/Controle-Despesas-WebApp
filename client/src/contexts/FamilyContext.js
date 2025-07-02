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

const FamilyContext = createContext();

export function useFamily() {
  return useContext(FamilyContext);
}

export function FamilyProvider({ children }) {
  const { currentUser } = useAuth();
  const [familyGroup, setFamilyGroup] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loadingFamily, setLoadingFamily] = useState(true);
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

    if (familyGroup && typeof familyGroup.id === 'string' && familyGroup.id.length > 0) {
      // Listener para os membros da família
      const q = query(collection(db, 'users'), where('familyGroupId', '==', familyGroup.id));
      unsubscribeMembers = onSnapshot(q, (snapshot) => {
        if (!familyGroup || !familyGroup.id) return; // Defesa extra
        const members = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));
        setFamilyMembers(members);
      });

    } else {
      setFamilyMembers([]);
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
    if (!currentUser) throw new Error('Usuário não autenticado.');

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

    return newGroupRef.id;
  };

  const joinFamilyGroup = async (groupId) => {
    if (!currentUser) throw new Error('Usuário não autenticado.');

    const groupRef = doc(db, 'familyGroups', groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
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
  };

  const addMemberToFamilyGroup = async (groupId, memberEmail) => {
    if (!currentUser || !currentUser.isAdmin) throw new Error('Apenas administradores podem adicionar membros.');

    const groupRef = doc(db, 'familyGroups', groupId);
    const groupSnap = await getDoc(groupRef);

    if (!groupSnap.exists()) {
      throw new Error('Grupo familiar não encontrado.');
    }

    // Verifica se o usuário logado é o admin do grupo
    if (groupSnap.data().adminId !== currentUser.uid) {
      throw new Error('Você não é o administrador deste grupo.');
    }

    // Busca o UID do membro pelo email
    const usersQuery = query(collection(db, 'users'), where('email', '==', memberEmail));
    const usersSnapshot = await getDocs(usersQuery);

    if (usersSnapshot.empty) {
      throw new Error('Usuário com este e-mail não encontrado.');
    }

    const memberUid = usersSnapshot.docs[0].id;

    // Verifica se o membro já está no grupo
    if (groupSnap.data().members.includes(memberUid)) {
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

    return memberUid;
  };

  const value = {
    familyGroup,
    familyMembers,
    loadingFamily,
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