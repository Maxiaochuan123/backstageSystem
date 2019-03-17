<template>
  <div id="home">
    <el-container>

      <el-header>
        <Header></Header>
      </el-header>

      <el-container>
        <Aside></Aside>
        <Main></Main>
      </el-container>
      
    </el-container>
  </div>
</template>

<script>
import Header from "../../component/basics/Header";
import Aside from "../../component/basics/Aside";
import Main from "../../component/basics/Main";
export default {
  name: "home",
  components: {
    Header,
    Aside,
    Main
  }
};
</script>

