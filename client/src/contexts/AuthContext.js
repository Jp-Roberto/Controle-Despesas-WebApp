import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await setDoc(doc(db, "users", user.uid), {
      name: name, // Adiciona o nome aqui
      email: user.email,
      createdAt: new Date(),
    });
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async user => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        let userData = userDocSnap.exists() ? userDocSnap.data() : {};

        // Garante que o campo 'name' exista no documento do usuário no Firestore
        if (!userData.name) {
          await setDoc(userDocRef, { name: '' }, { merge: true });
          userData.name = ''; // Atualiza o objeto local para refletir a mudança
        }

        // Garante que o email também esteja presente (para usuários antigos ou se o email mudar)
        if (!userData.email) {
          await setDoc(userDocRef, { email: user.email }, { merge: true });
          userData.email = user.email; // Atualiza o objeto local
        }

        setCurrentUser({ ...user, ...userData });

      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}