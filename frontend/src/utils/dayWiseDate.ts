export const getUpcomingAvailableSchedules = (scheduleList: any[]) => {
    const today = new Date();
    const result: { date: string; schedule: any }[] = [];
  
    for (let i = 0; i < 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
  
      const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
  
      scheduleList.forEach((slot) => {
        if (
          slot.day === dayName &&
          slot.availability === 'Available'
        ) {
          result.push({
            date: date.toISOString().split('T')[0],
            schedule: slot,
          });
        }
      });
    }
  
    return result;
  };


  export const allDays = [
    { label: 'Saturday', value: 'Saturday' },
    { label: 'Sunday', value: 'Sunday' },
    { label: 'Monday', value: 'Monday' },
    { label: 'Tuesday', value: 'Tuesday' },
    { label: 'Wednesday', value: 'Wednesday' },
    { label: 'Thursday', value: 'Thursday' },
    { label: 'Friday', value: 'Friday' },
  ];
  