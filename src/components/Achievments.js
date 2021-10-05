import React from "react";
import Imgshow from "./AchievementGrayFiles/Imgshow";

export const Achievments = (props) => {
  return (
    <>
      {" "}
      <div style={{ lineheight: 10 }}>
        <Imgshow logo={props.logos} event={props.eventId}/>
        {/* images */}
      </div>
    </>
  );
};
