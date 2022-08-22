import Viewer from 'viewerjs';
import 'viewerjs/dist/viewer.min.css';

// source https://fengyuanchen.github.io/viewer/
class ImgViewer{
    constructor(imgs,option){
        option = option||{};
        let index = option.index||0;
        let show = option.show===undefined?true:option.show;
        this.ul = document.createElement("ul");
        this.total = imgs.length;
        for(let i in imgs){
            this.insert_li(imgs[i],i);
        }
        this.ul.style.display = "none"
        document.body.appendChild(this.ul);
        this.init();
        if(show&&this.total>0){
            this.view(index);
        }
    }
    init(){
        this.viewer = new Viewer(this.ul);
    }
    view(index){
        this.viewer.view(index);
    }
    // 添加一个元素
    append(obj){
        this.insert_li(obj,this.total+1);
        this.viewer.update();
    }
    insert_li(obj,index=0){
        let li = document.createElement("li");
        let img = document.createElement("img");
        img.src = obj.src||"";
        img.alt = obj.des||parseInt(index,10)+1;
        li.appendChild(img);
        this.ul.appendChild(li);
    }
    update(){
        this.viewer.update();
        // this.viewer.destroy();
        // this.init();
    }
}

export default ImgViewer;