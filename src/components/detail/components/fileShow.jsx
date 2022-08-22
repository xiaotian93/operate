import React, { Component } from 'react';
// import moment from 'moment'
/**
 * source  []
 * { title:String,files:[{name:String,src:String}] }
 */

class FileShow extends Component{
    constructor(props) {
        super(props);
        this.state = {
            files:this.createEle(props.source)
        };
    }

    componentWillReceiveProps(props){
        this.setState({
            files:this.createEle(props.source)
        })
    }
    createEle(source){
        let filesEle = [];
        for(let s in source){
            let temp = [];
            for(let f in source[s].file){
                if(source[s].file[f].src){
                    temp.push(<a key={f} target="_blank" href={source[s].file[f].src}>{source[s].file[f].name}</a>)
                }else{
                    temp.push(<span key={f+"b"}>--</span>)
                }
            }
            if(temp.length<=0){
                temp.push(<span>--</span>)
            }
            filesEle.push(
                <div className="file-item" key={s}>
                    <span>{source[s].title}</span>
                    { temp }
                </div>
            )
        }
        return filesEle
    }
    render (){
        return(
            <div className="files-content">
                {/* <div className="file-item">
                    <span>借款协议</span>
                    <a href="">借款协议</a>
                </div>
                <div className="file-item">
                    <span>借款协议</span>
                    <a href="">借款协议</a>
                    <a href="">借款协议</a>
                    <a href="">借款协议</a>
                    <a href="">借款协议</a>
                </div> */}
                {this.state.files}
                <style>{
                    `.files-content:{
                        fost-size:14px;
                    }
                    .files-content .file-item{
                        display:flex;
                        margin-bottom:20px;
                    }
                    .files-content .file-item span{
                        font-weight: bolder;
                        margin-right: 10px;
                    }
                    .files-content .file-item a{
                        text-decoration: underline;
                        margin-right: 8px;
                    }
                    `
                }</style>
            </div>
        )
    }
}

export default FileShow;
