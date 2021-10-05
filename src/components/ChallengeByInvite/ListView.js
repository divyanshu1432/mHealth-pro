import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import NoData from '../NoData';
import ViewAllModal from './ViewAllModal';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const ListView = ({data = []}) => {
  const [modalData, setModalData] = useState({challenge: {}, data: []});
  const [viewAll, setViewAll] = useState(false);
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell style={{fontWeight: 800}}>Receiver</TableCell>
            <TableCell style={{fontWeight: 800}}>Challenger</TableCell>
            <TableCell style={{fontWeight: 800}} align="center">
              Score
            </TableCell>
            <TableCell style={{fontWeight: 800}} align="center">
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.length > 0 ? (
            data.map((row) => {
              const dump = row.scoresInTableFormat
                ? Object.entries(row.scoresInTableFormat)
                : [];

              const formattedData = dump.map((item) => {
                return {
                  date: item[0],
                  ...item[1],
                };
              });
              return (
                <TableRow key={row.name}>
                  <TableCell component="th" scope="row">
                    <div style={{display: 'flex'}}>
                      <Avatar
                        className="avatar-component sponser-logo"
                        src={row.receiverAvatarImage}
                      />{' '}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginLeft: 10,
                          alignItems: 'flex-start',
                        }}
                      >
                        <div>{row.receiverName || '-'}</div>

                        {row.totalReceiverDistance ? (
                          <>
                            <div>Last - {row.lastDayReceiverScore}</div>
                            <div>
                              Total -{' '}
                              {row.totalReceiverDistance ??
                                row.totalReceiverDistance.toFixed(2)}
                            </div>
                          </>
                        ) : (
                          '-'
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell align="center">
                    <div style={{display: 'flex'}}>
                      <Avatar
                        className="avatar-component sponser-logo"
                        src={row.senderAvatarImage}
                      />{' '}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          marginLeft: 10,
                          alignItems: 'flex-start',
                        }}
                      >
                        <div>{row.senderName || '-'}</div>

                        {row.totalSenderDistance ? (
                          <>
                            <div>Last - {row.lastDaySenderScore}</div>
                            <div>
                              Total -{' '}
                              {row.totalSenderDistance ??
                                row.totalSenderDistance.toFixed(2)}
                            </div>
                          </>
                        ) : (
                          '-'
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="d-flex" style={{justifyContent: 'center'}}>
                      <div className="scoreNo">{row.receiverPoints}</div>
                      <div className="scoreNo">{'-'}</div>
                      <div className="scoreNo"> {row.senderPoints}</div>
                    </div>
                    <div>
                      <div className="scorename">
                        {row.receiverLastActiveDay}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="view-all-score">
                      <button
                        onClick={() => {
                          if (formattedData.length > 0) {
                            setModalData({challenge: row, data: formattedData});
                            setViewAll((viewAll) => !viewAll);
                          }
                        }}
                        style={
                          formattedData.length == 0
                            ? {background: '#cdcdcd'}
                            : {}
                        }
                        disabled={formattedData.length == 0}
                      >
                        View Detail
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={4}
                style={{
                  position: 'relative',
                  height: 100,
                }}
              >
                <p
                  style={{
                    textAlign: 'center',
                    margin: '100px 0',
                    color: '#8e8e8e',
                  }}
                >
                  <NoData />
                </p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <ViewAllModal
        viewAll={viewAll}
        handleClose={() => {
          setModalData({challenge: {}, data: []});
          setViewAll(false);
        }}
        challenge={modalData.challenge}
        data={modalData.data}
      />
    </TableContainer>
  );
};

export default ListView;
