import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, ListItemText, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { cancelMeeting } from '../redux/meetingsSlice';

const MeetingsList = () => {
  const dispatch = useDispatch();
  const meetings = useSelector(state => state.meetings);
  const currentUser = useSelector(state => state.user.info?.nickname);
  const today = new Date().toISOString().slice(0, 10);

  const todayMeetings = (meetings[today] || []).filter(
    m => m.createdBy === currentUser || m.with === currentUser
  );

  const handleDelete = (index) => {
    if (window.confirm('Вы уверены, что хотите отменить встречу?')) {
      dispatch(cancelMeeting ({ date: today, index }));
    }
  };

  return (
    <List dense>
      {todayMeetings.map((m, i) => (
        <ListItem key={i}
          secondaryAction={
            m.createdBy === currentUser && (
              <IconButton edge="end" onClick={() => handleDelete(i)}>
                <DeleteIcon />
              </IconButton>
            )
          }
        >
          <ListItemText
            primary={`${m.start} - ${m.end}`}
            secondary={`С: ${m.with}`}
          />
        </ListItem>
      ))}
    </List>
  );
};

export default MeetingsList;