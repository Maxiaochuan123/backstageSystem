<template>
  <div class="tabsBox mainBox">
    <div class="uploadBox">
      <div class="show-list">
        <ul>
          <li :class="[isAlimatin?'animation-in':'']" v-for="(item,index) in imagesList" :key="item.imgName+index">
            <div class="mask">
              <i class="el-icon-zoom-in" @click="openPreview(item.src, item.file, index)"></i>
              <i class="el-icon-edit" @click="openEditPreview(item.src, item.file, index)"></i>
              <i class="el-icon-delete" @click="deleteImageItem(item.imgName)"></i>
            </div>
            <img :src="item.src" :alt="item.imgName">
            <img :src="item.src" :alt="item.imgName">
          </li>
        </ul>
      </div>
      <div class="push-box" @click="()=>fileInput.click()">
        <i class="el-icon-plus"></i>
        <input id="fileInput" type="file" accept="image/gif,image/jpeg,image/jpg,image/png,image/svg" multiple @change="onChange"/>
      </div>
    </div>

    <div class="image-preview-box" v-if="previewView">
      <span class="switch-arrow-left" @click="arrowLeft" v-show="isArrowLeft"><i class="el-icon-arrow-left"></i></span>
      <span class="switch-arrow-right" @click="arrowRight" v-show="isArrowRight"><i class="el-icon-arrow-right"></i></span>
      <span class="switch-close" @click="closePreview"><i class="el-icon-close"></i></span>
      <div class="img-Box animation-in" @mousewheel="getWheelDelta($event)">
        <img id="drag" :src="previewSrc" :style="transform.template()">
      </div>
      <div class="toolBar">
        <i class="el-icon-zoom-out" @click="imageTool('narrow')"></i>
        <i class="el-icon-zoom-in" @click="imageTool('enlarge')"></i>
        <i class="el-icon-full-screen" @click="imageTool('screen')"></i>
        <i class="el-icon-refresh-left" @click="imageTool('rotateLeft')"></i>
        <i class="el-icon-refresh-right" @click="imageTool('rotateRight')"></i>
      </div>
    </div>

    <div class="image-edit-box" v-if="editView">
      <span class="switch-close" @click="closeEditPreview"><i class="el-icon-close"></i></span>
      <div class="img-Box animation-in">
        <img id="drag" :src="previewSrc" :style="transform.template()">
        <div class="toolBar"></div>
      </div>
    </div>
  </div>
</template>

<script>
// import Exif from 'exif-js'
import Exif from './exif'
export default {
  name: "uploadImage",
  data() {
    return {
      fileInput:'', //上传 input doc
      imagesList:[], //图片 数据集
      minSize: 1024 * 1024, //图片容量最小值
      maxSize: 1024 * 1024 * 10, //图片容量最大值
      limitedSize:true, //是否限制图片尺寸
      maxWidth:1000, //图片最大宽度
      maxHeight:1000, //图片最大高度

      zipBeforeSize:0, //压缩前容量
      zipAfterSize:0, //压缩后容量
      zipRatio: 1, //压缩比 0 ~ 1 默认 0.92

      previewList: [], //图片预览 list
      previewView:false, //预览视窗
      previewSrc:'', //预览图 src
      previewIndex:'', //预览图 下标

      editView:false, //编辑视窗
      
      isAlimatin:true, //是否开启动画
      transform:{ //查看图片过渡效果
        state:true,
        deg:0, //旋转角度
        scale:1, //缩放比例
        zoomMultiple:false, //2倍数缩放
        speed:.3,//过渡速度
        template:() =>  this.transform.state ? `
                          transform: rotate(${this.transform.deg}deg) scale(${this.transform.scale});
                          transition: transform ${this.transform.speed}s ease;
                        ` : '',
        init:() => {this.transform.state=true; this.transform.deg=0; this.transform.scale=1; this.transform.zoomMultiple=false;}
      }
    };
  },
  mounted(){
    this.fileInput = document.querySelector('#fileInput');
  },
  methods: {
    // 图片编辑
    openEditPreview(src,file,index){
      this.editView = true;
      this.previewSrc = src;
      this.previewIndex = index;
    },
    // 关闭 图片编辑 view
    closeEditPreview(){
      this.editView = false;
      this.transform.init();
    },

    // 鼠标滚动 图片 放大/缩小
    getWheelDelta(e){
      let tempNum = this.transform.scale;
      if(e.wheelDelta == 120){
        tempNum += .2;
        if(tempNum >= 1.8){
          tempNum = 1.8;
        }
        this.transform.scale = parseFloat(tempNum.toFixed(1));
      }else{
        tempNum -= .2;
        if(tempNum <= .6){
          tempNum = .6;
        }
        this.transform.scale = parseFloat(tempNum.toFixed(1));
      }
    },
    
    // 图片拖拽
    drag(el) {
      let doc = el;
      doc.onmousedown = (e)=>{
        e.preventDefault();
        this.transform.speed = 0;
        //算出鼠标相对元素的位置
        let disX = e.clientX - doc.offsetLeft;
        let disY = e.clientY - doc.offsetTop;
        document.onmousemove = (e)=>{
          //用鼠标的位置减去鼠标相对元素的位置，得到元素的位置
          let left = e.clientX - disX;    
          let top = e.clientY - disY;
  
          //移动当前元素
          doc.style.left = left + 'px';
          doc.style.top = top + 'px';
        };
        document.onmouseup = (e) => {
          document.onmousemove = null;
          document.onmouseup = null;
          this.transform.speed = .3;
        };
      };
    },
    // 查看图片工具条 fnction
    imageTool(action){
      switch(action){
        case 'enlarge':
            this.transform.scale += .1;
          break;
        case 'narrow':
            this.transform.scale -= .1;
          break;
        case 'screen':
            this.transform.zoomMultiple = !this.transform.zoomMultiple;
            this.transform.scale = this.transform.zoomMultiple ? this.transform.scale*= 2 : this.transform.scale/=2;
          break;
        case 'rotateLeft':
            this.transform.deg -= 90;
          break;
        case 'rotateRight':
            this.transform.deg += 90;
          break;
      }
    },
    // 显示查看图片 view
    openPreview(src,file,index){
      this.previewView = true;
      this.previewSrc = src;
      this.previewIndex = index;
      this.$nextTick(()=>{
        if(this.transform.state){
          let el = document.querySelector('#drag')
          this.drag(el)
        }
      })
    },
    // 删除图片
    deleteImageItem(name){
      this.isAlimatin = false;
      this.imagesList = this.imagesList.filter(imgItem => imgItem.imgName !== name);
      this.fileInput.value = '';
    },
    
    // 上一张图
    arrowLeft(){
      let arrowLeftIndex = this.previewIndex <= 0 ? 0 : --this.previewIndex;
      this.previewSrc = this.imagesList[arrowLeftIndex].src;
      this.transform.state = false;
      setTimeout(()=>{this.transform.init();},500)
    },
    // 下一张图
    arrowRight(){
      let arrowRightIndex = this.previewIndex >= this.imagesList.length-1 ? this.imagesList.length-1 : ++this.previewIndex;
      this.previewSrc = this.imagesList[arrowRightIndex].src;
      this.transform.state = false;
      setTimeout(()=>{this.transform.init();},500)
    },
    // 关闭查看图片 view
    closePreview(){
      this.previewView = false;
      this.transform.init();
    },

    onChange(){
      this.isAlimatin = true;
      // URL.createObjectURL(file)  : 图片生成 bolo url
      const files = this.fileInput.files;
      const filesArr =  [...files].filter( fileItem =>{
        if(/^image/.test(fileItem.type)) return fileItem;
      })

      for(let fileItem of filesArr){
        let fileRender = new FileReader();
        fileRender.readAsDataURL(fileItem);  // file 转成 dataURL字符串

        fileRender.onload = fileEvent =>{
          const img = new Image();
          img.src = fileEvent.target.result;
          img.onload = imgEvent =>{

              if(fileItem.size <= this.minSize){
                // 是否限制 图片 尺寸
                if(this.limitedSize){
                  let [width,height] = this.isLimitedSize(imgEvent);
                  this.canvasDrawPictures(img,width,height,fileItem);
                }else{
                  // 压缩前大小 小于 最小图片大小 校验方向后 直接上传
                  // console.log('直接上传:',fileItem.name);
                    this.imagesList.push({'src':URL.createObjectURL(fileItem), 'imgName':fileItem.name, 'file':fileItem, 'bese64':fileEvent.target.result});
                    this.removeRepeat();
                }
              }else{
                // 是否限制 图片 尺寸
                if(this.limitedSize){
                  let [width,height] = this.isLimitedSize(imgEvent);
                  this.canvasDrawPictures(img,width,height,fileItem);
                }else{
                  this.canvasDrawPictures(img,img.width,img.height,fileItem);
                }
              }
          }
        }
      }
      
    },


    /**
     * @description: canvas 绘制图片
     * @param {img} 要绘制的图片
     * @param {width} 图片的宽度
     * @param {height} 图片的高度
     * @return: blob / bese64
     */
    canvasDrawPictures(img,width,height,fileItem){
      
      let canvas = document.createElement('canvas');
      canvas.width = width, canvas.height = height;
      let ctx = canvas.getContext('2d');

      //修复ios上传图片的时候 被旋转的问题
      this.rotateImg(img, canvas, ctx, width, height);
      
      // canvas 转 blob
      // canvas.toBlob(blob => {
      //   let imgUrl = URL.createObjectURL(blob);
      // }, 'image/jpeg', this.zipRatio);

      // canvas 转 bese64
      let bese64 = canvas.toDataURL('image/jpeg', this.zipRatio);
      let file = this.dataUrltoFile(bese64, fileItem.name.split('.')[0] + ".jpeg");
      this.imagesList.push({'src':URL.createObjectURL(file), 'imgName':fileItem.name, 'file':fileItem, 'bese64':bese64}); //图片预览
      this.removeRepeat();
      // console.log(`压缩后: ${this.bytesToSize(file.size)}, 压缩比: ${this.zipRatio}`);

    },
    
    /**
     * @description: 将base64转换为 file
     * @param {bese64} bese64 字符串
     * @param {fileName} 图片名
     * @return: file
     */
    dataUrltoFile(bese64, fileName) {
      let arr = bese64.split(","),
        type = arr[0].match(/:(.*?);/)[1],
        bs64Decode = atob(arr[1]),
        bs64Length = bs64Decode.length,
        u8arr = new Uint8Array(bs64Length);
      while (bs64Length--) {
        u8arr[bs64Length] = bs64Decode.charCodeAt(bs64Length);
      }
      return new File([u8arr], fileName, { type: type });
    },

    /**
     * @description: 转换blob对象用于上传
     * @param {bese64} bese64 字符串
     * @return: blob
     */
    dataURLtoBlob(base64) {
      let arr = base64.split(','), mime = arr[0].match(/:(.*?);/)[1],
          bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
      while(n--){
          u8arr[n] = bstr.charCodeAt(n);
      }
      return new Blob([u8arr], {type:mime});
    },

    /**
     * @description: 
     * @param {img} 图片
     * @param {ctx} //canvas上下文对象
     * @param {width} // 图片目标宽度
     * @param {height} // 图片目标高度
     * @return: 
     */
    rotateImg(img, canvas, ctx, width, height) {
      let Orientation;
      Exif.getData(img, function () {
        Orientation = Exif.getTag(img,'Orientation');
      });

      ctx.save(); //保存 canvas 当前的状态
      ctx.clearRect(0,0,width,height); //清除画布
      ctx.fillStyle = '#fff'; //铺底色 防止 png 绘制时 丢失透明度变成黑色底

      if(Orientation){
        if (Orientation == 3) {
          ctx.rotate(Math.PI);
          ctx.drawImage(img, -width * this.zipRatio, -height * this.zipRatio,  width * this.zipRatio, height * this.zipRatio);
        }else if (Orientation == 6) {
          canvas.width = height * this.zipRatio;
          canvas.height = width * this.zipRatio;
          ctx.rotate(Math.PI / 2);
          // (0,-imgHeight) 从旋转原理图那里获得的起始点
          ctx.drawImage(img, 0,-height * this.zipRatio,  width * this.zipRatio, height * this.zipRatio  );
        } else if (Orientation == 8) {
          canvas.width = height * this.zipRatio;
          canvas.height = width * this.zipRatio;
          ctx.rotate(3 * Math.PI / 2);
          ctx.drawImage(img, - width * this.zipRatio, 0,  width * this.zipRatio, height * this.zipRatio);
        } else {
          ctx.drawImage(img,0,0,width,height); //绘制ing...
        }
      }else{
        ctx.drawImage(img,0,0,width,height); //绘制ing...
      }

      ctx.restore(); //恢复 canvas 之前的状态
    },

    /**
     * @description: 是否限制 图片尺寸
     * @param {imgEvent} 图片 event
     * @return: 目标尺寸
     */
    isLimitedSize(imgEvent){
      let originWidth = imgEvent.path[0].width, originHeight = imgEvent.path[0].height; //图片原始
      let targetWidth = originWidth, targetHeight = originHeight; // 目标尺寸

      // 图片尺寸超过 默认值 时进行限制
      if (originWidth > this.maxWidth || originHeight > this.maxHeight) {
          if (originWidth / originHeight > this.maxWidth / this.maxHeight) {
              // 更宽，按照宽度限定尺寸
              targetWidth = this.maxWidth;
              targetHeight = Math.round(this.maxWidth * (originHeight / originWidth));
          } else {
              targetHeight = this.maxHeight;
              targetWidth = Math.round(this.maxHeight * (originWidth / originHeight));
          }
      }
      return [targetWidth, targetHeight]
    },

    // 去重
    removeRepeat(){
      let obj = {};
      this.imagesList = this.imagesList.reduce((item, next) =>{
        obj[next.imgName] ? '' : obj[next.imgName] = true && item.push(next);
        return item;
      }, []);
    },

    
    /**
     * @description: 容量换算
     * @param {bytes} 字节大小
     * @return: 换算后大小
     */
    bytesToSize(bytes){
      if (bytes === 0) return '0 B';
      var k = 1000, // or 1024
          sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
          i = Math.floor(Math.log(bytes) / Math.log(k));
  
      return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
    }
  },
  computed:{
    isArrowLeft(){
      return this.previewIndex > 0;
    },
    isArrowRight(){
      return this.previewIndex !== this.imagesList.length - 1;
    }
  }
};
</script>
<style lang="scss">
  .tabsBox {
    height: 100%;
    overflow-y: scroll;
    background-color: #fff;
    @keyframes animation-in {
      from{
        top:-48px;
        opacity: .2;
      }
      to{
        top:0px;
        opacity: 1;
      }
    }
    @keyframes animation-out {
      from{
        top:0px;
        opacity: 1;
      }
      to{
        top:-48px;
        opacity: .2;
      }
    }

    .animation-in{
      animation: animation-in .3s ease-out;
    }
    .animation-out{
      animation: animation-out .3s ease-out;
    }

    .image-preview-box,.image-edit-box{
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 1000;

      span{
        z-index: 999;
      }

      .switch-arrow-left, .switch-arrow-right, .switch-close{
        position: absolute;
        width: 44px;
        height: 44px;
        font-size: 24px;
        color: #fff;
        border-radius: 50%;
        background: #606266;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        &:active{
          transform: scale(0.9)
        }
      }

      .switch-close{
        top: 20px;
        right: 20px;
        width: 32px;
        height: 32px;
      }
    }

    .image-preview-box{
      .switch-arrow-left{
        top: 50%;
        left: 40px;
      }
      .switch-arrow-right{
        top: 50%;
        right: 40px;
      }
      .img-Box{
        width: 100%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        img{
          position: absolute;
        }
      }
      .toolBar{
        width: 200px;
        height: 44px;
        padding: 0 23px;
        border-radius: 22px;
        background-color: rgba(96,98,102, .5);
        // background-color: #606266;
        // opacity: .6;
        position: absolute;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);

        display: flex;
        align-items: center;
        justify-content: space-between;

        i{
          font-size: 24px;
          color: #fff;
          cursor: pointer;
          &:active{
            transform: scale(0.9)
          }
        }
      }
    }

    .image-edit-box{
      display: flex;
      align-items: center;
      justify-content: center;
      .img-Box{
        padding: 20px;
        background-color: #fff;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: flex-end;  
        .toolBar{
          width: 200px;
          height: 44px;
          border: 1px solid red;
          align-self: center;
        }
      }
    }

    .uploadBox{
      width: 100%;
      height: 200px;
      box-sizing: border-box;
      border: 1px solid black;
      padding: 8px;
      display: flex;

      .show-list{
        ul>li{
          overflow: hidden;
          background-color: #fff;
          border: 1px solid #c0ccda;
          border-radius: 6px;
          box-sizing: border-box;
          width: 148px;
          height: 148px;
          margin: 0 8px 8px 0;
          display: inline-block;
          position: relative;
          // animation: animation-in .3s ease-out;
          img,.mask{
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
          }
          .mask{
            z-index: 10;
            background-color: rgba(0,0,0,0);
            display: flex;
            align-items: center;
            justify-content: center;
            i{
              display: none;
              font-size: 22px;
              color: #FFF;
              cursor: pointer;
              &:not(:first-child){
                margin-left: 20px;
              }
              &:last-child:hover{
                color: #F56C6C;
              }
              &:hover{
                color: #409eff;
              }
            }
            &:hover{
              background-color: rgba(0,0,0,0.4);
              transition: all .3s ease-out;
              i{
                display: block;
              }
            }
          }
        }
      }

      .push-box{
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        width: 148px;
        height: 148px;
        cursor: pointer;
        line-height: 146px;
        vertical-align: top;

        i{
          font-size: 28px;
          color: #8c939d;
        }

        input[type="file"]{
          opacity: 0;
          display: none;
        }

        &:hover{
          border-color: #409eff;
          color: #409eff;
        }
      }
    }
  }
  .tabsBox::-webkit-scrollbar {
  //   /*滚动条整体样式*/
    width: 6px;
  }

  .tabsBox::-webkit-scrollbar-thumb {
  //   /*滚动条里面小方块*/
    border-radius: 4px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #adacac;
  }

  .tabsBox::-webkit-scrollbar-track {
  //   /*滚动条里面轨道*/
    background: #ffffff;
  }

</style>