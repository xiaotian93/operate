import React from "react";
import {Button} from "antd";
const AudioModal=({currentTime,allTime,changeTime,onMuteAudio,changeVolume,isMuted,volume,rateList,playRate,changePlayRate,formatSecond,visible})=>{
    return <div className="ant-notification ant-notification-topRight ant-notification-notice" style={{right:"20px",top:"60px",bottom:"auto",display:visible?"block":"none",position:"fixed",width:220,background:"#fff",padding:15,borderRadius:5,boxShadow:"0px 0px 5px rgba(0,0,0,0.5)",zIndex:100}}>
    <div>
    <span>
      {formatSecond(currentTime) + "/" + formatSecond(allTime)}
    </span>
    <input
      type="range"
      step="0.01"
      max={allTime}
      value={currentTime}
      onChange={changeTime}
    />
  </div>
  {/* <div onClick={onMuteAudio}>静音</div>
  <div>
    <span>音量调节：</span>
    <input
      type="range"
      onChange={changeVolume}
      value={isMuted ? 0 : volume}
    />
  </div> */}

  <div>
    <span>倍速播放：</span>
    {rateList &&
      rateList.length > 0 &&
      rateList.map((item) => (
        <Button
          key={item}
          style={
            playRate === item
              ? {
                  border: "1px solid #188eff",
                  color: "#188eff",
                }
              : null
          }
          onClick={() => changePlayRate(item)}
          size="small"
        >
          {item}
        </Button>
      ))}
  </div>
  </div>
}
export default AudioModal