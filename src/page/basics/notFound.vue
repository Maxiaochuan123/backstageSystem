<template>
  <div class="notFound">
    <el-container>
      <div class="imgBox">
        <img :src="abnormal_404" alt>
        <div class="goHome" onselectstart="return false" @click="goHome">go Home</div>
      </div>
    </el-container>
  </div>
</template>

<script>
export default {
  name: "notFound",
  data() {
    return {
      abnormal_404: this.imagesPath.abnormal[0]
    };
  },
  methods: {
    goHome() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.notFound {
  width: 100vw;
  height: 100vh;
  background-color: #9cdeef;
  .imgBox {
    width: 440px;
    height: 330px;
    margin: calc((100vh - 600px) / 2) auto 0;
    background-color: antiquewhite;
    .goHome {
      width: 100px;
      height: 24px;
      line-height: 24px;
      text-align: center;
      color: #fff;
      cursor: pointer;
      border: 1px solid #fff;
      margin: 20px auto 0;
    }
    .goHome:active {
      background-color: #6bd1eb;
    }
  }
}
</style>