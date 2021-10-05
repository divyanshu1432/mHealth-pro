import React, { useState, useEffect } from "react";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import TextField from "@material-ui/core/TextField";
import {
  createcoach,
  urlPrefix,
  uploadImage,
  getAllCoahes
} from "../../services/apicollection";
import axios from "axios";
import Message from "antd-message";
import CancelIcon from "@material-ui/icons/Cancel";

const AdInstructor = () => {
  const [image, setimage] = useState("d-none");
  const [nameImp, setnameImp] = useState("d-none");
  const [alldata, setalldata] = useState({});
  const [data, setData] = useState({
    coachname: "",
    bio: "",
    special: "",
    mobile: "",
    language: "",
    experience: "",
    email: "",
    twitter: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    img: ""
  });
  const [err, seterr] = useState("");
  const handelchange = (event) => {
    const { name, value } = event.target;
    setData((preval) => {
      return {
        ...preval,
        [name]: value
      };
    });
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
            window.image = res.data.response.responseData.image;
          })
          .catch((err) => {
            message.error("Try Again");
          });
      }
    }
  };

  const saveData = (e) => {
    e.preventDefault();
    setalldata(data);

    let payload = {};
    payload = {
      id: null,
      coachName: data.coachname,
      phoneNumber: data.mobile,
      emailId: data.email,
      specialization: data.special,
      languagesKnow: data.language,
      totalExperience: data.experience,
      shortBio: data.bio,
      twitterId: data.twitter,
      linkedinId: data.linkedin,
      facebookId: data.facebook,
      instagramId: data.instagram,
      coachImage: window.image
    };

    const URL = `${urlPrefix}${createcoach}`;
    if (payload.coachName != "" && payload.coachImage != "") {
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
          seterr(res.data.response.responseMessage);
          window.data = res.data.response.responseMessage;
        })
        .catch((err) => {
          seterr(err.data.response.responseMessage);
          window.data = err.data.response.responseMessage;
        });
    } else {
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

  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => {
    setOpen(false), seterr("");
  };

  return (
    <div style={{ width: "" }}>
      <button onClick={onOpenModal} className='create-event-button target-btn'>
        {" "}
        Add Instructor
      </button>
      <Modal
        open={open}
        closeIcon={closeIcon}
        onClose={onCloseModal}
        center
        styles={{ modal: { borderRadius: "10px" } }}
      >
        <CancelIcon
          style={{
            position: "absolute",
            top: 20,
            right: 5,
            color: "#ef5350",
            cursor: "pointer"
          }}
        />

        <h4> Coach Details </h4>

        <form style={{ padding: "10px" }}>
          <div className='name' style={{ display: "flex", fontSize: 12 }}>
            <div
              style={{ width: "50%", display: "flex", flexDirection: "column" }}
            >
              <label>
                {" "}
                Coach Name <span style={{ color: "red" }}> *</span>
              </label>
              <label className={nameImp} style={{ color: "red" }}>
                required field *{" "}
              </label>
              <input
                required
                onChange={handelchange}
                name='coachname'
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
              <label className={nameImp} style={{ color: "red" }}>
                required field *{" "}
              </label>
              <input
                onChange={handelchange}
                name='mobile'
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
              style={{ width: "50%", display: "flex", flexDirection: "column" }}
            >
              <label>
                {" "}
                Short Bio <span style={{ color: "red" }}> *</span>{" "}
              </label>
              <label className={nameImp} style={{ color: "red" }}>
                required field *{" "}
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
                onChange={handelchange}
                name='bio'
                className='event-text-field'
              />
            </div>

            <div style={{ width: "50%", marginLeft: "10px" }}>
              <label>
                {" "}
                Specialization <span style={{ color: "red" }}> *</span>
              </label>
              <label className={nameImp} style={{ color: "red" }}>
                required field *{" "}
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
                name='special'
                onChange={handelchange}
                className='event-text-field'
              />{" "}
            </div>
          </div>

          <div
            className='name'
            style={{ display: "flex", marginTop: "15px", fontSize: 12 }}
          >
            <div
              style={{ width: "50%", display: "flex", flexDirection: "column" }}
            >
              <label>
                {" "}
                Language known <span style={{ color: "red" }}> *</span>
              </label>
              <label className={nameImp} style={{ color: "red" }}>
                required field *{" "}
              </label>
              <input
                className='border-danger'
                name='language'
                maxLength='150'
                onChange={handelchange}
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
                onChange={handelchange}
                name='experience'
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
              style={{ width: "50%", display: "flex", flexDirection: "column" }}
            >
              <label>
                {" "}
                Email id <span style={{ color: "red" }}> *</span>
              </label>

              <input
                onChange={handelchange}
                name='email'
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
                onChange={handelchange}
                name='twitter'
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
              style={{ width: "50%", display: "flex", flexDirection: "column" }}
            >
              <label> Instagram </label>
              <input
                onChange={handelchange}
                name='instagram'
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
                onChange={handelchange}
                name='linkedin'
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
              style={{ width: "50%", display: "flex", flexDirection: "column" }}
            >
              <label> Facebook </label>
              <input
                onChange={handelchange}
                name='facebook'
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
              <label id='img'>
                {" "}
                select Image <span style={{ color: "red" }}> *</span>
              </label>

              <input
                type='file'
                name='img'
                onChange={(e) => {
                  onFileChange(e);
                }}
                style={{ fontSize: 12, marginTop: 10 }}
              />
            </div>
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ width: "50%" }}></div>
            <div style={{ width: "50%" }}>
              <p
                style={{
                  marginTop: 10,
                  color: "red"
                }}
              >
                {" "}
                {err}{" "}
              </p>
              <button
                className='is-success'
                onClick={saveData}
                style={{
                  float: "right",
                  marginTop: 0,
                  width: 100,
                  height: 32,
                  marginLeft: 100
                }}
              >
                Submit
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdInstructor;
