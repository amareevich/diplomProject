import React, { useState } from 'react';
import { Button, TextField, Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addFriendRequest } from '../redux/friendsSlice';
import { loadUsers } from '../utils/localStorageHelpers';

const FriendSearch = () => {
    
  const [nickname, setNickname] = useState('');

  const { info } = useSelector(state => state.user);
  const dispatch = useDispatch();

  const handleSearch = () => {
    if (nickname === info.nickname) {
      alert("Нельзя добавить самого себя");
      return;
    }

    const users = loadUsers();
    if (users.find(u => u.nickname === nickname)) {
      dispatch(addFriendRequest(nickname));
      alert('Запрос отправлен');
    } else {
      alert('Пользователь не найден');
    }
  };

  return (
    <Box sx={{ py: 2 }}>
      <TextField
        label="Найти друга"
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        fullWidth
        margin="normal"
      />
      <Button onClick={handleSearch} variant="contained" fullWidth>
        Добавить в друзья
      </Button>
    </Box>
  );
};

export default FriendSearch;