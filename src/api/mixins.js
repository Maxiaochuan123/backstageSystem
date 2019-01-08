// 为避免与 vue 方法冲突，所有自定义的方法以 $_ 开头
export default{
  data(){
    return{
      btnLoading:false,
      tableLoading:false,
      
      // 分页器
      paging:{
        totalPage: 60,
        req:{
          pageSize: 10,
          pageIndex: 1
        }
      }
    }
  },
  computed:{
    switchStatu(){
      return (data, status1, status2)=> {
        return data == 1 ? status1 : status2
      }
    }
  },
  methods: {
    // 取消
    closeDialog(){
      this.resetFn();
    },

    // 重置
    resetFn(){
      this.$refs['ruleForm'].resetFields();
      this.dialogStatus = false;
    },

    // 分页
    sizeChange(activePage){
      console.log(activePage)
    },
    currentChange(activePage){
      console.log(activePage)
    }
  }
}