import React , { Component } from 'react';
// import ImgViewer from '../../../templates/ImgViewer';
import Image from '../../../templates/ImageTag';


class ImgViewerDoc extends Component {

    constructor(props){
        super(props);
        this.state = {

        }
        let a = {
            src:"http://static.image.baimaodai.com/20180409/201804091823312707_idCard_0.jpg",
            des:"描述1"
        }
        let b = {
            src:"http://pic33.photophoto.cn/20141022/0019032438899352_b.jpg",
            des:"描述2"
        }
        let c = {
            src:"http://img5.duitang.com/uploads/item/201411/07/20141107164412_v284V.jpeg",
            des:"描述3"
        }
        this.imgs = [a,b,c];
    }
    render(){
        return (
            <div className="content">
                <Image imgs={this.imgs} />
            <style>{
                `
                #images{
                    display:flex;
                    justify-content:space-between;
                    width:600px
                }
                #images img{
                    width:80px;
                }
                `
            }</style>
            </div>
        )
    }
}

export default ImgViewerDoc;