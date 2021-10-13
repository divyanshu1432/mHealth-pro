import React, {useState, useEffect} from 'react';
import clsx from 'clsx';
import {lighten, makeStyles, useTheme} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import FilterListIcon from '@material-ui/icons/FilterList';
import CircularProgress from '@material-ui/core/CircularProgress';
import Avatar from '@material-ui/core/Avatar';
import Popover from '@material-ui/core/Popover';
import LeaderBoardFilters from './LeaderBoardFilters';
import FirstPageIcon from '@material-ui/icons/FirstPage';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import LastPageIcon from '@material-ui/icons/LastPage';
import {pinUsersAction} from '../services/challengeApi';
import {APP} from '../utils/appConfig';
import CSVExport from './CSVExport';
import TableDataSourceCarousel from './TableDataSourceCarousel';
import ImageCarousel from './ImageCarousel';
import {checkForFalsy} from '../utils/commonFunctions';
import NoData from './NoData';
import ActiveButton from './Utility/ActiveButton';

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
      ? 'zzzzzzzzzzzzzzzz'
      : typeof a[orderBy] == 'string'
      ? a[orderBy]?.toLowerCase()
      : a[orderBy];
  let secondValue =
    b[orderBy] == null
      ? 'zzzzzzzzzzzzzzzz'
      : typeof b[orderBy] == 'string'
      ? b[orderBy]?.toLowerCase()
      : b[orderBy];
  let modifiedFirst =
    orderBy == 'userName'
      ? a['aliasName']
        ? a['aliasName']?.toLowerCase()
        : firstValue
      : firstValue;
  let modifiedSecond =
    orderBy == 'userName'
      ? b['aliasName']
        ? b['aliasName']?.toLowerCase()
        : secondValue
      : secondValue;
  if (modifiedSecond < modifiedFirst) {
    return -1;
  }
  if (modifiedSecond > modifiedFirst) {
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
    label: 'Rank',
    id: 'rank',
    numeric: true,
    disablePadding: true,
  },
  {
    label: 'Name',
    id: 'userName',
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
    label: 'Source',
    id: 'dataSource',
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
    label: 'Achievement',
    id: 'valueTillDate',
    numeric: false,
    disablePadding: true,
  },
  {
    label: 'Km',
    id: 'lastDistanceCovered',
    numeric: true,
    disablePadding: true,
  },

  // {
  //   label: "verification status",
  //   id: "lastDistanceCovered",
  //   numeric: true,
  //   disablePadding: true
  // },
  {
    label: 'Total Km',
    id: 'value',
    numeric: true,
    disablePadding: true,
  },
  {
    label: 'Average Km',
    id: 'averageDistanceCovered',
    numeric: true,
    disablePadding: true,
  },
  {
    label: 'Lead',
    id: 'leadBy',
    numeric: true,
    disablePadding: true,
  },
  {
    label: 'Active Days',
    id: 'totalParticipationDays',
    numeric: true,
    disablePadding: true,
  },
];

function EnhancedTableHead(props) {
  const {
    classes,
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    pinActive,
  } = props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {pinActive && (
          <TableCell padding="checkbox">
            <Checkbox
              inputProps={{'aria-label': 'select all desserts'}}
              disabled={true}
            />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'default'}
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

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: '#0277bd',
          border: '1px solid #f5f5f5',
        }
      : {
          color: '#0277bd',
          border: '1px solid #f5f5f5',
        },
  title: {
    flex: '1 1 100%',
  },
}));

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
    console.log(rowsPerPage);
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

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const {
    numSelected,
    leaderBoardData,
    setPinActive,
    pinActive,
    selected,
    setTableRowData,
    setFilters,
    filters,
    currentEvent,
  } = props;

  const [filterPopoverAnchorEl, setFilterPopoverAnchorEl] =
    React.useState(null);

  const handleFilterPopoverClick = (event) => {
    setFilterPopoverAnchorEl(event.currentTarget);
  };

  const handlefilterPopoverClose = () => {
    setFilterPopoverAnchorEl(null);
  };

  const filterPopoverOpen = Boolean(filterPopoverAnchorEl);
  const filterPopoverId = filterPopoverOpen ? 'simple-popover' : undefined;

  const handlePinSave = () => {
    setPinActive(false);
    let pinnedUsers = leaderBoardData['data']['rankWiseBoard']
      .filter((item) => selected.includes(item.rank))
      .map((item) => item.userId);
    let payload = {
      challangerZoneId: leaderBoardData.data.challengerZoneId,
      userIdsToPin: pinnedUsers,
    };
    pinUsersAction(payload);

    if (
      leaderBoardData['data']['rankWiseBoard'] &&
      leaderBoardData['data']['sessionUserRank']
    ) {
      setTableRowData([
        leaderBoardData['data']['sessionUserRank'],
        ...leaderBoardData['data']['rankWiseBoard'].filter(
          (item) =>
            pinnedUsers.includes(item.userId) &&
            item.userId !== leaderBoardData['data']['sessionUserRank']['userId']
        ),
        ...leaderBoardData['data']['rankWiseBoard'].filter(
          (item) =>
            !pinnedUsers.includes(item.userId) &&
            item.userId !== leaderBoardData['data']['sessionUserRank']['userId']
        ),
      ]);
    }
  };

  return (
    <>
      <Toolbar
        className={clsx(classes.root, {
          [classes.highlight]: pinActive,
        })}
      >
        {pinActive && currentEvent['id'] ? (
          <div className="leaderboard-table-title challenges-heading">
            {numSelected}/{`${currentEvent.pinnedUserCount} friends pinned`}
          </div>
        ) : (
          <div className="leaderboard-table-title challenges-heading">
            {currentEvent && currentEvent['challengeName']
              ? currentEvent['challengeName']
              : 'Table Title'}
            <span style={{marginLeft: 5, color: '#757575'}}>
              {currentEvent
                ? currentEvent['moderatorName']
                  ? `( Moderator : ${currentEvent['moderatorName']} ${
                      currentEvent['moderatorMobileNumber']
                        ? ' , ' + currentEvent['moderatorMobileNumber'] + ' )'
                        : ' )'
                    }`
                  : ''
                : ''}
            </span>
          </div>
        )}

        {pinActive && currentEvent['id'] ? (
          <button
            variant="contained"
            onClick={() => handlePinSave()}
            className="pin-users-save-button"
            style={{
              background: '#DCFCE7',
              color: '#166534',
              borderRadius: 2,
              height: 20,
            }}
          >
            SAVE
          </button>
        ) : (
          <div className="leaderboard-table-button-wrapper">
            {leaderBoardData?.data?.rankWiseBoard?.length > 0 &&
              currentEvent['id'] && (
                <Tooltip title="Export data">
                  <CSVExport
                    data={
                      leaderBoardData?.data?.rankWiseBoard?.length > 0
                        ? leaderBoardData?.data?.rankWiseBoard
                        : []
                    }
                    filename={`${leaderBoardData['data']['challengerZoneName']}.csv`}
                    source="dashboard"
                  />
                </Tooltip>
              )}
            {currentEvent['id'] && (
              <Tooltip title="Pin users">
                <button
                  style={{
                    height: 20,
                    background: '#E0E7FF',
                    color: '#4338CA',
                    borderRadius: 2,
                    width: 100,
                    marginLeft: 10,
                  }}
                  onClick={() => setPinActive(!pinActive)}
                >
                  Tag Friends
                </button>
              </Tooltip>
            )}
            {/* <Tooltip title="Filter list">
              <IconButton
                aria-label="filter list"
                style={{
                  width: 40,
                  marginLeft: 10,
                }}
                onClick={(event) => handleFilterPopoverClick(event)}
              >
                <FilterListIcon />
              </IconButton>
            </Tooltip> */}
          </div>
        )}
        <Popover
          id={filterPopoverId}
          open={filterPopoverOpen}
          anchorEl={filterPopoverAnchorEl}
          onClose={handlefilterPopoverClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <div>
            <LeaderBoardFilters
              setTableRowData={setTableRowData}
              leaderBoardData={leaderBoardData}
              setFilters={setFilters}
              filters={filters}
              handlefilterPopoverClose={handlefilterPopoverClose}
            />
          </div>
        </Popover>
      </Toolbar>
      {props.children}
    </>
  );
};

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
  leaderBoardData,
  currentEvent,
  challengeSwitch,
}) {
  const classes = useStyles();

  const [tableRowData, setTableRowData] = useState([]);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('');
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [pinActive, setPinActive] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    age: [0, 100],
    city: '',
    pinCode: '',
    state: '',
    activeDays: [0, 365],
  });
  const [isActive, setActive] = useState(true);

  const settingTableData = () => {
    if (leaderBoardData && leaderBoardData['data'] && currentEvent['id']) {
      let pinnedUsers = leaderBoardData['data']['pinUserRank']
        ? leaderBoardData['data']['pinUserRank'].map((item) => item.userId)
        : [];

      if (leaderBoardData['data']['rankWiseBoard']) {
        if (leaderBoardData['data']['sessionUserRank']) {
          let tableData = [
            leaderBoardData['data']['sessionUserRank'],
            ...leaderBoardData['data']['rankWiseBoard'].filter(
              (item) =>
                pinnedUsers.includes(item.userId) &&
                item.userId !==
                  leaderBoardData['data']['sessionUserRank']['userId']
            ),
            ...leaderBoardData['data']['rankWiseBoard'].filter((item) =>
              isActive
                ? !pinnedUsers.includes(item.userId) &&
                  item.userId !==
                    leaderBoardData['data']['sessionUserRank']['userId'] &&
                  item.totalParticipationDays > 0
                : !pinnedUsers.includes(item.userId) &&
                  item.userId !==
                    leaderBoardData['data']['sessionUserRank']['userId']
            ),
          ];
          setTableRowData(tableData);
        } else {
          let tableData = [
            ...leaderBoardData['data']['rankWiseBoard'].filter((item) =>
              pinnedUsers.includes(item.userId)
            ),
            ...leaderBoardData['data']['rankWiseBoard'].filter((item) =>
              isActive
                ? !pinnedUsers.includes(item.userId) &&
                  item.totalParticipationDays > 0
                : !pinnedUsers.includes(item.userId)
            ),
          ];

          setTableRowData(tableData);
        }
      }

      if (leaderBoardData['data']['pinUserRank']) {
        setSelected(
          leaderBoardData['data']['pinUserRank'].map((item) => item.rank)
        );
      }
    }
  };
  useEffect(() => {
    setPinActive(false);
    setSelected([]);
    settingTableData();
  }, [leaderBoardData]);

  useEffect(() => {
    settingTableData();
  }, [isActive]);

  useEffect(() => {
    if (challengeSwitch) {
      setActive(challengeSwitch == 'upcoming' ? false : true);
    }
  }, [challengeSwitch]);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleClick = (event, rank) => {
    if (
      selected.length < currentEvent.pinnedUserCount ||
      selected.includes(rank)
    ) {
      const selectedIndex = selected.indexOf(rank);
      let newSelected = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, rank);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }
      if (
        leaderBoardData['data'] &&
        leaderBoardData['data']['sessionUserRank']
      ) {
        if (leaderBoardData['data']['sessionUserRank']['rank'] !== rank) {
          setSelected(newSelected);
        }
      } else {
        setSelected(newSelected);
      }
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedUserData, setSelectedUserData] = React.useState(undefined);

  const handleDataSrcClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setSelectedUserData(undefined);
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  const [showCarousel, setShowCarousel] = useState(false);
  const [searchText, setSearchText] = useState('');

  const getFilterData = () => {
    const filterData = leaderBoardData.data.rankWiseBoard.filter((v) =>
      !checkForFalsy(v.aliasName)
        ? v.aliasName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
        : v.userName.toLowerCase().indexOf(searchText.toLowerCase()) !== -1
    );
    setTableRowData(filterData);
  };

  const getStatusImg = (url) => {
    return (
      <div style={{width: 30}}>
        <img src={url} width={'100%'} />
      </div>
    );
  };

  return (
    <div className={classes.root} style={{display: 'flex'}}>
      <Paper className={classes.paper}>
        <TableContainer>
          <EnhancedTableToolbar
            numSelected={selected.length}
            leaderBoardData={leaderBoardData}
            setPinActive={setPinActive}
            pinActive={pinActive}
            selected={selected}
            setTableRowData={setTableRowData}
            setFilters={setFilters}
            filters={filters}
            currentEvent={currentEvent}
          >
            <div className="table-search-container">
              <input
                className="table-search"
                placeholder="Search by name"
                onChange={(e) => {
                  if (e.target.value === '') {
                    settingTableData();
                    return;
                  }
                  setSearchText(e.target.value);
                  getFilterData();
                }}
              />
              <div className="d-flex a-i-center">
                <ActiveButton
                  isActive={isActive}
                  handleActive={() => {
                    setActive((isActive) => !isActive);
                  }}
                />
                <TablePagination
                  rowsPerPageOptions={[25, 50, 75, 100]}
                  component="div"
                  count={tableRowData.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onChangePage={handleChangePage}
                  onChangeRowsPerPage={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </div>
            </div>
          </EnhancedTableToolbar>

          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={'small'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
              rowCount={tableRowData.length}
              pinActive={pinActive}
            />

            <TableBody>
              {leaderBoardData.loading ? (
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
              ) : tableRowData.length > 0 && currentEvent['id'] ? (
                <>
                  {stableSort(tableRowData, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row, index) => {
                      const isItemSelected = isSelected(row.rank);
                      const labelId = `enhanced-table-checkbox-${index}`;

                      return (
                        <TableRow
                          hover
                          onClick={(event) => {
                            if (pinActive) {
                              handleClick(event, row.rank);
                            }
                          }}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.rank + '' + index}
                          selected={isItemSelected}
                          style={
                            leaderBoardData['data'] &&
                            leaderBoardData['data']['sessionUserRank'] &&
                            row.rank ==
                              leaderBoardData['data']['sessionUserRank']['rank']
                              ? {background: '#e8f5e9'}
                              : isItemSelected
                              ? {
                                  backgroundColor: '#e0f2fe',
                                }
                              : {}
                          }
                        >
                          {pinActive && (
                            <TableCell padding="checkbox">
                              <Checkbox
                                onClick={(event) =>
                                  handleClick(event, row.rank)
                                }
                                checked={isItemSelected}
                                inputProps={{'aria-labelledby': labelId}}
                                disabled={
                                  leaderBoardData['data'] &&
                                  leaderBoardData['data']['sessionUserRank'] &&
                                  row.rank ==
                                    leaderBoardData['data']['sessionUserRank'][
                                      'rank'
                                    ]
                                }
                              />
                            </TableCell>
                          )}
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="none"
                            align="center"
                          >
                            <div style={{fontSize: 12}}>
                              {row.rank ? row.rank : '-'}
                            </div>
                          </TableCell>

                          <TableCell align="center">
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: 12,
                                justifyContent: 'space-between',
                                width: '100%',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                }}
                              >
                                <Avatar
                                  style={{
                                    width: 30,
                                    height: 30,
                                    marginRight: 5,
                                  }}
                                  src={row.avtarImg}
                                  className="avatar-component"
                                />
                                <div style={{width: 'max-content'}}>
                                  {row.aliasName
                                    ? row.aliasName
                                    : row.userName
                                    ? row.userName
                                    : '-'}
                                </div>
                              </div>
                              <div>
                                <div style={{marginLeft: '0.75em'}}>
                                  {row.toolTipMessage && (
                                    <Tooltip
                                      title={row.toolTipMessage}
                                      aria-label={row.toolTipMessage}
                                      placement="top"
                                    >
                                      {row.statusImageUrl &&
                                        getStatusImg(row.statusImageUrl)}
                                    </Tooltip>
                                  )}
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>
                              {row.gender ? row.gender : '-'}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>
                              {row.city ? row.city : '-'}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div
                              style={{
                                fontSize: 12,
                                cursor:
                                  (row.dataSource === 'WHATSAPP' ||
                                    row.dataSource === 'WEB') &&
                                  row?.whatsappImageDataSet?.length > 0
                                    ? 'pointer'
                                    : 'default',
                              }}
                              aria-describedby={id}
                              onClick={(e) => {
                                if (
                                  (row.dataSource === 'WHATSAPP' ||
                                    row.dataSource === 'WEB') &&
                                  row?.whatsappImageDataSet?.length > 0
                                ) {
                                  setSelectedUserData(row);
                                  handleDataSrcClick(e);
                                }
                              }}
                            >
                              <img
                                src={
                                  (console.log('jhfefbefe', APP),
                                  row.dataSource
                                    ? APP.dataSourceLogo[row.dataSource]
                                    : 'https://walkathon21.s3.ap-south-1.amazonaws.com/logo/NotSet.svg')
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
                              {row.valueTillDate ? row.valueTillDate : '-'}
                            </div>
                          </TableCell>

                          <TableCell align="center">
                            <div style={{fontSize: 12}}>
                              <img
                                style={{
                                  width: 40,
                                  height: 40,
                                }}
                                src="https://walkathon21.s3.ap-south-1.amazonaws.com/logo/Distance/D_14K_Colour_20210930.png"
                              />
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div
                              style={{
                                fontSize: 12,
                                display: 'flex',
                                justifyContent: 'space-between',
                              }}
                            >
                              {row.lastDistanceCovered
                                ? row.lastDistanceCovered.toFixed(2)
                                : '0'}
                              {row.verificationImage ? (
                                <img
                                  title="Verified"
                                  src={row.verificationImage}
                                  style={{
                                    marginTop: -7,
                                    height: 30,
                                    width: 30,
                                    marginLeft: 10,
                                  }}
                                />
                              ) : (
                                ''
                              )}
                            </div>
                          </TableCell>

                          <TableCell align="center">
                            <div style={{fontSize: 12}}>
                              {row.value ? row.value.toFixed(2) : '0'}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{fontSize: 12, width: '50px'}}>
                              {row.averageDistanceCovered
                                ? row.averageDistanceCovered.toFixed(2)
                                : '0'}
                            </div>
                          </TableCell>
                          <TableCell align="center">
                            <div style={{fontSize: 12}}>
                              {row.leadBy ? row.leadBy : ''}
                            </div>
                          </TableCell>
                          <TableCell align="center" style={{maxWidth: '50px'}}>
                            <div style={{fontSize: 12, maxWidth: '50px'}}>
                              {row.totalParticipationDays
                                ? row.totalParticipationDays
                                : '0'}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </>
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={pinActive ? 11 : 10}
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
                      {leaderBoardData.message === 'SUCCESS' ? (
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
      <TableDataSourceCarousel
        {...{
          id,
          open,
          anchorEl,
          handleClose,
          selectedUserData,
        }}
      >
        {open &&
          selectedUserData &&
          selectedUserData.whatsappImageDataSet.length !== 0 && (
            <ImageCarousel {...{selectedUserData}} />
          )}
      </TableDataSourceCarousel>
    </div>
  );
}
