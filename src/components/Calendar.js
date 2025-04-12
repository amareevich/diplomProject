import React from 'react';
import { Box, Grid, Typography } from '@mui/material';
import DayBlock from './DayBlock';
import { useDispatch, useSelector } from 'react-redux';
import { selectDay } from '../redux/calendarSlice';

export default function Calendar() {
  const dispatch = useDispatch();
  const selectedDay = useSelector(state => state.calendar.selectedDay);

  const handleSelectDay = (dateStr) => {
    dispatch(selectDay(dateStr));
  };

  const daysArray = [];
  const today = new Date();
  for (let i = 0; i < 30; i++) {
    const dateObj = new Date();
    dateObj.setDate(today.getDate() + i);
    const dateStr = dateObj.toISOString().slice(0, 10);
    daysArray.push(dateStr);
  }

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Календарь встреч (ближайшие 30 дней)
      </Typography>
      <Grid container spacing={2}>
        {daysArray.map((dateStr, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <DayBlock
              date={dateStr}
              isSelected={dateStr === selectedDay}
              onSelect={() => handleSelectDay(dateStr)}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}