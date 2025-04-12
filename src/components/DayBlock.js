import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { addMeetingRequest } from '../redux/meetingsSlice';

const DayBlock = ({ date, isSelected, onSelect }) => {
  const dispatch = useDispatch();
  const allMeetings = useSelector(state => state.meetings || []);
  const currentUser = useSelector(state => state.user.info?.nickname);
  const friends = useSelector(state => state.friends.list);

  const dayMeetings = allMeetings.filter(
    m => m.date === date && (m.createdBy === currentUser || m.with === currentUser)
  );

  const [open, setOpen] = useState(false);
  const [friend, setFriend] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const cardStyle = {
    border: isSelected ? '2px solid #1976d2' : '1px solid #ccc',
    cursor: 'pointer'
  };

  const handleDayClick = () => {
    onSelect();
  };

  const handleOpenDialog = (e) => {
    e.stopPropagation();
    setOpen(true);
  };

  const handleCloseDialog = () => {
    setOpen(false);
    setFriend('');
    setStartTime('');
    setEndTime('');
  };

  const handleSaveMeeting = () => {
    if (!friend || !startTime || !endTime) {
      alert('Пожалуйста, заполните все поля.');
      return;
    }
    if (startTime >= endTime) {
      alert('Время начала не может быть больше или равно времени окончания.');
      return;
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    if (date === todayStr) {
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentTimeStr = `${String(currentHours).padStart(2, '0')}:${String(currentMinutes).padStart(2, '0')}`;
      if (startTime <= currentTimeStr) {
        alert('Нельзя назначить встречу на прошедшее или текущее время в сегодняшнем дне.');
        return;
      }
    }

    dispatch(addMeetingRequest({
      date,
      meeting: {
        with: friend,
        start: startTime,
        end: endTime,
        createdBy: currentUser,
      },
    }));
    handleCloseDialog();
  };

  return (
    <>
      <Card variant="outlined" sx={cardStyle} onClick={handleDayClick}>
        <CardContent>
          <Typography variant="h6">{date}</Typography>
          <Typography variant="body2" sx={{ mb: 1 }}>
            Встреч: {dayMeetings.length}
          </Typography>
          <Button variant="outlined" size="small" onClick={handleOpenDialog}>
            Назначить встречу
          </Button>
        </CardContent>
      </Card>

      <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="xs">
        <DialogTitle>Создать встречу</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <TextField
            select
            label="С кем встреча"
            value={friend}
            onChange={(e) => setFriend(e.target.value)}
          >
            {friends.map((f, i) => (
              <MenuItem key={i} value={f}>{f}</MenuItem>
            ))}
          </TextField>
          <TextField
            label="Начало (HH:MM)"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Окончание (HH:MM)"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button variant="contained" onClick={handleSaveMeeting}>Сохранить</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DayBlock;