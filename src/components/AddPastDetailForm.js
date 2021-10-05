import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import { addSupportingDoc } from "../services/challengeApi";
import Message from "antd-message";

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`
  };
}

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 320,
    backgroundColor: "#fff",
    padding: 24,
    borderRadius: 12,
    outline: "none"
  }
}));

export default function AddPastDetailForm({
  selectedDate,
  displayModal,
  setDisplayModal,
  eventId,
  handlePerformanceClick
}) {
  const [state, setState] = useState({
    unit: "",
    data: "",
    supporting_doc: "",
    supporting_doc_obj: ""
  });

  const disableSubmit =
    Object.values(state).filter((val) => val === "" || val === undefined)
      .length > 0;

  const classes = useStyles();
  // getModalStyle is not a pure function, we roll the style only on the first render
  const [modalStyle] = React.useState(getModalStyle);

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const onFileChange = (event) => {
    if (event.target.files) {
      const { files } = event.target;
      if (files && files.length > 0) {
        getBase64(files[0]).then((res) => {
          setState({
            ...state,
            supporting_doc_obj: files[0],
            supporting_doc: res
          });
        });
      }
    }
  };

  const handleSubmit = () => {
    window.message = Message;
    const formData = new FormData();
    formData.append("avatar", state.supporting_doc_obj);
    formData.append("data", state.data);
    formData.append("date", selectedDate);
    formData.append("rawUnit", state.unit);
    formData.append("eventId", eventId);

    addSupportingDoc(formData)
      .then((res) => {
        message.success("Success");
        setDisplayModal(false);
        handlePerformanceClick();
      })
      .catch((err) => {
        message.error("Try Again");
      });
  };

  const body = (
    <div style={modalStyle} className={classes.paper}>
      <div className='supporting-doc-container'>
        <div style={{ display: "flex" }}>
          <div
            style={{
              maxWidth: 150,
              marginRight: "1.25rem"
            }}
          >
            <div className='mhealth-input-box' style={{ marginBottom: "2rem" }}>
              <label>Date</label>
              {selectedDate}
            </div>
            {/* <div className="mhealth-input-box parallel"> */}
            <div className='mhealth-input-box' style={{ marginBottom: "2rem" }}>
              <label>Data</label>
              <input
                type='number'
                value={state.data}
                placeholder='Enter data'
                onChange={(e) => {
                  setState({
                    ...state,
                    data: e.target.value
                  });
                }}
              />
            </div>
            <div className='mhealth-input-box' style={{ marginBottom: "2rem" }}>
              <label>Unit</label>
              <select
                value={state.unit}
                width={"100%"}
                placeholder='ex: KM/STEP/MILE'
                onChange={(e) => {
                  setState({
                    ...state,
                    unit: e.target.value
                  });
                }}
              >
                <option value={undefined}>--Select--</option>
                <option value={"KM"}>KM</option>
                <option value={"MILE"}>MILE</option>
                <option value={"STEP"}>STEP</option>
              </select>
              {/* </div> */}
            </div>
          </div>
          <div style={{ minWidth: 150, minHeight: 240 }}>
            <div className='mhealth-input-box '>
              <label>Supporting Document</label>
            </div>
            {state.supporting_doc !== "" ? (
              <>
                <div
                  className='mhealth-input-box'
                  style={{
                    maxWidth: 145,
                    maxHeight: 200,
                    backgroundPosition: "50% 50%",
                    backgroundSize: "cover"
                  }}
                >
                  <img src={state.supporting_doc} width={150} height={150} />
                </div>
                <button
                  style={{ margin: 10 }}
                  className='select-supporting-doc-button'
                  onClick={() => {
                    setState({
                      ...state,
                      supporting_doc: "",
                      supporting_doc_obj: ""
                    });
                  }}
                >
                  Remove
                </button>
              </>
            ) : (
              <div className='mhealth-input-box'>
                <input
                  id='avatar-select-input'
                  className='select-avatar-input'
                  type='file'
                  onChange={(e) => {
                    onFileChange(e);
                  }}
                  accept='image/*'
                />
                <button
                  className='select-avatar-button'
                  style={{
                    margin: 0,
                    marginTop: "1rem",
                    height: 170,
                    borderRadius: 4,
                    borderColor: "gray"
                  }}
                  onClick={() => {
                    document.getElementById("avatar-select-input").click();
                  }}
                >
                  Select Image
                </button>
                <span style={{ color: "red", fontSize: 11 }}>
                  {" "}
                  Image size should not exceed 2 MB.{" "}
                </span>
              </div>
            )}
          </div>
        </div>
        <div className='mhealth-input-box'>
          <button
            className={disableSubmit ? "is-disabled" : "is-success"}
            onClick={handleSubmit}
            disabled={disableSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <Modal
        open={displayModal}
        onClose={() => setDisplayModal(false)}
        aria-labelledby='simple-modal-title'
        aria-describedby='simple-modal-description'
      >
        {body}
      </Modal>
    </div>
  );
}
