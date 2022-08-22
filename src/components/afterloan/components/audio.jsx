import React, { Component } from "react";
import {Icon,} from "antd";
import { axios_postloan } from '../../../ajax/request';
// import { host_xjd } from '../../../ajax/config';
import {afterloan_call_audio } from '../../../ajax/api';
import AudioModal from './audioModal';
class App extends Component {
  constructor(props) {
    super(props);
    props.onRef(this);
    this.state = {
      rateList: [1.0, 1.25, 1.5, 2.0],
      playRate: 1.0,
      isPlay: false,
      isMuted: false,
      volume: 100,
      allTime: 0,
      currentTime: 0,
    };
  }

  componentDidMount() {
    // this.getAudio(this.props.src)
  }
  componentWillReceiveProps(props){
    if(!props.isPlay){
      this.pauseAudio();
    }
  }
    
  getAudio(data){
    axios_postloan.post(afterloan_call_audio,{requestNo:data}).then(e=>{
      if(!e.code){
          this.setState({
            src:e.data
          })
      }
  })
}
  formatSecond(time) {
    const second = Math.floor(time % 60);
    let minite = Math.floor(time / 60);
    return `${minite}:${second >= 10 ? second : `0${second}`}`;
  }

  // 该视频已准备好开始播放
  onCanPlay() {

    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);
    this.setState({
      allTime: audio.duration,
    });
  };

  playAudio() {
    var getUrl=this.props.getUrl;
    this.props.play(this.props.src);
    if(!getUrl){
      this.getAudio(this.props.src);
    }
    // this.getAudio(this.props.src)
    // this.pauseAudio();
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);console.log(audio)
    setTimeout(function(){
      audio.play();
    },300)
    
    // console.log(audio.duration)
    this.setState({
      isPlay: true,
      currentTime:this.state.currentTime
    });
  };
  pauseAudio () {
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);
    audio.pause();
    this.setState({
      isPlay: false,
    });
  };

  onMuteAudio () {
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);
    this.setState({
      isMuted: !audio.muted,
    });
    audio.muted = !audio.muted;
  };

  changeTime (e) {
    const { value } = e.target;
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);
    this.setState({
      currentTime: value,
    });
    audio.currentTime = value;
    if (value === audio.duration) {
      this.setState({
        isPlay: false,
      });
    }
  };

  // 当前播放位置改变时执行
  onTimeUpdate () {
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);

    this.setState({
      currentTime: audio.currentTime,
    });
    if (audio.currentTime === audio.duration) {
      this.setState({
        isPlay: false,
      });
    }
  };

  changeVolume (e) {
    const { value } = e.target;
    const { id } = this.props;
    const audio = document.getElementById(`audio${id}`);
    audio.volume = value / 100;

    this.setState({
      volume: value,
      isMuted: !value,
    });
  };

  // 倍速播放
  changePlayRate (num) {
    this.audioDom.playbackRate = num;
    this.setState({
      playRate: num,
    });
  };

  render() {
    const { id } = this.props;

    const {
      isPlay,
      src,
      // isMuted,
      // volume,
      // allTime,
      // currentTime,
      // rateList,
      // playRate,
    } = this.state;
        return (
      <div>
        <audio
          id={`audio${id}`}
          src={src}
          ref={(audio) => {
            this.audioDom = audio;
          }}
          preload={"auto"}
          onCanPlay={this.onCanPlay.bind(this)}
          onTimeUpdate={this.onTimeUpdate.bind(this)}
        >
          <track src={src} kind="captions" />
        </audio>

        {isPlay&&this.props.isPlay ? (
        //   <div onClick={this.pauseAudio.bind(this)}>暂停</div>
          <Icon type="pause-circle" onClick={this.pauseAudio.bind(this)} style={{fontSize:"20px",color:"#1B84FF",pointer:"cursor"}} />
        //   <Icon type="question" style={{ fontSize: 16, color: '#08c' }} />
        ) : (
        //   <div onClick={this.playAudio.bind(this)}>播放</div>
          <Icon type="play-circle" onClick={this.playAudio.bind(this)} style={{fontSize:"20px",color:"#1B84FF",pointer:"cursor"}} disabled />
        )}
        <AudioModal currentTime={this.state.currentTime} allTime={this.state.allTime} changeTime={this.changeTime.bind(this)} onMuteAudio={this.onMuteAudio.bind(this)} changeVolume={this.changeVolume.bind(this)} isMuted={this.state.isMuted} volume={this.state.volume} rateList={this.state.rateList} playRate={this.state.playRate} changePlayRate={this.changePlayRate.bind(this)} formatSecond={this.formatSecond.bind(this)} visible={isPlay&&this.props.isPlay} />
        {/* <div style={{float:"left"}}>
          <span>
            {this.formatSecond(currentTime) + "/" + this.formatSecond(allTime)}
          </span>
          <input
            type="range"
            step="0.01"
            max={allTime}
            value={currentTime}
            onChange={this.changeTime.bind(this)}
          />
        </div> */}
        {/* <div onClick={this.onMuteAudio.bind(this)}>静音</div>

        <div>
          <span>音量调节：</span>
          <input
            type="range"
            onChange={this.changeVolume.bind(this)}
            value={isMuted ? 0 : volume}
          />
        </div>

        <div>
          <span>倍速播放：</span>
          {rateList &&
            rateList.length > 0 &&
            rateList.map((item) => (
              <button
                key={item}
                style={
                  playRate === item
                    ? {
                        border: "1px solid #188eff",
                        color: "#188eff",
                      }
                    : null
                }
                onClick={() => this.changePlayRate(item)}
              >
                {item}
              </button>
            ))}
        </div> */}
      </div>
    );
  }
}

export default App;
