import React , { Component } from 'react';
import PhotoSwipe from 'photoswipe';
import PhotoswipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';
import 'photoswipe/dist/photoswipe.css';
import 'photoswipe/dist/default-skin/default-skin.css';

class Gallery extends Component {
    constructor(props){
        super(props);
        this.state = {
            gallery: null
        };
    }
    componentWillMount(){
        
    }
    componentWillUnmount() {
        this.closeGallery();
    }
    render_imgs(){
        let lists=this.props.list||[];
        let imgs = [];
        let items = [];
        for(let i in lists){
            console.log(lists[i])
            imgs.push(<div key={i} style={{float:"left"}}><img onClick={(e) => this.openGallery(i,e)} alt="" key={i} width="200px" height="150px" style={{marginLeft:"20px"}} src={lists[i].src||lists[i].refinedUrl||lists[i].origin} /><div>{lists[i].des}</div></div>)
            items.push({
                src:lists[i].src||lists[i].origin||lists[i].thumbUrl,
                w:0,
                h:0
            })
        }
        this.items = items;
        return imgs;
    }
    openGallery (index,e) {
        const items = this.items;
        const pswpElement = document.querySelectorAll('.pswp')[0];
        const options = {index: parseInt(index,10)};
        this.gallery = new PhotoSwipe( pswpElement, PhotoswipeUIDefault, items, options);
        this.gallery.listen('gettingData', (index, item) => {
            const _this = this;
            if (item.w < 1 || item.h < 1) { 
                let img = new Image();
                img.onload = function() { 
                    item.w = this.width; 
                    item.h = this.height; 
                    _this.gallery.invalidateCurrItems(); 
                    _this.gallery.updateSize(true);
                };
                img.src = item.src; 
            }
        });
        this.gallery.init();
        // setTimeout(function(){
        //     this.gallery.goTo(parseInt(index,10));
        // }.bind(this),200)
    };
    closeGallery () {
        if (!this.gallery) return;
        this.gallery.close();
    };
    render() {
        let imgs = this.render_imgs();
        return (
            <div className="gutter-example button-demo">
                { imgs }
                <div className="pswp" tabIndex="-1" role="dialog" aria-hidden="true">
                    <div className="pswp__bg" />

                    <div className="pswp__scroll-wrap">

                        <div className="pswp__container">
                            <div className="pswp__item" />
                            <div className="pswp__item" />
                            <div className="pswp__item" />
                        </div>

                        <div className="pswp__ui pswp__ui--hidden">

                            <div className="pswp__top-bar">

                                <div className="pswp__counter" />

                                <button className="pswp__button pswp__button--close" title="Close (Esc)" />

                                {/*<button className="pswp__button pswp__button--share" title="Share" />*/}

                                <button className="pswp__button pswp__button--fs" title="Toggle fullscreen" />

                                <button className="pswp__button pswp__button--zoom" title="Zoom in/out" />

                                <div className="pswp__preloader">
                                    <div className="pswp__preloader__icn">
                                        <div className="pswp__preloader__cut">
                                            <div className="pswp__preloader__donut" />
                                        </div>
                                    </div>
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
                        text-align:center;color:#9b9b9b;
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