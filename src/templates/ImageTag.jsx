import React , { Component } from 'react';
import ImgViewer from './ImgViewer';

class ImgViewerDoc extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }
    shouldComponentUpdate(props){
        if(props.imgs.length>0){
            this.viewer = new ImgViewer(props.imgs,{index:1,show:false});
            return true;
        }else{
            return false
        }
    }
    show_img(index){
        this.viewer.view(index);
    }
    render(){
        let imgs = this.props.imgs;
        let lis = [];
        for(let i in imgs){
            lis.push(<li key={i} onClick={(e)=>{this.show_img(i)}}><img src={imgs[i].src} alt={imgs[i].des} key={i} /><div>{imgs[i].des}</div></li>)
        }
        return (
            <div>
                <ul id="image-proview-list" style={{width:this.props.width||"100%"}}>
                    { lis }
                </ul>
                <style>{
                    `
                    #image-proview-list{
                        overflow:hidden;
                    }
                    #image-proview-list li div{
                        position: absolute;
                        bottom: 0px;
                    }
                    #image-proview-list li{
                        display: flex;
                        align-items: center;
                        flex-direction: column;
                        justify-content: center;
                        position: relative;
                        padding-bottom: 20px;

                        width:160px;
                        height:160px;
                        overflow:hidden;
                        float:left;
                        margin-right:15px;
                        margin-bottom:10px;
                    }
                    #image-proview-list li img{
                        max-width:100%;
                        max-height:90%;
                    }
                    `
                }</style>
            </div>
        )
    }
}

export default ImgViewerDoc;