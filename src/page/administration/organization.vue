<template>
<!-- 区域管理 -->
  <div class="organization">
    <!-- 对话框 -->
    <el-dialog :title="btnText == '新增'? `新增${dialogText}` : `编辑${editText}`" :visible.sync="dialogStatus" @close="closeDialog">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="上级名称:" prop="superiorName" v-if="isJt">
          <el-input v-model="ruleForm.superiorName" disabled></el-input>
        </el-form-item>
        <el-form-item label="名称:" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="机构属性:" prop="attribute" v-if="isDq">
          <el-input v-model="ruleForm.attribute" disabled></el-input>
        </el-form-item>
        <el-form-item label="所属区域:" prop="region" v-if="isBm && isJt && isDq">
          <el-select v-model="ruleForm.region" placeholder="请选择所属区域" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.mechanismList" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述:" prop="describe">
          <el-input v-model="ruleForm.describe" type="textarea" :rows="2"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeDialog">取 消</el-button>
        <el-button type="primary" size="mini" :loading="btnLoading" @click="submit">提 交</el-button>
      </div>
    </el-dialog>

    <!-- 表格 -->
    <div class="content">
      <tableTree :data="tableData" border>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="switchStatu(scope.row.status, 'enable','prohibit')">{{scope.row.status == 0 ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="270">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-plus" size="mini" @click="showDialog(scope.row,'新增')" v-if="scope.row.children">
              {{`新增${attrText(scope.row.attribute)}`}}
            </el-button>
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog(scope.row,'编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.status, 'el-icon-close', 'el-icon-check')"
              :class="switchStatu(scope.row.status, 'prohibit','enable')"
              @click="enableDisabled(scope.row)"
            >{{switchStatu(scope.row.status, '禁用', '启用') }}</el-button>
            <el-button type="text" class="danger" icon="el-icon-delete" size="mini" @click="deletItem(scope.row)">删除</el-button>
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
        superiorName:'', //上级名称
        name:'', //名称
        attribute:'', //机构属性
        region:'', //所属区域
        describe:'' //描述
      },
      // 验证
      rules:{
        name:[{required: true, message: '请输入名称', trigger: 'blur'}],
        region:[{required: true, message: '请选择所属区域', trigger: 'change'}],
      },

      // 表格
      tableData: [
        {
          name: "众汇金控集团",
          id: 1,
          parentId:'',
          status: 1,
          attribute: 'jt',
          region: '1',
          describe:'描述~',
          children: [
            {
              name: "洛阳公司",
              id: 11,
              parentId:1,
              status: 0,
              attribute: 'jg',
              region: '2',
              describe:'描述~',
              children: [
                {
                  name: "万网科技",
                  id: 111,
                  parentId:11,
                  status: 0,
                  attribute: 'bm',
                  region: '',
                  describe:'描述~',
                  children: [
                    {
                      name: "成都一区",
                      id: 1111,
                      parentId:111,
                      status: 1,
                      attribute: 'dq',
                      region: '',
                      describe:'描述~',
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
  computed: {
    attrText(){
      return (attribute)=>{
        switch (attribute) {
          case 'jt':
              return '机构';
            break;
          case 'jg':
              return '部门';
            break;
          case 'bm':
              return '大区';
            break;
        }
      }
    },
    attrText2(){
      return (attribute)=>{
        switch (attribute) {
          case 'jt':
              return '集团';
            break;
          case 'jg':
              return '机构';
            break;
          case 'bm':
              return '部门';
            break;
          case 'dq':
              return '大区';
            break;
        }
      }
    }
  },

  methods: {
    // 禁用 / 启用
    enableDisabled(scope) {
      scope.status = scope.status == 1 ? 0 : 1;
      if(scope.attribute == 'jt'){
        this.recursion(scope.children, scope);
      }
    },
    recursion(scopeChildren, scope){
      scopeChildren.forEach(item => {
        item.status = scope.status == 1 ? 1 : 0;
        if(item.children){
          this.recursion(item.children, scope);
        }
      })
    },

    // 显示对话框
    showDialog(scope, btnText){
      this.dialogStatus = true;
      this.dialogText = this.attrText(scope.attribute);
      this.editText = this.attrText2(scope.attribute);
      this.btnText = btnText;

      this.$nextTick(()=>{
        if(btnText == '编辑'){
          this.ruleForm = {...scope}
          this.ruleForm.attribute = this.attrText2(scope.attribute);
          this.ruleForm.superiorName = scope.parent ? scope.parent.name : '';
          this.isBm = scope.attribute == 'bm' ? false : true;
          this.isJt = scope.attribute == 'jt' ? false : true;
          this.isDq = scope.attribute == 'dq' ? false : true;
          console.log(this.ruleForm)

        }else if(btnText == '新增'){
          this.ruleForm.superiorName = scope.name;
          this.ruleForm.attribute = this.attrText(scope.attribute);
          this.isBm = scope.attribute == 'jg' ? false : true;
          this.isJt = true;
          this.isDq = true;
          console.log(this.ruleForm)
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
          delete this.ruleForm._expanded; delete this.ruleForm._level; delete this.ruleForm.parent;
          delete this.ruleForm._show; delete this.ruleForm.children;
          // console.log(this.ruleForm);

          // if(this.btnText == '编辑'){

          // }else{

          // }

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

    deletItem(scope){
      this.$confirm('您确定要删除吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      })
    }
  }
};
</script>
<style lang="scss">
.organization {
  height: calc(100vh - 72px);

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
    .danger{
      color: #ff0000;
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