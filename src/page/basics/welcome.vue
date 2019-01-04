<template>
  <div class="welcome">
    <div class="fontImg">
      <img :src="loginTag == 1 ? imagesList[0] : imagesList[i]" alt="">
    </div>
  </div>
</template>

<script>
export default {
  name: "",
  data() {
    return {
      i: Math.floor(Math.random()*10),
      loginTag: this.storage.localGet('loginTag'),
      imagesList: this.imagesPath.welcome
    };
  },
  created() {},

  methods: {}
};
</script>
<style lang="scss" scoped>
.welcome {
  width: 100%;
  height: 100%;
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;

  .fontImg{
    width: 980px;
    min-height: 180px;
    max-height: 480px;
    img{
      width: 100%;
      height: 100%;
    }
  }
}
</style>