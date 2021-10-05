import React, { useState, useEffect } from "react";
import { lighten, makeStyles, useTheme } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TextField from "@material-ui/core/TextField";
import axios from "axios";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CircularProgress from "@material-ui/core/CircularProgress";
import message from "antd-message";
import { Edit } from "react-feather";
import {
  urlPrefix,
  createcoach,
  uploadImage
} from "../../services/apicollection";
import { Modal } from "react-responsive-modal";
import CancelIcon from "@material-ui/icons/Cancel";

const CoachTable = (props) => {
  const [preval, setpreval] = useState({});
  const [alldata, setalldata] = useState({});
  const [editImage, seteditImage] = useState("");

  const data = props.gdata;
  useEffect(() => {
    setpreval(props.coach);
  }, [props]);

  // console.log(props , preval);

  const handelchange = (event) => {
    const { name, value } = event.target;

    setpreval((prestate) => {
      console.warn(prestate);
      return {
        ...prestate,
        [name]: value
      };
    });
  };

  const editCoach = (e) => {
    e.preventDefault();
    // setalldata(preval)
    // console.warn(alldata)

    let payload = {};
    {
      editImage == ""
        ? (payload = {
            id: preval.id,
            coachName: preval.coachName,
            phoneNumber: preval.phoneNumber,
            emailId: preval.emailId,
            specialization: preval.specialization,
            languagesKnow: preval.languagesKnow,
            totalExperience: preval.totalExperience,
            shortBio: preval.shortBio,
            twitterId: preval.twitterId,
            linkedinId: preval.linkedinId,
            facebookId: preval.facebookId,
            instagramId: preval.instagramId,
            coachImage: preval.coachImage
          })
        : (payload = {
            id: preval.id,
            coachName: preval.coachName,
            phoneNumber: preval.phoneNumber,
            emailId: preval.emailId,
            specialization: preval.specialization,
            languagesKnow: preval.languagesKnow,
            totalExperience: preval.totalExperience,
            shortBio: preval.shortBio,
            twitterId: preval.twitterId,
            linkedinId: preval.linkedinId,
            facebookId: preval.facebookId,
            instagramId: preval.instagramId,
            coachImage: editImage
          });
    }

    const URL = `${urlPrefix}${createcoach}`;
    axios
      .post(URL, payload, {
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
        // seterr(res.data.response.responseMessage)
        window.data = res.data.response.responseMessage;
        onCloseModal();
        data();
        setpreval(props.coach);
        message.success("Coach Updated");
      })
      .catch((err) => {
        // seterr(err.data.response.responseMessage)
        window.data = err.data.response.responseMessage;
      });
  };

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

  const coachHeads = [
    {
      label: "coach name",
      id: "coachname",
      numeric: false,
      disablePadding: true
    },
    {
      label: "total experience",
      id: "experience",
      numeric: false,
      disablePadding: true
    },

    {
      label: "specialization",
      id: "specialization",
      numeric: false,
      disablePadding: true
    },
    {
      label: "phone number",
      id: "phonenumber",
      numeric: false,
      disablePadding: true
    },

    {
      label: "Email  id",
      id: "email",
      numeric: false,
      disablePadding: true
    },
    {
      label: "Languagees known",
      id: "language",
      numeric: false,
      disablePadding: true
    }
  ];

  // function coach(props)
  const EnhancedTableHead = (prop) => {
    const { classes, order, orderBy, onRequestSort } = prop;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };

    return (
      <TableHead>
        <TableRow>
          {coachHeads.map((coachTableHeads) => (
            <TableCell
              key={coachTableHeads.id}
              align='center'
              padding='none'
              sortDirection={orderBy === coachTableHeads.id ? order : false}
              style={{
                width: "max-content",
                paddingLeft: coachTableHeads.id == "index" ? 5 : 0
              }}
            >
              <TableSortLabel
                active={orderBy === coachTableHeads.id}
                direction={orderBy === coachTableHeads.id ? order : "asc"}
                onClick={createSortHandler(coachTableHeads.id)}
                style={{ width: "max-content" }}
              >
                {coachTableHeads.label}
                {orderBy === coachTableHeads.id ? (
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

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%"
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

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const classes = useStyles();
  const [order, setOrder] = useState("asc");
  const [orderBy, setOrderBy] = useState("");

  const [open, setOpen] = useState(false);
  const onCloseModal = () => {
    setOpen(false), setpreval({});
  };

  const onOpenModal = () => {
    setOpen(true);
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

            seteditImage(res.data.response.responseData.image);
          })
          .catch((err) => {
            message.error("Try Again");
          });
      }
    }
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
  // const x = props.coach.phoneNumber;

  return (
    <>
      <Modal
        open={open}
        styles={{ modal: { borderRadius: "10px", maxWidth: "600px" } }}
        onClose={onCloseModal}
        center
        closeIcon={closeIcon}
      >
        <CancelIcon
          style={{
            position: "absolute",
            top: 15,
            right: 5,
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
          <form style={{ padding: "10px" }}>
            <div className='name' style={{ display: "flex", fontSize: 12 }}>
              {/* <input type="text"   > */}
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label>
                  {" "}
                  Coach Name <span style={{ color: "red" }}> *</span>
                </label>

                <input
                  value={preval.coachName}
                  name='coachName'
                  type='text'
                  accept='image/*'
                  maxLength='75'
                  style={{
                    background: "#f2f0eb",
                    textAlign: "left",
                    fontSize: 12,
                    border: 0,
                    outline: 0,
                    height: "30px",
                    borderRadius: 5
                  }}
                  onChange={handelchange}
                  placeholder='enter name'
                />
              </div>

              <div
                style={{
                  width: "50%",
                  marginLeft: "10px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label>
                  {" "}
                  Phone number <span style={{ color: "red" }}> *</span>
                </label>
                <input
                  value={preval.phoneNumber}
                  onChange={handelchange}
                  name='phoneNumber'
                  type='text'
                  maxLength='10'
                  style={{
                    background: "#f2f0eb",
                    textAlign: "left",
                    fontSize: 12,
                    border: 0,
                    outline: 0,
                    height: "30px",
                    borderRadius: 5
                  }}
                  placeholder='enter number'
                />{" "}
              </div>
            </div>

            <div
              className='name'
              style={{ display: "flex", fontSize: 12, marginTop: "15px" }}
            >
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label>
                  {" "}
                  Short Bio <span style={{ color: "red" }}> *</span>{" "}
                </label>

                <TextField
                  maxLength='500'
                  id='standard-basic'
                  placeholder='Enter short bio'
                  style={{
                    width: "95%"
                  }}
                  variant='outlined'
                  multiline
                  value={preval.shortBio}
                  onChange={handelchange}
                  name='shortBio'
                  className='event-text-field'
                />
              </div>

              <div style={{ width: "50%", marginLeft: "10px" }}>
                <label>
                  {" "}
                  Specialization <span style={{ color: "red" }}> *</span>
                </label>
                <TextField
                  id='standard-basic'
                  placeholder='Enter specialization'
                  style={{
                    width: "95%",
                    background: "#f2f0eb"
                  }}
                  variant='outlined'
                  multiline
                  value={preval.specialization}
                  onChange={handelchange}
                  name='specialization'
                  className='event-text-field'
                />{" "}
              </div>
            </div>

            <div
              className='name'
              style={{ display: "flex", marginTop: "15px", fontSize: 12 }}
            >
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label>
                  {" "}
                  Language known <span style={{ color: "red" }}> *</span>
                </label>
                <input
                  className='border-danger'
                  value={preval.languagesKnow}
                  onChange={handelchange}
                  name='languagesKnow'
                  maxLength='150'
                  type='text'
                  accept='image/*'
                  style={{
                    background: "#f2f0eb",
                    textAlign: "left",
                    fontSize: 12,
                    border: 0,
                    outline: 0,
                    height: "30px",
                    borderRadius: 5
                  }}
                  placeholder='Language known '
                />{" "}
              </div>

              <div
                style={{
                  width: "50%",
                  marginLeft: "10px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label> Total experience </label>
                <input
                  value={preval.totalExperience}
                  onChange={handelchange}
                  name='totalExperience'
                  type='text'
                  accept='image/*'
                  maxLength='50'
                  style={{
                    background: "#f2f0eb",
                    textAlign: "left",
                    fontSize: 12,
                    border: 0,
                    outline: 0,
                    height: "30px",
                    borderRadius: 5
                  }}
                  placeholder='Experience'
                />{" "}
              </div>
            </div>

            <div
              className='name'
              style={{ display: "flex", marginTop: "15px", fontSize: 12 }}
            >
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label>
                  {" "}
                  Email id <span style={{ color: "red" }}> *</span>
                </label>

                <input
                  value={preval.emailId}
                  onChange={handelchange}
                  name='emailId'
                  type='email'
                  accept='image/*'
                  style={{
                    background: "#f2f0eb",
                    textAlign: "left",
                    fontSize: 12,
                    border: 0,
                    outline: 0,
                    height: "30px",
                    borderRadius: 5
                  }}
                  placeholder='Enter email'
                />
              </div>

              <div
                style={{
                  width: "50%",
                  marginLeft: "10px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label> Twitter </label>
                <input
                  value={preval.twitterId}
                  onChange={handelchange}
                  name='twitterId'
                  type='text'
                  style={{
                    background: "#f2f0eb",
                    textAlign: "left",
                    fontSize: 12,
                    border: 0,
                    outline: 0,
                    height: "30px",
                    borderRadius: 5
                  }}
                  placeholder='enter twitter link'
                />{" "}
              </div>
            </div>

            <div
              className='name'
              style={{ display: "flex", marginTop: "15px", fontSize: 12 }}
            >
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label> Instagram </label>
                <input
                  value={preval.instagramId}
                  onChange={handelchange}
                  name='instagramId'
                  type='text'
                  accept='image/*'
                  style={{
                    background: "#f2f0eb",
                    textAlign: "left",
                    fontSize: 12,
                    border: 0,
                    outline: 0,
                    height: "30px",
                    borderRadius: 5
                  }}
                  placeholder='enter instagram link'
                />{" "}
              </div>

              <div
                style={{
                  width: "50%",
                  marginLeft: "10px",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label> LinkedIn </label>
                <input
                  value={preval.linkedinId}
                  onChange={handelchange}
                  name='linkedinId'
                  type='text'
                  accept='image/*'
                  style={{
                    background: "#f2f0eb",
                    textAlign: "left",
                    fontSize: 12,
                    border: 0,
                    outline: 0,
                    height: "30px",
                    borderRadius: 5
                  }}
                  placeholder='enter linkedin link'
                />{" "}
              </div>
            </div>

            <div
              className='name'
              style={{ display: "flex", marginTop: "15px", fontSize: 12 }}
            >
              <div
                style={{
                  width: "50%",
                  display: "flex",
                  flexDirection: "column"
                }}
              >
                <label> Facebook </label>
                <input
                  value={preval.facebookId}
                  onChange={handelchange}
                  name='facebookId'
                  type='text'
                  accept='image/*'
                  style={{
                    background: "#f2f0eb",
                    textAlign: "left",
                    fontSize: 12,
                    border: 0,
                    outline: 0,
                    height: "30px",
                    borderRadius: 5
                  }}
                  placeholder='enter facebook link'
                />{" "}
              </div>

              <div style={{ width: "50%", fontSize: 12, marginLeft: "0px" }}>
                {/* <input type="file"  name="img" 
                                 onChange={(e) => {
                                    onFileChange(e);
                                  }}
                                 style={{ fontSize:12 , marginTop:10 }} /> */}

                <img
                  src={preval.coachImage}
                  style={{
                    marginLeft: 50,
                    width: "100px",
                    height: "100px",
                    borderRadius: "100%"
                  }}
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
                  <input
                    onChange={(e) => {
                      editFile(e);
                    }}
                    name='teamLogo'
                    type='file'
                    id='editimg'
                    style={{ fontSize: 12, display: "none" }}
                  />
                </label>
              </div>
            </div>
            <div style={{ display: "flex" }}>
              <div style={{ width: "50%" }}>
                <button
                  className='is-success'
                  onClick={editCoach}
                  style={{
                    float: "left",
                    marginTop: 0,
                    width: 100,
                    height: 32
                    // marginLeft: 00,
                  }}
                >
                  Submit
                </button>
              </div>
              <div style={{ width: "50%" }}></div>
            </div>
          </form>
        </div>
      </Modal>

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
        <TableBody>
          <TableRow>
            <TableCell
              colSpan={10}
              style={{
                position: "relative"
              }}
            >
              {/* <FacebookCircularProgress /> */}
            </TableCell>
          </TableRow>
          <TableRow hover tabIndex={-1}>
            <TableCell align='center'>
              <div style={{ fontSize: 12, width: "max-content" }}>
                <div style={{ display: "flex" }}>
                  {" "}
                  <img
                    src={props.coach.coachImage}
                    style={{ width: "25px", height: "25px", borderRadius: 100 }}
                  />{" "}
                  <span style={{ marginTop: 5, marginLeft: 10 }}>
                    {props.coach.coachName}{" "}
                  </span>{" "}
                </div>
                {/* {props.coachPhoneNumber} */}
              </div>
            </TableCell>

            <TableCell align='center'>
              <div style={{ fontSize: 12, width: "max-content" }}>
                {props.coach.totalExperience}
                {/* {props.coachPhoneNumber} */}
              </div>
            </TableCell>

            <TableCell align='center'>
              <div style={{ fontSize: 12, width: "max-content" }}>
                {props.coach.specialization}
                {/* {props.coachPhoneNumber} */}
              </div>
            </TableCell>

            <TableCell align='center'>
              <div style={{ fontSize: 12, width: "max-content" }}>
                {props.coach.phoneNumber}
                {/* {props.coachPhoneNumber} */}
              </div>
            </TableCell>

            <TableCell align='center'>
              <div style={{ fontSize: 12, width: "max-content" }}>
                {props.coach.emailId}
                {/* {props.coachPhoneNumber} */}
              </div>
            </TableCell>

            <TableCell align='center'>
              <div style={{ fontSize: 12, width: "max-content" }}>
                {props.coach.languagesKnow}
                {/* {props.coachPhoneNumber} */}
              </div>
            </TableCell>
            <TableCell align='center'>
              <Edit
                size={16}
                style={{
                  marginLeft: 5,
                  color: "#069b3f",
                  cursor: "pointer"
                }}
                onClick={() => {
                  onOpenModal();
                }}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </>
  );
};
export default CoachTable;
