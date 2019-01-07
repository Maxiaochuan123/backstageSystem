<template>
<!-- 区域管理 -->
  <div class="organization">
    <!-- 新增 -->
    <!-- <el-button type="primary" icon="el-icon-plus" class="addBtn" size="small"  @click="showDialog('省份','','新增')">新增省份</el-button> -->
    <!-- 对话框 -->
    <!-- <el-dialog :title="btnText == '新增'? `新增${dialogText}` : `编辑${dialogText}`" :visible.sync="dialogStatus" @close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="省份名称:" v-if="btnText == '新增' && dialogText == '大区'">
            <el-input v-model="activeProvince" disabled></el-input>
          </el-form-item>
          <el-form-item :label="`${dialogText}名称:`" prop="fieldName">
            <el-input v-model.trim="ruleForm.fieldName" :placeholder="`请输入${dialogText}名称`" clearable></el-input>
          </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="mini" :loading="btnLoading" @click="submit">提 交</el-button>
      </div>
    </el-dialog> -->
    <!-- 表格 -->
    <div class="content">
      <tableTree :data="tableData" border>
        <el-table-column prop="label" label="名称"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="switchStatu(scope.row.status, 'enable','prohibit')">{{scope.row.status == 0 ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog('省份',scope.row,'编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.status, 'el-icon-close', 'el-icon-check')"
              :class="switchStatu(scope.row.status, 'prohibit','enable')"
              @click="enableDisabledParent(scope.$index, scope.row)"
            >{{switchStatu(scope.row.status, '禁用', '启用') }}</el-button>
            <el-button type="text" icon="el-icon-plus" size="mini" @click="showDialog('大区',scope.row,'新增')" v-if="scope.row.children">
              {{新增大区}}
            </el-button>
          </template>
        </el-table-column>
      </tableTree>
    </div>
    <!-- 分页 -->
    <div class="paging">
      <el-pagination
        background
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="paging.req.pageIndex"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="paging.req.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paging.totalPage">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import tableTree from '../../component/tableTree/index'
export default {
  name: "organization",
  components:{
    tableTree
  },
  data() {
    return {
      dialogStatus:false, //新增 or 编辑 对话框
      dialogText:'', //对话框 title
      provinceId:'',  // 当前省id
      activeProvince:'', //省份(新增大区时用于展示)
      btnText:'', //按钮文字


      // 表单
      ruleForm:{
        fieldName:'', //新增 or 编辑 字段名
      },
      // 验证
      rules:{
        fieldName:[{required: true, message: '内容不能为空', trigger: 'blur'}]
      },

      columns: [{
        text: "名称",
        value: "label"
      },
      {
        text: "状态",
        value: "status"
      }],

      // 表格
      tableData: [
        {
          label: "众汇金控集团",
          id: 1,
          status: 1,
          attr: 'jt',
          children: [
            {
              label: "洛阳公司",
              id: 11,
              status: 0,
              attr: 'jg',
              children: [
                {
                  label: "万网科技",
                  id: 111,
                  status: 0,
                  attr: 'bm',
                  children: [
                    {
                      label: "成都一区",
                      id: 1111,
                      status: 1,
                      attr: 'dq',
                    }
                  ]
                }
              ]
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
          return item.status = 1;
        }else{
          return item.status = 0;
        }
      })
    },

    // 禁用 / 启用  子
    enableDisabledChldren(index, scope, scopeParent){
      scope.status = scope.status == 1 ? 0 : 1;
    },

    // 显示对话框
    showDialog(title, scope, btnText){
      // this.dialogStatus = true;
      // this.dialogText = title;
      // this.provinceId = title == '大区' ? scope.id : null;
      // this.btnText = btnText;

      // this.$nextTick(()=>{
      //   if(btnText == '编辑'){
      //     this.ruleForm.fieldName = scope.date;
      //   }else if(btnText == '新增' && title == '大区'){
      //     this.activeProvince = scope.date;
      //   }
      // });
      console.log(scope.children)

    },

    //提交
    submit(){
      // console.log(this.provinceId)
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(this.btnText == '编辑'){

          }else{

          }
          this.btnLoading = true;
          setTimeout(()=>{
            this.btnLoading = false;
            this.resetFn();
          },1000)

        } else {
          return false;
        }
      });
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
    .addBtn{
      position: absolute;
      right: 10px;
    }
    .el-input{
      width: 90%;
    }
  }

  .content{
    overflow-y: none;
    height: calc(100vh - 116px);
    background-color: #fff;

    .statusChildren{
      margin-right: 40px;
    }
    .prohibit {
      color: #f56c6c;
    }
    .enable {
      color: #67c23a;
    }
  }

  .paging{
    width: 100%;
    padding: 4px;
    background-color: #fff;
    display: flex;
    flex-direction: row-reverse;
    .el-pagination{
      min-width: 23%;
      margin-right: 10px;
      z-index: 100;
    }
    .el-pagination__jump{
      margin-left: 0px;
    }
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
  .el-dialog{
    width: 20%;
  }
}
</style>