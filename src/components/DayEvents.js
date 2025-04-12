import React from 'react';
import { Dialog, DialogTitle, DialogContent, Button, List, ListItem, ListItemText } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { cancelMeeting } from '../redux/meetingsSlice';

const DayEvents = ({ open, onClose, date }) => {
  const meetings = useSelector(state => state.meetings);
  const currentUser = useSelector(state => state.user.info?.nickname);
  const dispatch = useDispatch();

  const filtered = meetings.filter(
    m => m.createdBy === currentUser || m.with === currentUser
  ).filter(m => m.date === date);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{date} — встречи</DialogTitle>
      <DialogContent>
        <List>
          {filtered.map((m, i) => (
            <ListItem key={i}>
              <ListItemText primary={`${m.start} - ${m.end} с ${m.with}`} />
              <Button onClick={() => dispatch(cancelMeeting(m.id))}>Отмена</Button>
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  );
};

export default DayEvents;