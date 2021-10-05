import React, { useEffect, useState } from "react";
import { getActivitySubEvent } from "../../../services/challengeApi";
import { formatDate } from "../../../utils/commonFunctions";

const useActivity = (eventId, value) => {
  const [subEventList, setSubEventList] = useState([]);
  const [scheduledData, setScheduledData] = useState([]);

  const fetchSubEvents = (payload = []) => {
    if (payload.length > 0) {
      const start_date = formatDate(payload[0]);
      const end_date = formatDate(payload[1]);
      payload[0] = start_date;
      payload[1] = end_date;
    }

    if (eventId) {
      getActivitySubEvent(eventId, [])
        .then((res) => {
          const { responseCode, responseData } = res.data.response;
          if (
            responseCode === 0 &&
            responseData &&
            Array.isArray(responseData)
          ) {
            const subEventData = responseData;
            setSubEventList(subEventData);
            // setSubEventList([]);
          } else {
            setSubEventList([]);
          }
        })
        .catch((err) => {
          setSubEventList([]);
        });
      getActivitySubEvent(eventId, payload)
        .then((res) => {
          const { responseCode, responseData } = res.data.response;
          if (
            responseCode === 0 &&
            responseData &&
            Array.isArray(responseData)
          ) {
            const subEventData = responseData;
            setScheduledData(subEventData);
          } else {
            setScheduledData([]);
          }
        })
        .catch((err) => {
          setScheduledData([]);
        });
    } else {
      setSubEventList([]);
      setScheduledData([]);
    }
  };

  useEffect(() => {
    fetchSubEvents(value);
  }, [eventId]);

  return [subEventList, scheduledData, fetchSubEvents];
};

export default useActivity;
