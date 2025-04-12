export const loadMeetingsFromStorage = () => {
  try {
    const data = localStorage.getItem('meetings');
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};


export const saveMeetingsToStorage = (meetings) => {
  localStorage.setItem('meetings', JSON.stringify(meetings));
};
export const loadUsers = () => {
  try {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    return users;
  } catch (e) {
    console.error('Ошибка при чтении списка пользователей из localStorage:', e);
    return [];
  }
};


export const saveUsers = (users) => {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (e) {
    console.error('Ошибка при сохранении списка пользователей в localStorage:', e);
  }
};


export const loadUserFromStorage = () => {
  try {
    const data = localStorage.getItem('user');
    return data ? JSON.parse(data) : null;
  } catch (e) {
    return null;
  }
};


export const saveUserToStorage = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};


export const loadFriendsForNickname = (nickname) => {
  const users = loadUsers();
  const found = users.find(u => u.nickname === nickname);
  if (found && Array.isArray(found.friends)) {
    return found.friends;
  }
  return [];
};


export const addFriendsRelation = (userNickname, friendNickname) => {
  const users = loadUsers();
  const userIndex = users.findIndex(u => u.nickname === userNickname);
  const friendIndex = users.findIndex(u => u.nickname === friendNickname);

  if (userIndex === -1 || friendIndex === -1) {
    return;
  }

  const user = users[userIndex];
  const friend = users[friendIndex];

  if (!Array.isArray(user.friends)) {
    user.friends = [];
  }
  if (!Array.isArray(friend.friends)) {
    friend.friends = [];
  }

  if (!user.friends.includes(friendNickname)) {
    user.friends.push(friendNickname);
  }

  if (!friend.friends.includes(userNickname)) {
    friend.friends.push(userNickname);
  }

  users[userIndex] = user;
  users[friendIndex] = friend;
  saveUsers(users);
};


export const removeFriendsRelation = (userNickname, friendNickname) => {
  const users = loadUsers();
  const userIndex = users.findIndex(u => u.nickname === userNickname);
  const friendIndex = users.findIndex(u => u.nickname === friendNickname);

  if (userIndex === -1 || friendIndex === -1) return;

  const user = users[userIndex];
  const friend = users[friendIndex];

  if (Array.isArray(user.friends)) {
    user.friends = user.friends.filter(f => f !== friendNickname);
  }
  if (Array.isArray(friend.friends)) {
    friend.friends = friend.friends.filter(f => f !== userNickname);
  }

  users[userIndex] = user;
  users[friendIndex] = friend;
  saveUsers(users);
};


export const loadFriendsOf = (nickname) => {
  const allUsers = loadUsers() || [];
  const user = allUsers.find(u => u.nickname === nickname);
  return user?.friends || [];
};


export const saveFriendsOf = (nickname, newFriendsList) => {
  const allUsers = loadUsers() || [];
  const index = allUsers.findIndex(u => u.nickname === nickname);
  if (index === -1) return;

  allUsers[index].friends = newFriendsList;
  saveUsers(allUsers);
};