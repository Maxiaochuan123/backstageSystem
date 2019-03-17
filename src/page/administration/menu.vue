<template>
<!-- 菜单管理 -->
  <div class="menu mainBox">
    <!-- 操作栏 -->
    <div class="actionBar">
      <el-row class="row">
        <el-col :span="2" :offset="22">
          <!-- 新增 -->
          <el-button type="primary" icon="el-icon-plus" class="addBtn" size="small"  @click="showDialog('菜单','','新增')">新增菜单</el-button>

          <!-- 上级菜单对话框 -->
          <el-dialog class="supDialog" :visible.sync="supDialogStatus" @close="closeSupDialog">
            <div class="filter">
              <el-input v-model="filterText" placeholder="输入关键字进行过滤" prefix-icon="iconfont icon-guolv" @clear="filterClear" clearable></el-input>
            </div>
            <el-tree ref="tree" class="filter-tree" accordion v-if="treeStatus"
              :data="relationResList" :props="defaultProps"
              :default-expanded-keys="defaultExpansion"
              show-checkbox node-key="id" check-strictly
              :filter-node-method="filterNode" @check="checkFn">
            </el-tree>
            <div slot="footer" class="dialog-footer">
              <el-button size="mini" plain @click="closeSupDialog">取 消</el-button>
              <el-button type="primary" plain size="mini" :loading="btnLoading" @click="supDialogConf">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 选择 icon 对话框 -->
          <el-dialog class="iconDialog" :visible.sync="iconDialogStatus" @close="closeIconDialog">
            <div class="iconBox">
              <el-button :icon="item" circle v-for="(item,index) in iconList" :key="index" @click="iconBtn(item)"></el-button>
            </div>
            <div slot="footer" class="dialog-footer">
              <el-button size="mini" plain @click="closeIconDialog">取 消</el-button>
              <el-button type="primary" plain size="mini" :loading="btnLoading" @click="iconDialogConf">确 定</el-button>
            </div>
          </el-dialog>

          <!-- 主对话框 -->
          <el-dialog :title="btnText == '新增'? `新增${dialogText}` : `编辑${dialogText}`" :visible.sync="dialogStatus" @close="closeDialog">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
              <el-form-item label="上级菜单:" prop="supName" class="superIcon" v-if="dialogText == '子菜单' || btnText == '编辑'">
                <el-input v-model="supName" @focus="showSupDialog" placeholder="请选择上级菜单" :disabled="isMainMenu" clearable>
                  <el-button slot="append" icon="el-icon-search" @click="supDialogStatus = true"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="名称:" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入菜单名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="链接:" prop="url">
                <el-input v-model="ruleForm.url" placeholder="请输入链接" clearable></el-input>
              </el-form-item>
              <el-form-item label="图标:" prop="icon" class="iconIcon">
                <el-input v-model="ruleForm.icon" @focus="showIconDialog" placeholder="请选择菜单图标" clearable>
                  <el-button slot="append" icon="iconfont icon-xuanze" @click="iconDialogStatus = true"></el-button>
                </el-input>
              </el-form-item>
              <el-form-item label="排序:" prop="sort">
                <el-input v-model="ruleForm.sort" placeholder="请输入排序权重" clearable></el-input>
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
        <el-table-column label="名称" prop="name">
          <template slot-scope="scope">
            <i :class="scope.row.icon"></i>
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column label="链接" prop="url"></el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column label="状态" prop="isEnable">
          <template slot-scope="scope">
            <span :class="switchStatu(scope.row.isEnable, 'prohibit','enable')">{{scope.row.isEnable == 0 ? '启用' : '禁用'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog('菜单', scope.row, '编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.isEnable, 'el-icon-check', 'el-icon-close')"
              :class="switchStatu(scope.row.isEnable, 'enable','prohibit')"
              @click="enableDisabled(scope.row)"
            >{{switchStatu(scope.row.isEnable, '启用', '禁用') }}</el-button>
            <el-button type="text" icon="el-icon-plus" size="mini" @click="showDialog('子菜单', scope.row, '新增')">新增子菜单</el-button>
          </template>
        </el-table-column>
      </tableTree>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import tableTree from '../../component/tableTree/index'
export default {
  name: "region",
  components:{
    tableTree
  },
  data() {
    return {
      dialogStatus:false, //对话框
      supDialogStatus:false, //选择上级对话框
      iconDialogStatus:false, //选择上级对话框
      dialogText:'', //对话框 title
      btnText:'', //按钮文字
      isMainMenu: false, //是否添加主菜单
      defaultExpansion:[0], //tree 默认展开项
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      filterText:'',
      supNameItem:'',
      supName:'',

      iconItem:'',
      iconList:[
        'iconfont icon-jiaoseguanli1','iconfont icon-caidan','iconfont icon-guolv','iconfont icon-quyupaixu','iconfont icon-zuzhi'
        ,'iconfont icon-jiaoseguanli','iconfont icon-guansuo','el-icon-setting','el-icon-date','el-icon-menu'
      ],

      // 表单
      ruleForm:{
        parentId:'', //上级菜单 id
        name:'', //菜单名
        url:'', //菜单链接
        icon:'', //菜单图标
        sort:'' //排序
      },
      // 验证
      rules:{
        name:[{required: true, message: '请输入菜单名称', trigger: 'blur'}]
      },

      // 表格
      tableData: []
    };
  },
  created() {
    this.apiMethod.getMenu(this);
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  computed:{
    ...mapState(['relationResList'])
  },
  methods: {
    // 禁用 / 启用
    enableDisabled(scope) {
      this.apiMethod.disabledMenu(this, scope);
      setTimeout(()=>{
        this.getRelationRes();
        this.getUserMenu();
      },500);
    },

    recursion(scopeChildren, scope){
      scopeChildren.forEach(item => {
        if(scope.parentId == item.id){
          return this.supName = this.btnText == '新增' ? scope.name : item.name;
        }else{
          if(item.children){
            this.recursion(item.children, scope);
          }
          
          if(this.btnText == '新增'){
            return this.supName = scope.name;
          }else{
            return this.supName = scope.parent ? scope.parent.name : '';
          }
        }
      })
    },

    // 显示对话框
    showDialog(title, scope, btnText){
      this.dialogStatus = true;
      this.dialogText = title;
      this.btnText = btnText;
      this.isMainMenu = true;
      this.supName = '';

      this.$nextTick(()=>{
        if(btnText == '编辑'){
          this.ruleForm = {...scope};
          this.recursion(this.tableData, scope);
        }else if(btnText == '新增' && title == '菜单'){
          this.isMainMenu = false;
          this.ruleForm.parentId = 0;
        }else if(btnText == '新增' && title == '子菜单'){
          this.ruleForm.parentId = scope.id;
          this.recursion(this.tableData, scope);
        }
      });

    },

    // 显示 选择上级对话框
    showSupDialog(){
      this.supDialogStatus = true;
      this.treeStatus = true;
    },
    //tree
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // tree单选
    checkFn(node, data) {
      this.supNameItem = node.name;
      this.ruleForm.parentId = node.id;
      let checkedKeys = data.checkedKeys;
      let currKey = node.id;
      this.$refs.tree.setCheckedKeys([currKey]);
    },
    // 当清除 filterText时，恢复初始展开状态
    filterClear(){
      this.treeStatus = false;
      setTimeout(() => {
        this.treeStatus = true;
      });
    },

    // 上级对话框 确认
    supDialogConf(){
      this.supName = this.supNameItem;
      this.supDialogStatus = false;
    },
    // 关闭上级对话框
    closeSupDialog(){
      this.filterText = '';
      this.treeStatus = false;
      this.supDialogStatus = false;
    },


    // 显示 icon 对话框
    showIconDialog(){
      this.iconDialogStatus = true;
    },
    iconBtn(item){
      this.iconItem = item;
    },
    // icon对话框 确认
    iconDialogConf(){
      this.ruleForm.icon = this.iconItem;
      this.iconDialogStatus = false;
    },
    // 关闭 icon 对话框
    closeIconDialog(){
      this.iconDialogStatus = false;
    },

    //提交
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(this.btnText == '编辑'){
            delete this.ruleForm.children; delete this.ruleForm._expanded; delete this.ruleForm._level; delete this.ruleForm._show; delete this.ruleForm.parent;
            this.apiMethod.editMenu(this);
            setTimeout(()=>{
              this.getRelationRes();
              this.getUserMenu();
            },500);
          }else if(this.btnText == '新增' && (this.dialogText == '菜单' || this.dialogText == '子菜单')){
            this.apiMethod.addMenu(this);
            setTimeout(()=>{
              this.getRelationRes();
              this.getUserMenu();
            },500);
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
.menu {
  .actionBar {
    .el-input{
      width: 90%;
    }
    .superIcon{
      .el-input-group__append, .el-input-group__prepend{
        padding: 0 11px;
      }
    }
    .iconIcon{
      .el-input-group__append, .el-input-group__prepend{
        padding: 0 10px;
      }
    }
    .supDialog{
      .el-dialog{
        width: 18%;
      }
      .el-dialog__body{
        padding: 20px 20px;
      }
      .filter{
        margin-bottom: 20px;
      }
    }

    .iconDialog{
      .el-button.is-circle{
        width: 44px;
        height: 44px;
        overflow: hidden;
        margin-left: 4px;
        margin-bottom: 6px;
      }
      .iconBox{
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
      }
      .el-button{
        .is-circle{
          width: 50px;
          height: 50px;
        }
        .iconfont{
          font-size: 18px;
        }
      }
      .el-dialog{
        width: 15%!important;
        .el-dialog__body{
          padding: 20px 20px;
        }
      }
    }
  }
  .el-dialog{
    width: 28%!important;
  }
}
</style>