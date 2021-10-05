import React from 'react';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
const DateRangePickerW = ({value, handleDateChange}) => {
  return (
    <DateRangePicker
      onChange={handleDateChange}
      value={value}
      clearIcon={null}
      className="activity-date-picker"
    />
  );
};

export default DateRangePickerW;
