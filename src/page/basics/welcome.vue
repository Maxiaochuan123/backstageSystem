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
<style lang="scss">
.welcome {
  height: calc(100vh - 72px);
  background-color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>