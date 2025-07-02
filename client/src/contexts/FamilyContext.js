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
    let unsubscribe = () => {};
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      unsubscribe = onSnapshot(userRef, async (docSnap) => {
        if (docSnap.exists() && docSnap.data().familyGroupId) {
          const groupId = docSnap.data().familyGroupId;
          const groupRef = doc(db, 'familyGroups', groupId);
          onSnapshot(groupRef, (groupSnap) => {
            if (groupSnap.exists()) {
              setFamilyGroup({ id: groupSnap.id, ...groupSnap.data() });
            } else {
              setFamilyGroup(null);
            }
            setLoadingFamily(false);
          });
        } else {
          setFamilyGroup(null);
          setLoadingFamily(false);
        }
      });
    } else {
      setFamilyGroup(null);
      setFamilyMembers([]);
      setLoadingFamily(false);
    }

    return () => unsubscribe();
  }, [currentUser]);

  // Efeito para carregar os membros do grupo familiar
  useEffect(() => {
    let unsubscribe = () => {};
    if (familyGroup) {
      const q = query(collection(db, 'users'), where('familyGroupId', '==', familyGroup.id));
      unsubscribe = onSnapshot(q, (snapshot) => {
        const members = snapshot.docs.map(doc => ({
          uid: doc.id,
          ...doc.data()
        }));
        setFamilyMembers(members);
      });
    } else {
      setFamilyMembers([]);
    }
    return () => unsubscribe();
  }, [familyGroup]);

  const createFamilyGroup = async (groupName) => {
    if (!currentUser) throw new Error('Usuário não autenticado.');

    const newGroupRef = doc(collection(db, 'familyGroups'));
    await setDoc(newGroupRef, {
      name: groupName,
      adminId: currentUser.uid,
      members: [currentUser.uid],
    });

    // Atualizar o documento do usuário para incluir o familyGroupId
    await updateDoc(doc(db, 'users', currentUser.uid), {
      familyGroupId: newGroupRef.id,
    });

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
    await updateDoc(doc(db, 'users', currentUser.uid), {
      familyGroupId: groupId,
    });
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