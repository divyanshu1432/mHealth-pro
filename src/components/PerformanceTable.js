import React, {useState, useEffect} from 'react';
import {lighten, makeStyles, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {APP} from '../utils/appConfig';
import AddPastDetailForm from './AddPastDetailForm';
import {
  getDataCurrentSource,
  syncGFitAndStrava,
} from '../services/challengeApi';
import {AlertTriangle} from 'react-feather';
import Tooltip from '@material-ui/core/Tooltip';
import Message from 'antd-message';

function FacebookCircularProgress(props) {
  const useStylesFacebook = makeStyles((theme) => ({
    root: {
      position: 'absolute',
      left: '50%',
      top: '50%',
    },
    bottom: {
      color: theme.palette.grey[theme.palette.type === 'light' ? 200 : 700],
    },
    top: {
      color: '#1a90ff',
      animationDuration: '550ms',
      position: 'absolute',
      left: 0,
    },
    circle: {
      strokeLinecap: 'round',
    },
  }));
  const classes = useStylesFacebook();

  return (
    <div className={classes.root}>
      <CircularProgress
        variant="determinate"
        className={classes.bottom}
        size={20}
        thickness={4}
        {...props}
        value={100}
      />
      <CircularProgress
        variant="indeterminate"
        disableShrink
        className={classes.top}
        classes={{
          circle: classes.circle,
        }}
        size={20}
        thickness={4}
        {...props}
      />
    </div>
  );
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    label: 'S.No',
    id: 'index',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'Date',
    id: 'valueTillDate',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'Km',
    id: 'value',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'Source',
    id: 'dataSource',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'Action Required',
    id: 'addData',
    numeric: false,
    disablePadding: true,
  },
];

function EnhancedTableHead(props) {
  const {classes, order, orderBy, onRequestSort} = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding="none"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

const useStyles1 = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
}));

function TablePaginationActions(props) {
  const classes = useStyles1();
  const theme = useTheme();
  const {count, page, rowsPerPage, onPageChange} = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <div className={classes.root} style={{display: 'flex'}}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
        style={{width: 30, padding: 0}}
      >
        {theme.direction === 'rtl' ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
        style={{width: 30, padding: 0}}
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
        style={{width: 30, padding: 0}}
      >
        {theme.direction === 'rtl' ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
        style={{width: 30, padding: 0}}
      >
        {theme.direction === 'rtl' ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </div>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  paper: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1,
  },
}));

export default function PerformanceTable({
  data,
  eventId,
  handlePerformanceClick,
  challengeSwitch,
}) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [selectedDate, setSelectedDate] = useState('');
  const [displayModal, setDisplayModal] = useState(false);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const [displayAddButton, setDisplayAddButton] = useState(false);
  const [dataButtonType, setDataButtonType] = useState('');
  const [isCheckingData, setCheckingData] = useState(false);
  const [eventIDForSync, setEventIDForSync] = useState([]);
  useEffect(() => {
    setPage(0);
    setOrder('asc');
    setOrderBy('');
    setRowsPerPage(50);
  }, [data]);

  useEffect(() => {
    if (eventId) {
      getDataCurrentSource(eventId)
        .then((res) => {
          if (
            res.data.response.responseCode === 0 &&
            (res.data.response.responseData.datasource === 'WHATSAPP' ||
              res.data.response.responseData.datasource === 'WEB')
          ) {
            setDataButtonType('WHATSAPP_WEB');
          } else if (
            res.data.response.responseCode === 0 &&
            (res.data.response.responseData.datasource === 'STRAVA' ||
              res.data.response.responseData.datasource === 'GOOGLE_FIT')
          ) {
            setDataButtonType('STRAVA_GOOGLE_FIT');
          } else {
            setDataButtonType('');
          }
        })
        .catch((err) => {
          setDataButtonType('');
        });
    } else {
      setDataButtonType('');
    }
  }, [eventId]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div style={{fontSize: 14, fontWeight: 700, padding: 8}}>
          Date Wise Performance
        </div>

        <TableContainer>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
            }}
          >
            {challengeSwitch !== 'old' && dataButtonType === 'WHATSAPP_WEB' && (
              <button
                className="add-data-button"
                style={{marginLeft: 10}}
                onClick={() => {
                  var today = new Date();
                  var dd = String(today.getDate()).padStart(2, '0');
                  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                  var yyyy = today.getFullYear();

                  setSelectedDate(yyyy + '-' + mm + '-' + dd);
                  setDisplayModal(true);
                }}
              >
                Add Today's Data
              </button>
            )}
            {challengeSwitch !== 'old' &&
              dataButtonType === 'STRAVA_GOOGLE_FIT' && (
                <button
                  className="add-data-button"
                  style={{marginLeft: 10}}
                  onClick={() => {
                    window.message = Message;
                    /** api to sync**/
                    setCheckingData(true);
                    if (eventIDForSync.length === 0) {
                      syncGFitAndStrava('check', eventId)
                        .then((res) => {
                          if (res.data.response.responseCode === 0) {
                            setEventIDForSync(
                              res.data.response.responseData[0]
                            );
                          } else {
                            message.success('No Data to sync');
                            setEventIDForSync([]);
                          }
                          setCheckingData(false);
                        })
                        .catch((err) => {
                          setEventIDForSync([]);
                          setCheckingData(false);
                        });
                    }
                    if (eventIDForSync.length > 0) {
                      syncGFitAndStrava('fix', eventId)
                        .then((res) => {
                          if (res.data.response.responseCode === 0) {
                            message.success('Synced');
                            setEventIDForSync([]);
                            handlePerformanceClick();
                          }
                          setCheckingData(false);
                        })
                        .catch((err) => {
                          setCheckingData(false);
                        });
                    }
                  }}
                >
                  {isCheckingData
                    ? 'In Progress..'
                    : eventIDForSync.length > 0
                    ? 'Sync Data'
                    : 'Validate'}
                </button>
              )}
            <TablePagination
              rowsPerPageOptions={[25, 50, 75, 100]}
              component="div"
              count={data.data.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </div>

          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />

            <TableBody>
              {data.loading ? (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    style={{
                      position: 'relative',
                      height: 200,
                    }}
                  >
                    <FacebookCircularProgress />
                  </TableCell>
                </TableRow>
              ) : data.data.length > 0 ? (
                <>
                  {stableSort(data.data, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.userId + '' + index}
                          className="performace-table-row"
                        >
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>{row.index + 1}</div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>
                              {row.valueTillDate}
                            </div>
                          </TableCell>

                          <TableCell align="center">
                            <div
                              style={{
                                fontSize: 12,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {row.value ? row.value : 0}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>
                              <img
                                src={
                                  row.dataSource
                                    ? APP.dataSourceLogo[row.dataSource]
                                    : 'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/NotSet.svg'
                                }
                                style={{
                                  width: 30,
                                  height: 30,
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>
                              {challengeSwitch !== 'old' &&
                                row.value == 0 &&
                                row.dataSource == 'WHATSAPP' &&
                                dataButtonType === 'WHATSAPP_WEB' && (
                                  <button
                                    className="add-data-button"
                                    onClick={() => {
                                      setSelectedDate(row.valueTillDate);
                                      setDisplayModal(true);
                                    }}
                                  >
                                    Add Data
                                  </button>
                                )}
                              {challengeSwitch !== 'old' &&
                                dataButtonType === 'STRAVA_GOOGLE_FIT' &&
                                eventIDForSync.includes(row.valueTillDate) && (
                                  <Tooltip title="Click on Sync button to sync the data">
                                    <div
                                      style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                      }}
                                    >
                                      <AlertTriangle
                                        size={14}
                                        style={{
                                          marginLeft: '2px',
                                          marginRight: '2px',
                                          color: 'red',
                                        }}
                                      />
                                      Sync Data
                                    </div>
                                  </Tooltip>
                                )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </>
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
                      {data.message === 'SUCCESS'
                        ? 'Data is not present'
                        : data.message}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {displayModal && (
        <AddPastDetailForm
          {...{
            selectedDate,
            displayModal,
            setDisplayModal,
            eventId,
            handlePerformanceClick,
          }}
        />
      )}
    </div>
  );
}
