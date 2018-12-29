<template>
  <div class="solt">
    <!-- accept="image/jpg, image/jpeg, image/png, image/gif" -->
    <el-upload
      ref="imgUpload"
      action="..."
      :http-request="uploadHandle"
      list-type="picture-card"
      :auto-upload="false"
      :multiple="true"
      :before-upload="handleBeforeUpload"
      :on-preview="handlePictureCardPreview"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <div class="images" v-viewer.static="{}">
      <img width="100%" :src="dialogImageUrl" alt>
    </div>

    <div>
      <el-button type="primary" @click="downImg">下载图片</el-button>
    </div>
    
    <el-button type="primary" @click="upLoaod">upLoaod</el-button>
  </div>
</template>

<script>
import Vue from 'vue';
import Viewer from 'v-viewer';
import '_viewerjs@1.3.1@viewerjs/dist/viewer.css';
Vue.use(Viewer, {
  defaultOptions: {
    zIndex: 9999
  }
});

export default {
  name: "solt",
  data() {
    return {
      dialogImageUrl: "",
      imgList:['../../../static/images/welcome/1.png','../../../static/images/welcome/2.png']
    };
  },
  methods: {
    downImg(){
      //必须同源才能下载
      var alink = document.createElement("a");
      // alink.href = this.dialogImageUrl;
      // alink.download = "pic"; //图片名
      // alink.click();
      for(let item of this.imgList){
        alink.href = item;

        let index = item.lastIndexOf("\/")
        item = item.substring(index + 1, item .length)
        item = item.split(".")[0]
        alink.download = item; //图片名
        
        alink.click();
        console.log(item)
      }
    },
    // 上传之前
    handleBeforeUpload(file) {
      let type = file.type;
      let maxSize = 10 * 1024 * 1024; //10MB
      let currentSize = file.size / 1024 / 1024;
      currentSize = currentSize.toFixed(2) + "MB";
      if (/^image/.test(type)) {
        if (file.size >= maxSize) {
          this.$message.warning(
            `必须是 <= 10MB 的图片! , 当前图片 ${currentSize}`
          );
          return false;
        } else {
          return true;
        }
      } else {
        this.$message.warning('只允许上传 "图片"!');
        return false;
      }
    },
    // 查看
    showDoc() {
      const viewer = this.$el.querySelector(".images").$viewer;
      viewer.show();
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      let doc = document.querySelector(".el-upload-list__item-preview");
      setTimeout(() => {
        doc.onclick = this.showDoc();
      }, 60);
    },
    // 上传
    uploadHandle(options) {
      const file = options.file;
      let _this = this;
      let Orientation;

      if (file.size <= 1024 * 1024) {
        //图片 <= 1M 直接上传
        // this.upLoaodCallback();
      } else {
        //判断支不支持FileReader
        if (!file || !window.FileReader) return;

        //创建一个reader
        let reader = new FileReader();

        //将图片转成base64格式
        reader.readAsDataURL(file);

        //读取成功后的回调
        reader.onloadend = function() {
          let result = this.result;
          let img = new Image();
          img.src = result;
          // console.log("********未压缩前的图片大小********");
          // console.log(file.size);
          img.onload = function() {
            let zipData = _this.zipImage(img, file.type);
            // this.upLoaodCallback();
          };
        };
      }
    },
    // 压缩图片
    zipImage(img, type) {
      let canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");
      let initSize = img.src.length;
      let width = img.width;
      let height = img.height;
      canvas.width = width;
      canvas.height = height;
      // 铺底色
      ctx.fillStyle = "#fff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, width, height);

      //压缩 ing...
      let base64Data = canvas.toDataURL("image/jpeg", 0.5);
      base64Data = this.base64toFile(base64Data, Date.now() + ".jpeg");
      // console.log("*******压缩后的图片大小*******");
      // console.log(base64Data.size);

      return base64Data;
    },
    base64toFile(base64Data, fileName) {
      //将base64转换为 file
      var arr = base64Data.split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], fileName, { type: mime });
    },
    upLoaodCallback() {
      // let formdata = new FormData();
      // formdata.append("kind", "this.datas.kind");
      // formdata.append("customerId", "this.datas.customerId");
      // formdata.append("customerNum", "this.datas.customerNum");
      // formdata.append("documentType", "this.datas.documentType");
      // formdata.append("telphone", "this.datas.telphone");
      // formdata.append("files", file);
      // this.api.upLoaod(formdata).then(res => {
      // });
    },
    upLoaod() {
      this.$refs.imgUpload.submit();
    }
  }
};
</script>
<style lang="scss">
.solt {
  .images {
    display: none;
  }
}
</style>