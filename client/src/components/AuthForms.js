import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import styles from './AuthForms.module.css';

function AuthForms() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const { signup, login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await signup(email, password, name);
      }
    } catch (err) {
      setError('Falha na autenticação: ' + err.message);
    }
  };

  return (
    <div className={styles['auth-container']}>
      <h2>{isLogin ? 'Login' : 'Cadastro'}</h2>
      {error && <p className={styles['error-message']}>{error}</p>}
      <form onSubmit={handleSubmit} className={styles['auth-form']}>
        {!isLogin && (
          <input
            type="text"
            placeholder="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        )}
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Entrar' : 'Cadastrar'}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)} className={styles['toggle-auth']}>
        {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Faça login'}
      </p>
    </div>
  );
}

export default AuthForms;