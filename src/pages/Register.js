import React, { useState } from 'react';
import { Button, TextField, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loadUsers, saveUsers } from '../utils/localStorageHelpers';

const Register = () => {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    if (!nickname || !password) {
      alert('Пожалуйста, укажите никнейм и пароль.');
      return;
    }

    const users = loadUsers();
    const existing = users.find(u => u.nickname === nickname);
    if (existing) {
      alert('Пользователь с таким ником уже существует!');
      return;
    }

    const newUser = {
      nickname,
      password,
      about: '',
      friends: [],
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);

    alert('Регистрация прошла успешно!');
    navigate('/login');
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>
        Регистрация
      </Typography>
      <TextField 
        fullWidth 
        label="Nickname" 
        margin="normal"
        value={nickname} 
        onChange={(e) => setNickname(e.target.value)} 
      />
      <TextField 
        fullWidth 
        label="Password" 
        type="password" 
        margin="normal"
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
      />
      <Button 
        fullWidth 
        variant="contained" 
        onClick={handleRegister}
      >
        Зарегистрироваться
      </Button>
    </Container>
  );
};

export default Register;