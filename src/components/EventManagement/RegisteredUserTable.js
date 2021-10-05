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
import Avatar from '@material-ui/core/Avatar';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {APP} from '../../utils/appConfig';
import CSVExport from '../CSVExport';
import Tooltip from '@material-ui/core/Tooltip';
import NoData from '../NoData';
import {checkForFalsy} from '../../utils/commonFunctions';
import ActiveButton from '../Utility/ActiveButton';

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

const headCells = [
  {
    label: 'S.No',
    id: 'index',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'Name',
    id: 'name',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'D.O.B',
    id: 'dob',
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
    label: 'City',
    id: 'city',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'Email',
    id: 'email',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'Mobile',
    id: 'mobileNumber',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'ActiveDays',
    id: 'daysActive',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'TotalKms',
    id: 'totalKms',
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
    label: 'RegOn',
    id: 'registrationDate',
    numeric: false,
    disablePadding: true,
  },
  // {
  //   label: 'Subscription Status',
  //   id: 'isSubscribed',
  //   numeric: false,
  //   disablePadding: true,
  // },
  {
    label: 'RegSource',
    id: 'registrationSource',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'Amount',
    id: 'paymentAmount',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'TrnStatus',
    id: 'paymentStatus',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'TrnID',
    id: 'paymentTxnId',
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
            style={{
              width: 'max-content',
              paddingLeft: headCell.id == 'index' ? 5 : 0,
            }}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
              style={{width: 'max-content'}}
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

export default function EnhancedTable({
  defaultRegisteredUserList,
  selectedEvent,
}) {
  const classes = useStyles();
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchText, setSearchText] = useState('');
  const [registeredUserList, setRegisteredUserList] = useState({data: []});
  const [isActive, setActive] = useState(true);

  useEffect(() => {
    setPage(0);
    setOrder('asc');
    setOrderBy('');
    setRowsPerPage(50);
    setSearchText('');
    setRegisteredUserList(
      isActive
        ? {
            ...defaultRegisteredUserList,
            data: defaultRegisteredUserList.data.filter(
              (val) => val.daysActive
            ),
          }
        : defaultRegisteredUserList
    );
  }, [defaultRegisteredUserList]);
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

  const getFilterData = (text) => {
    const filterData = defaultRegisteredUserList.data.filter((v) =>
      !checkForFalsy(v.aliasName)
        ? v.aliasName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        : v.name.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );
    setRegisteredUserList({data: filterData});
  };

  const handleActive = () => {
    if (isActive) {
      setActive(false);
      setRegisteredUserList(defaultRegisteredUserList);
    } else {
      setActive(true);
      setRegisteredUserList({
        data: defaultRegisteredUserList.data.filter((val) => val.daysActive),
      });
    }
  };
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <div style={{fontSize: 12, marginLeft: 10, marginTop: 10}}>
            {selectedEvent?.challengeName}
          </div>
          <div className="table-search-container">
            <input
              className="table-search"
              placeholder="Search by name"
              value={searchText}
              onChange={(e) => {
                setSearchText(e.target.value);
                if (e.target.value === '') {
                  setRegisteredUserList(defaultRegisteredUserList);
                  return;
                }
                getFilterData(e.target.value);
              }}
            />

            <div
              style={{
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <ActiveButton isActive={isActive} handleActive={handleActive} />
              {registeredUserList?.data?.length > 0 && (
                <Tooltip title="Export data">
                  <CSVExport
                    data={
                      registeredUserList?.data?.length > 0
                        ? registeredUserList?.data
                        : []
                    }
                    filename={`${selectedEvent?.challengeName}.csv`}
                    source="eventManagement"
                  />
                </Tooltip>
              )}
              <TablePagination
                rowsPerPageOptions={[50, 75, 100]}
                component="div"
                count={registeredUserList.data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
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
              {registeredUserList.loading ? (
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
              ) : registeredUserList.data.length > 0 ? (
                <>
                  {stableSort(
                    registeredUserList.data,
                    getComparator(order, orderBy)
                  )
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      return (
                        <TableRow
                          hover
                          tabIndex={-1}
                          key={row.mobileNumber}
                          className={
                            row.isSubscribed == 'SUBSCRIBED'
                              ? 'success-row'
                              : 'danger-row'
                          }
                        >
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {index + 1}
                            </div>
                          </TableCell>
                          <TableCell
                            component="th"
                            scope="row"
                            padding="none"
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: 12,
                                width: 'max-content',
                              }}
                            >
                              <Avatar
                                style={{width: 30, height: 30, marginRight: 5}}
                                src={row.avtarImg}
                                className="avatar-component"
                              />
                              <div style={{width: 'max-content'}}>
                                {row.name ? row.name : '-'}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.dob ? row.dob.split(' ')[0] : '-'}
                            </div>
                          </TableCell>

                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.gender ? row.gender : '-'}
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.city ? row.city : '-'}
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.email ? row.email : '-'}
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.mobileNumber ? row.mobileNumber : '-'}
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.daysActive ? row.daysActive : 0}
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.totalKms ? row.totalKms : 0}
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              <img
                                src={APP.dataSourceLogo[row.dataSource]}
                                style={{
                                  width: 30,
                                  height: 30,
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.registrationDate
                                ? row.registrationDate
                                : '-'}
                            </div>
                          </TableCell>

                          {/* <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.isSubscribed == 'SUBSCRIBED'
                                ? row.isSubscribed
                                : row.isUnSubscribed}
                            </div>
                          </TableCell> */}

                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              <img
                                src={
                                  APP.regSource[
                                    row.registrationSource &&
                                    row.registrationSource !== ''
                                      ? row.registrationSource
                                      : 'NOTSET'
                                  ]
                                }
                                style={{
                                  width: 30,
                                  height: 30,
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.paymentAmount ? row.paymentAmount : 0}
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.paymentStatus ? row.paymentStatus : '-'}
                            </div>
                          </TableCell>
                          <TableCell
                            align="center"
                            style={{padding: '5px 15px'}}
                          >
                            <div style={{fontSize: 12, width: 'max-content'}}>
                              {row.paymentTxnId ? row.paymentTxnId : '-'}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={16}
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
                      {registeredUserList.message === 'SUCCESS' ? (
                        'Data is not present'
                      ) : (
                        <NoData />
                      )}
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
