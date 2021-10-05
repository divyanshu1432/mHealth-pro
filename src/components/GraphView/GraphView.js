import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import React, { useState, useEffect } from "react";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Charts from "react-google-charts";
import { CSVLink } from "react-csv";
import "./GraphView.css";
import Tooltip from "@material-ui/core/Tooltip";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import { useTheme } from "@material-ui/core/styles";
import Message from "antd-message";
import { LocalSeeOutlined } from "@material-ui/icons";
import { urlPrefix , secretToken} from "../../services/apicollection";
const GraphReport = (props) => {
  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(2)
    },
    button: {
      margin: theme.spacing(1, 1, 0, 0)
    }
  }));
  console.log(props.events)
  const [Event, setEvent] = useState([]);
  const [data, setData] = useState([]);
  const [Err, setErr] = useState("");
  const geteventrlist = () => {

       setData(props.events)
      
  };
  const handleChange = (e) => {
    setEvent(e.target.value);
  };
  const [chartData, setChartData] = useState([]);
  const [circle, setCircle] = useState([]);

  function submit(e) {
    e.preventDefault();

    axios
      .get(
        `https://testapi.mhealth.ai:8081/v1.0/getDashboardReport?challengerZoneId=${Event}`,
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
        // console.log(res.data.response.responseData.totalMembers);

        {
          res.data.response.responseData
            ? setChartData(res.data.response.responseData.subEventAttendies)
            : Message.error(res.data.response.responseMessage);
        }
        setCircle(res.data.response.responseData?.totalMembers);
      });
  }
  useEffect(() => {
    geteventrlist();
  }, []);
  //   console.log(chartData)

  return (
    <>
      {/* <div style={{ backgroundColor: "white" }}> */}
      <div style={{ height: "80vh", background: "white", overflowY: "scroll" }}>
        <div class='container' style={{ maxWidth: "50%" }}>
          <form
            onSubmit={(e) =>
              Event ? submit(e) : setErr("Please select an event")
            }
          >
            <div
              class='row'
              style={{ display: "flex", justifyContent: "space-around" }}
            >
              <div
                className='select_date'
                style={{
                  maxWidth: "250px"
                }}
              >
                <fieldset>
                  <legend>Select Event</legend>
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
                    {/* <option value='null'>Select Event ....</option> */}
                    {data &&
                      data.map(function (ev, index) {
                        return (
                          <MenuItem required value={ev.id}>
                            {ev.challengeName}
                          </MenuItem>
                        );
                      })}
                  </Select>
                </fieldset>
              </div>

              {/* <div class='col-md-1'></div> */}

              <button
                style={{
                  color: "white",
                  background: "green",
                  height: 30,
                  width: 80,
                  marginTop: 20
                }}
                class='btn btn-success'
              >
                {" "}
                Submit
              </button>
            </div>
          </form>
        </div>{" "}
        <hr />{" "}
        <div style={{}}>
          <div
            style={{
              //   height: "50vh",
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              flexWrap: "wrap"
            }}
          >
            {chartData && chartData.length > 0 ? (
              chartData.map((item, index) => {
                console.log(item.length, "item");
                return (
                  <Charts
                    width={"350px"}
                    height={"200px"}
                    chartType='PieChart'
                    paddingLeft={"0px"}
                    loader={<div>Loading Chart</div>}
                    data={[
                      ["Task", "Hours per Day"],

                      ["Total Members", circle],
                      ["No of subscribers", item.noOfSubscribers],

                      ["No of Attendence", item.noOfAttendies]
                    ]}
                    options={{
                      is3D: true
                    }}
                  />
                );
              })
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
          </div>
        </div>
      </div>
    </>
  );
};
export default GraphReport;
