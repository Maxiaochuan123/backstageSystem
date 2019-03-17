<template>
<!-- 机构管理 -->
  <div class="mechanism mainBox">
    <!-- 操作栏 -->
    <div class="actionBar">
      <el-row class="row">
        <el-col :span="2" :offset="22">
          <!-- 新增 -->
          <el-button type="primary" icon="el-icon-plus" class="addBtn" size="small"  @click="showDialog('','新增')">新增机构</el-button>

          <!-- 对话框 -->
          <el-dialog :title="btnText == '新增'? `新增${dialogText}` : `编辑${editText}`" :visible.sync="dialogStatus" @close="closeDialog">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="上级名称:" prop="superiorName" v-if="isJt">
                <el-input v-model="superiorName" disabled></el-input>
              </el-form-item>
              <el-form-item label="名称:" prop="groupName">
                <el-input v-model="ruleForm.groupName" placeholder="请输入名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="机构属性:" prop="typeText" v-if="isDq">
                <el-input v-model="typeText" disabled></el-input>
              </el-form-item>
              <el-form-item label="所属区域:" prop="geoId" v-if="isBm && isJt && isDq">
                <el-select v-model="ruleForm.geoId" placeholder="请选择所属区域" clearable>
                  <el-option :label="item.label" :value="item.value" :disabled="item.isEnable == 1"  v-for="(item,index) in  dialogText == '机构' || dialogText == '部门' ? companyList : largeAreaList" :key="index"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="描述:" prop="description">
                <el-input v-model="ruleForm.description" type="textarea" :rows="2"></el-input>
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
        <el-table-column prop="groupName" label="名称"></el-table-column>
        <el-table-column prop="isEnable" label="状态">
          <template slot-scope="scope">
            <span :class="switchStatu(scope.row.isEnable, 'prohibit','isEnable')">{{scope.row.isEnable == 0 ? '启用' : '禁用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="270">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-plus" size="mini" @click="showDialog(scope.row,'新增')" v-if="scope.row.type != 3">
              {{`新增${attrText(scope.row.type)}`}}
            </el-button>
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog(scope.row,'编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.isEnable, 'el-icon-check', 'el-icon-close')"
              :class="switchStatu(scope.row.isEnable, 'isEnable','prohibit')"
              @click="enableDisabled(scope.row)"
            >{{switchStatu(scope.row.isEnable, '启用', '禁用') }}</el-button>
            <el-button type="text" class="danger" icon="el-icon-delete" size="mini" @click="deletItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </tableTree>
    </div>
  </div>
</template>

<script>
import tableTree from '../../component/tableTree/index'
import { mapState } from 'vuex'
export default {
  name: "mechanism",
  components:{
    tableTree
  },
  data() {
    return {
      dialogStatus:false, //对话框
      dialogText:'', //对话框 title
      editText:'', //对话框 编辑时文字
      btnText:'', //按钮文字
      isBm:true, //部门显示 or 隐藏
      isJt:true, //集团显示 or 隐藏
      isDq:true, //大区显示 or 隐藏
      parentList:'', //父节点

      // 表单
      ruleForm:{
        
        groupName:'', //名称
        parentId:'', //父级 id
        geoId:'', //关联地区 id
        type:'', //机构属性
        
        description:'' //描述
      },
      superiorName:'', //上级名称
      typeText:'', //机构属性描述

      // 验证
      rules:{
        groupName:[{required: true, message: '请输入名称', trigger: 'blur'}],
        geoId:[{required: true, message: '请选择所属区域', trigger: 'change'}],
      },
      
      // 表格
      tableData: []
    };
  },
  created() {
    this.apiMethod.getMechanism(this);
  },
  computed: {
    ...mapState(['largeAreaList', 'companyList']),

    // 组织类型(0:集团，1:机构，2:部门，3:大区)
    attrText(){
      return (type)=>{
        switch (type) {
          case 0:
              return '机构';
            break;
          case 1:
              return '部门';
            break;
          case 2:
              return '大区';
            break;
        }
      }
    },
    attrText2(){
      return (type)=>{
        switch (type) {
          case 0:
              return '集团';
            break;
          case 1:
              return '机构';
            break;
          case 2:
              return '部门';
            break;
          case 3:
              return '大区';
            break;
        }
      }
    },
    attrText3(){
      return (type)=>{
        switch (type) {
          case '集团':
              return 0;
            break;
          case '机构':
              return 1;
            break;
          case '部门':
              return 2;
            break;
          case '大区':
              return 3;
            break;
        }
      }
    },
    attrText4(){
      return (type)=>{
        switch (type) {
          case 0:
              return 1;
            break;
          case 1:
              return 2;
            break;
          case 2:
              return 3;
            break;
        }
      }
    }
  },

  methods: {
    // 禁用 / 启用
    enableDisabled(scope) {
      let isEnable = scope.parent ? scope.parent.isEnable : '';
      if(isEnable == 1){
        this.$message.warning('父级禁用状态下, 子级不可修改状态!')
      }else{
        this.apiMethod.disabledMechanism(this, scope);
        setTimeout(()=>{this.getMechanism()},500);
      }
    },

    // 显示对话框
    showDialog(scope, btnText){
      
      this.dialogStatus = true;
      this.dialogText = this.attrText(scope.type) || '机构';
      this.editText = this.attrText2(scope.type);
      this.btnText = btnText;

      this.$nextTick(()=>{
        if(btnText == '编辑'){
          this.ruleForm = {...scope}
          this.typeText = this.attrText2(scope.type);
          this.superiorName = scope.parent ? scope.parent.groupName : '众汇车服集团';
          this.isBm = scope.type == 2 ? false : true;
          this.isJt = scope.type == 0 ? false : true;
          this.isDq = scope.type == 3 ? false : true;

        }else if(btnText == '新增' && this.dialogText == '机构'){
          this.superiorName = '众汇车服集团';
          this.ruleForm.type = 1;
          this.typeText = '机构';
          this.ruleForm.parentId = 0;

          this.isBm = scope.type == 1 ? false : true;
          this.isJt = true;
          this.isDq = true;
          
          
        }else if(btnText == '新增' && (this.dialogText == '部门' || this.dialogText == '大区')){
          this.superiorName = scope.groupName;
          this.ruleForm.type = this.attrText4(scope.type);
          this.typeText = this.attrText(scope.type);
          this.ruleForm.parentId = scope.id;

          this.isBm = scope.type == 1 ? false : true;
          this.isJt = true;
          this.isDq = true;
        }
      });

    },

    //查找父节点的 id = parentId 相等的父节点
    findParent(data, parentId) {
     data.forEach(item => {
       if(parentId){
         if(item.id == parentId){
           this.parentList = item;
         }else{
           this.findParent(item.children, parentId);
         }
       }
     })
    },

    //提交
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          delete this.ruleForm._expanded; delete this.ruleForm._level; delete this.ruleForm.parent; delete this.ruleForm.superiorName;
          delete this.ruleForm._show; delete this.ruleForm.children; delete this.ruleForm.typeText;

          console.log('ruleForm:',this.ruleForm);

          if(this.btnText == '编辑'){
            this.apiMethod.editMechanism(this);
            setTimeout(()=>{this.getMechanism()},500);
          }else{
            this.apiMethod.addMechanism(this);
            setTimeout(()=>{this.getMechanism()},500);
          }
        } else {
          return false;
        }
      });
    },

    // 删除
    deletItem(scope){
      this.apiMethod.deleteMechanism(this, scope);
    }
  }
};
</script>
<style lang="scss">
.mechanism {
  .actionBar {
    .el-input{
      width: 90%;
    }
  }

  .el-dialog{
    width: 28%;
    .el-input, .el-textarea{
      width: 90%;
    }
    .el-select{
      width: 90%;
      .el-input{
        width: 100%;
      }
    }
  }
}
</style>