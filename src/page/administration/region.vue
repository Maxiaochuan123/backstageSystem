<template>
<!-- 区域管理 -->
  <div class="region mainBox">
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
            <span :class="switchStatu(scope.row.isEnable, 'prohibit','enable')">{{scope.row.isEnable == 0 ? '启用' : '禁用'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog('省份',scope.row,'编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.isEnable, 'el-icon-check', 'el-icon-close')"
              :class="switchStatu(scope.row.isEnable, 'enable','prohibit')"
              @click="enableDisabled(scope.row)"
            >{{switchStatu(scope.row.isEnable, '启用', '禁用') }}</el-button>
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
      let isEnable = scope.parent ? scope.parent.isEnable : '';
      if(isEnable == 1){
        this.$message.warning('父级禁用状态下, 子级不可修改状态!')
      }else{
        this.apiMethod.disabledRegion(this, scope);
        setTimeout(()=>{this.getRegion()},500);
      }
    },

    // 显示对话框
    showDialog(title, scope, btnText){
      this.dialogStatus = true;
      this.dialogText = title;
      this.provinceId = title == '大区' ? scope.id : null;
      this.btnText = btnText;

      this.$nextTick(()=>{
        if(btnText == '编辑'){
          console.log(scope)
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
            setTimeout(()=>{this.getRegion()},500);
          }else if(this.btnText == '新增' && (this.dialogText == '大区' || this.dialogText == '省份')){
            this.apiMethod.addRegion(this);
            setTimeout(()=>{this.getRegion()},500);
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss">
.region {
  .actionBar {
    .el-input{
      width: 90%;
    }
  }
  .el-dialog{
    width: 20%;
  }
}
</style>