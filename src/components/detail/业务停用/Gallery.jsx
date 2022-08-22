/**
 * Created by hao.cheng on 2017/5/6.
 */
import React from 'react';
import { Card ,Button,message} from 'antd';
import { axios_sh } from "../../../ajax/request";
import { deny_archive } from "../../../ajax/api";
//import BreadcrumbCustom from './BreadcrumbCustom';
import PhotoSwipe from 'photoswipe';
import PhotoswipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';
class Gallery extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            gallery: null,
            first:true,
            src:''
        }
    }
    componentDidMount() {

    }
    componentWillUnmount() {
        //var img=document.getElementById('checked');console.log(img);
        this.closeGallery();
    };
    openGallery(item,k) {
        const items = [
            {
                src: item,
                w: 0,
                h: 0,
            }
        ];
        //alert(k)
        //var items=[];
        //for(var i in item){
        //    var test={
        //        src:item[i].src,
        //        w:0,
        //        h:0
        //    };
        //    items.push(test);
        //}
        this.setState({
            src:item
        })
         const pswpElement = this.pswpElement;
        const options = {index: k};
        this.gallery = new PhotoSwipe( pswpElement, PhotoswipeUIDefault, items, options);
        this.gallery.listen('gettingData', (index, item) => {
            const _this = this;
            if (item.w < 1 || item.h < 1) { // unknown size
                //alert(item.src)
                var img = new Image();
                img.onload = function() { // will get size after load
                    item.w = this.width; // set image width
                    item.h = this.height; // set image height
                    _this.gallery.invalidateCurrItems(); // reinit Items
                    _this.gallery.updateSize(true); // reinit Items
                };
                img.src = item.src; // let's download image
            }
        });
        this.gallery.init();
    };
    closeGallery () {
        if (!this.gallery) return;
        this.gallery.close();
    };
    reject(){
        if(this.state.first){
            var orderNo=this.props.orderNo;
            axios_sh.get(deny_archive+'?orderNo='+orderNo).then((e)=>{
                if(e.code===0){
                    message.success('操作成功');
                    this.setState({
                        first:false
                    })
                }

            })
        }else{
            message.warn('已驳回补填保单');
        }
    }

    render() {
        var setSrc=this.state.src;
        var img=this.props.card;
        var num=0;
        function rotate(){

            num++;
            //setTimeout(function(){
                var img=document.getElementById('checked');
                img.setAttribute('src',setSrc);
                var current=90*num;
                img.style.transform='rotate('+current+'deg)';
            alert(num+'--'+current);console.log(img)
            //},1000)

        }
        function close(){
            num=0;
            var img=document.getElementById('checked');
            img.setAttribute('src',setSrc);
            img.style.transform='none';
        }
        return (

            <div className="gutter-example button-demo">
                {
                    //<img onClick={() => this.openGallery(v1.src||v1.url)} alt="暂无图片" width={this.props.width?"":"100%"} src={v1.src||v1.thumbUrl} height={this.props.width?"100%":""} />
                }
                {
                    img!==undefined?img.map(function(v1,k) {
                        return (
                                <div className="gutter-box" key={k} style={{width:this.props.width||"",margin:this.props.marginLeft||""}}>
                                    <Card bordered={false} bodyStyle={{ padding: 0 }}>
                                        <div className="imgBox" style={{height:this.props.width||""}}>
                                            <img onClick={() => this.openGallery(v1.src||v1.url)} alt="暂无图片" width={this.props.width?"":"100%"} src={v1.src||v1.thumbUrl} height={this.props.width?"100%":""} />
                                        </div>
                                    </Card>
                                    <div className="pa-m" style={{lineHeight:this.props.lineHeight||""}}>
                                        <h3>{v1.des}
                                            {v1.btn==="true"?<Button size="small" style={{float:'right'}} onClick={this.reject.bind(this)}>保单驳回</Button>:""}
                                        </h3>
                                    </div>
                                </div>
                            )

                    }.bind(this)):""
                }


                <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true" ref={(div) => {this.pswpElement = div;} }>

                    <div className="pswp__bg" />

                    <div className="pswp__scroll-wrap">

                        <div className="pswp__container">

                            <div className="pswp__item" />
                            <div className="pswp__item" >
                                <div style={{width:'100px',height:'100px',background:'red'}} />
                            </div>
                            <div className="pswp__item" />
                        </div>

                        <div className="pswp__ui pswp__ui--hidden">

                            <div className="pswp__top-bar">

                                <div className="pswp__counter" />

                                <button className="pswp__button pswp__button--close" title="Close (Esc)" onClick={()=>{close()}} />

                                <button className="pswp__button pswp__button--share" title="Share" />

                                <button className="pswp__button pswp__button--fs" title="Toggle fullscreen" />

                                <button className="pswp__button pswp__button--zoom" title="Zoom in/out" />

                                <div className="pswp__preloader">
                                    <div className="pswp__preloader__icn">
                                        <div className="pswp__preloader__cut">
                                            <div className="pswp__preloader__donut" />
                                        </div>
                                    </div>
                                </div>
                                <div style={{position:'absolute',right:'176px',top:0,width:'44px',height:'44px',background:'url(../../style/imgs/shun.png)'}} onClick={()=>{rotate()}}>
                                    <img src="../../style/imgs/shun.png" alt="" />
                                </div>
                            </div>

                            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                                <div className="pswp__share-tooltip" />
                            </div>

                            <button className="pswp__button pswp__button--arrow--left" title="Previous (arrow left)" />

                            <button className="pswp__button pswp__button--arrow--right" title="Next (arrow right)" />

                            <div className="pswp__caption">
                                <div className="pswp__caption__center" />
                            </div>

                        </div>

                    </div>

                </div>
                <style>{`
                    .ant-card-body img {
                        cursor: pointer;
                    }
                    .gutter-box{
                        width:240px;float:left;margin:10px 0 10px 22px;
                    }
                    .imgBox{
                        height:151px;overflow:hidden
                    }
                    .pa-m{
                        text-align:center;color:#9b9b9b;height:25px
                    }
                    .pa-m>h3{
                        color:#9b9b9b
                    }
                    .ant-card{
                        background:none!important;
                    }

                `}</style>
            </div>
        )
    }
}

export default Gallery;