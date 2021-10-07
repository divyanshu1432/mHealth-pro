import React, {useEffect, useState} from 'react';
import {lighten, useTheme} from '@material-ui/core/styles';

import Navbar from './Navbar';
import {resetPasswordHandler} from '../services/loginapi';
import ReactLoadingWrapper from './loaders/ReactLoadingWrapper';
import Message from 'antd-message';
import TopUserDetails from './TopUserDetails';
import ResetPin1 from '../assets/resetPin.svg';
import {Modal} from 'react-responsive-modal';
import {makeStyles} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import CancelIcon from '@material-ui/icons/Cancel';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import IconButton from '@material-ui/core/IconButton';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import Tooltip from '@material-ui/core/Tooltip';
import Performance from './PerformanceReport';
import AuditReport from './AuditReport';
import GraphReport from './GraphView/GraphView';

import AddIcon from '@material-ui/icons/Add';
import {Edit} from 'react-feather';
import {CSVLink} from 'react-csv';
import {
  urlPrefix,
  secretToken,
  getSubEvent,
  zoomreport,
} from '../services/apicollection';
import axios from 'axios';

const MisReport = () => {
  const [open, setOpen] = useState(true);
  const [date, setdate] = useState();
  const [events, setevents] = useState([]);
  const [Perevents, setPerevents] = useState([]);
  const [programs, setprograms] = useState([]);
  const [data, setdata] = useState([]);
  const [admin, setAdmin] = useState();
  const [peradmin, setperadmin] = useState();
  // const [date, setdate] = useState();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchText, setSearchText] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [progId, setprogId] = useState();
  const [resMessage, setresMessage] = useState('');
  const [currDate, setcurrDate] = useState('');
  const [audit, setaudit] = useState({display: 'none'});
  const [display, setDisplay] = useState({display: 'none'});
  const [block, setblock] = useState({display: 'block'});
  const [flag, setflag] = useState('a');
  const performance = () => {
    if (flag == 'a') {
      setflag('b');
      setblock(display);
      setDisplay(block);
    }
  };
  const auditReportFun = () => {
    // setflag("c");
    setDisplay({display: 'none'});
    setblock({display: 'none'});
    setaudit({display: 'block'});
  };
  const attendence = () => {
    if (flag != 'a') {
      setflag('a');
      setblock(display);
      setDisplay(block);
    }
  };
  const getCDate = () => {
    //
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    const months = [
      '01',
      '02',
      '03',
      '04',
      '05',
      '06',
      '07',
      '08',
      '09',
      '10',
      '11',
      '12',
    ];

    const mos = today.getMonth();
    var mm = months[mos];
    var year = today.getFullYear();
    setdate(year + '-' + mm + '-' + dd);
  };
  useEffect(() => {
    getCDate();
  }, []);

  const headers = [
    {label: 'Register time', key: 'registrationDateTime'},
    {label: 'Company name', key: 'companyName'},
    {label: 'Employee Id', key: 'employeeId'},
    {label: 'First name', key: 'userFirstName'},
    {label: 'Last name', key: 'userlastName'},
    {label: 'Gender', key: 'gender'},
    {label: 'Mobile', key: 'userPhonNumber'},
    {label: 'Email Id', key: 'emailId'},
    {label: 'City', key: 'city'},
    {label: 'First In', key: 'firstInTime'},
    {label: 'Last out', key: 'lastOutTime'},
    {label: 'Total time', key: 'durationInTime'},
  ];
  const datas = data;

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(3),
    },
    button: {
      margin: theme.spacing(1, 1, 0, 0),
    },
    root: {
      width: '100%',
      // border: "1px solid black"
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

  const classes = useStyles();

  const useStyles1 = makeStyles((theme) => ({
    container: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200,
    },
    button: {
      display: 'block',
      marginTop: theme.spacing(2),
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }));

  // get EVENTS

  const getEvents = () => {
    const adminurl = `${urlPrefix}clients/getAllEvents?others=report&userId=${localStorage.getItem(
      'userId'
    )}`;
    return axios
      .get(adminurl, {
        headers: {
          Authorization: `Bearer ${secretToken}`,
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
        setAdmin(res.data.response.responseData.isAdmin);
        const y = res.data.response.responseData.events;

        if (res.data.response.responseData.isAdmin != true) {
          var marvelHeroes = y.filter(function (hero) {
            const x = hero.moderatorId == localStorage.getItem('userId');
            return x;
          });

          if (marvelHeroes) {
            const filteredData = marvelHeroes.sort(function (a, b) {
              if (
                a.challengeName.toLowerCase() < b.challengeName.toLowerCase()
              ) {
                return -1;
              }
              if (
                a.challengeName.toLowerCase() > b.challengeName.toLowerCase()
              ) {
                return 1;
              }
              return 0;
            });
            setevents(filteredData);
          }
        } else {
          const a = res.data.response.responseData.events;
          if (a) {
            const f = a.sort(function (a, b) {
              if (
                a.challengeName.toLowerCase() < b.challengeName.toLowerCase()
              ) {
                return -1;
              }
              if (
                a.challengeName.toLowerCase() > b.challengeName.toLowerCase()
              ) {
                return 1;
              }
              return 0;
            });
            setevents(f);
          }
        }
      });
  };

  console.log(events, 'events');

  // PERFORMANCE API CALL

  const getPerEvents = () => {
    const adminurl = `${urlPrefix}clients/getAllEvents?others=performance&userId=${localStorage.getItem(
      'userId'
    )}`;
    return axios
      .get(adminurl, {
        headers: {
          Authorization: `Bearer ${secretToken}`,
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
        setperadmin(res.data.response.responseData.isAdmin);
        const y = res.data.response.responseData.events;

        if (res.data.response.responseData.isAdmin != true) {
          var marvelHeroes = y.filter(function (hero) {
            const x = hero.moderatorId == localStorage.getItem('userId');
            return x;
          });

          if (marvelHeroes) {
            const filteredData = marvelHeroes.sort(function (a, b) {
              if (
                a.challengeName.toLowerCase() < b.challengeName.toLowerCase()
              ) {
                return -1;
              }
              if (
                a.challengeName.toLowerCase() > b.challengeName.toLowerCase()
              ) {
                return 1;
              }
              return 0;
            });
            setPerevents(filteredData);
          }
        } else {
          const a = res.data.response.responseData.events;
          if (a) {
            const f = a.sort(function (a, b) {
              if (
                a.challengeName.toLowerCase() < b.challengeName.toLowerCase()
              ) {
                return -1;
              }
              if (
                a.challengeName.toLowerCase() > b.challengeName.toLowerCase()
              ) {
                return 1;
              }
              return 0;
            });
            setPerevents(f);
          }
        }
      });
  };

  useEffect(() => {
    getEvents();
    getPerEvents();
  }, []);

  const handleChange = (e) => {
    let URL = `${urlPrefix}v1.0/getAllSubActivities?challengerzoneId=${e.target.value}`;

    return axios
      .get(URL, {
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
        setprograms(res.data.response.responseData);
        console.log('programs', res.data.response.responseData);
      });
  };

  const progChange = (e) => {
    setprogId(e.target.value);
  };
  const getDate = (event) => {
    setcurrDate(event.target.value);
  };

  function descendingComparator(a, b, orderBy) {
    let firstValue =
      a[orderBy] == null
        ? 'zzzzzzzzzzzz'
        : typeof a[orderBy] == 'string'
        ? a[orderBy]?.toLowerCase()
        : a[orderBy];
    let secondValue =
      b[orderBy] == null
        ? 'zzzzzzzzzzzz'
        : typeof b[orderBy] == 'string'
        ? b[orderBy]?.toLowerCase()
        : b[orderBy];
    if (secondValue < firstValue) {
      return -1;
    }
    if (secondValue > firstValue) {
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

  const getData = () => {
    let URL = `${urlPrefix}${zoomreport}?date=${currDate}&subEventId=${progId}`;

    return axios
      .get(URL, {
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
        // setprograms(res.data.response.responseData);
        if (res.data.response.responseData) {
          setdata(res.data.response.responseData.registeredUsers);
          setresMessage('');
        } else {
          setresMessage(res.data.response.responseMessage);
          setdata([]);
        }
      });
  };

  // GET EVENTS END

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

  const teamHeads = [
    {
      label: 'S.no',
      id: 's_no',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Register time',
      id: 'registrationDateTime',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Company name',
      id: 'companyName',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Emp id',
      id: 'employeeId',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'User name',
      id: 'userFirstName',
      numeric: false,
      disablePadding: true,
    },

    {
      label: 'Gender',
      id: 'gender',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Phone',
      id: 'userPhonNumber',
      numeric: false,
      disablePadding: true,
    },

    {
      label: 'Email',
      id: 'emailId',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'City',
      id: 'city',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'First In',
      id: 'firstInTime',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Last out',
      id: 'lastOutTime',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Total time',
      id: 'durationInTime',
      numeric: false,
      disablePadding: true,
    },
  ];

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  // function coach(props)
  const EnhancedTableHead = (prop) => {
    const {classes, order, orderBy, onRequestSort} = prop;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      // <Paper className={classes.paper}>
      <TableHead style={{}}>
        <TableRow>
          {teamHeads.map((teamHead) => (
            <TableCell
              key={teamHead.id}
              align="center"
              padding="none"
              sortDirection={orderBy === teamHead.id ? order : false}
              style={{
                width: 'max-content',
                paddingLeft: teamHead.id == 'index' ? 5 : 0,
              }}
            >
              <TableSortLabel
                active={orderBy === teamHead.id}
                direction={orderBy === teamHead.id ? order : 'asc'}
                onClick={createSortHandler(teamHead.id)}
                style={{width: 'max-content'}}
              >
                <span style={{marginLeft: 30}}> {teamHead.label} </span>
                {orderBy === teamHead.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === 'desc'
                      ? 'sorted descending'
                      : 'sorted ascending'}
                  </span>
                ) : null}
              </TableSortLabel>
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
    );
  };

  const classes1 = useStyles1();

  return (
    <div className="Profile" style={{height: 'auto', overflowX: 'hidden'}}>
      <TopUserDetails />
      <Navbar />
      <div className="profile-background" style={{overflowX: 'hidden'}}>
        <div
          className="form reset-form"
          style={{
            marginTop: 40,
            width: '90%',
            height: 'auto',
            marginTop: 50,
            // marginTop: "20px"
          }}
        >
          <Tabs style={{marginTop: 20}}>
            {' '}
            <div
              className="d-flex j-c-sp-btn a-i-center cursor-pointer"
              style={{justifyContent: 'flex-end'}}
            >
              <div className="leaderboard-actions ">
                {' '}
                <TabList style={{border: '0px'}}>
                  <Tab
                    style={{
                      fontSize: 12,
                      border: '0px',
                      background: '#e0f2fe',
                      height: 30,
                    }}
                  >
                    {' '}
                    <button
                      style={{
                        padding: 0,
                        height: 30,
                        background: '#e0f2fe',
                        color: '#518ad6',
                      }}
                    >
                      Attendance report{' '}
                    </button>
                  </Tab>
                  <Tab
                    style={{
                      fontSize: 12,
                      border: '0px',
                      background: '#e0f2fe',
                      height: 30,
                    }}
                  >
                    {' '}
                    <button
                      // className='is-success'
                      style={{
                        background: '#e0f2fe',
                        color: '#518ad6',
                        padding: 0,
                        height: 30,
                      }}
                      // className={classes}
                      // onClick={auditReportFun}
                    >
                      Audit report{' '}
                    </button>
                  </Tab>
                  <Tab
                    style={{
                      fontSize: 12,
                      border: '0px',
                      background: '#e0f2fe',
                      height: 30,
                    }}
                  >
                    {' '}
                    <button
                      // className={classes}
                      style={{
                        fontSize: 12,
                        background: '#e0f2fe',
                        color: '#518ad6',
                        padding: 0,
                        height: 30,
                      }}
                    >
                      Performance{' '}
                    </button>{' '}
                  </Tab>
                  <Tab
                    style={{
                      fontSize: 12,
                      border: '0px',
                      background: '#e0f2fe',
                      height: 30,
                    }}
                  >
                    {' '}
                    <button
                      style={{
                        background: '#e0f2fe',
                        color: '#518ad6',
                        padding: 0,
                        height: 30,
                      }}
                    >
                      Charts{' '}
                    </button>
                  </Tab>
                </TabList>
              </div>
            </div>
            <TabPanel>
              <div style={{}}>
                <div
                  className="main_div"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <div
                    style={{
                      marginTop: 50,
                      display: 'flex',
                      justifyContent: 'space-around',
                      fontSize: 12,
                      height: '10vh',
                      // position: "absolute"
                    }}
                  >
                    {/* <Performance /> */}
                    <div
                      className="select_date"
                      style={{
                        maxWidth: '250px',
                        // overflowX: "scroll",
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: 20,
                      }}
                    >
                      <fieldset>
                        <legend>Select Event:</legend>
                        <form className={classes1.container} noValidate>
                          <Select
                            style={{width: '250px'}}
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            // open={open}
                            // onClose={handleClose}
                            // onOpen={handleOpen}
                            // value={age}
                            onChange={handleChange}
                          >
                            {events.map((curelem, index) => {
                              return (
                                <MenuItem
                                  style={{fontSize: 12}}
                                  value={curelem.id}
                                >
                                  {curelem.challengeName}
                                </MenuItem>
                              );
                            })}
                          </Select>
                        </form>
                      </fieldset>
                    </div>

                    <div
                      className="select_date"
                      style={{
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: 20,
                      }}
                    >
                      <fieldset>
                        <legend>Select Program</legend>
                        <form className={classes1.container} noValidate>
                          <Select
                            style={{width: '100%'}}
                            labelId="demo-controlled-open-select-label"
                            id="demo-controlled-open-select"
                            // open={open}
                            // onClose={handleClose}
                            // onOpen={handleOpen}
                            // value={age}
                            onChange={progChange}
                          >
                            {programs &&
                              programs.map((curelem, index) => {
                                return (
                                  <MenuItem
                                    style={{fontSize: 12}}
                                    value={curelem.id}
                                  >
                                    {curelem.eventName}
                                  </MenuItem>
                                );
                              })}
                          </Select>
                        </form>
                      </fieldset>
                    </div>
                    <div
                      className="select_date"
                      style={{
                        width: '20%',
                        justifyContent: 'center',
                        alignItems: 'center',
                        top: 20,
                      }}
                    >
                      <fieldset>
                        <legend>Select Date:</legend>
                        <form className={classes1.container} noValidate>
                          <TextField
                            id="date"
                            type="date"
                            defaultValue={date}
                            className={classes1.textField}
                            InputLabelProps={{
                              shrink: true,
                            }}
                            onChange={getDate}
                            //
                          />
                        </form>
                      </fieldset>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                  >
                    <button
                      className="is-success"
                      style={{
                        height: 30,
                        width: 80,
                        marginTop: 25,
                      }}
                      onClick={getData}
                    >
                      {' '}
                      submit{' '}
                    </button>
                    <span
                      style={{
                        marginTop: 20,
                        color: 'red',
                        marginLeft: 50,
                      }}
                    >
                      {' '}
                      {resMessage}{' '}
                    </span>
                  </div>
                </div>

                <div style={{minWidth: '800px', overflowX: 'auto'}}>
                  {/* <Paper className={classes.paper}> */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    <Tooltip title="Export data">
                      <CSVLink data={datas} headers={headers} separator={','}>
                        <SystemUpdateAltIcon />
                      </CSVLink>
                    </Tooltip>
                    <div className="d-flex a-i-center">
                      <TablePagination
                        rowsPerPageOptions={[50, 75, 100]}
                        component="div"
                        count={data.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={handleChangePage}
                        onChangeRowsPerPage={handleChangeRowsPerPage}
                        ActionsComponent={TablePaginationActions}
                      />
                    </div>
                  </div>

                  <div style={{}}>
                    {/* <Table
                  className={classes.table}
                  aria-labelledby='tableTitle'
                  size={"small"}
                  aria-label='enhanced table'
                  // style={{ position: "absolute" }}
                >
                  <EnhancedTableHead
                    // style={{ width: "80%" }}
                    classes={classes}
                    order={order}
                    orderBy={orderBy}
                    onRequestSort={handleRequestSort}
                  />
                </Table> */}
                  </div>
                  {/* <div > */}
                  {data.length > 0 ? (
                    <div style={{padding: 20}}>
                      <Table
                        className={classes.table}
                        aria-labelledby="tableTitle"
                        size={'small'}
                        aria-label="enhanced table"
                      >
                        {' '}
                        <EnhancedTableHead
                          style={{fontSize: '5px'}}
                          classes={classes}
                          order={order}
                          orderBy={orderBy}
                          onRequestSort={handleRequestSort}
                        />
                        {stableSort(data, getComparator(order, orderBy))
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((item, ind) => {
                            return (
                              <>
                                <TableRow className="teamLeaderboard">
                                  {' '}
                                  <TableCell align="center">
                                    {' '}
                                    <span style={{fontSize: 12}}>
                                      {ind}
                                    </span>{' '}
                                  </TableCell>
                                  <TableCell align="center">
                                    {' '}
                                    <span style={{fontSize: 12}}>
                                      {item.registrationDateTime
                                        ? item.registrationDateTime
                                        : '  -     '}
                                    </span>{' '}
                                  </TableCell>
                                  <TableCell align="center">
                                    {' '}
                                    <span style={{fontSize: 12}}>
                                      {item.companyName
                                        ? item.companyName
                                        : '  -     '}
                                    </span>{' '}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{fontSize: 12}}
                                  >
                                    {' '}
                                    {item.employeeId
                                      ? item.employeeId
                                      : '  -     '}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{fontSize: 12}}
                                  >
                                    {item.userFirstName} {item.userlastName}{' '}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{fontSize: 12}}
                                  >
                                    {item.gender ? item.gender : '    '}{' '}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{fontSize: 12}}
                                  >
                                    <span style={{}}>
                                      {' '}
                                      {item.userPhonNumber
                                        ? item.userPhonNumber
                                        : '    '}{' '}
                                    </span>{' '}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{fontSize: 12}}
                                  >
                                    {item.emailId ? item.emailId : '   '}{' '}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{fontSize: 12}}
                                  >
                                    {item.city ? item.city : '   '}{' '}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{fontSize: 12}}
                                  >
                                    <span style={{marginRight: 20}}>
                                      {' '}
                                      {item.firstInTime
                                        ? item.firstInTime
                                        : '    '}{' '}
                                    </span>{' '}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{fontSize: 12}}
                                  >
                                    <span style={{marginRight: 20}}>
                                      {' '}
                                      {item.lastOutTime
                                        ? item.lastOutTime
                                        : '    '}{' '}
                                    </span>{' '}
                                  </TableCell>
                                  <TableCell
                                    align="center"
                                    style={{fontSize: 12}}
                                  >
                                    <span style={{marginRight: 20}}>
                                      {' '}
                                      {item.durationInTime
                                        ? item.durationInTime
                                        : '    '}{' '}
                                    </span>{' '}
                                  </TableCell>
                                </TableRow>
                              </>
                            );
                          })}
                      </Table>
                      {/* </div> */}
                    </div>
                  ) : (
                    <>
                      <div
                        style={{
                          height: 250,
                          padding: '5px',
                          marginTop: 30,
                          width: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          fontSize: 12,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}
                        className=""
                      >
                        {' '}
                        <img
                          style={{width: 200, height: 200}}
                          src="https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg"
                        />
                        Data is not present
                      </div>{' '}
                    </>
                  )}
                </div>
              </div>
            </TabPanel>
            <TabPanel>
              <div style={{}}>
                <AuditReport events={Perevents} />
              </div>
            </TabPanel>
            <TabPanel>
              {' '}
              <Performance data={Perevents} peradmin={peradmin} />
            </TabPanel>
            <TabPanel>
              {' '}
              <GraphReport events={events} />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MisReport;
