import React, { useState, useEffect } from "react";
import { lighten, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TextField from "@material-ui/core/TextField";
import { Modal } from "react-responsive-modal";
import CancelIcon from "@material-ui/icons/Cancel";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
import CSVExport from "../CSVExport";
import Tooltip from "@material-ui/core/Tooltip";
import NoData from "../NoData";
import ActiveButton from "../Utility/ActiveButton";
import AddIcon from "@material-ui/icons/Add";
import { Edit } from "react-feather";
import axios from "axios";
import {
  urlPrefix,
  secretToken,
  uploadImage,
  renderMemberList,
  createorupdateteam,
  renderTeamList,
  teamLeaderBoardData,
  activeUserInTeam,
  validateUser
} from "../../services/apicollection";
import { APP } from "../../utils/appConfig";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
// import Avatar from '@material-ui/core/Avatar';
import ImageIcon from "@material-ui/icons/Image";
import WorkIcon from "@material-ui/icons/Work";
import BeachAccessIcon from "@material-ui/icons/BeachAccess";
import { makeStyles } from "@material-ui/core/styles";
import Checkbox from "@material-ui/core/Checkbox";
import { useAsync } from "react-use";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import VisibilityOutlinedIcon from "@material-ui/icons/VisibilityOutlined";

// import "./Team.css";

const CreateTeam = (props) => {
  const [memberlist, setmemberlist] = useState([]);
  const [teamname, setTeamName] = useState([]);
  const [eventname, seteventname] = useState(props.eventId);
  const [open, setOpen] = useState(false);
  const [joinModal, setjoinModal] = useState(false);
  const onjoinModal = () => {
    setjoinModal(true);
  };
  const onclosejoinModal = () => {
    setjoinModal(false);
  };
  const onCloseModal = () => {
    setOpen(false);
    seterr();
  };
  const onOpenModal = () => {
    setOpen(true);
  };
  const [openMember, closeMember] = useState(false);
  const onCloseMemberModal = () => {
    closeMember(false),
      setlistarray([]),
      setupdateerr(""),
      setregUser([]),
      setinActiveErr("");
  };
  const onOpenMemberModal = () => {
    closeMember(true), registeredUser();
  };
  const [id, setId] = useState();
  const [JoinId, setJoinId] = useState();
  // const x = teamname[0];
  // if (x != undefined) {
  //   setId(x.id); hyb e
  // }
  const [mod, setMod] = useState({});
  const [checkMemberlist, setCheckmemberList] = useState([]);
  const [listarray, setlistarray] = useState([]);
  const [teamId, setteamId] = useState();
  const [LeaderId, setLeaderId] = useState();
  const [updateerr, setupdateerr] = useState("");
  const [editId, seteditId] = useState();
  const [editTeam, seteditTeam] = useState({});
  const [updateTeam, setupdateTeam] = useState(false);
  const [LeaderboardData, setLeaderboardData] = useState([]);
  const [regUser, setregUser] = useState([]);
  const [isAdmin, setisAdmin] = useState(false);
  const [inActive, setinActive] = useState();
  const [inActiveErr, setinActiveErr] = useState("");
  const [userList, setuserList] = useState([]);
  const [userListModal, setuserListModal] = useState(false);
  const [highlightRow, sethighlightRow] = useState({ background: "#e0f2fe" });
  const [highlight, sethighlight] = useState({ background: "transparent" });
  const [team, setteam] = useState("");
  const [teamImg, setteamImg] = useState("");
  const [sessionteamRank, setsessionteamRank] = useState({});
  const [maxteamMember, setmaxteamMember] = useState();
  const [TL, setTL] = useState();
  const [activeInTeam, setactiveInTeam] = useState();
  const openUserListModal = () => {
    setuserListModal(true);
  };
  console.warn(maxteamMember, "members");
  const closeUserListModal = () => {
    setuserListModal(false);
  };
  const closeUpdateTeam = () => {
    setupdateTeam(false);
  };
  const openUpdateTeam = () => {
    setupdateTeam(true);
  };

  const handelchange = (event) => {
    const { name, value } = event.target;

    seteditTeam((prestate) => {
      prestate;
      return {
        ...prestate,
        [name]: value
      };
    });
  };
  const [editImg, seteditImg] = useState("");

  const getTeamdata = (id) => {
    if (teamname) {
      var marvelHeroes = teamname.filter(function (hero) {
        const x = hero.id == id;
        return x;
      });

      seteditTeam(marvelHeroes[0]);
      // {
      //   editTeam && seteditImg(editTeam.teamLogo);
      // }
    }

    // const a = editTeam
  };

  console.warn(editImg);
  // (teamname);

  useEffect(() => {
    setCheckmemberList(memberlist);
  }, []);

  console.log(editImg, "image");
  const getTeam = () => {
    setTeamName([]);
    const URL = `${urlPrefix}${renderTeamList}?challengerZoneId=${props.eventId}`;
    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          timeStamp: "timestamp",
          accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          withCredentials: true,
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers":
            "accept, content-type, x-access-token, x-requested-with"
        }
      })
      .then((res) => {
        if (res.data.response.responseData) {
          setTeamName(res.data.response.responseData);
          setId(res.data.response.responseData[0].id);
        } else {
          setTeamName([]);
          setId();
        }
      });
  };
  // useEffect(() => {
  const getLeaderBoardData = () => {
    const URL = `${urlPrefix}${teamLeaderBoardData}?challengerZoneId=${props.eventId}`;
    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          timeStamp: "timestamp",
          accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          withCredentials: true,
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers":
            "accept, content-type, x-access-token, x-requested-with"
        }
      })
      .then((res) => {
        // setLeaderboardData(res.data.response.responseData);
        if (res.data.response.responseData) {
          setLeaderboardData(
            res.data.response.responseData.teamAndUserLeaderBoard[0]
              .rankWiseTeamLeaderBoard
          );
          setmaxteamMember(res.data.response.responseData.eventMaxMember);
          setactiveInTeam(res.data.response.responseData.active);
          setsessionteamRank(
            res.data.response.responseData.teamAndUserLeaderBoard[0]
              .sessionUserTeamRank
          );
        } else {
          setLeaderboardData([]);
          setsessionteamRank([]);
        }
      });
  };

  sessionteamRank;
  // }, []);

  function descendingComparator(a, b, orderBy) {
    let firstValue =
      a[orderBy] == null
        ? "zzzzzzzzzzzz"
        : typeof a[orderBy] == "string"
        ? a[orderBy]?.toLowerCase()
        : a[orderBy];
    let secondValue =
      b[orderBy] == null
        ? "zzzzzzzzzzzz"
        : typeof b[orderBy] == "string"
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
    return order === "desc"
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

  const getmemberlist = () => {
    const URL = `${urlPrefix}${renderMemberList}?challengerZoneId=${props.eventId}`;
    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          timeStamp: "timestamp",
          accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          withCredentials: true,
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers":
            "accept, content-type, x-access-token, x-requested-with"
        }
      })
      .then((res) => {
        // window.val={
        const a = res.data.response.responseData;
        if (a) {
          const f = a.sort(function (a, b) {
            if (a.name.toLowerCase() < b.name.toLowerCase()) {
              return -1;
            }
            if (a.name.toLowerCase() > b.name.toLowerCase()) {
              return 1;
            }
            return 0;
          });
          setmemberlist(f);
        } else {
          setmemberlist([]);
        } // const unique =  [...new Set(list.map((item) => [item['userId'] , item])).values()];
      });
  };

  const getAdmin = () => {
    const adminurl = `${urlPrefix}clients/getAllEvents?others=all&userId=${localStorage.getItem(
      "userId"
    )}`;
    return axios
      .get(adminurl, {
        headers: {
          Authorization: `Bearer ${secretToken}`,
          timeStamp: "timestamp",
          accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          withCredentials: true,
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers":
            "accept, content-type, x-access-token, x-requested-with"
        }
      })
      .then((res) => {
        const y = res.data.response.responseData.events;

        var marvelHeroes = y.filter(function (hero) {
          const x = hero.id == `${props.eventId}`;
          return x;
        });
        setMod(marvelHeroes[0]);
        setisAdmin(res.data.response.responseData.isAdmin);
        // window.val={
        // const unique =  [...new Set(list.map((item) => [item['userId'] , item])).values()];
      });
  };

  const registeredUser = () => {
    // setId(val);
    const URL = `${urlPrefix}${activeUserInTeam}?challengerZoneId=${props.eventId}&teamId=${id}`;
    return axios
      .get(URL, {
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
          timeStamp: "timestamp",
          accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          withCredentials: true,
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers":
            "accept, content-type, x-access-token, x-requested-with"
        }
      })
      .then((res) => {
        setregUser(res.data.response.responseData);
      });
  };
  useEffect(() => {
    registeredUser();
  }, [id]);

  useEffect(() => {
    getAdmin();
    seteventname(props.eventId);
    getTeam();
    getLeaderBoardData();
    getmemberlist();
    listarray;
  }, [props.eventId]);

  const [imgname, setimgname] = useState("");
  const [err, seterr] = useState();
  const [alldata, setalldata] = useState({});
  const [teamdetail, setteamdetails] = useState({
    eventname: "",
    team_name: "",
    teamlogo: "",
    teamtagline: ""
  });

  const handleteam = (event) => {
    const { name, value } = event.target;
    // (name , value);
    setteamdetails((preval) => {
      return {
        ...preval,
        [name]: value
      };
    });
  };

  const editFile = (event) => {
    if (event.target.files) {
      const { files } = event.target;
      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append("media", files[0]);

        axios
          .post(`${urlPrefix}${uploadImage}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              timeStamp: "timestamp",
              accept: "*/*",
              "Content-type": "multipart/form-data; boundary=???"
            }
          })
          .then((res) => {
            message.success("Success");

            seteditImg(res.data.response.responseData.image);
          })
          .catch((err) => {
            message.error("Try Again");
          });
      }
    }
  };

  const onFileChange = (event) => {
    if (event.target.files) {
      const { files } = event.target;
      if (files && files.length > 0) {
        const formData = new FormData();
        formData.append("media", files[0]);

        axios
          .post(`${urlPrefix}${uploadImage}`, formData, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              timeStamp: "timestamp",
              accept: "*/*",
              "Content-type": "multipart/form-data; boundary=???"
            }
          })
          .then((res) => {
            message.success("Success");

            setimgname(res.data.response.responseData.image);
          })
          .catch((err) => {
            message.error("Try Again");
          });
      }
    }
  };

  const savedata = (e) => {
    e.preventDefault();

    let payload = {};
    payload = {
      id: null,
      eventId: props.eventId,
      teamName: teamdetail.team_name,
      teamLogo: imgname,
      teamTagLine: teamdetail.teamtagline
    };

    const url = `${urlPrefix}${createorupdateteam}`;

    if (
      payload.teamName != "" &&
      payload.teamTagLine != "" &&
      payload.teamLogo != ""
    ) {
      axios
        .post(url, payload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            timeStamp: "timestamp",
            accept: "*/*",
            "Access-Control-Allow-Origin": "*",
            withCredentials: true,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
            "Access-Control-Allow-Headers":
              "accept, content-type, x-access-token, x-requested-with"
          }
        })
        .then((res) => {
          seterr(res.data.response.responseMessage);
          window.data = res.data.response.responseMessage;
          getTeam();
          getLeaderBoardData();
        })
        .catch((err) => {
          seterr(err.data.response.responseMessage);
          window.data = err.data.response.responseMessage;
        });
    } else {
      seterr("please fill required fields");
    }
  };

  const updateTeamData = (e) => {
    e.preventDefault();
    console.log(typeof editImg, "typeof");
    let updatepayload = {};
    if (editImg == "") {
      updatepayload = {
        id: editTeam.id,
        eventId: editTeam.challengerzoneId,
        teamName: editTeam.teamName,
        teamLogo: editTeam.teamLogo,
        teamTagLine: editTeam.tagLine
      };
    } else {
      updatepayload = {
        id: editTeam.id,
        eventId: editTeam.challengerzoneId,
        teamName: editTeam.teamName,
        teamLogo: editImg,
        teamTagLine: editTeam.tagLine
      };
    }

    const url = `${urlPrefix}${createorupdateteam}`;
    axios
      .post(url, updatepayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          timeStamp: "timestamp",
          accept: "*/*",
          "Access-Control-Allow-Origin": "*",
          withCredentials: true,
          "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
          "Access-Control-Allow-Headers":
            "accept, content-type, x-access-token, x-requested-with"
        }
      })
      .then((res) => {
        seterr(res.data.response.responseMessage);
        window.data = res.data.response.responseMessage;
        setlistarray([]);
        setmemberlist([]);
        getmemberlist();
        getTeam();
        registeredUser(id);
        setinActiveErr("");
        getLeaderBoardData();
        seteditImg("");
      })
      .catch((err) => {
        seterr(err.data.response.responseMessage);
        window.data = err.data.response.responseMessage;
      });
  };

  teamname, "hgtghgbtb";
  const useStyles1 = makeStyles((theme) => ({
    root: {
      flexShrink: 0,
      marginLeft: theme.spacing(2.5)
    }
  }));

  function FacebookCircularProgress(props) {
    const useStylesFacebook = makeStyles((theme) => ({
      root: {
        position: "absolute",
        left: "50%",
        top: "50%"
      },
      bottom: {
        color: theme.palette.grey[theme.palette.type === "light" ? 200 : 700]
      },
      top: {
        color: "#1a90ff",
        animationDuration: "550ms",
        position: "absolute",
        left: 0
      },
      circle: {
        strokeLinecap: "round"
      }
    }));
    const classes = useStylesFacebook();

    return (
      <div className={classes.root}>
        <CircularProgress
          variant='determinate'
          className={classes.bottom}
          size={20}
          thickness={4}
          {...props}
          value={100}
        />
        <CircularProgress
          variant='indeterminate'
          disableShrink
          className={classes.top}
          classes={{
            circle: classes.circle
          }}
          size={20}
          thickness={4}
          {...props}
        />
      </div>
    );
  }

  // (sessionteamRank, "efheru");

  const existTeam = () => {
    return (
      <>
        <div
          className='member'
          style={{
            height: 300,
            top: 500,
            overflow: "auto",
            scrollBehavior: "smooth"
          }}
        >
          {/* <p style={{ marginTop: 50, fontSize: 12, color: "red" }}>
                Teams already exist in this event
              </p> */}
          {teamname != undefined ? (
            <Table
              style={{ width: 600, fontSize: 12, marginTop: 20 }}
              className={classes.root}
              aria-labelledby='tableTitle'
              size={"small"}
              aria-label='enhanced table'
            >
              <TableHead>
                <TableRow style={{ background: "#e6e4e1" }}>
                  <TableCell align='center'>Team logo</TableCell>
                  <TableCell align='center'>Team name</TableCell>
                  <TableCell align='center'>Tagline</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teamname &&
                  teamname.map((curelem, index) => {
                    return (
                      <>
                        <TableRow>
                          <TableCell align='center'>
                            <div>
                              {" "}
                              <img
                                src={curelem.teamLogo}
                                style={{
                                  height: 30,
                                  width: 30,
                                  borderRadius: "100%"
                                }}
                              />
                            </div>
                          </TableCell>
                          <TableCell align='center'>
                            <div style={{ fontSize: 12 }}>
                              {" "}
                              <label>{curelem.teamName}</label>
                            </div>
                          </TableCell>
                          <TableCell align='center'>
                            <div style={{ fontSize: 12 }}>
                              {" "}
                              <label>{curelem.tagLine}</label>
                            </div>
                          </TableCell>
                        </TableRow>
                      </>
                    );
                  })}
              </TableBody>
            </Table>
          ) : (
            <>
              <div
                style={{
                  height: 400,
                  padding: "5px",
                  marginTop: 0,
                  width: 500,
                  display: "flex",
                  flexDirection: "column",
                  fontSize: 12,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  bottom: 50
                }}
                className=''
              >
                {" "}
                <img
                  style={{ width: 200, height: 200 }}
                  src='https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg'
                />
                NO TEAM
              </div>{" "}
            </>
          )}
        </div>
      </>
    );
  };

  const topUser = (name, img) => {
    setteam(name);
    setteamImg(img);
    setuserList(sessionteamRank.usersList);
  };

  const leaderBoardUser = (name, img) => {
    setteam(name);
    setteamImg(img);
    var marvelHeroes = LeaderboardData.filter(function (hero) {
      const x = hero.teamName == name;
      return x;
    });
    setuserList(marvelHeroes[0].usersList);
  };

  function TablePaginationActions(props) {
    const classes = useStyles1();
    const theme = useTheme();
    const { count, page, rowsPerPage, onChangePage } = props;

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
      <div className={classes.root} style={{ display: "flex" }}>
        <IconButton
          onClick={handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label='first page'
          style={{ width: 30, padding: 0 }}
        >
          {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
        </IconButton>
        <IconButton
          onClick={handleBackButtonClick}
          disabled={page === 0}
          aria-label='previous page'
          style={{ width: 30, padding: 0 }}
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowRight />
          ) : (
            <KeyboardArrowLeft />
          )}
        </IconButton>
        <IconButton
          onClick={handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='next page'
          style={{ width: 30, padding: 0 }}
        >
          {theme.direction === "rtl" ? (
            <KeyboardArrowLeft />
          ) : (
            <KeyboardArrowRight />
          )}
        </IconButton>
        <IconButton
          onClick={handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label='last page'
          style={{ width: 30, padding: 0 }}
        >
          {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
        </IconButton>
      </div>
    );
  }

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(3)
    },
    button: {
      margin: theme.spacing(1, 1, 0, 0)
    },
    root: {
      width: "100%"
      // border: "1px solid black"
    },
    paper: {
      width: "100%",
      marginBottom: theme.spacing(2)
    },
    table: {
      minWidth: 750
    },
    visuallyHidden: {
      border: 0,
      clip: "rect(0 0 0 0)",
      height: 1,
      margin: -1,
      overflow: "hidden",
      padding: 0,
      position: "absolute",
      top: 20,
      width: 1
    }
  }));

  const submitTeam = () => {
    // (listarray);
    let teampayload = {};
    if (TL == "") {
      teampayload = {
        // id:null,
        challengerZoneId: props.eventId,
        teamId: parseInt(teamId),
        teamLeaderId: parseInt(LeaderId),
        teamMembersList: listarray
      };
    } else {
      teampayload = {
        // id:null,
        challengerZoneId: props.eventId,
        teamId: parseInt(teamId),
        teamLeaderId: parseInt(TL),
        teamMembersList: listarray
      };
    }

    if (listarray.includes(parseInt(LeaderId)) || LeaderId == null) {
      const url = `${urlPrefix}v1.0/addRegisteredUsersInTeam`;
      axios
        .post(url, teampayload, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            timeStamp: "timestamp",
            accept: "*/*",
            "Access-Control-Allow-Origin": "*",
            withCredentials: true,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
            "Access-Control-Allow-Headers":
              "accept, content-type, x-access-token, x-requested-with"
          }
        })
        .then((res) => {
          // alert('updated')
          setupdateerr(res.data.response.responseMessage);
          window.data = res.data.response.responseMessage;
          setlistarray([]);
          setmemberlist([]);
          getmemberlist();
          registeredUser(id);
          setinActiveErr("");
          getLeaderBoardData();
          setLeaderId();
        })
        .catch((err) => {
          setupdateerr(err.data.response.responseMessage);
          window.data = err.data.response.responseMessage;
        });
    } else {
      setupdateerr("TL must be in team");
    }
  };

  const teamJoinData = (name, img, id) => {
    setteam(name);
    setteamImg(img);
    setJoinId(id);
  };

  console.warn(team, teamImg, JoinId);
  const removemember = () => {
    const inActiveMember = `${urlPrefix}v1.0/inactiveUserFromTeam?challengerZoneId=${props.eventId}&teamId=${teamId}&userId=${inActive}`;
    axios
      .put(
        inActiveMember,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            timeStamp: "timestamp",
            accept: "*/*",
            "Access-Control-Allow-Origin": "*",
            withCredentials: true,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
            "Access-Control-Allow-Headers":
              "accept, content-type, x-access-token, x-requested-with"
          }
        }
      )
      .then((res) => {
        // alert('updated')
        setinActiveErr(res.data.response.responseMessage);
        // window.data = res.data.response.responseMessage;
        registeredUser(id);
        setupdateerr();
        getmemberlist();
        // (res);
      })
      .catch((err) => {
        // (err);
        // setinActiveErr(err.data.response.responseMessage);
        // window.data = err.data.response.responseMessage;
      });
  };

  const listarr = [];

  const handle = (e) => {
    const { name, checked } = e.target;
    if (checked) {
      listarray.push(parseInt(name));
    } else {
      function arrayRemove(listarray, value) {
        return listarray.filter(function (ele) {
          return ele != value;
        });
      }
      const result = arrayRemove(listarray, name);
      setlistarray(result);
    }
    console.log("listarray", listarray);
  };

  const handleInactive = (event) => {
    const { name, value } = event.target;
    setinActive(value);
    setTL(value);
    listarray.push(value);
    if (listarray.length > 1) {
      listarray.shift(value);
    }
  };
  console.log(listarray, TL);
  // (inActive);
  const selectTeam = (event) => {
    const { name, value } = event.target;
    setteamId(value);
    setId(value);
  };

  const selectLeader = (event) => {
    const { name, value } = event.target;
    setLeaderId(value);
  };

  const useStyles2 = makeStyles((theme) => ({
    root: {
      width: "100%",
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper
    }
  }));

  const list_class = useStyles2();

  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [searchText, setSearchText] = useState("");
  const [registeredUserList, setRegisteredUserList] = useState(LeaderboardData);
  const [isActive, setIsActive] = useState(true);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const closeIcon = (
    <svg fill='white' viewBox='0 0 20 20' width={28} height={28}>
      <path
        fillRule='evenodd'
        d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z'
        clipRule='evenodd'
      ></path>
    </svg>
  );

  const teamHeads = [
    {
      label: "Rank",
      id: "rank",
      numeric: false,
      disablePadding: true
    },
    {
      label: "Team",
      id: "teamName",
      numeric: false,
      disablePadding: true
    },
    {
      label: "Members",
      id: "totalMember",
      numeric: false,
      disablePadding: true
    },

    // {
    //   label: "Gender",
    //   id: "experience",
    //   numeric: false,
    //   disablePadding: true
    // },

    // {
    //   label: "City",
    //   id: "specialization",
    //   numeric: false,
    //   disablePadding: true
    // },
    // {
    //   label: "Source",
    //   id: "phonenumber",
    //   numeric: false,
    //   disablePadding: true
    // },

    {
      label: "Date",
      id: "currentDate",
      numeric: false,
      disablePadding: true
    },
    // {
    //   label: "km",
    //   id: "language",
    //   numeric: false,
    //   disablePadding: true
    // },
    {
      label: "Today (km)",
      id: "todayContributionKM",
      numeric: false,
      disablePadding: true
    },
    {
      label: "Total km",
      id: "teamTotalKm",
      numeric: false,
      disablePadding: true
    },
    {
      label: "Average",
      id: "teamAverage",
      numeric: false,
      disablePadding: true
    },
    {
      label: "Active Days",
      id: "teamActiveDay",
      numeric: false,
      disablePadding: true
    },
    {
      label: "Details",
      id: "userstatus",
      numeric: false,
      disablePadding: true
    }
    // {
    //   label: "Action",
    //   id: "userstatus",
    //   numeric: false,
    //   disablePadding: true
    // }
  ];

  const joinTeam = (id) => {
    const url = `${urlPrefix}v1.0/joinTeamByUser?challengerZoneId=${props.eventId}&teamId=${id}`;
    axios
      .post(
        url,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            timeStamp: "timestamp",
            accept: "*/*",
            "Access-Control-Allow-Origin": "*",
            withCredentials: true,
            "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,OPTIONS",
            "Access-Control-Allow-Headers":
              "accept, content-type, x-access-token, x-requested-with"
          }
        }
      )
      .then((res) => {
        getLeaderBoardData();
        onclosejoinModal();
      });
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // function coach(props)
  const EnhancedTableHead = (prop) => {
    const { classes, order, orderBy, onRequestSort } = prop;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      // <Paper className={classes.paper}>
      <TableHead>
        <TableRow>
          {teamHeads.map((teamHead) => (
            <TableCell
              key={teamHead.id}
              align='center'
              padding='none'
              sortDirection={orderBy === teamHead.id ? order : false}
              style={{
                width: "max-content",
                paddingLeft: teamHead.id == "index" ? 5 : 0
              }}
            >
              <TableSortLabel
                active={orderBy === teamHead.id}
                direction={orderBy === teamHead.id ? order : "asc"}
                onClick={createSortHandler(teamHead.id)}
                style={{ width: "max-content" }}
              >
                {teamHead.label}
                {orderBy === teamHead.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "desc"
                      ? "sorted descending"
                      : "sorted ascending"}
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
      {editTeam ? (
        <Modal
          open={updateTeam}
          styles={{ modal: { borderRadius: "10px", maxWidth: "900px" } }}
          onClose={closeUpdateTeam}
          center
          closeIcon={closeIcon}
        >
          <CancelIcon
            style={{
              position: "absolute",
              top: 15,
              right: 15,
              color: "#ef5350",
              cursor: "pointer"
            }}
          />

          <div style={{ padding: 10, paddingRight: 50, paddingLeft: 50 }}>
            <form>
              <div className='Image'>
                <img
                  src={editTeam.teamLogo}
                  style={{ width: 100, height: 100, borderRadius: 100 }}
                />
                <label for='editimg'>
                  {" "}
                  <Edit
                    size={12}
                    style={{
                      marginLeft: -25,
                      marginTop: -15,
                      color: "#069b3f",
                      cursor: "pointer"
                    }}
                  />{" "}
                </label>
              </div>
              <div
                className='form-group'
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 30
                }}
              >
                <input
                  onChange={(e) => {
                    editFile(e);
                  }}
                  name='teamLogo'
                  type='file'
                  id='editimg'
                  style={{ fontSize: 12, display: "none" }}
                />
                <label> Team name </label>
                <input
                  type='text'
                  onChange={handelchange}
                  style={{ fontSize: 12 }}
                  value={editTeam.teamName}
                  name='teamName'
                />
              </div>

              <div
                className='form-group'
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: 30
                }}
              >
                <label> Team Tagline </label>
                <input
                  style={{ fontSize: 12 }}
                  type='text'
                  onChange={handelchange}
                  value={editTeam.tagLine}
                  name='tagLine'
                />
              </div>

              <button
                onClick={updateTeamData}
                style={{
                  background: "green",
                  color: "white",
                  height: 25,
                  width: 100,
                  marginTop: 30,
                  marginLeft: 50
                }}
              >
                Update
              </button>
            </form>
          </div>
        </Modal>
      ) : (
        <></>
      )}

      <Modal
        open={openMember}
        styles={{
          modal: {
            borderRadius: "10px",
            height: 500,
            maxWidth: 1200
          }
        }}
        onClose={onCloseMemberModal}
        center
        closeIcon={closeIcon}
      >
        <CancelIcon
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            color: "#ef5350",
            cursor: "pointer"
          }}
        />
        {teamname.length > 0 ? (
          <div
            style={{
              height: 400,
              padding: "5px",
              marginTop: 30,
              display: "flex",
              flexDirection: "column",
              fontSize: 12
            }}
          >
            <p
              style={{
                float: "left",
                fontSize: 15,
                color: "red",
                position: "fixed",
                bottom: 100
              }}
            >
              {" "}
              {updateerr}{" "}
            </p>
            <p
              style={{
                float: "left",
                fontSize: 15,
                color: "red",
                position: "fixed",
                bottom: 80
              }}
            >
              {" "}
              {inActiveErr}
            </p>

            <div
              style={{
                display: "flex",
                // justifyContent: "space-between",
                height: 200,
                width: 1000
              }}
            >
              <div
                className='member'
                style={{
                  height: 400,
                  width: 300,
                  overflow: "auto",
                  scrollBehavior: "smooth"
                }}
              >
                <Table
                  style={{}}
                  className={classes.root}
                  aria-labelledby='tableTitle'
                  size={"small"}
                  aria-label='enhanced table'
                >
                  <TableHead>
                    <TableRow style={{}}>
                      <TableCell align='center'>Edit</TableCell>
                      <TableCell align='center'>Team</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {teamname &&
                      teamname.map((curelem, index) => {
                        return (
                          <>
                            <TableRow>
                              <TableCell align='center'>
                                <div>
                                  <Edit
                                    size={12}
                                    style={{
                                      color: "#069b3f",
                                      cursor: "pointer"
                                    }}
                                    onClick={() => {
                                      getTeamdata(curelem.id),
                                        // seteditImg(curelem.teamLogo),
                                        // console.log(curelem.teamLogo);
                                        openUpdateTeam();
                                    }}
                                  />
                                </div>
                              </TableCell>
                              <TableCell align='center'>
                                <div
                                  style={{
                                    fontSize: 12,
                                    width: "max-content",
                                    display: "flex",
                                    justifyContent: "space-between",
                                    padding: "9px"
                                  }}
                                >
                                  <div>
                                    {" "}
                                    <input
                                      type='radio'
                                      name='teamselect'
                                      value={curelem.id}
                                      onChange={selectTeam}
                                      style={{
                                        color: "red",
                                        width: 16,
                                        height: 16,
                                        padding: "10px",
                                        marginRight: 10
                                      }}
                                      id={curelem.id}
                                    />
                                    <label for={curelem.id}>
                                      {curelem.teamName}
                                    </label>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
              {/* registered user */}
              {regUser && regUser.length > 0 ? (
                <div
                  className='member'
                  style={{
                    height: 400,
                    width: 280,
                    overflow: "auto",
                    scrollBehavior: "smooth"
                  }}
                >
                  <Table
                    // style={{ width: 150 }}
                    className={classes.root}
                    aria-labelledby='tableTitle'
                    size={"small"}
                    aria-label='enhanced table'
                  >
                    <TableHead style={{}}>
                      <TableRow style={{}}>
                        <TableCell align='center'>Registered members</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody style={{}}>
                      {regUser &&
                        regUser.map((regus, index) => {
                          // console.log(regus);
                          return (
                            <>
                              <TableRow style={{ marginTop: 80 }}>
                                <TableCell align='center'>
                                  <div
                                    style={{
                                      padding: 9,
                                      fontSize: 12,
                                      width: "max-content"
                                    }}
                                  >
                                    <input
                                      // control={<Radio color='red' />}
                                      aria-label='quiz'
                                      name='quiz'
                                      type='radio'
                                      onChange={handleInactive}
                                      value={regus.userId}
                                      style={{
                                        marginRight: 20,
                                        // background: "red",
                                        // color: "red",
                                        width: 16,
                                        height: 16,
                                        padding: "10px"
                                      }}
                                    />
                                    <span for={regus.userId} style={{}}>
                                      {regus.name}{" "}
                                      {regus.role == "TL" ? (
                                        <> ({regus.role}) </>
                                      ) : (
                                        <> </>
                                      )}{" "}
                                    </span>
                                  </div>
                                </TableCell>
                              </TableRow>
                            </>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <> </>
              )}
              {/* end registered user */}

              <div
                className='member'
                style={{
                  height: 400,
                  width: 500,

                  overflow: "auto",
                  display: "inline-block",
                  scrollBehavior: "smooth"
                  // position: "fixed"
                }}
              >
                <Table
                  style={{}}
                  className={classes.root}
                  aria-labelledby='tableTitle'
                  size={"small"}
                  aria-label='enhanced table'
                  style={{}}
                >
                  <TableHead style={{}}>
                    <TableRow>
                      <TableCell align='center'>Avilable members</TableCell>
                      <TableCell align='left'> Set TL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody style={{}}>
                    {memberlist &&
                      memberlist.map((currentelement, index) => {
                        return (
                          <>
                            <TableRow style={{}}>
                              <TableCell style={{}} align='center'>
                                <div
                                  style={{ fontSize: 12, width: "max-content" }}
                                >
                                  <Checkbox
                                    onChange={handle}
                                    name={currentelement.userId}
                                    // checked={currentelement?.isChecked || false}
                                    id={currentelement.userId}
                                    style={{ fontSize: 9 }}
                                    inputProps={{
                                      "aria-label": "uncontrolled-checkbox"
                                    }}
                                  />
                                  <label for={currentelement.userId}>
                                    {currentelement.name}{" "}
                                  </label>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div>
                                  {" "}
                                  <input
                                    type='radio'
                                    name='selectLeader'
                                    value={currentelement.userId}
                                    onChange={selectLeader}
                                    style={{
                                      width: 15,
                                      height: 15,
                                      padding: "15px",
                                      marginRight: 10
                                    }}
                                    id={currentelement.userId}
                                  />
                                </div>
                              </TableCell>
                            </TableRow>
                          </>
                        );
                      })}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div style={{ background: "white", display: "flex" }}>
              <div style={{ width: "50%" }}>
                {regUser && regUser.length > 0 ? (
                  <button
                    onClick={removemember}
                    style={{
                      background: "#F43F5E",
                      marginTop: 240,
                      marginLeft: 400,
                      color: "white",
                      width: 130,
                      height: 25,
                      position: "fixed"
                    }}
                  >
                    Remove member
                  </button>
                ) : (
                  <> </>
                )}
              </div>
              <div style={{ width: "50%" }}>
                <button
                  onClick={submitTeam}
                  style={{
                    background: "#F43F5E",
                    marginTop: 240,
                    marginLeft: 370,
                    color: "white",
                    width: 120,
                    height: 25,
                    position: "fixed"
                  }}
                >
                  Map member
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              style={{
                height: 400,
                padding: "5px",
                marginTop: 30,
                width: 500,
                display: "flex",
                flexDirection: "column",
                fontSize: 12,
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
              }}
              className=''
            >
              {" "}
              <img
                style={{ width: 200, height: 200 }}
                src='https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg'
              />
              NO TEAM
            </div>{" "}
          </>
        )}
      </Modal>

      {/* UERLIST MODAL */}

      <Modal
        open={userListModal}
        styles={{
          modal: { borderRadius: "10px", maxWidth: "100vw" }
        }}
        onClose={closeUserListModal}
        center
        closeIcon={closeIcon}
      >
        <CancelIcon
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            color: "#ef5350",
            cursor: "pointer"
          }}
        />
        <div
          style={{
            width: "2000",
            paddingTop: 5,
            paddingLeft: 10,
            paddingRight: 10
          }}
        >
          <div style={{ display: "flex" }}>
            <img
              src={
                teamImg != ""
                  ? teamImg
                  : "https://toppng.com/uploads/preview/free-icons-team-icon-11553443974c84uvvhqrz.png"
              }
              style={{
                width: 40,
                height: 40,
                top: 30,
                borderRadius: 100,
                marginRight: 20
              }}
            />{" "}
            <h4> {team} </h4>{" "}
          </div>
          <Table
            style={{ fontSize: 9 }}
            // className={classes.root}
            aria-labelledby='tableTitle'
            size={"small"}
            aria-label='enhanced table'
          >
            <TableHead style={{ background: "#ecf0f1" }}>
              <TableRow style={{}}>
                <TableCell align='center'>Rank</TableCell>
                <TableCell align='center'> Name</TableCell>
                <TableCell align='center'>Gender</TableCell>
                <TableCell align='center'> City</TableCell>
                <TableCell align='center'> Source</TableCell>
                <TableCell align='center'> Date</TableCell>
                <TableCell align='center'> Km</TableCell>
                <TableCell align='center'> Total km</TableCell>

                <TableCell align='left'> Avrage km</TableCell>
                {/* <TableCell align='left'> Distance Covered</TableCell> */}
                <TableCell align='left'> Active days</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userList.map((user, ind) => {
                // const a = () => {
                //   if (user.dataSource) {
                //     return user.dataSource === "WHATSAPP"
                //       ? "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/whatsapp.svg"
                //       : user.dataSorce === "GOOGLE_FIT"
                //       ? "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/googlefit.svg"
                //       : user.dataSorce === "STRAVA"
                //       ? "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/strava.svg"
                //       : "";
                //   }
                // };
                return (
                  <TableRow
                    style={user.memberRole == "TL" ? highlightRow : highlight}
                  >
                    <TableCell align='center'> {user.userRank}</TableCell>
                    <TableCell align='left'>
                      {" "}
                      <div style={{ display: "flex" }}>
                        <span>
                          {" "}
                          <img
                            style={{
                              width: 25,
                              height: 25,
                              borderRadius: 100,
                              marginRight: 20
                            }}
                            src={
                              user.profileImage
                                ? user.profileImage
                                : "https://support.logmeininc.com/assets/images/care/topnav/default-user-avatar.jpg"
                            }
                          />{" "}
                        </span>{" "}
                        <span style={{ marginTop: 5 }}>{user.userName} </span>
                      </div>
                    </TableCell>
                    <TableCell align='center'> {user.userGender} </TableCell>
                    <TableCell align='center'> {user.userCity} </TableCell>
                    <TableCell align='center'>
                      {" "}
                      <img
                        style={{ width: 25, height: 25, borderRadius: 100 }}
                        src={
                          user.dataSource
                            ? APP.dataSourceLogo[user.dataSource]
                            : "https://walkathon21.s3.ap-south-1.amazonaws.com/logo/NotSet.svg"
                        }
                      />{" "}
                    </TableCell>
                    <TableCell align='center'>
                      {" "}
                      {user.lastActiveDate}{" "}
                    </TableCell>
                    <TableCell align='center'>
                      {" "}
                      {user.lastDistanceCovered
                        ? parseFloat(user.lastDistanceCovered.toFixed(2))
                        : "0.00"}{" "}
                    </TableCell>
                    <TableCell align='center'>
                      {" "}
                      {user.userTotalKm
                        ? parseFloat(user.userTotalKm.toFixed(2))
                        : "0.00"}{" "}
                    </TableCell>
                    <TableCell align='center'>
                      {" "}
                      {user.userAvgKm
                        ? parseFloat(user.userAvgKm).toFixed(2)
                        : "0.00"}{" "}
                    </TableCell>
                    {/* <TableCell align='center'>
                      {" "}
                      {user.lastDistanceCovered}{" "}
                    </TableCell> */}
                    <TableCell align='center'>
                      {" "}
                      {user.totalActiveDays}{" "}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Modal>

      {/* TEAMJOIN MODAL */}

      <Modal
        open={joinModal}
        styles={{ modal: { borderRadius: "10px" } }}
        onClose={onclosejoinModal}
        center
        closeIcon={closeIcon}
      >
        <CancelIcon
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            color: "#ef5350",
            cursor: "pointer"
          }}
        />

        <div
          style={{
            padding: "20px",
            paddingLeft: "5px",
            paddingBottom: "0px",
            paddingTop: "10px"
          }}
        >
          <div style={{ display: "flex" }}>
            <img
              src={
                teamImg != ""
                  ? teamImg
                  : "https://toppng.com/uploads/preview/free-icons-team-icon-11553443974c84uvvhqrz.png"
              }
              style={{
                width: 40,
                height: 40,
                top: 30,
                borderRadius: 100,
                marginRight: 20
              }}
            />{" "}
            <h4> {team} </h4>{" "}
          </div>{" "}
          <h3>
            <strong> Please confirm to join {team} </strong>
          </h3>
          <div style={{ display: "flex", justifyContent: "space-around" }}>
            {" "}
            <button
              style={{
                height: 30,
                width: 90,
                color: "white",
                background: "#d65151"
              }}
              onClick={() => onclosejoinModal()}
            >
              {" "}
              Cancel
            </button>
            <button
              className='is-success'
              style={{
                height: 30,
                width: 90,
                color: "white",
                background: "#d65151"
              }}
              onClick={() => joinTeam(JoinId)}
            >
              {" "}
              Confirm
            </button>{" "}
          </div>
        </div>
      </Modal>

      {/* TEAM JOIN MODAL END */}

      {/* USERLIST MODAL END */}
      <Modal
        open={open}
        styles={{ modal: { borderRadius: "10px" } }}
        onClose={onCloseModal}
        center
        closeIcon={closeIcon}
      >
        <CancelIcon
          style={{
            position: "absolute",
            top: 15,
            right: 15,
            color: "#ef5350",
            cursor: "pointer"
          }}
        />
        <div
          style={{
            padding: "20px",
            paddingLeft: "5px",
            paddingBottom: "0px",
            paddingTop: "10px"
          }}
        >
          <>
            <form style={{ padding: "0px", paddingTop: "25px" }}>
              <div
                className='firstrow'
                style={{ display: "flex", justifyContent: "center" }}
              >
                <div style={{ width: "30%" }}>
                  <div>
                    <label>
                      {" "}
                      Team Name<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                  </div>
                  <input
                    type='text'
                    onChange={handleteam}
                    required
                    placeholder='set your team name'
                    name='team_name'
                    style={{ fontSize: 12 }}
                    maxLength='50'
                  />
                </div>
                <div style={{ width: "30%" }}>
                  <div>
                    <label>
                      {" "}
                      Team tagline<span style={{ color: "red" }}>*</span>
                    </label>
                  </div>
                  {/* <input style={{width:'100%' , fontSize:12}} value={parseInt(eventname)} name='eventname' type="number" onChange={handleteam} />  */}
                  <input
                    onChange={handleteam}
                    type='text'
                    style={{ fontSize: 12 }}
                    placeholder='Set yor team tagline'
                    name='teamtagline'
                  />
                </div>
              </div>

              <div
                className='secondrow'
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px"
                }}
              >
                <div style={{ width: "30%" }}>
                  <div>
                    <label>
                      {" "}
                      Set Team Logo<span style={{ color: "red" }}>*</span>{" "}
                    </label>
                  </div>
                  <input
                    onChange={(e) => {
                      onFileChange(e);
                    }}
                    style={{ fontSize: 12 }}
                    type='file'
                    name='teamlogo'
                  />
                </div>
                <div style={{ width: "30%" }}>
                  <div>
                    <button
                      onClick={savedata}
                      style={{
                        width: 100,
                        height: 30,
                        marginTop: 20,
                        position: "relative",
                        background: "green",
                        float: "right",
                        color: "white"
                      }}
                    >
                      submit
                    </button>
                  </div>
                </div>
              </div>
              <span style={{ marginTop: "20px", color: "red", fontSize: 12 }}>
                {" "}
                {err}{" "}
              </span>
            </form>
            <hr />
            {existTeam()}
          </>
        </div>
      </Modal>
      {isAdmin === true ||
      mod.moderatorId == localStorage.getItem("userId") ||
      mod.teamBuild !== "NA" ? (
        <div className='main_div' style={{ display: "flex", width: "100%" }}>
          <div className='adminuse' style={{ width: "100%", display: "flex" }}>
            {mod.teamBuild !== "NA" ? (
              <button
                className='create-event-button target-btn'
                onClick={() => {
                  onOpenModal();
                }}
                style={{ width: "100px", height: 20 }}
              >
                Team
              </button>
            ) : (
              ""
            )}
            {mod.teamBuild !== "NA" ? (
              <button
                className='create-event-button target-btn'
                onClick={() => {
                  onOpenMemberModal();
                }}
                style={{ width: "100px", height: 20 }}
              >
                Members
              </button>
            ) : (
              ""
            )}
          </div>
        </div>
      ) : (
        <> </>
      )}

      {LeaderboardData.length > 0 ? (
        <div style={{ width: "100%" }}>
          {/* <Paper className={classes.paper}> */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <div className='d-flex a-i-center'>
              <TablePagination
                rowsPerPageOptions={[50, 75, 100]}
                component='div'
                count={LeaderboardData.length}
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
            aria-labelledby='tableTitle'
            size={"small"}
            aria-label='enhanced table'
          >
            <EnhancedTableHead
              classes={classes}
              order={order}
              orderBy={orderBy}
              onRequestSort={handleRequestSort}
            />

            <TableBody style={{ fontSize: 12 }}>
              {sessionteamRank ? (
                <TableRow
                  style={{ background: "#e0f2fe" }}
                  className='teamLeaderboard'
                >
                  <TableCell align='center'>{sessionteamRank.rank} </TableCell>
                  <TableCell align='left'>
                    {" "}
                    <div style={{ display: "flex" }}>
                      <span>
                        {" "}
                        <img
                          style={{
                            width: 25,
                            height: 25,
                            borderRadius: 100,
                            marginRight: 20
                          }}
                          src={
                            sessionteamRank.teamMascot != ""
                              ? sessionteamRank.teamMascot
                              : "https://toppng.com/uploads/preview/free-icons-team-icon-11553443974c84uvvhqrz.png"
                          }
                        />{" "}
                      </span>{" "}
                      <span style={{ marginTop: 5 }}>
                        {sessionteamRank.teamName}{" "}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell align='center'>
                    {sessionteamRank.totalMember}/{maxteamMember}{" "}
                  </TableCell>
                  <TableCell align='center'>
                    {sessionteamRank.currentDate}{" "}
                  </TableCell>
                  <TableCell align='center'>
                    {/* {sessionteamRank.todayContributionKM}{" "} */}

                    {/* {sessionteamRank.todayContributionKM
                      ? parseFloat(sessionteamRank.todayContributionKM)
                      : "0.00"} */}

                    {sessionteamRank.todayContributionKM
                      ? sessionteamRank.todayContributionKM.toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell align='center'>
                    {/* {sessionteamRank.teamTotalKm}{" "} */}

                    {sessionteamRank.teamTotalKm
                      ? sessionteamRank.teamTotalKm.toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell align='center'>
                    {/* {sessionteamRank.teamAverage
                      ? parseFloat(sessionteamRank.teamAverage)
                      : "0.00"}{" "} */}

                    {sessionteamRank.teamAverage
                      ? parseFloat(sessionteamRank.teamAverage).toFixed(2)
                      : "0.00"}
                  </TableCell>
                  <TableCell align='center'>
                    {sessionteamRank.teamActiveDay}{" "}
                  </TableCell>
                  <TableCell align='center'>
                    {" "}
                    <AddIcon
                      onClick={() => {
                        topUser(
                          sessionteamRank.teamName,
                          sessionteamRank.teamMascot
                        ),
                          openUserListModal();
                      }}
                      style={{ cursor: "pointer" }}
                    />{" "}
                  </TableCell>
                </TableRow>
              ) : (
                ""
              )}

              {stableSort(LeaderboardData, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((item, ind) => {
                  return (
                    <>
                      <TableRow style={{}} className='teamLeaderboard'>
                        <TableCell align='center'>{item.rank} </TableCell>
                        <TableCell align='left'>
                          {" "}
                          <div style={{ display: "flex" }}>
                            <span>
                              {" "}
                              <img
                                style={{
                                  width: 25,
                                  height: 25,
                                  borderRadius: 100,
                                  marginRight: 20
                                }}
                                src={
                                  item.teamMascot != ""
                                    ? item.teamMascot
                                    : "https://toppng.com/uploads/preview/free-icons-team-icon-11553443974c84uvvhqrz.png"
                                }
                              />{" "}
                            </span>{" "}
                            <span style={{ marginTop: 5 }}>
                              {item.teamName}{" "}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell align='center'>
                          {item.totalMember}/{maxteamMember}{" "}
                        </TableCell>
                        <TableCell align='center'>
                          {item.currentDate}{" "}
                        </TableCell>
                        <TableCell align='center'>
                          {item.todayContributionKM
                            ? parseFloat(item.todayContributionKM).toFixed(2)
                            : "0.00"}{" "}
                        </TableCell>
                        <TableCell align='center'>
                          {/* {parseFloat(item.teamTotalKm.toFixed(2))} */}
                          {item.teamTotalKm
                            ? parseFloat(item.teamTotalKm).toFixed(2)
                            : "0.00"}{" "}
                        </TableCell>
                        <TableCell align='center'>
                          {item.teamAverage
                            ? parseFloat(item.teamAverage).toFixed(2)
                            : "0.00"}{" "}
                        </TableCell>
                        <TableCell align='center'>
                          {item.teamActiveDay}{" "}
                        </TableCell>
                        <TableCell align='center'>
                          {" "}
                          <AddIcon
                            onClick={() => {
                              leaderBoardUser(item.teamName, item.teamMascot),
                                openUserListModal();
                            }}
                            style={{ cursor: "pointer" }}
                          />{" "}
                        </TableCell>
                        {!activeInTeam && (
                          <TableCell align='center'>
                            {
                              (item,
                              !activeInTeam &&
                                (item.totalMember < maxteamMember ||
                                item.totalMember == 0 ? (
                                  <>
                                    <button
                                      style={{
                                        height: 25,
                                        width: 50,
                                        color: "white",
                                        backgroundColor: "green",
                                        borderRadius: "10px"
                                      }}
                                      onClick={() => {
                                        // joinTeam(item.teamId),
                                        teamJoinData(
                                          item.teamName,
                                          item.teamMascot,
                                          item.teamId
                                        );
                                        onjoinModal();
                                      }}
                                    >
                                      {" "}
                                      Join{" "}
                                    </button>
                                  </>
                                ) : (
                                  ""
                                )))
                            }{" "}
                          </TableCell>
                        )}
                      </TableRow>
                    </>
                  );
                })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <>
          <div
            style={{
              // height: 400,
              padding: "5px",
              marginTop: 30,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              fontSize: 12,
              display: "flex",
              justifyContent: "center",
              alignItems: "center"
            }}
            className=''
          >
            {" "}
            <img
              style={{ width: 200, height: 200 }}
              src='https://w21.mhealth.ai/static/media/dataSource.11fba1d5.svg'
            />
            Data is not present
          </div>{" "}
        </>
      )}
    </>
    // <Paper/>
  );
};

export default CreateTeam;
