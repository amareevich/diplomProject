import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Stack } from '@mui/material';
import { useDispatch } from 'react-redux';
import { login } from '../redux/userSlice';
import { useNavigate } from 'react-router-dom';
import { loadUsers } from '../utils/localStorageHelpers';

export default function Login() {
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = () => {
    const users = loadUsers();

    if (users.length === 0) {
      alert('Нет зарегистрированных пользователей. Пожалуйста, зарегистрируйтесь.');
      return;
    }

    const validUser = users.find(u => u.nickname === nickname && u.password === password);

    if (validUser) {
      dispatch(login(validUser));
      navigate('/dashboard');
    } else {
      alert('Неверный логин или пароль');
    }
  };

  const handleRegister = () => {
    navigate('/register');
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" gutterBottom>Вход</Typography>

      <TextField
        fullWidth
        label="Nickname"
        margin="normal"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
      />

      <TextField
        fullWidth
        type="password"
        label="Password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <Stack direction="column" spacing={2} mt={2}>
        <Button variant="contained" onClick={handleLogin} fullWidth>
          Войти
        </Button>

        <Button variant="outlined" onClick={handleRegister} fullWidth>
          Зарегистрироваться
        </Button>
      </Stack>
    </Container>
  );
}