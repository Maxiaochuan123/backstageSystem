<template>
<!-- 机构管理 -->
  <div class="mechanism">
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
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in largeAreaList" :key="index"></el-option>
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

    <!-- 表格 -->
    <div class="content">
      <tableTree :data="tableData" border stripe v-loading="tableLoading">
        <el-table-column prop="groupName" label="名称"></el-table-column>
        <el-table-column prop="isEnable" label="状态">
          <template slot-scope="scope">
            <span :class="switchStatu(scope.row.isEnable, 'isEnable','prohibit')">{{scope.row.isEnable == 0 ? '禁用' : '启用'}}</span>
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
              :icon="switchStatu(scope.row.isEnable, 'el-icon-close', 'el-icon-check')"
              :class="switchStatu(scope.row.isEnable, 'prohibit','isEnable')"
              @click="enableDisabled(scope.row)"
            >{{switchStatu(scope.row.isEnable, '禁用', '启用') }}</el-button>
            <el-button type="text" class="danger" icon="el-icon-delete" size="mini" @click="deletItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </tableTree>
    </div>
    <!-- 分页 -->
    <!-- <div class="paging">
      <el-pagination
        background
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page="paging.req.pageIndex"
        :page-sizes="[15, 20, 30, 40]"
        :page-size="paging.req.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paging.totalPage">
      </el-pagination>
    </div> -->
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
    ...mapState(['largeAreaList']),

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
    attrNum(){
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
      // scope.isEnable = scope.isEnable == 1 ? 0 : 1;
      this.apiMethod.disabledMechanism(this, scope)
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
    showDialog(scope, btnText){
      this.dialogStatus = true;
      this.dialogText = this.attrText(scope.type);
      this.editText = this.attrText2(scope.type);
      this.btnText = btnText;

      this.$nextTick(()=>{
        if(btnText == '编辑'){
          this.ruleForm = {...scope}
          this.typeText = this.attrText2(scope.type);
          this.superiorName = scope.parent ? scope.parent.groupName : '';
          this.isBm = scope.type == 2 ? false : true;
          this.isJt = scope.type == 0 ? false : true;
          this.isDq = scope.type == 3 ? false : true;
          // console.log(this.ruleForm)

        }else if(btnText == '新增'){
          this.superiorName = scope.groupName;
          this.ruleForm.type = this.attrNum(scope.type);
          this.typeText = this.attrText(scope.type);
          this.ruleForm.parentId = scope.parentId == 0 ? 1 : scope.parentId;

          this.isBm = scope.type == 1 ? false : true;
          this.isJt = true;
          this.isDq = true;
          console.log('scope:',scope)
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
          }else{
            this.apiMethod.addMechanism(this);
          }

          // this.btnLoading = true;
          // setTimeout(()=>{
          //   this.btnLoading = false;
          //   this.resetFn();
          // },1000);

        } else {
          return false;
        }
      });
    },

    // 删除
    deletItem(scope){
      this.apiMethod.deleteMechanism(this, scope);
    },

    // 触发分页
    changePaging(){
      this.apiMethod.getMechanism(this);
    },
  }
};
</script>
<style lang="scss">
.mechanism {
  height: calc(100vh - 72px);

  .content{
    overflow-y: none;
    height: calc(100vh - 70px);
    background-color: #fff;

    .statusChildren{
      margin-right: 40px;
    }
    .prohibit {
      color: #f56c6c;
    }
    .isEnable {
      color: #67c23a;
    }
    .danger{
      color: #ff0000;
    }
    .el-table__body-wrapper{
      overflow-y: auto;
    }
  }

  // .paging{
  //   width: 100%;
  //   padding: 4px;
  //   background-color: #fff;
  //   display: flex;
  //   flex-direction: row-reverse;
  //   .el-pagination{
  //     min-width: 23%;
  //     margin-right: 10px;
  //     z-index: 100;
  //   }
  //   .el-pagination__jump{
  //     margin-left: 0px;
  //   }
  // }

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