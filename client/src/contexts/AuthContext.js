import React, { useContext, useState, useEffect, createContext } from 'react';
import { auth, db } from '../firebaseConfig';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { notifySuccess, notifyError } from '../utils/notifications';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  async function signup(email, password, name) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await setDoc(doc(db, "users", user.uid), {
        name: name, // Adiciona o nome aqui
        email: user.email,
        createdAt: new Date(),
      });
      notifySuccess("Cadastro realizado com sucesso!");
      return userCredential;
    } catch (error) {
      notifyError("Erro no cadastro: " + error.message);
      throw error;
    }
  }

  function login(email, password) {
    try {
      return signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      notifyError("Erro no login: " + error.message);
      throw error;
    }
  }

  function logout() {
    try {
      return signOut(auth);
    } catch (error) {
      notifyError("Erro ao sair: " + error.message);
      throw error;
    }
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

        // Garante que o campo 'isAdmin' exista no documento do usuário no Firestore
        if (typeof userData.isAdmin === 'undefined') {
          await setDoc(userDocRef, { isAdmin: false }, { merge: true }); // Define como false por padrão se não existir
          userData.isAdmin = false; // Atualiza o objeto local
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