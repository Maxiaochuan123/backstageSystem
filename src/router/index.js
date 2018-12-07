import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

// 路由懒加载
const Home = () => import ('../page/home')
const Login = () => import ('../page/login')
const LockScreen = () => import ('../page/lockScreen')
const NotFound = () => import ('../page/notFound')
// keepAlive:true
export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/lockScreen',
      name: 'LockScreen',
      component: LockScreen
    },
    {
      path: '*',
      name: '404',
      component: NotFound
    }
  ]
})
