import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

export default function DatePicker({
  placeholder,
  value,
  onChange,
  disabled,
  disablePast,
  outlineVariantDisable,
}) {
  function formatDate(date) {
    if (!date) return '';
    var day = date.getDate();
    if (day < 10) {
      day = '0' + day;
    }
    var month = date.getMonth() + 1;
    if (month < 10) {
      month = '0' + month;
    }
    var year = date.getFullYear();
    return year + '-' + month + '-' + day;
  }
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {outlineVariantDisable ? (
        <KeyboardDatePicker
          autoOk
          format="yyyy/MM/dd"
          value={value ?? ''}
          InputAdornmentProps={{position: 'start'}}
          onChange={(date) => onChange(formatDate(date))}
          style={disabled ? {background: '#f3f4f6'} : {}}
          disablePast={disablePast}
        />
      ) : (
        <KeyboardDatePicker
          autoOk
          format="yyyy/MM/dd"
          value={value ?? ''}
          InputAdornmentProps={{position: 'start'}}
          onChange={(date) => onChange(formatDate(date))}
          style={disabled ? {background: '#f3f4f6'} : {}}
          disablePast={disablePast}
        />
      )}
    </MuiPickersUtilsProvider>
  );
}
