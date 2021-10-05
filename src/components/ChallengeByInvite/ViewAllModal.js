import React, { useState } from "react";
import InfoDialog from "../Utility/InfoDialog";
import Pagination from "@material-ui/lab/Pagination";

const ViewAllModal = ({ viewAll, handleClose, challenge, data }) => {
  const [page, setPage] = useState(1);

  const handleChange = (event, value) => {
    setPage(value);
  };
  return (
    <InfoDialog open={viewAll} onClose={handleClose}>
      <div className='d-flex flex-column'>
        {" "}
        <div className='all-time-score-container'>
          <table>
            <tr>
              <th
                style={{
                  textAlign: "left",
                  width: "33%"
                }}
              >
                Date
              </th>
              <th
                style={{
                  textAlign: "left",
                  width: "33%"
                }}
              >
                {challenge.receiverName}
              </th>
              <th
                style={{
                  textAlign: "left",
                  width: "33%"
                }}
              >
                {challenge.senderName}
              </th>
            </tr>
            {data
              .slice(13 * (page - 1))
              .slice(0, 13)
              .map((item, index) => (
                <tr>
                  <td style={{ width: "33%" }}>{item.date}</td>
                  <td
                    style={{
                      width: "33%",
                      fontWeight:
                        item["receiverScore"] > item["senderScore"] ? 800 : 300,
                      background:
                        item["receiverScore"] > item["senderScore"]
                          ? "#DCFCE7"
                          : "#FFF",
                      color:
                        item["receiverScore"] > item["senderScore"]
                          ? "#14532D"
                          : "#000"
                    }}
                  >
                    {item["receiverScore"]}
                  </td>
                  <td
                    style={{
                      width: "33%",
                      fontWeight:
                        item["senderScore"] > item["receiverScore"] ? 800 : 300,
                      background:
                        item["senderScore"] > item["receiverScore"]
                          ? "#DCFCE7"
                          : "#FFF",
                      color:
                        item["senderScore"] > item["receiverScore"]
                          ? "#14532D"
                          : "#000"
                    }}
                  >
                    {item["senderScore"]}
                  </td>
                </tr>
              ))}
          </table>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "1.5em",
            marginBottom: 10
          }}
        >
          <Pagination
            count={Math.ceil(data.length / 13)}
            page={page}
            onChange={handleChange}
          />
        </div>
        <div
          style={{
            marginBottom: "1.5em",
            width: "100%",
            textAlign: "center"
          }}
        >
          <button
            style={{
              width: "fit-content",
              height: "auto",
              background: "green",
              borderRadius: 24,
              color: "white",
              padding: "6px 12px"
            }}
            onClick={() => {
              handleClose();
            }}
          >
            Close
          </button>
        </div>
      </div>
    </InfoDialog>
  );
};

export default ViewAllModal;
