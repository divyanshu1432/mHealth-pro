import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import {
  getUserDetailsHandler,
  updateUserDetailsHandler,
  updateAvatarAndAliasHandler,
  validateAliasName,
  getDashboardTabs
} from "../services/userprofileApi";
import Message from "antd-message";
import Avatar from "@material-ui/core/Avatar";
import { APP } from "../utils/appConfig";
import TopUserDetails from "./TopUserDetails";
import DatePicker from "./DatePicker";
import message from "antd-message";

const Profile = () => {
  const [userDetails, setUserDetails] = useState({
    firstName: "",
    lastName: "",
    country: "",
    emailId: "",
    gender: "",
    city: "",
    dob: "",
    avtarImg: "",
    avtarImgObject: "",
    aliasName: "",
    authorizedDatasource: [],
    state: "",
    pinCode: "",
    dashboard_default_tab: "",
    dashboard_view_status: ""
  });

  const [isLoadingUserDetails, setLoadingUserDetails] = useState(false);
  const [isLoadingAvatar, setLoadingAvatar] = useState(false);
  const [isCheckingAlias, setCheckingAlias] = useState(false);
  const [aliasErrMessage, setAliasErrMessage] = useState("");
  const [profileUpdatedFlag, setProfileUpdatedFlag] = useState(false);
  const [listOfTabs, setListOfTabs] = useState([]);

  useEffect(() => {
    getUserDetailsHandler()
      .then((res) => {
        setUserDetails({
          ...userDetails,
          firstName: res.data.response.responseData.firstName,
          lastName: res.data.response.responseData.lastName,
          country: res.data.response.responseData.country,
          emailId: res.data.response.responseData.emailId,
          gender: res.data.response.responseData.gender,
          city: res.data.response.responseData.city,
          dob: res.data.response.responseData.dob
            ? res.data.response.responseData.dob.split(" ")[0]
            : "",
          avtarImg: res.data.response.responseData.avtarImg,
          aliasName: res.data.response.responseData.aliasName,
          authorizedDatasource:
            res.data.response.responseData.authorizedDatasource,
          state: res.data.response.responseData.state,
          pinCode: res.data.response.responseData.pinCode,
          dashboard_default_tab:
            res.data.response.responseData.dashboard_default_tab,
          dashboard_view_status:
            res.data.response.responseData.dashboard_view_status
        });
        localStorage.setItem(
          "authorizedDatasource",
          JSON.stringify(res.data.response.responseData.authorizedDatasource)
        );
        localStorage.setItem(
          "dashboard_default_tab",
          res.data.response.responseData.dashboard_default_tab
        );
        localStorage.setItem(
          "dashboard_view_status",
          res.data.response.responseData.dashboard_view_status
        );
      })
      .catch((err) => {});

    getDashboardTabs()
      .then((res) => {
        console.log(res);
        if (res.data.response && res.data.response.responseData) {
          setListOfTabs(res.data.response.responseData);
        } else {
          setListOfTabs([]);
        }
      })
      .catch((err) => {
        setListOfTabs([]);
      });
  }, []);

  const handleInputChange = (type, value) => {
    setUserDetails({
      ...userDetails,
      [type]: value
    });
  };

  const handleUserDetailSubmit = () => {
    window.message = Message;
    const {
      country,
      firstName,
      lastName,
      emailId,
      gender,
      city,
      dob,
      state,
      pinCode,
      dashboard_default_tab,
      dashboard_view_status
    } = userDetails;

    if (!userDetails.country || userDetails.country === "") {
      message.error("Country cannot be empty");
      return;
    }
    if (dashboard_view_status === "" && dashboard_default_tab === "") {
      message.error("Default Tab and View cannot be empty");
      return;
    }
    if (!dashboard_default_tab || dashboard_default_tab === "") {
      message.error("Default Tab cannot be empty");
      return;
    }

    if (dashboard_view_status === "") {
      message.error("Default View cannot be empty");
      return;
    }

    setLoadingUserDetails(true);
    let payload = {};

    if (firstName && firstName !== "") {
      payload["firstName"] = firstName;
    }
    if (lastName && lastName !== "") {
      payload["lastName"] = lastName;
    }
    if (country && country !== "") {
      payload["country"] = APP.countryCode[country.toUpperCase()];
    }
    if (emailId && emailId !== "") {
      payload["emailId"] = emailId;
    }
    if (gender && gender !== "") {
      payload["gender"] = gender;
    }
    if (city && city !== "") {
      payload["city"] = city;
    }
    if (state && state !== "") {
      payload["state"] = state;
    }
    if (pinCode && pinCode !== "") {
      payload["pinCode"] = pinCode;
    }
    if (dob && dob !== "") {
      payload["dob"] = dob + " 12:00:00";
    }

    if (dashboard_default_tab && dashboard_default_tab != "") {
      payload["dashboard_default_tab"] = dashboard_default_tab;
    }
    if (dashboard_view_status == 0 || dashboard_view_status == 1) {
      payload["dashboard_view_status"] = dashboard_view_status;
    }

    updateUserDetailsHandler(payload)
      .then((res) => {
        setLoadingUserDetails(false);
        setProfileUpdatedFlag(true);
        message.success("Profile Updated");
        localStorage.setItem("emailId", payload.emailId);
        localStorage.setItem("gender", payload.gender);
        localStorage.setItem("dob", payload.dob);
        localStorage.setItem("state", payload.state);
        localStorage.setItem("pinCode", payload.pinCode);
        localStorage.setItem(
          "dashboard_default_tab",
          payload.dashboard_default_tab
        );
        localStorage.setItem(
          "dashboard_view_status",
          payload.dashboard_view_status
        );
      })
      .catch((err) => {
        setLoadingUserDetails(false);
        message.error("Something went wrong");
      });
  };

  const updateAvatrAndAlias = () => {
    window.message = Message;
    setCheckingAlias(true);
    validateAliasName(userDetails.aliasName)
      .then((res) => {
        setCheckingAlias(false);
        if (res.data.response.responseCode === 181) {
          setAliasErrMessage(res.data.response.responseMessage);
          message.warning("Failed to update");
          return false;
        } else {
          setAliasErrMessage("");
        }

        const { avtarImgObject, aliasName } = userDetails;
        setLoadingAvatar(true);
        const formData = new FormData();
        if (avtarImgObject && avtarImgObject !== "") {
          formData.append("avatar", avtarImgObject);
        }

        if (avtarImgObject || aliasName) {
          updateAvatarAndAliasHandler(aliasName, formData)
            .then((res) => {
              setLoadingAvatar(false);
              setProfileUpdatedFlag(true);
              if (res.data.response.responseCode === 0) {
                localStorage.setItem("aliasName", userDetails.aliasName);
                localStorage.setItem("avatarImg", userDetails.avtarImg);
                message.success("Updated Successfully!!!");
                setUpdateAgain(!updateAgain);
              }
            })
            .catch((err) => {
              setLoadingAvatar(false);
              message.error("Something went wrong");
            });
        }
      })
      .catch((err) => {
        message.error("Failed to save. Try again");
      });
  };

  const {
    firstName,
    lastName,
    country,
    emailId,
    gender,
    city,
    dob,
    state,
    pinCode,
    dashboard_default_tab,
    dashboard_view_status
  } = userDetails;

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
          setUserDetails({
            ...userDetails,
            avtarImgObject: files[0],
            avtarImg: res
          });
        });
      }
    }
  };

  const [updateAgain, setUpdateAgain] = useState(false);
  return (
    <div className='Profile'>
      <TopUserDetails updateAgain={updateAgain} />
      <Navbar />
      <div className='profile-background' style={{ flexDirection: "column" }}>
        <div
          className='form'
          style={{ background: "transparent", boxShadow: "none" }}
        >
          {/* <div className="heading" style={{textAlign: 'center'}}>
            View and add your details
          </div> */}

          <div className='basic-info-container'>
            <div className='basic-info flex-row'>
              <div className='box '>
                <div className='mhealth-input-box padding-05em'>
                  <label>Avatar</label>
                  <div className='avatar-container'>
                    <div className='avatar'>
                      <Avatar
                        src={userDetails.avtarImg}
                        className='avatar-size'
                        style={{ border: "2px solid #fff" }}
                      />
                    </div>
                    <input
                      id='avatar-select-input'
                      className='select-avatar-input'
                      type='file'
                      onChange={(e) => {
                        onFileChange(e);
                      }}
                    />{" "}
                    {userDetails.avtarImg ? (
                      ""
                    ) : (
                      <span style={{ color: "red", fontSize: 11 }}>
                        {" "}
                        Image size should not exceed 2 MB.{" "}
                      </span>
                    )}
                    <button
                      className='select-avatar-button'
                      onClick={() => {
                        document.getElementById("avatar-select-input").click();
                      }}
                    >
                      Select
                    </button>
                  </div>
                </div>
                <div className='mhealth-input-box padding-05em'>
                  <label>Alias Name</label>
                  <input
                    placeholder='Enter your alias name'
                    value={userDetails.aliasName}
                    onChange={(e) =>
                      handleInputChange("aliasName", e.target.value)
                    }
                    style={{
                      background: aliasErrMessage ? "#FDA4AF" : null
                    }}
                  />
                  <label className='input-error'>{aliasErrMessage}</label>
                </div>
                <div className='avatarSave'>
                  <button
                    className='is-success'
                    onClick={() => updateAvatrAndAlias()}
                  >
                    {isCheckingAlias
                      ? "Checking Alias"
                      : isLoadingAvatar
                      ? "Saving..."
                      : "Save"}
                  </button>
                </div>
              </div>

              <div className='box'>
                <div className='parallel'>
                  <div className='mhealth-input-box padding-05em'>
                    <label>First name</label>
                    <input
                      placeholder='Enter your first name'
                      value={firstName}
                      onChange={(e) =>
                        handleInputChange("firstName", e.target.value)
                      }
                    />
                  </div>
                  <div className='mhealth-input-box padding-05em'>
                    <label>Last name</label>
                    <input
                      placeholder='Enter your last name'
                      value={lastName}
                      onChange={(e) =>
                        handleInputChange("lastName", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className='mhealth-input-box padding-05em'>
                  <label>Email ID</label>
                  <input
                    placeholder='Enter your email id'
                    value={emailId}
                    onChange={(e) =>
                      handleInputChange("emailId", e.target.value)
                    }
                  />
                </div>

                <div className='parallel'>
                  <div className='mhealth-input-box padding-05em'>
                    <label>Gender</label>
                    <select
                      name='gender'
                      value={gender}
                      width={"100%"}
                      onChange={(e) => {
                        handleInputChange("gender", e.target.value);
                      }}
                    >
                      <option value='Male'>Male</option>
                      <option value='Female'>Female</option>
                    </select>
                  </div>
                  <div className='mhealth-input-box padding-05em'>
                    <label>Date of birth (YYYY-MM-DD)</label>
                    <DatePicker
                      placeholder='Enter your Date of birth'
                      value={dob}
                      onChange={(e) => handleInputChange("dob", e)}
                    />
                  </div>
                </div>
                <div className='parallel'>
                  <div className='mhealth-input-box padding-05em'>
                    <label>City</label>
                    <input
                      placeholder='Enter your city'
                      value={city}
                      onChange={(e) =>
                        handleInputChange("city", e.target.value)
                      }
                    />
                  </div>
                  <div className='mhealth-input-box padding-05em'>
                    <label>State</label>
                    <input
                      placeholder='Enter your state'
                      value={state}
                      onChange={(e) =>
                        handleInputChange("state", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className='parallel'>
                  <div className='mhealth-input-box padding-05em'>
                    <label>Country (mandatory)</label>
                    <input
                      placeholder='Enter your country'
                      value={country}
                      onChange={(e) =>
                        handleInputChange("country", e.target.value)
                      }
                    />
                  </div>
                  <div className='mhealth-input-box padding-05em'>
                    <label>Pin Code</label>
                    <input
                      placeholder='Enter your pin code'
                      value={pinCode}
                      onChange={(e) =>
                        handleInputChange("pinCode", e.target.value)
                      }
                    />
                  </div>
                </div>

                <div className='parallel'>
                  <div
                    className='mhealth-input-box padding-05em'
                    style={{ width: "95%" }}
                  >
                    <label>Default Tab</label>
                    <select
                      name='dashboard_default_tab'
                      value={dashboard_default_tab}
                      onChange={(e) => {
                        handleInputChange(
                          "dashboard_default_tab",
                          e.target.value
                        );
                      }}
                    >
                      <option value=''>Select Tab</option>
                      {listOfTabs.map((tab) => (
                        <option value={tab.dashboardTabName} key={tab.id}>
                          {tab.dashboardTabName
                            .split("_")
                            .join(" ")
                            .toUpperCase()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div
                    className='mhealth-input-box padding-05em'
                    style={{ width: "95%" }}
                  >
                    <label>Default View</label>
                    <select
                      name='dashboard_view_status'
                      value={dashboard_view_status}
                      onChange={(e) => {
                        handleInputChange(
                          "dashboard_view_status",
                          e.target.value
                        );
                      }}
                    >
                      <option value=''>Select View</option>
                      <option value={"0"}>Minimize</option>
                      <option value={"1"}>Maximize</option>
                    </select>
                  </div>
                </div>

                <div className='avatarSave'>
                  <button
                    className='is-success'
                    onClick={() => handleUserDetailSubmit()}
                  >
                    {isLoadingUserDetails ? "Saving" : "Save"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
