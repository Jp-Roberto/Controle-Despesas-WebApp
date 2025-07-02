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
  onSnapshot
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

  const value = {
    familyGroup,
    familyMembers,
    loadingFamily,
    createFamilyGroup,
    joinFamilyGroup,
  };

  return (
    <FamilyContext.Provider value={value}>
      {!loadingFamily && children}
    </FamilyContext.Provider>
  );
}