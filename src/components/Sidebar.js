import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Button,
  Divider,
  Paper,
  Stack,
  Typography,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import EditProfile from './EditProfile';
import {
  loadUsers,
  loadFriendsOf,
  saveUsers
} from '../utils/localStorageHelpers';
import {
  addNotification,
  removeNotification,
  removeNotificationByFilter
} from '../redux/notificationsSlice';
import {
  cancelMeetingThunk,
  acceptMeetingThunk,
  rejectMeetingThunk
} from '../redux/meetingsSlice';
import { selectDay } from '../redux/calendarSlice';
import FriendProfileModal from './FriendProfileModal';
import { setFriends } from '../redux/friendsSlice';

const Sidebar = () => {
  const dispatch = useDispatch();

  const { info } = useSelector(state => state.user);
  const currentUserNickname = info?.nickname || '';

  const [notifOpen, setNotifOpen] = useState(false);
  const [friendsOpen, setFriendsOpen] = useState(false);

  const [friendSearch, setFriendSearch] = useState('');

  const [friendProfileOpen, setFriendProfileOpen] = useState(false);
  const [selectedFriendProfile, setSelectedFriendProfile] = useState('');

  const allNotifications = useSelector(state =>
    state.notifications.list.filter(n => n.user === currentUserNickname)
  );

  const selectedDay = useSelector(state => state.calendar.selectedDay);
  const allMeetings = useSelector(state => state.meetings);

  const dayMeetings = (allMeetings || []).filter(m => {
    if (m.date !== selectedDay) return false;
    if (m.createdBy === currentUserNickname) {
      return true;
    }
    if (m.with === currentUserNickname && m.status === 'confirmed') {
      return true;
    }
    return false;
  });

  const [friends, setLocalFriends] = useState([]);

  useEffect(() => {
    if (!currentUserNickname) return;
    const userFriends = loadFriendsOf(currentUserNickname) || [];
    setLocalFriends(userFriends);
    dispatch(setFriends(userFriends));
  }, [currentUserNickname, dispatch]);

  const handleSearchFriend = () => {
    if (!friendSearch) {
      alert('Введите никнейм друга.');
      return;
    }
    if (friendSearch === currentUserNickname) {
      alert('Нельзя добавить самого себя.');
      return;
    }
    const allUsers = loadUsers();
    const userFound = allUsers.find(u => u.nickname === friendSearch);
    if (!userFound) {
      alert('Пользователь не найден.');
      return;
    }

    dispatch(addNotification({
      user: friendSearch,
      type: 'friendRequestReceived',
      message: `Новый запрос в друзья от ${currentUserNickname}`,
      data: { from: currentUserNickname, to: friendSearch },
    }));

    dispatch(addNotification({
      user: currentUserNickname,
      type: 'friendRequestSent',
      message: `Вы отправили запрос в друзья для ${friendSearch}`,
      data: { from: currentUserNickname, to: friendSearch },
    }));

    alert('Запрос отправлен!');
    setFriendSearch('');
  };

  const handleCancelSentRequest = (notifId) => {
    dispatch(removeNotification(notifId));
  };

  const handleFriendConfirm = (from, notifId) => {
    dispatch(removeNotification(notifId));

    dispatch(removeNotificationByFilter({
      user: from,
      filterFn: (notif) => {
        return (
          notif.type === 'friendRequestSent' &&
          notif.data.from === from &&
          notif.data.to === currentUserNickname
        );
      }
    }));

    const allUsers = loadUsers() || [];
    const currentIndex = allUsers.findIndex(u => u.nickname === currentUserNickname);
    const fromIndex = allUsers.findIndex(u => u.nickname === from);
    if (currentIndex === -1 || fromIndex === -1) return;

    if (!Array.isArray(allUsers[currentIndex].friends)) {
      allUsers[currentIndex].friends = [];
    }
    if (!Array.isArray(allUsers[fromIndex].friends)) {
      allUsers[fromIndex].friends = [];
    }

    if (!allUsers[currentIndex].friends.includes(from)) {
      allUsers[currentIndex].friends.push(from);
    }
    if (!allUsers[fromIndex].friends.includes(currentUserNickname)) {
      allUsers[fromIndex].friends.push(currentUserNickname);
    }

    saveUsers(allUsers);

    const newFriendsList = allUsers[currentIndex].friends;
    setLocalFriends(newFriendsList);
    dispatch(setFriends(newFriendsList));

    dispatch(addNotification({
      user: from,
      type: 'friendRequestAccepted',
      message: `${currentUserNickname} принял(а) ваш запрос в друзья`,
      data: { from: currentUserNickname, to: from },
    }));
  };

  const handleFriendReject = (from, notifId) => {
    dispatch(removeNotification(notifId));

    dispatch(removeNotificationByFilter({
      user: from,
      filterFn: (notif) => {
        return (
          notif.type === 'friendRequestSent' &&
          notif.data.from === from &&
          notif.data.to === currentUserNickname
        );
      }
    }));

    dispatch(addNotification({
      user: from,
      type: 'friendRequestRejected',
      message: `${currentUserNickname} отклонил(а) ваш запрос в друзья`,
      data: { from: currentUserNickname, to: from },
    }));
  };

  const handleRemoveFriend = (nickname) => {
    if (!window.confirm(`Удалить ${nickname} из друзей? Все встречи с ним будут отменены.`)) {
      return;
    }

    const allUsers = loadUsers() || [];
    const currentIndex = allUsers.findIndex(u => u.nickname === currentUserNickname);
    const friendIndex = allUsers.findIndex(u => u.nickname === nickname);

    if (currentIndex === -1) return;

    const myFriends = allUsers[currentIndex].friends || [];
    allUsers[currentIndex].friends = myFriends.filter(f => f !== nickname);

    if (friendIndex !== -1) {
      const friendFriends = allUsers[friendIndex].friends || [];
      allUsers[friendIndex].friends = friendFriends.filter(f => f !== currentUserNickname);
    }

    saveUsers(allUsers);

    setLocalFriends(allUsers[currentIndex].friends);
    dispatch(setFriends(allUsers[currentIndex].friends));

    dispatch(addNotification({
      user: nickname,
      type: 'friendRemoved',
      message: `Вас удалил из друзей пользователь ${currentUserNickname}. Все назначенные встречи отменены.`,
      data: { removedBy: currentUserNickname },
    }));

    const toCancel = allMeetings
      .filter(m =>
        (m.createdBy === currentUserNickname && m.with === nickname) ||
        (m.createdBy === nickname && m.with === currentUserNickname)
      )
      .map(m => m.id);

    toCancel.forEach(id => {
      dispatch(cancelMeetingThunk(id));
    });
  };

  const handleOkNotification = (notifId) => {
    dispatch(removeNotification(notifId));
  };

  const handleFriendProfile = (nickname) => {
    setSelectedFriendProfile(nickname);
    setFriendProfileOpen(true);
  };

  const handleCancelMeeting = (meetingId) => {
    if (window.confirm('Вы уверены, что хотите отменить встречу?')) {
      dispatch(cancelMeetingThunk(meetingId));
    }
  };

  const handleAcceptMeeting = (meetingId, notificationId) => {
    dispatch(removeNotification(notificationId));
    dispatch(acceptMeetingThunk(meetingId));
  };

  const handleRejectMeeting = (meetingId, notificationId) => {
    dispatch(removeNotification(notificationId)); 
    dispatch(rejectMeetingThunk(meetingId));
  };

  return (
    <Box sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
      <Typography variant="h6">
        Привет, {currentUserNickname}
      </Typography>

      {info?.about && (
        <Typography variant="body2" sx={{ mt: 1 }}>
          О себе: {info.about}
        </Typography>
      )}

      <EditProfile />

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" fullWidth onClick={() => setNotifOpen(!notifOpen)}>
          Уведомления ({allNotifications.length})
        </Button>
        {notifOpen && (
          <Paper sx={{ mt: 1, p: 1 }} elevation={2}>
            <List dense>
              {allNotifications.map(item => {
                switch (item.type) {
                  case 'friendRequestReceived': {
                    const { from } = item.data;
                    return (
                      <ListItem key={item.id}>
                        <ListItemText
                          primary="Запрос в друзья"
                          secondary={`От: ${from}`}
                        />
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            onClick={() => handleFriendConfirm(from, item.id)}
                          >
                            Принять
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleFriendReject(from, item.id)}
                          >
                            Отклонить
                          </Button>
                        </Stack>
                      </ListItem>
                    );
                  }
                  case 'friendRequestSent': {
                    return (
                      <ListItem key={item.id}>
                        <ListItemText primary={item.message} />
                        <Button
                          size="small"
                          onClick={() => handleCancelSentRequest(item.id)}
                        >
                          Отменить запрос
                        </Button>
                      </ListItem>
                    );
                  }
                  case 'meetingCanceled': {
                    return (
                      <ListItem key={item.id}>
                        <ListItemText
                          primary="Встреча отменена"
                          secondary={item.message}
                        />
                        <Button size="small" onClick={() => handleOkNotification(item.id)}>
                          Ок
                        </Button>
                      </ListItem>
                    );
                  }
                  case 'meetingRequest': {
                    const { meetingId, date, start, end, createdBy } = item.data;
                    return (
                      <ListItem key={item.id}>
                        <ListItemText
                          primary="Предложение встречи"
                          secondary={`От: ${createdBy}, ${date} ${start}-${end}`}
                        />
                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            onClick={() => handleAcceptMeeting(meetingId, item.id)}
                          >
                            Принять
                          </Button>
                          <Button
                            size="small"
                            onClick={() => handleRejectMeeting(meetingId, item.id)}
                          >
                            Отклонить
                          </Button>
                        </Stack>
                      </ListItem>
                    );
                  }
                  case 'meetingRejected': {
                    return (
                      <ListItem key={item.id}>
                        <ListItemText
                          primary="Встреча отклонена"
                          secondary={item.message}
                        />
                        <Button
                          size="small"
                          onClick={() => handleOkNotification(item.id)}
                        >
                          Ок
                        </Button>
                      </ListItem>
                    );
                  }
                  default:
                    return (
                      <ListItem key={item.id}>
                        <ListItemText primary={item.message} />
                        <Button
                          size="small"
                          onClick={() => handleOkNotification(item.id)}
                        >
                          Ок
                        </Button>
                      </ListItem>
                    );
                }
              })}
            </List>
          </Paper>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ mb: 2 }}>
        <Button variant="outlined" fullWidth onClick={() => setFriendsOpen(!friendsOpen)}>
          Друзья ({friends.length})
        </Button>
        {friendsOpen && (
          <Paper sx={{ mt: 1, maxHeight: 200, overflowY: 'auto', p: 1 }} elevation={2}>
            <List dense>
              {friends.map((f, i) => (
                <ListItem key={i}>
                  <ListItemText primary={f} />
                  <Stack direction="row" spacing={1}>
                    <Button size="small" onClick={() => handleFriendProfile(f)}>
                      Профиль
                    </Button>
                    <Button size="small" onClick={() => handleRemoveFriend(f)}>
                      Удалить
                    </Button>
                  </Stack>
                </ListItem>
              ))}
            </List>
          </Paper>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      <Typography variant="subtitle1">Поиск друга:</Typography>
      <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
        <input
          style={{ flex: 1 }}
          placeholder="Никнейм"
          value={friendSearch}
          onChange={(e) => setFriendSearch(e.target.value)}
        />
        <Button
          variant="contained"
          onClick={handleSearchFriend}
        >
          Добавить
        </Button>
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6">Мероприятия</Typography>
      <Typography variant="body2" sx={{ mb: 1 }}>
        Выбранный день: {selectedDay}
      </Typography>

      <List dense>
        {dayMeetings.map((m) => (
          <ListItem key={m.id}>
            <ListItemText
              primary={`${m.start} - ${m.end} (Статус: ${
                m.status === 'pending' ? 'Не подтверждена' :
                m.status === 'confirmed' ? 'Подтверждена' : 'Unknown'
              })`}
              secondary={`С: ${m.with === currentUserNickname ? m.createdBy : m.with}`}
            />
            <Button size="small" onClick={() => handleCancelMeeting(m.id)}>
              Отмена
            </Button>
          </ListItem>
        ))}
      </List>

      {selectedFriendProfile && (
        <FriendProfileModal
          open={friendProfileOpen}
          onClose={() => setFriendProfileOpen(false)}
          friendNickname={selectedFriendProfile}
        />
      )}
    </Box>
  );
};

export default Sidebar;