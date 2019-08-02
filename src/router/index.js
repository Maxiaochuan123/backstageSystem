import Vue from "vue";
import Router from "vue-router";
Vue.use(Router);

// 页面框架
const Home = () => import("../page/basics/home");
const Login = () => import("../page/basics/login");
const LockScreen = () => import("../page/basics/lockScreen");
const NotFound = () => import("../page/basics/notFound");
const Welcome = () => import("../page/basics/welcome");

// 页面
const uploadImage = () => import("../page/upload/uploadImage"); //上传图像

const router = new Router({
  routes: [
    {
      path: '/',
      redirect: "welcome",
      name: "Home",
      component: Home,
      meta: {
        title: "首页"
      },
      children: [
        { path: "welcome", name: "Welcome", component: Welcome, meta: { title: "欢迎" }},
        { path: "/uploadImage", name: "uploadImage", component: uploadImage, meta: { title: "上传图像", keepAlive:false }}
      ]
    },
    {
      path: "/login",
      name: "Login",
      component: Login
    },
    {
      path: "/lockScreen",
      name: "LockScreen",
      component: LockScreen
    },
    {
      path: "*",
      name: "NotFound",
      component: NotFound
    }
  ]
});
// router.beforeEach((to, from, next) => {
//   if (sessionStorage.getItem("token")) {
//     next();
//   } else {
//     if (to.path == "/login") {
//       //多判断一次路径 避免 死循环
//       next();
//     } else {
//       next("/login");
//     }
//   }
// });

export default router;
