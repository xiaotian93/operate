import React, { Component } from 'react';
import ImgViewer from './ImgViewer';

class ImgViewerDoc extends Component {
    constructor(props) {
        super(props)
        this.state = {
            imgarr: []
        }
        this.sty = [];
        this.imgUrls = [];
        // this.viewer = new ImgViewer([],{index:1,show:false});
    }

    componentWillReceiveProps(props) {
        this.sty = [];
        this.imgUrls = [];
        for (let i in props.imgs) {
            this.set_img(props.imgs[i], 190, 110, i)
        }
    }
    shouldComponentUpdate(props) {
        if (props.imgs.length > 0) {
            // console.log(props.imgs[0])
            this.viewer = new ImgViewer(props.imgs, { index: 1, show: false });
            return true;
        } else {
            return false
        }
    }
    componentDidUpdate() {
        // console.log(this.props.imgs)
    }
    show_img(index) {
        this.viewer.view(index);
    }
    pushImg() {

    }
    set_img(e, c, h, i) {

        // 图片地址
        var img_url = e.src;
        // 创建对象
        var img = new Image();
        // 改变图片的src
        img.src = img_url;
        // 判断是否有缓存
        if (img.complete) {
            if (e.key) {
                if (this.imgUrls.indexOf(e.key) >= 0) return;
                this.imgUrls.push(e.key);
            } else {
                if (this.imgUrls.indexOf(img_url) >= 0) return;
                this.imgUrls.push(img_url);
            }
            if (img.width <= img.height) {
                var set_h = img.height / (img.width / c);
                var top = set_h > h ? (set_h - h) / 2 : (h - set_h) / 2;
                this.sty.push(<li onClick={(e) => { this.show_img(i) }} key={i} ><div className="img-box"><img src={img.src} alt={e.des} style={{ width: "100%", marginTop: set_h > h ? "-" + parseInt(top,10) + "px" : parseInt(top,10) + "px" }} /></div><div className="img-des">{e.des}</div></li>)
            } else {
                var set_w = img.width / (img.height / h);
                var left = set_w > c ? (set_w - c) / 2 : (c - set_w) / 2;
                // e.target.getAttribute("data-key")
                this.sty.push(<li onClick={(e) => { this.show_img(i) }} key={i}><div className="img-box"><img src={img.src} alt={e.des} style={{ height: "100%", marginLeft: set_w > c ? "-" + parseInt(left,10) + "px" : parseInt(left,10) + "px" }} /></div><div className="img-des">{e.des}</div></li>)
                // this.viewer.append(e)
            }
            this.sty.sort(this.sortId)
            this.setState({
                imgarr: this.sty
            })
        } else {
            // 加载完成执行
            img.onload = function () {
                // 打印
                // console.log('from:onload : width:'+img.width+',height:'+img.height);
                if (e.key) {
                    if (this.imgUrls.indexOf(e.key) >= 0) return;
                    this.imgUrls.push(e.key);
                } else {
                    if (this.imgUrls.indexOf(img_url) >= 0) return;
                    this.imgUrls.push(img_url);
                }
                if (img.width <= img.height) {
                    var set_h = img.height / (img.width / c);
                    var top = set_h > h ? (set_h - h) / 2 : (h - set_h) / 2;
                    this.sty.push(<li onClick={(e) => { this.show_img(i) }} key={i} ><div className="img-box"><img src={img.src} alt={e.des} style={{ width: "100%", marginTop: set_h > h ? "-" + parseInt(top,10) + "px" : parseInt(top,10) + "px" }} /></div><div className="img-des">{e.des}</div></li>)
                } else {
                    var set_w = img.width / (img.height / h);
                    var left = set_w > c ? (set_w - c) / 2 : (c - set_w) / 2;
                    // e.target.getAttribute("data-key")
                    this.sty.push(<li onClick={(e) => { this.show_img(i) }} key={i}><div className="img-box"><img src={img.src} alt={e.des} style={{ height: "100%", marginLeft: set_w > c ? "-" + parseInt(left,10) + "px" : parseInt(left,10) + "px" }} /></div><div className="img-des">{e.des}</div></li>)
                    // this.viewer.append(e)
                }
                this.sty.sort(this.sortId)

                this.setState({
                    imgarr: this.sty
                })
            }.bind(this);
            img.onerror = function () {
                if (e.key) {
                    if (this.imgUrls.indexOf(e.key) >= 0) return;
                    this.imgUrls.push(e.key);
                } else {
                    if (this.imgUrls.indexOf(img_url) >= 0) return;
                    this.imgUrls.push(img_url);
                }
                this.sty.push(<li onClick={(e) => { this.show_img(i) }} key={i}><div className="img-box"><img src={img.src} alt={e.des} /></div><div className="img-des">{e.des}</div></li>)
                this.sty.sort(this.sortId)
                this.setState({
                    imgarr: this.sty
                })
            }.bind(this)
        }
    }
    sortId(a, b) {
        return a.key - b.key
    }
    render() {
        return (
            <div>
                <ul id="image-proview-list" style={{ width: this.props.width || "100%" }}>
                    {this.state.imgarr}
                </ul>
                <style>{
                    `
                    #image-proview-list{
                        
                        overflow:hidden
                    }
                    #image-proview-list li{
                        margin-bottom:15px;
                        float:left;
                    }
                    #image-proview-list li .img-box{
            
                        width:190px;
                        height:110px;
                        overflow:hidden;
                        margin-right:15px;
                        margin-bottom:10px;
                        background-position:center;
                        background-size:cover;
                    }
                    #image-proview-list li .img-des{
                        width:190px;
                        text-align:center
                    }
                    `
                }</style>
            </div>
        )
    }
}

export default ImgViewerDoc;