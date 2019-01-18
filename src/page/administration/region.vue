<template>
<!-- 区域管理 -->
  <div class="region">
    <!-- 操作栏 -->
    <div class="actionBar">
      <el-row class="row">
        <el-col :span="2" :offset="22">
          <!-- 新增 -->
          <el-button type="primary" icon="el-icon-plus" class="addBtn" size="small"  @click="showDialog('省份','','新增')">新增省份</el-button>
          <!-- 对话框 -->
          <el-dialog :title="btnText == '新增'? `新增${dialogText}` : `编辑${dialogText}`" :visible.sync="dialogStatus" @close="closeDialog">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="省份名称:" v-if="btnText == '新增' && dialogText == '大区'">
                 <el-input v-model="activeProvince" disabled></el-input>
               </el-form-item>
               <el-form-item :label="`${dialogText}名称:`" prop="areaName">
                 <el-input v-model.trim="ruleForm.areaName" :placeholder="`请输入${dialogText}名称`" clearable></el-input>
               </el-form-item>
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button size="mini" @click="closeDialog">取 消</el-button>
              <el-button type="primary" size="mini" :loading="btnLoading" @click="submit">提 交</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content">
      <tableTree :data="tableData" border v-loading="tableLoading">
        <el-table-column label="区域分类" prop="areaName"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="switchStatu(scope.row.isEnable, 'enable','prohibit')">{{scope.row.isEnable == 0 ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog('省份',scope.row,'编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.isEnable, 'el-icon-close', 'el-icon-check')"
              :class="switchStatu(scope.row.isEnable, 'prohibit','enable')"
              @click="enableDisabled(scope.row)"
            >{{switchStatu(scope.row.isEnable, '禁用', '启用') }}</el-button>
            <el-button type="text" icon="el-icon-plus" size="mini" @click="showDialog('大区',scope.row,'新增')" v-if="scope.row.parentId == 0">新增大区</el-button>
          </template>
        </el-table-column>
      </tableTree>
    </div>
  </div>
</template>

<script>
import tableTree from '../../component/tableTree/index'
export default {
  name: "region",
  components:{
    tableTree
  },
  data() {
    return {
      dialogStatus:false, //对话框
      dialogText:'', //对话框 title
      provinceId:'',  // 当前省id
      activeProvince:'', //省份(新增大区时用于展示)
      btnText:'', //按钮文字

      // 表单
      ruleForm:{
        areaName:'' //新增 or 编辑 字段名
      },
      // 验证
      rules:{
        areaName:[{required: true, message: '内容不能为空', trigger: 'blur'}]
      },

      // 表格
      tableData: []
    };
  },
  created() {
    this.apiMethod.getRegion(this);
  },

  methods: {
    // 禁用 / 启用
    enableDisabled(scope) {
      // scope.isEnable = scope.isEnable == 1 ? 0 : 1;
      this.apiMethod.disabledRegion(this, scope);
      // if(scope.children){
      //   this.recursion(scope.children, scope);
      // }
    },
    // recursion(scopeChildren, scope){
    //   scopeChildren.forEach(item => {
    //     item.isEnable = scope.isEnable == 1 ? 1 : 0;
    //     if(item.children){
    //       this.recursion(item.children, scope);
    //     }
    //   })
    // },

    // 显示对话框
    showDialog(title, scope, btnText){
      this.dialogStatus = true;
      this.dialogText = title;
      this.provinceId = title == '大区' ? scope.id : null;
      this.btnText = btnText;

      this.$nextTick(()=>{
        if(btnText == '编辑'){
          this.ruleForm.areaName = scope.areaName;
          this.ruleForm.geoId = scope.id;
          delete this.ruleForm.parentId ? this.ruleForm.parentId : '';

        }else if(btnText == '新增' && title == '大区'){
          this.activeProvince = scope.areaName;
          this.ruleForm.parentId = scope.id;
          delete this.ruleForm.geoId ? this.ruleForm.geoId : '';

        }else if(btnText == '新增' && title == '省份'){
          delete this.ruleForm.geoId ? this.ruleForm.geoId : '';
          this.ruleForm.parentId = 0;
        }
      });

    },

    //提交
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(this.btnText == '编辑'){
            this.apiMethod.editRegion(this);
          }else if(this.btnText == '新增' && this.dialogText == '大区'){
            this.apiMethod.addRegion(this);

          }else if(this.btnText == '新增' && this.dialogText == '省份'){
            this.apiMethod.addRegion(this);
          }
        } else {
          return false;
        }
      });
    },

    // 触发分页
    changePaging(){
      this.apiMethod.getRegion(this);
    },
  }
};
</script>
<style lang="scss">
.region {
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
    height: calc(100vh - 124px);
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
    .el-table__body-wrapper{
      overflow-y: auto;
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