import React, {useState, useEffect} from 'react';
import Modal from '@material-ui/core/Modal';
import {makeStyles} from '@material-ui/core/styles';
import CancelIcon from '@material-ui/icons/Cancel';
import {checkForFalsy} from '../../utils/commonFunctions';

import {editUserProgramPaymentDetails} from '../../services/challengeApi';

import DateFnsUtils from '@date-io/date-fns';
import {MuiPickersUtilsProvider, DateTimePicker} from '@material-ui/pickers';

import ReactLoadingWrapper from '../loaders/ReactLoadingWrapper';

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
    maxWidth: `600px`,
  };
}

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
  let formattedHours =
    `${date.getHours()}`.length == 2 ? date.getHours() : '0' + date.getHours();
  let formattedMins =
    `${date.getMinutes()}`.length == 2
      ? date.getMinutes()
      : '0' + date.getMinutes();
  let formattedDate =
    year +
    '-' +
    month +
    '-' +
    day +
    ' ' +
    formattedHours +
    ':' +
    formattedMins +
    ':' +
    '00';

  return formattedDate;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '90%',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    outline: 'none',
    maxHeight: 650,
  },
  chips: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  chip: {
    margin: 2,
  },
}));

const EditPaymentDetails = ({visible, closeModal, editPaymentObject}) => {
  const [loading, setLoading] = useState(false);
  const [paymentObject, setPaymentObject] = useState({
    txnId: '',
    subEventId: '',
    txnAmount: '',
    txnDateTime: Date.now(),
    txnMode: '',
    txnPaymentIdByUser: '',
  });

  useEffect(() => {
    if (editPaymentObject) {
      setPaymentObject({
        txnId: editPaymentObject.txnId,
        subEventId: editPaymentObject.subEventId,
        txnAmount: editPaymentObject.txnPaymentAmout,
        txnDateTime: editPaymentObject.txnPaymentDate,
        txnMode: editPaymentObject.transitionMode,
        txnPaymentIdByUser: editPaymentObject.transitionPaymentIdByUser,
      });
    }
  }, []);

  const handleInputChange = (name, value) => {
    setPaymentObject((prevState) => {
      return {...prevState, [name]: value};
    });
  };

  const classes = useStyles();
  const [modalStyle] = React.useState(getModalStyle);

  const [errorObj, setErrorObj] = useState({});

  const getDisableStatus = () => {
    let disabled = false;

    let checkObject = {...paymentObject};
    disabled =
      Object.values(checkObject).includes(undefined) ||
      Object.values(checkObject).includes(null) ||
      Object.values(checkObject).includes('');

    return disabled;
  };

  const [regMessage, setRegMessage] = useState({
    type: 'error',
    msg: '',
  });

  const handleSubmit = () => {
    setRegMessage({
      type: 'error',
      msg: '',
    });
    if (!getDisableStatus()) {
      setLoading(true);
      let payload = {
        ...paymentObject,
        txnDateTime: paymentObject.txnDateTime.split('T').join(' '),
      };
      editUserProgramPaymentDetails(editPaymentObject.userId, payload).then(
        (res) => {
          setLoading(false);
          setRegMessage({
            type: 'success',
            msg: res.data.mhealthResponseMessage,
          });
        }
      );
    } else {
      let newErrorObj = {};
      Object.entries(paymentObject).map((item) => {
        if (item[1] == undefined || item[1] == '') {
          newErrorObj[item[0]] = true;
        }
      });

      setErrorObj(newErrorObj);
    }
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div
        className="heading"
        style={{
          marginTop: 0,
          fontSize: 18,
          display: 'flex',
          alignItems: 'center',
          marginBottom: 20,
        }}
      >
        Edit user payment details
      </div>
      <div
        className="basic-info-container"
        style={{overflowY: 'scroll', maxHeight: 580}}
      >
        <div className="basic-info register-form">
          <div
            className="mhealth-input-box padding-025em"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{width: '50%'}}>
              <div>
                <label style={{fontSize: 12}}>Transaction Id</label>
                {errorObj.txnId && <p className="error-text">Please input</p>}
              </div>
              <input
                style={{
                  border: errorObj.txnId ? '1px solid red' : 0,
                }}
                placeholder="Enter transaction id"
                value={
                  checkForFalsy(paymentObject.txnId) ? '' : paymentObject.txnId
                }
                onChange={(e) => handleInputChange('txnId', e.target.value)}
              />
            </div>
            <div style={{width: '50%', marginLeft: 10}}>
              <div>
                <label style={{fontSize: 12}}>Transaction Mode</label>
                {errorObj.txnMode && (
                  <p className="error-text">Please select</p>
                )}
              </div>
              <select
                name="txnMode"
                value={paymentObject.txnMode}
                style={{
                  border: errorObj.txnMode ? '1px solid red' : 0,
                  height: 28,
                }}
                onChange={(e) => {
                  handleInputChange('txnMode', e.target.value);
                }}
              >
                <option value={undefined}>Select transaction mode</option>
                <option value="DEBIT_CARD">Debit Card</option>
                <option value="CREDIT_CARD">Credit Card</option>
                <option value="CASH">Cash</option>
                <option value="WALLET">Wallet</option>
                <option value="NEFT">NEFT</option>
                <option value="BANK_TRANSFER">Bank Trasfer</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
          </div>

          <div
            className="mhealth-input-box padding-025em"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
            }}
          >
            <div style={{width: '50%'}}>
              <div>
                <label style={{fontSize: 12}}>Transaction Amount</label>
                {errorObj.txnAmount && (
                  <p className="error-text">Please input</p>
                )}
              </div>

              <input
                type="number"
                style={{
                  border: errorObj.txnAmount ? '1px solid red' : 0,
                }}
                placeholder="Enter transaction Amount"
                value={paymentObject.txnAmount}
                onChange={(e) => handleInputChange('txnAmount', e.target.value)}
              />
            </div>

            <div style={{width: '50%', marginLeft: 10}}>
              <div>
                <label style={{fontSize: 12}}>Transaction Id by user</label>
                {errorObj.txnPaymentIdByUser && (
                  <p className="error-text">Please input</p>
                )}
              </div>
              <input
                style={{
                  border: errorObj.txnPaymentIdByUser ? '1px solid red' : 0,
                }}
                placeholder="Enter transaction Id by user"
                value={
                  checkForFalsy(paymentObject.txnPaymentIdByUser)
                    ? ''
                    : paymentObject.txnPaymentIdByUser
                }
                onChange={(e) =>
                  handleInputChange('txnPaymentIdByUser', e.target.value)
                }
              />
            </div>
          </div>

          <div
            className="mhealth-input-box padding-025em"
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{width: '50%'}}>
              <div>
                <label style={{fontSize: 12}}>Transaction Date and Time</label>
                {errorObj.txnDateTime && (
                  <p className="error-text">Please input</p>
                )}
              </div>
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DateTimePicker
                  variant="inline"
                  value={paymentObject.txnDateTime ?? ''}
                  onChange={(date) => {
                    handleInputChange('txnDateTime', formatDate(date));
                  }}
                />
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </div>
      </div>
      <div
        className="submit-button"
        style={{
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            fontSize: 14,
            width: 'max-content',
            color: regMessage.type == 'success' ? '#069b3f' : '#d65151',
          }}
        >
          {regMessage.msg}
        </div>
        {loading ? (
          <span
            style={{
              marginTop: 0,
              marginBottom: 15,
              width: 100,
              height: 32,
            }}
          >
            <ReactLoadingWrapper
              color={'#518ad6'}
              height={32}
              width={32}
              type={'spin'}
            />
          </span>
        ) : (
          <button
            className="is-success"
            onClick={() => handleSubmit()}
            style={{
              marginTop: 0,
              width: 100,
              height: 32,
              marginLeft: 20,
            }}
            disabled={getDisableStatus()}
          >
            Submit
          </button>
        )}
      </div>
      <CancelIcon
        style={{
          position: 'absolute',
          top: 5,
          right: 5,
          color: '#ef5350',
          cursor: 'pointer',
        }}
        onClick={() => closeModal()}
      />
    </div>
  );
  return (
    <Modal
      open={visible}
      onClose={() => {
        closeModal();
        setPaymentObject();
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
      disableAutoFocus
      disableBackdropClick={true}
    >
      {body}
    </Modal>
  );
};

export default EditPaymentDetails;
