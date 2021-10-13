import React from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import '@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css';
import 'react-calendar/dist/Calendar.css';
const DateRangePickerW = ({value, handleDateChange}) => {
  return (
    <DateRangePicker
      style={{}}
      onChange={handleDateChange}
      value={value}
      clearIcon={null}
      className="activity-date-picker"
    />
  );
};

export default DateRangePickerW;
