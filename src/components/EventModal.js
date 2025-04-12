import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { addMeeting } from '../redux/meetingsSlice';

const EventModal = ({ open, onClose, date }) => {
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');
    const [friend, setFriend] = useState('');
    const dispatch = useDispatch();
    const friends = useSelector(state => state.friends.list);
    const currentUser = useSelector(state => state.user.info?.nickname); // 👈
  
    const handleSave = () => {
      if (!start || !end || !friend) return;
  
      dispatch(addMeeting({
        date,
        meeting: {
          with: friend,
          start,
          end,
          createdBy: currentUser,
        }
      }));
  
      onClose();
      setStart('');
      setEnd('');
      setFriend('');
    };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Новая встреча на {date}</DialogTitle>
      <DialogContent>
        <TextField
          label="Начало"
          type="time"
          fullWidth
          margin="normal"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="Конец"
          type="time"
          fullWidth
          margin="normal"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          select
          label="С кем"
          fullWidth
          margin="normal"
          value={friend}
          onChange={(e) => setFriend(e.target.value)}
        >
          {friends.map((f, i) => (
            <MenuItem key={i} value={f}>{f}</MenuItem>
          ))}
        </TextField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSave} variant="contained">Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EventModal;