import React, { useState } from 'react';
import { Button, TextField, Box, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../redux/userSlice';

const availableColors = [
  { label: 'Серый', value: '#ccc' },
  { label: 'Красный', value: 'red' },
  { label: 'Зелёный', value: 'green' },
  { label: 'Синий', value: 'blue' },
  { label: 'Жёлтый', value: 'yellow' },
];

const EditProfile = () => {
  const { info } = useSelector(state => state.user);
  const [editMode, setEditMode] = useState(false);
  const [about, setAbout] = useState(info.about || '');
  const [avatarColor, setAvatarColor] = useState(info.avatarColor || '');
  const dispatch = useDispatch();

  if (!editMode) {
    return (
      <Box sx={{ marginTop: 2 }}>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: info.avatarColor || '#ccc',
            display: 'inline-block',
            marginRight: '8px',
            verticalAlign: 'middle'
          }}
        />
        <Button onClick={() => setEditMode(true)}>Редактировать профиль</Button>
      </Box>
    );
  }

  const handleSave = () => {
    dispatch(updateProfile({ about, avatarColor }));
    setEditMode(false);
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <TextField
        fullWidth
        multiline
        label="О себе"
        value={about}
        onChange={(e) => setAbout(e.target.value)}
        margin="normal"
      />
      <TextField
        select
        label="Цвет аватарки"
        value={avatarColor}
        onChange={(e) => setAvatarColor(e.target.value)}
        fullWidth
        margin="normal"
      >
        {availableColors.map((c) => (
          <MenuItem key={c.value} value={c.value}>
            {c.label}
          </MenuItem>
        ))}
      </TextField>
      <Button onClick={handleSave} variant="contained" sx={{ mr: 1 }}>Сохранить</Button>
      <Button onClick={() => setEditMode(false)}>Отмена</Button>
    </Box>
  );
};

export default EditProfile;