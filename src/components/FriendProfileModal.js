import React from 'react';
import { Dialog, DialogTitle, DialogContent, Box, Typography } from '@mui/material';
import { loadUsers } from '../utils/localStorageHelpers';

const FriendProfileModal = ({ open, onClose, friendNickname }) => {
  if (!friendNickname) return null;
  const allUsers = loadUsers();
  const friendData = allUsers.find(u => u.nickname === friendNickname);

  if (!friendData) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Профиль {friendNickname}</DialogTitle>
      <DialogContent>
        <Box
          sx={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: friendData.avatarColor || '#ccc',
            marginBottom: '1rem'
          }}
        />
        <Typography>О себе: {friendData.about || '—'}</Typography>
      </DialogContent>
    </Dialog>
  );
};

export default FriendProfileModal;