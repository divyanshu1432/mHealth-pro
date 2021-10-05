import React, {useEffect, useState, useCallback} from 'react';
import {useTheme} from '@material-ui/core/styles';
import Popup from './Popup';
import EditIcon from '@material-ui/icons/EditOutlined';
import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import Input from '@material-ui/core/Input';
// import Event from './Event'
// import 'bootstrap/dist/css/bootstrap.rtl.min.css';
// import ImageViewer from 'react-simple-image-viewer';
// import ReactLoadingWrapper from "./loaders/ReactLoadingWrapper";
// import Message from "antd-message";

// import { Modal } from "react-responsive-modal";
import {makeStyles} from '@material-ui/core/styles';
// import TextField from "@material-ui/core/TextField";
// import InputLabel from "@material-ui/core/InputLabel";
// import MenuItem from "@material-ui/core/MenuItem";
// import FormControl from "@material-ui/core/FormControl";
// import Select from "@material-ui/core/Select";
// import Button from "@material-ui/core/Button";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
// import CancelIcon from "@material-ui/icons/Cancel";
import TableCell from '@material-ui/core/TableCell';
// import TableContainer from "@material-ui/core/TableContainer";
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import axios from 'axios';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Message from 'antd-message';

// import Paper from "@material-ui/core/Paper";
import SystemUpdateAltIcon from '@material-ui/icons/SystemUpdateAlt';
import IconButton from '@material-ui/core/IconButton';
// import CircularProgress from "@material-ui/core/CircularProgress";
// import Avatar from "@material-ui/core/Avatar";
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
// import CSVExport from "../CSVExport";
import Tooltip from '@material-ui/core/Tooltip';
// import NoData from "../NoData";
// import ActiveButton from "../Utility/ActiveButton";
// import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
// import "react-tabs/style/react-tabs.css";
// import AddIcon from "@material-ui/icons/Add";
import {Edit} from 'react-feather';
import {CSVLink} from 'react-csv';
import {urlPrefix, secretToken} from '../services/apicollection';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(3),
    overflowX: 'auto',
  },
  table: {
    minWidth: 650,
  },
  selectTableCell: {
    width: 30,
  },
  tableCell: {
    width: 130,
    height: 40,
  },
  input: {
    width: 50,
    height: 40,
  },
}));

const CustomTableCell = ({item, name, onChange}) => {
  const classes = useStyles();
  const {isEditMode} = item;
  return (
    <TableCell align="left" className={classes.tableCell}>
      {isEditMode ? (
        <Input
          value={item[name]}
          name={name}
          onChange={(e) => onChange(e, item)}
          className={classes.input}
        />
      ) : (
        item[name]
      )}
    </TableCell>
  );
};

const AuditReport = (props) => {
  const [Event, setEvent] = useState();
  const [data, setData] = useState([]);
  const geteventrlist = () => {
    // const adminurl = `${urlPrefix}clients/getAllEvents?others=performance&userId=${localStorage.getItem(
    //   'userId'
    // )}`;

    // return axios
    //   .get(adminurl, {
    //     headers: {
    //       Authorization: `Bearer ${secretToken}`,
    //       timeStamp: 'timestamp',
    //       accept: '*/*',
    //       'Access-Control-Allow-Origin': '*',
    //       withCredentials: true,
    //       'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE,OPTIONS',
    //       'Access-Control-Allow-Headers':
    //         'accept, content-type, x-access-token, x-requested-with',
    //     },
    //   })
    //   .then((res) => {
    //     {
    //       res.data.response.responseData
    setData(props.events);
    //       : '';
    //   }
    // });
  };
  const [player, setPlayer] = useState([]);

  const [playerId, setplayerId] = useState();
  const getplayerlist = (e) => {
    const adminurl = `${urlPrefix}v1.0/getEventWiseUserDetail?event=${e}&isActive=1`;

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
        // console.log(res.data.response.responseData);
        {
          res.data.response.responseData
            ? setPlayer(res.data.response.responseData)
            : Message.error(res.data.response.responseMessage);
        }
      });
  };

  const players = (e) => {
    setplayerId(e.target.value);
  };

  const handleChange = (e) => {
    setEvent(e.target.value);
    getplayerlist(e.target.value);
  };

  useEffect(() => {
    geteventrlist();
  }, []);

  const [items, setItems] = useState([]);
  function submit(e) {
    e.preventDefault();

    axios
      .get(
        `${urlPrefix}v1.0/getEventWisePlayerAuditForm?challengerZoneId=${Event}&playerId=${playerId}`,
        {
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
        }
      )
      .then((res) => {
        // console.log(res.data.response.responseData);
        {
          res.data.response.responseData
            ? setItems(res.data.response.responseData)
            : Message.error(res.data.response.responseMessage);
        }
      });
  }

  const [EditId, setEditId] = useState();
  const [EditValue, setEditValue] = useState();
  const [EditData, setEditData] = useState();
  const [previous, setPrevious] = React.useState({});
  const onToggleEditMode = (id) => {
    setItems((state) => {
      return items.map((row) => {
        if (row.id === id) {
          return {...row, isEditMode: !row.isEditMode};
        }
        return row;
      });
    });
    axios
      .put(
        `${urlPrefix}v1.0/editOcrFailedStatus?id=${EditId}&value=${EditValue}`,
        {},
        {
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
        }
      )
      .then((res) => {});
  };

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious((state) => ({...state, [row.id]: row}));
    }
    const value = e.target.value;
    console.log(value);
    setEditValue(value);
    const name = e.target.name;
    console.log(name);
    const {id} = row;
    // console.log(id)
    setEditId(id);
    const newRows = items.map((row) => {
      if (row.id === id) {
        return {...row, [name]: value};
      }
      return row;
    });
    setItems(newRows);
  };

  console.log(items);
  const [currentImage, setCurrentImage] = useState('');
  const [isViewerOpen, setIsViewerOpen] = useState([false]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isOpen, setIsOpen] = useState(false);
  const togglePopup = (whatsAppImage) => {
    setIsOpen(!isOpen);
    setCurrentImage(whatsAppImage);
  };

  //   const [searchText, setSearchText] = useState("");
  //   const [isActive, setIsActive] = useState(true);
  //   const [team, setteam] = useState();
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  // console.log(team, "xyz");
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(2),
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

  function TablePaginationActions(props) {
    const classes = useStyles();
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

  const headers = [
    {label: 'Source', key: 'dataSorce'},
    {label: 'Date', key: 'date'},
    {label: 'Active on', key: 'activityStartDate'},
    {label: 'Activity to', key: 'activityEndDate'},
    {label: 'Entry on', key: 'entryDateTime'},
    {label: 'Raw value', key: 'rawValue'},
    {label: 'Raw unit', key: 'rawUnit'},
    {label: 'LeederBoard value', key: 'leaderBoardValue'},
  ];
  const datas = items;

  const teamHeads = [
    {
      label: 'S.No',
      id: 'index',

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
      label: 'Date',
      id: 'date',
      numeric: false,
      disablePadding: true,
    },

    {
      label: 'Activity from',
      id: 'activityStartDate',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Activity To',
      id: 'activityEndDate',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Entry On',
      id: 'entryDateTime',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Value',
      id: 'rawValue',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Unit',
      id: 'rawUnit',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Image',
      id: 'whatsAppImage',
      numeric: false,
      disablePadding: true,
    },

    {
      label: 'LeaderBoard',
      id: 'leaderBoardValue',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Checked',
      id: 'ocrVerified',
      numeric: false,
      disablePadding: true,
    },
    {
      label: 'Update',

      numeric: false,
      disablePadding: true,
    },
  ];

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
                paddingLeft: teamHead.id === 'index' ? 5 : 0,
              }}
            >
              <TableSortLabel
                active={orderBy === teamHead.id}
                direction={orderBy === teamHead.id ? order : 'asc'}
                onClick={createSortHandler(teamHead.id)}
                // style={{ width: "max-content" }}
              >
                <span style={{marginLeft: 5, fontSize: 15, fontFamily: 'bold'}}>
                  {' '}
                  {teamHead.label}{' '}
                </span>
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

  return (
    <>
      <div>
        <div class="container" style={{marginTop: '10px'}}>
          <form onSubmit={(e) => submit(e)}>
            <div
              class="row"
              style={{display: 'flex', justifyContent: 'space-around'}}
            >
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
                  <legend>Select Event</legend>
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
                    {/* <option value='null'>Select Event ....</option> */}
                    {data &&
                      data.map(function (ev, index) {
                        return (
                          <MenuItem
                            required
                            style={{fontSize: 12}}
                            value={ev.id}
                          >
                            {ev.challengeName}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </fieldset>
              </div>
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
                  <legend>Select Player</legend>
                  <Select
                    style={{width: '250px'}}
                    labelId="demo-controlled-open-select-label"
                    id="demo-controlled-open-select"
                    onChange={players}
                  >
                    {/* <option value='null'>Select Player ....</option> */}
                    {player &&
                      player.map(function (ev, index) {
                        return (
                          <MenuItem
                            required
                            style={{fontSize: 12}}
                            value={ev.mstUserId}
                          >
                            {ev.name}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </fieldset>
              </div>
              {/* <div class='col-md-1'></div> */}
            </div>
            <div style={{display: 'flex', justifyContent: 'center'}}>
              <button
                style={{
                  color: 'white',
                  background: 'green',
                  height: 30,
                  width: 80,
                  marginTop: 25,
                }}
                class="btn btn-success"
              >
                {' '}
                Submit
              </button>
            </div>
          </form>
        </div>
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
              rowsPerPageOptions={[10, 50, 75, 100]}
              component="div"
              count={items && items.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={handleChangePage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActions}
            />
          </div>
        </div>

        <div
          style={{
            minHeight: '350px',
            fontSize: 12,
            overflowX: 'scroll',
          }}
        >
          {items && items.length > 0 ? (
            <Table
              className={classes.table}
              aria-labelledby="tableTitle"
              size={'small'}
              aria-label="enhanced table"
              style={{}}
            >
              <EnhancedTableHead
                classes={classes}
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />

              <TableBody style={{}}>
                {items &&
                  stableSort(items, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((item, index) => {
                      // console.log(items);
                      return (
                        <TableRow>
                          <TableCell align="center">{index + 1}</TableCell>
                          <TableCell align="center">
                            {' '}
                            <img
                              style={{height: 20}}
                              src={
                                item.dataSource === 'WHATSAPP'
                                  ? 'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/whatsapp.svg'
                                  : item.dataSource === 'GOOGLE_FIT'
                                  ? 'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/googlefit.svg'
                                  : 'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/strava.svg'
                              }
                            />
                          </TableCell>
                          <TableCell align="center" style={{fontSize: 12}}>
                            <p style={{marginTop: '5px'}}> {item.date} </p>{' '}
                          </TableCell>
                          <TableCell align="center" style={{fontSize: 12}}>
                            {' '}
                            {item.activityStartDate.map((curr, ind) => {
                              console.log(curr);
                              return (
                                <>
                                  <p style={{marginTop: '5px', width: 140}}>
                                    {' '}
                                    {curr}{' '}
                                  </p>{' '}
                                </>
                              );
                            })}{' '}
                          </TableCell>
                          <TableCell align="center" style={{fontSize: 12}}>
                            {' '}
                            {item.activityEndDate.map((curr, ind) => {
                              console.log(curr);
                              return (
                                <>
                                  <p style={{marginTop: '5px', width: 150}}>
                                    {' '}
                                    {curr}{' '}
                                  </p>{' '}
                                </>
                              );
                            })}{' '}
                          </TableCell>
                          <TableCell align="center" style={{fontSize: 12}}>
                            {' '}
                            {item.entryDateTime.map((curr, ind) => {
                              console.log(curr);
                              return (
                                <>
                                  <p style={{marginTop: '5px', width: 150}}>
                                    {' '}
                                    {curr}{' '}
                                  </p>{' '}
                                </>
                              );
                            })}{' '}
                          </TableCell>
                          <TableCell align="center" style={{fontSize: 12}}>
                            {' '}
                            {item.rawValue.map((curr, ind) => {
                              console.log(curr);
                              return (
                                <>
                                  <p style={{marginTop: '5px'}}> {curr} </p>{' '}
                                </>
                              );
                            })}{' '}
                          </TableCell>

                          <TableCell align="center" style={{fontSize: 12}}>
                            <p>{item.rawUnit}</p>
                          </TableCell>
                          <TableCell align="center" style={{fontSize: 12}}>
                            <img
                              src={item.whatsAppImage}
                              onClick={() => togglePopup(item.whatsAppImage)}
                              // onClick={ () => openImageViewer(index) }
                              height="50%"
                              width="50px"
                              key={index}
                            />
                          </TableCell>

                          {isOpen && (
                            <Popup
                              content={
                                <>
                                  <img
                                    src={currentImage}
                                    height="450px"
                                    width="450px"
                                  />
                                </>
                              }
                              handleClose={togglePopup}
                            />
                          )}
                          <TableCell align="center">
                            <CustomTableCell
                              {...{item, name: 'leaderBoardValue', onChange}}
                            />
                          </TableCell>
                          <TableCell align="center" style={{fontSize: 12}}>
                            {item.ocrVerified}
                          </TableCell>
                          <TableCell
                            align="center"
                            className={classes.selectTableCell}
                          >
                            {item.isEditMode ? (
                              <>
                                <IconButton
                                  aria-label="done"
                                  onClick={() => onToggleEditMode(item.id)}
                                >
                                  <DoneIcon />
                                </IconButton>
                              </>
                            ) : (
                              <IconButton
                                aria-label="delete"
                                onClick={() => onToggleEditMode(item.id)}
                              >
                                <EditIcon />
                              </IconButton>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
              </TableBody>
            </Table>
          ) : (
            ''
          )}
        </div>
      </div>
    </>
  );
};
export default AuditReport;
