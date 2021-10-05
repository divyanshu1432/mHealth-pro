import React, { useEffect, useState } from "react";
import { lighten, useTheme } from "@material-ui/core/styles";

import ReactLoadingWrapper from "./loaders/ReactLoadingWrapper";
import Message from "antd-message";
import TopUserDetails from "./TopUserDetails";
// import ResetPin1 from "../assets/resetPin.svg";
import { Modal } from "react-responsive-modal";
import { makeStyles } from "@material-ui/core/styles";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import CancelIcon from "@material-ui/icons/Cancel";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import Avatar from "@material-ui/core/Avatar";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";
// import CSVExport from "../CSVExport";
import Tooltip from "@material-ui/core/Tooltip";
// import NoData from "../NoData";
// import ActiveButton from "../Utility/ActiveButton";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import "react-tabs/style/react-tabs.css";
import AddIcon from "@material-ui/icons/Add";
import { Edit } from "react-feather";
import { CSVLink } from "react-csv";
import {
  urlPrefix,
  performanceReport,
  secretToken,
  getSubEvent,
  zoomreport
} from "../services/apicollection";
import axios from "axios";
import PromiseTeam from "./PerformanceTeam/PromisingTeam";
import EfficientPlayer from "./PerformanceTeam/EfficientTeam";
import InspiringPlayer from "./PerformanceTeam/InspiringTeam";
import ConsistantPlayer from "./PerformanceTeam/ConsistantPlayer";
const Performance = (props) => {
  const [events, setevents] = useState([]);
  const [programs, setprograms] = useState([]);
  const [promisePlayer, setpromisePlayer] = useState([]);
  const [effecientPlayer, seteffecientPlayer] = useState([]);
  const [inspiringPlayer, setinspiringPlayer] = useState([]);
  const [consistantPlayer, setconsistantPlayer] = useState([]);
  const [progId, setprogId] = useState();
  const [endDate, setendDate] = useState("");
  const [startDate, setstartDate] = useState("");
  const [currDate, setcurrDate] = useState("");
  const [challengerId, setchallengerId] = useState();
  const [resMessage, setresMessage] = useState();
  const progChange = (e) => {
    setprogId(e.target.value);
  };
  const toDate = (e) => {
    setendDate(e.target.value);
  };
  const FromDate = (e) => {
    setstartDate(e.target.value);
  };
  // console.log("progId", programs.length);

  const handleChange = (e) => {
    setchallengerId(e.target.value);
  };

  const getData = () => {
    const url = `${urlPrefix}${performanceReport}?challengerZoneId=${challengerId}&endDate=${endDate}&startDate=${startDate}`;
    return axios
      .get(url, {
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
        if (res.data.response.responseData) {
          setpromisePlayer(res.data.response.responseData.mostPromisingPlayer);
        }
        if (res.data.response.responseData) {
          seteffecientPlayer(
            res.data.response.responseData.mostEfficientPlayer
          );
          setresMessage();
        }
        if (res.data.response.responseData) {
          setinspiringPlayer(
            res.data.response.responseData.mostInspiringPlayer
          );
          setresMessage();
        }
        if (res.data.response.responseData) {
          setconsistantPlayer(
            res.data.response.responseData.mostConsistantPlayer
          );
          setresMessage();
        }
        if (res.data.response.responseMessage) {
          if (res.data.response.responseMessage != "SUCCESS") {
            setresMessage(res.data.response.responseMessage);
          }
        }
        // setprograms(res.data.response.responseData);
        // console.log();
      });
  };

  const useStyles1 = makeStyles((theme) => ({
    container: {
      display: "flex",
      flexWrap: "wrap"
    },
    textField: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      width: 200
    },
    button: {
      display: "block",
      marginTop: theme.spacing(2)
    },
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    }
  }));
  const classes1 = useStyles1();

  const getEvents = () => {
    if (props.peradmin != true) {
      var marvelHeroes = props.data.filter(function (hero) {
        const x = hero.moderatorId == localStorage.getItem("userId");
        return x;
      });
      setevents(marvelHeroes);
    } else {
      setevents(props.data);
    }
  };
  useEffect(() => {
    getEvents();
  }, [props.data]);

  return (
    <>
      <div className='main_div'>
        <div
          style={{
            marginTop: 50,
            display: "flex",
            justifyContent: "space-around",
            fontSize: 12,
            height: "10vh"
            // position: "absolute"
          }}
        >
          {/* <Performance /> */}
          <div
            className='select_date'
            style={{
              maxWidth: "250px",
              justifyContent: "center",
              alignItems: "center",
              top: 20
            }}
          >
            <fieldset>
              <legend>Select Event:</legend>
              <form className={classes1.container} noValidate>
                <Select
                  style={{ width: "250px" }}
                  labelId='demo-controlled-open-select-label'
                  id='demo-controlled-open-select'
                  // open={open}
                  // onClose={handleClose}
                  // onOpen={handleOpen}
                  // value={age}
                  onChange={handleChange}
                >
                  {events.map((curelem, index) => {
                    return (
                      <MenuItem style={{ fontSize: 12 }} value={curelem.id}>
                        {curelem.challengeName}
                      </MenuItem>
                    );
                  })}
                </Select>
              </form>
            </fieldset>
          </div>

          {/* <div
            className='select_date'
            style={{
              width: "23%",
              justifyContent: "center",
              alignItems: "center",
              top: 20
            }}
          >
            <fieldset>
              <legend>Select Program</legend>
              <form className={classes1.container} noValidate>
                <Select
                  style={{ width: "100%" }}
                  labelId='demo-controlled-open-select-label'
                  id='demo-controlled-open-select'
                  // open={open}
                  // onClose={handleClose}
                  // onOpen={handleOpen}
                  // value={age}
                  onChange={progChange}
                >
                  {programs &&
                    programs.map((curelem, index) => {
                      return (
                        <MenuItem style={{fontSize:12}} value={curelem.id}>
                          {curelem.eventName}
                        </MenuItem>
                      );
                    })}
                </Select>
              </form>
            </fieldset>
          </div> */}
          <div
            className='select_date'
            style={{
              width: "23%",
              justifyContent: "center",
              alignItems: "center",
              top: 20
            }}
          >
            <fieldset>
              <legend>From Date:</legend>
              <form className={classes1.container} noValidate>
                <TextField
                  style={{ fontSize: 12, width: "100%" }}
                  id='date'
                  type='date'
                  defaultValue=''
                  className={classes1.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={FromDate}
                />
              </form>
            </fieldset>
          </div>
          <div
            className='select_date'
            style={{
              width: "250px",
              justifyContent: "center",
              alignItems: "center",
              top: 20
            }}
          >
            <fieldset>
              <legend>To Date:</legend>
              <form className={classes1.container} noValidate>
                <TextField
                  style={{ fontSize: 12, maxWidth: "250px" }}
                  id='date'
                  type='date'
                  defaultValue=''
                  className={classes1.textField}
                  InputLabelProps={{
                    shrink: true
                  }}
                  onChange={toDate}
                />
              </form>
            </fieldset>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <button
            style={{
              color: "white",
              background: "green",
              height: 30,
              width: 80,
              marginTop: 25
            }}
            onClick={getData}
          >
            {" "}
            submit{" "}
          </button>
          <span style={{ marginTop: 20, color: "red", marginLeft: 50 }}>
            {" "}
            {resMessage}{" "}
          </span>
        </div>

        <Tabs style={{ marginTop: 15 }}>
          <TabList>
            <Tab style={{ fontSize: 12 }}>Promising player</Tab>
            <Tab style={{ fontSize: 12 }}>Efficient player</Tab>
            <Tab style={{ fontSize: 12 }}> Inspiring Player </Tab>
            <Tab style={{ fontSize: 12 }}> Consistant Player </Tab>
          </TabList>

          <TabPanel>
            {promisePlayer.length > 0 ? (
              <PromiseTeam promisePlayer={promisePlayer} />
            ) : (
              <>
                <div
                  style={{
                    height: 250,
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
          </TabPanel>
          <TabPanel>
            {effecientPlayer.length > 0 ? (
              <EfficientPlayer effecientPlayer={effecientPlayer} />
            ) : (
              <>
                <div
                  style={{
                    height: 250,
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
            )}{" "}
          </TabPanel>

          <TabPanel>
            {inspiringPlayer.length > 0 ? (
              <InspiringPlayer inspiringPlayer={inspiringPlayer} />
            ) : (
              <>
                <div
                  style={{
                    height: 250,
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
            )}{" "}
          </TabPanel>

          <TabPanel>
            {consistantPlayer.length > 0 ? (
              <ConsistantPlayer consistantPlayer={consistantPlayer} />
            ) : (
              <>
                <div
                  style={{
                    height: 250,
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
            )}{" "}
          </TabPanel>
        </Tabs>

        <div>{/* <Paper className={classes.paper}> */}</div>
      </div>
    </>
  );
};

export default Performance;
