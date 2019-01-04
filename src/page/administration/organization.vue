<template>
  <div class="organization">
    <!-- 操作栏 -->
    <div class="actionBar">
      <el-row class="row">
        <el-col :span="2" :offset="22">
          <!-- 新增 -->
          <el-button type="primary" size="small" @click="showDialog('省份','','新增')">新增省份</el-button>
          <!-- 对话框 -->
          <el-dialog :title="btnText == '新增'? `新增${dialogText}` : `编辑${dialogText}`" :visible.sync="dialogStatus">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
               <el-form-item :label="`${dialogText}名称:`" prop="fieldName">
                 <el-input v-model.trim="ruleForm.fieldName" :placeholder="`请输入${dialogText}名称`" clearable></el-input>
               </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button size="mini" @click="cancel">取 消</el-button>
              <el-button type="primary" size="mini" @click="addFnc">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form>
              <el-form-item v-for="(item, index) in scope.row.children" :key="index">
                <div>
                  <span>{{ item.date }}</span>
                </div>
                <div class="actionBtn">
                  <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog('大区',item,'编辑')">编辑</el-button>
                  <el-button
                    type="text" size="mini"
                    :icon="switchStatu(item.status, 'el-icon-close', 'el-icon-check')"
                    :class="switchStatu(item.status, 'prohibit','enable')"
                    @click="enableDisabledChldren(index, item)"
                  >{{switchStatu(item.status, '禁用', '启用') }}</el-button>
                </div>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="区域分类" prop="date"></el-table-column>

        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog('省份',scope.row,'编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.status, 'el-icon-close', 'el-icon-check')"
              :class="switchStatu(scope.row.status, 'prohibit','enable')"
              @click="enableDisabledParent(scope.$index, scope.row)"
            >{{switchStatu(scope.row.status, '禁用', '启用') }}</el-button>
            <el-button type="text" icon="el-icon-plus" size="mini" @click="showDialog('大区',scope.row,'新增')">新增大区</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="paging">
        <el-pagination
          layout="prev, pager, next"
          :total="paging.totalPage"
          :page-size="paging.req.pageSize"
          :current-page.sync="paging.req.pageIndex"
          @current-change="chengePage"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "organization",
  data() {
    return {
      dialogStatus:false, //新增 or 编辑 对话框
      dialogText:'', //对话框 title
      provinceId:'',  // 当前省id
      btnText:'', //当前点击的是编辑 or 新增 按钮

      // 分页器
      paging:{
        totalPage: 0,
        req:{
          pageSize: 10, 
          pageIndex: 1
        }
      },

      // 表单
      ruleForm:{
        fieldName:'', //新增 or 编辑 字段名
      },
      // 验证
      rules:{
        fieldName:[{required: true, message: '内容不能为空', trigger: 'blur'}]
      },

      // 表格
      tableData: [
        {
          date: "四川省",
          id: 1,
          status: 1,
          children: [
            {
              date: "成都一区",
              id: 11,
              status: 0
            },
            {
              date: "成都二区",
              id: 12,
              status: 1
            }
          ]
        },
        {
          date: "四川省",
          id: 2,
          status: 1,
          children: [
            {
              date: "南充一区",
              id: 13,
              status: 1
            },
            {
              date: "南充二区",
              id: 14,
              status: 1
            }
          ]
        }
      ]
    };
  },
  created() {},

  methods: {
    // 禁用 / 启用  父
    enableDisabledParent(index, scope) {
      scope.status = scope.status == 1 ? 0 : 1;
      scope.children.map(item => {
        if(scope.status == 1){
          return item.status = 0;
        }else{
          return item.status = 1;
        }
      })
    },

    // 禁用 / 启用  子
    enableDisabledChldren(index, scope){
      scope.status = scope.status == 1 ? 0 : 1;
    },

    // 显示对话框
    showDialog(title, scope, btnText){
      this.dialogStatus = true;
      this.dialogText = title;
      this.provinceId = title == '大区' ? scope.id : null;
      this.btnText = btnText;

      this.$nextTick(()=>{
        if(btnText == '编辑'){
          this.ruleForm.fieldName = scope.date;
        }else{
          this.ruleForm.fieldName = '';
        }
      });

    },
    
    // 新增 or 编辑
    addFnc(){
      // console.log(this.provinceId)
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(this.btnText == '编辑'){

          }else{

          }
          this.dialogStatus = false;
          this.$refs['ruleForm'].resetFields();
        } else {
          return false;
        }
      });
    },
    // 取消
    cancel(){
      this.$refs['ruleForm'].resetFields();
      this.dialogStatus = false;
    },

    // 分页
    chengePage(activePage){
      console.log(activePage)
    }
  }
};
</script>
<style lang="scss">
.organization {
  height: calc(100vh - 72px);
  
  .actionBar {
    width: 100%;
    height: 44px;
    background-color: #fff;
    margin-bottom: 6px;
    box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.1);
    .row {
      padding-top: 6px;
    }
  }

  .content{
    height: calc(100% - 50px);
    background-color: #fff;

    .paging{
      width: 100%;
      margin-top: 20px;
      display: flex;
      flex-direction: row-reverse;
    }
  }

  

  .prohibit {
    color: #f56c6c;
  }
  .enable {
    color: #67c23a;
  }

  .el-form-item__content {
    display: flex;
    justify-content: space-between;
  }
  .el-form-item__content::after,
  .el-form-item__content::before {
    content: none;
  }
  .el-table__expanded-cell[class*="cell"] {
    padding: 4px 98px 4px 70px;
  }
  .el-form-item {
    margin-bottom: 0px;
  }
  .el-dialog{
    width: 22%;
  }
  .el-input{
    width: 80%;
  }
}
</style>