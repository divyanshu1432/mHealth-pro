import React, {useState, useEffect} from 'react';
import {lighten, makeStyles, useTheme} from '@material-ui/core/styles';
import Chart from 'react-apexcharts';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {APP} from '../utils/appConfig';
import AddPastDetailForm from './AddPastDetailForm';
import {urlPrefix, secretToken} from '../services/apicollection';
import axios from 'axios';
import {
  getDataCurrentSource,
  syncGFitAndStrava,
  getChallengesByDate,
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
  const {count, page, rowsPerPage, onChangePage} = props;

  const handleFirstPageButtonClick = (event) => {
    onChangePage(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onChangePage(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onChangePage(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
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
  const [weekMonth, setWeekMonth] = useState();
  const [radioValue, setRadioValue] = useState('Daily');
  console.log(radioValue);

  const [options, setOptions] = useState();
  const [series, setSeries] = useState();
  const handle = (val) => {
    const startdate = [];
    const weeksum = [];
    const adminurl = `${urlPrefix}v1.0/getWeekWiseLeaderBoardData?challengerZoneId=${eventId}&value=${val}`;
    console.log(adminurl);
    return axios
      .get(adminurl, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          timeStamp: 'timestamp',
          accept: '*/*',
          'Access-Control-Allow-Origin': '*',
          withCredentials: true,
          'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
          'Access-Control-Allow-Headers':
            'accept, content-type, x-access-token, x-requested-with',
        },
      })
      .then((res) => {
        {
          res.data.response.responseData.map((e1) => {
            startdate.push(e1.weekStartDate);
            weeksum.push(e1.weekSum);
          });
          console.log(startdate, weeksum);
          setOptions(startdate);
          setSeries(weeksum);

          setRadioValue(val);
          res.data.response.responseData.sort(function (a, b) {
            return new Date(b.weekStartDate) - new Date(a.weekStartDate);
          })
            ? setWeekMonth(res.data.response.responseData)
            : message.error(res.data.response.responseMessage);
        }
      });
  };
  useEffect(() => {
    // getweekmonthlist();
    // handleChange1();
    handle();
  }, []);
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
    setOrder('dsc');
    setOrderBy('');

    setRowsPerPage(50);
  }, [data]);
  const [series1, setSeries1] = useState();
  const [options1, setOptions1] = useState();
  const valuestartdate = [];
  const valuevalue = [];
  useEffect(() => {
    if (eventId) {
      getChallengesByDate(eventId).then((res) => {
        console.log(
          res.data.response.responseData.challengerWiseLeaderBoard[0]
            .dateWiseBoard
        );
        res.data.response.responseData.challengerWiseLeaderBoard[0].dateWiseBoard.map(
          (e2) => {
            valuestartdate.push(e2.valueTillDate);
            valuevalue.push(e2.value);
          }
        );
        setOptions1(valuestartdate);
        setSeries1(valuevalue);
        console.log(valuestartdate, valuevalue);
      });
      getDataCurrentSource(eventId)
        .then((res) => {
          console.log(res);
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

  // }
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <div
            style={{
              display: 'flex',
              // alignItems: 'center',
              // float:'left',
              justifyContent: 'flex-end',
            }}
          >
            <div style={{width: '50%', display: 'flex'}}>
              <span style={{fontSize: 14, fontWeight: 700, padding: 8}}>
                Data View:
              </span>
              <span
                style={{
                  marginLeft: '10px',
                  marginTop: '10px',
                }}
              >
                <div className="main" style={{display: 'flex'}}>
                  <div className="first_div">
                    <input
                      type="radio"
                      defaultChecked
                      id="daily"
                      name="radiobtn"
                      // checked={"true"}
                      // onChange={() => getChallengesByDate(eventId)}
                      onChange={() => handle('Daily')}
                    />
                    <label for="Daily"> Daily </label>
                  </div>

                  <div className="mid_div">
                    <input
                      type="radio"
                      id="Week"
                      value={radioValue}
                      name="radiobtn"
                      onChange={() => handle('Week')}
                    />
                    <label for="Week"> Weekly </label>
                  </div>

                  <div className="last_div">
                    <input
                      type="radio"
                      id="month"
                      value={radioValue}
                      name="radiobtn"
                      onChange={() => handle('Month')}
                    />
                    <label for="Month"> Monthly </label>
                  </div>
                </div>
              </span>
            </div>
            <div style={{width: '50%', display: 'flex'}}>
              <div style={{width: '30%'}}>
                {challengeSwitch !== 'old' && (
                  <button
                    className="add-data-button"
                    style={{marginLeft: 10, marginTop: 10, fontSize: 12}}
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
                  dataButtonType === 'WHATSAPP_WEB' &&
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
              </div>
              <div style={{width: '70%'}}>
                {(radioValue === 'Week') | (radioValue === 'Month') ? (
                  <TablePagination
                    rowsPerPageOptions={[25, 50, 75, 100]}
                    component="div"
                    count={weekMonth.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    ActionsComponent={TablePaginationActions}
                  />
                ) : (
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
                )}
              </div>
            </div>
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
              {(radioValue === 'Daily') | (radioValue === undefined) ? (
                <>
                  {stableSort(data.data, getComparator(orderBy, order))
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
                              {row.value == 0 &&
                                row.dataSource == 'WHATSAPP' &&
                                challengeSwitch !== 'old' && (
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
              ) : radioValue === 'Week' ? (
                <>
                  {stableSort(weekMonth, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      // console.log(row);
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.userId + '' + index}
                          className="performace-table-row"
                        >
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>{index + 1}</div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>
                              {row.weekStartDate}
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
                              {row.weekSum ? row.weekSum : 0}
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
                            {/* <div style={{fontSize: 12}}>
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
                            </div> */}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </>
              ) : radioValue === 'Month' ? (
                <>
                  {stableSort(weekMonth, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      // console.log(row);
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.userId + '' + index}
                          className="performace-table-row"
                        >
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>{index + 1}</div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>
                              {row.weekStartDate}
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
                              {row.weekSum ? row.weekSum : 0}
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
                            {/* <div style={{fontSize: 12}}>
                              {
                                row.weekSum === 0 &&
                                row.dataSource == 'WHATSAPP' &&
                                dataButtonType === 'WHATSAPP_WEB' && (
                                  <button
                                    className="add-data-button"
                                    onClick={() => {
                                      setSelectedDate(row.weekStartDate);
                                      setDisplayModal(true);
                                    }}
                                  >
                                    Add Data
                                  </button>
                                )}
                              {challengeSwitch !== 'old' &&
                                dataButtonType === 'STRAVA_GOOGLE_FIT' &&
                                eventIDForSync.includes(row.weekStartDate) && (
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
                            </div> */}
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
      {radioValue === 'Week' || radioValue === 'Month' ? (
        <div style={{display: 'flex'}}>
          <div style={{width: '50%'}}>
            <Chart
              options={{
                tooltip: {
                  x: {
                    format: 'dd/MM/yy',
                  },
                },
                chart: {
                  id: 'weekmonth',
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  show: true,
                  width: 2,
                },

                fill: {
                  opacity: 1,
                },
                xaxis: {
                  type: 'datetime',
                  categories: options,
                },
              }}
              series={[
                {
                  name: 'week',
                  data: series,
                },
              ]}
              height={350}
              style={{
                boxShadow:
                  '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                borderRadius: 12,
              }}
              type="bar"
              width="500"
            />
          </div>
          <div style={{width: '50%', marginLeft: '20px'}}>
            <Chart
              options={{
                tooltip: {
                  x: {
                    format: 'dd/MM/yy',
                  },
                },
                chart: {
                  id: 'weekmonth',
                },
                xaxis: {
                  type: 'datetime',
                  categories: options,
                },
              }}
              series={[
                {
                  name: 'week',
                  data: series,
                },
              ]}
              height={350}
              style={{
                boxShadow:
                  '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                borderRadius: 12,
              }}
              type="line"
              width="500"
            />
          </div>
        </div>
      ) : radioValue === 'Daily' || radioValue === undefined ? (
        <div style={{display: 'flex'}}>
          <div style={{width: '50%'}}>
            <Chart
              options={{
                tooltip: {
                  x: {
                    format: 'dd/MM/yy',
                  },
                },
                chart: {
                  id: 'weekmonth',
                },
                dataLabels: {
                  enabled: false,
                },
                stroke: {
                  show: true,
                  width: 2,
                },

                fill: {
                  opacity: 1,
                },
                xaxis: {
                  type: 'datetime',
                  categories: options1,
                },
              }}
              series={[
                {
                  name: 'week',
                  data: series1,
                },
              ]}
              height={350}
              style={{
                boxShadow:
                  '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                borderRadius: 12,
              }}
              type="bar"
              width="500"
            />
          </div>
          <div style={{width: '50%', marginLeft: '20px'}}>
            <Chart
              options={{
                tooltip: {
                  x: {
                    format: 'dd/MM/yy',
                  },
                },
                chart: {
                  id: 'weekmonth',
                },
                xaxis: {
                  type: 'datetime',
                  categories: options1,
                },
              }}
              series={[
                {
                  name: 'week',
                  data: series1,
                },
              ]}
              height={350}
              style={{
                boxShadow:
                  '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
                borderRadius: 12,
              }}
              type="line"
              width="500"
            />
          </div>
        </div>
      ) : (
        ''
      )}
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
