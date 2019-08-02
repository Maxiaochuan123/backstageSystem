<template>
  <div class="tabsBox mainBox">
    <div class="uploadBox">
      <div class="show-list">
        <ul>
          <li v-for="(item,index) in imagesList" :key="item.imgName+index">
            <img :src="item.src" :alt="item.imgName" @click="openPreview(item.src, item.file, index)">
          </li>
        </ul>
      </div>
      <div class="push-box" @click="()=>uploadInput.click()">
        <i class="el-icon-plus"></i>
        <input id="push-input" ref="uploadInput" type="file" multiple @change="onChange"/>
      </div>
    </div>
    <div class="image-preview-box" v-if="previewView">
      <span class="switch-arrow-left" @click="arrowLeft"><i class="el-icon-arrow-left"></i></span>
      <span class="switch-arrow-right" @click="arrowRight"><i class="el-icon-arrow-right"></i></span>
      <span class="switch-close" @click="()=>previewView=false"><i class="el-icon-close"></i></span>
      <div class="img-Box"><img :src="previewSrc" alt=""></div>
    </div>
    
  </div>
</template>

<script>
export default {
  name: "uploadImage",
  data() {
    return {
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
      previewIndex:'' //预览图 下标
    };
  },
  mounted(){
    this.uploadInput = this.$refs['uploadInput'];
  },
  methods: {
    openPreview(src,file,index){
      this.previewView = true;
      this.previewSrc = src;
      this.previewIndex = index;
    },
    arrowLeft(){
      let arrowLeftIndex = this.previewIndex <= 0 ? 0 : --this.previewIndex;
      this.previewSrc = this.imagesList[arrowLeftIndex].src;
    },
    arrowRight(){
      let arrowRightIndex = this.previewIndex >= this.imagesList.length-1 ? this.imagesList.length-1 : ++this.previewIndex;
      this.previewSrc = this.imagesList[arrowRightIndex].src;
    },
    onChange(){
      // URL.createObjectURL(file)  : 图片生成 bolo url
      const files = this.$refs['uploadInput'].files;
      const filesArr =  [...files].filter( fileItem =>{
        if(/^image/.test(fileItem.type)) return fileItem;
      })

      for(let fileItem of filesArr){
        let fileRender = new FileReader();
        fileRender.readAsDataURL(fileItem);  // file 转成 dataURL字符串

        fileRender.onload = fileEvent =>{
          console.log('fileEvent:',fileEvent)
          if(fileItem.size <= this.minSize){
            // 压缩前大小 小于 最小图片大小 校验方向后 直接上传
            console.log('直接上传:',fileItem.name);
            this.imagesList.push({'src':URL.createObjectURL(fileItem), 'imgName':fileItem.name, 'file':fileItem, 'bese64':fileEvent.target.result});
          }else{
            // console.log(`压缩前: ${this.bytesToSize(fileItem.size)}`);
            this.zipImages(fileEvent,fileItem);
          }
        }
      }
      
    },

    async zipImages(fileEvent,fileItem){
      const img = new Image();
      img.src = fileEvent.target.result;

      img.onload = imgEvent =>{
        // 是否限制 图片 尺寸
        if(this.limitedSize){
          let [width,height] = this.isLimitedSize(imgEvent);
          this.canvasDrawPictures(img,width,height,fileItem);
        }else{
          this.canvasDrawPictures(img,img.width,img.height,fileItem);
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
      console.log(width,height)
      let canvas = document.createElement('canvas');
      canvas.width = width, canvas.height = height;
      let ctx = canvas.getContext('2d');

      ctx.clearRect(0,0,width,height); //清除画布
      ctx.fillStyle = '#fff'; //铺底色 防止 png 绘制时 丢失透明度变成黑色底
      ctx.drawImage(img,0,0,width,height); //绘制ing...

      
      // canvas.toBlob(blob => {
      //   let imgUrl = URL.createObjectURL(blob);
      // }, 'image/jpeg', this.zipRatio);

      let bese64 = canvas.toDataURL('image/jpeg', this.zipRatio);
      let file = this.dataUrltoFile(bese64, fileItem.name.split('.')[0] + ".jpeg");
      this.imagesList.push({'src':URL.createObjectURL(file), 'imgName':fileItem.name, 'file':fileItem, 'bese64':bese64}); //图片预览
      this.previewList.push(URL.createObjectURL(file))

      console.log(`压缩后: ${this.bytesToSize(file.size)}, 压缩比: ${this.zipRatio}`);

    },

    dataUrltoFile(bese64, fileName) {
      //将base64转换为 file
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
  }
};
</script>
<style lang="scss">
  .tabsBox {
    height: 100%;
    overflow-y: scroll;
    background-color: #fff;

    .image-preview-box{
      position: fixed;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      background-color: rgba(0,0,0,0.5);
      z-index: 1000;

      .img-Box{
        width: 100%;
        height: 100%;
        border: 1px solid brown;
        display: flex;
        justify-content: center;
        align-items: center;
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
          // width: 42px;
          // height: 42px;
          transform: scale(0.9)
        }
      }
      .switch-arrow-left{
        top: 50%;
        left: 40px;
      }
      .switch-arrow-right{
        top: 50%;
        right: 40px;
      }
      .switch-close{
        top: 20px;
        right: 20px;
        width: 32px;
        height: 32px;
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
        @keyframes mymove {
          from{
            top:-48px;
            opacity: .2;
          }
          to{
            top:0px;
            opacity: 1;
          }
        }

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
          animation: mymove .8s ease-out;

          img{
            width: 100%;
            height: 100%;
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