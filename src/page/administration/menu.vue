<template>
<!-- 菜单管理 -->
  <div class="region">
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
              <el-form-item label="上级菜单:" prop="supName" class="superIcon">
                <el-input v-model="supName" @focus="showSupDialog" placeholder="请选择上级菜单" clearable> <el-button slot="append" icon="el-icon-search"></el-button></el-input>
              </el-form-item>
              <el-form-item label="名称:" prop="name">
                <el-input v-model="ruleForm.name" placeholder="请输入菜单名称" clearable></el-input>
              </el-form-item>
              <el-form-item label="链接:" prop="url">
                <el-input v-model="ruleForm.url" placeholder="请输入链接" clearable></el-input>
              </el-form-item>
              <el-form-item label="图标:" prop="icon" class="iconIcon">
                <el-input v-model="ruleForm.icon" @focus="showIconDialog" placeholder="请选择菜单图标" clearable> <el-button slot="append" icon="iconfont icon-xuanze"></el-button></el-input>
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
        <el-table-column label="名称" prop="name"></el-table-column>
        <el-table-column label="链接" prop="url"></el-table-column>
        <el-table-column label="排序" prop="sort"></el-table-column>
        <el-table-column prop="isEnable" label="状态">
          <template slot-scope="scope">
            <span :class="switchStatu(scope.row.isEnable, 'enable','prohibit')">{{scope.row.isEnable == 0 ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="220">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog('菜单',scope.row,'编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.isEnable, 'el-icon-close', 'el-icon-check')"
              :class="switchStatu(scope.row.isEnable, 'prohibit','enable')"
              @click="enableDisabled(scope.row)"
            >{{switchStatu(scope.row.isEnable, '禁用', '启用') }}</el-button>
            <el-button type="text" icon="el-icon-plus" size="mini" @click="showDialog('子菜单',scope.row,'新增')">新增子菜单</el-button>
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
        :page-sizes="[15, 20, 30, 40]"
        :page-size="paging.req.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="paging.totalPage">
      </el-pagination>
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
      defaultExpansion:[], //tree 默认展开项
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: () => this.isSee ? true : false
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
      scope.isEnable = scope.isEnable == 1 ? 0 : 1;
      this.apiMethod.changeStatus(this, scope);
      if(scope.children){
        this.recursion(scope.children, scope);
      }
    },
    recursion(scopeChildren, scope){
      scopeChildren.forEach(item => {
        item.isEnable = scope.isEnable == 1 ? 1 : 0;
        if(item.children){
          this.recursion(item.children, scope);
        }
      })
    },

    // 显示对话框
    showDialog(title, scope, btnText){
      this.dialogStatus = true;
      this.dialogText = title;
      this.btnText = btnText;
      
      this.$nextTick(()=>{
        if(btnText == '编辑'){
          this.ruleForm = {...scope};

        }else if(btnText == '新增' && title == '菜单'){
          
        }else if(btnText == '新增' && title == '子菜单'){
          
        }
      });

    },

    // 显示 选择上级对话框
    showSupDialog(){
      this.supDialogStatus = true;
      this.treeStatus = true;
      this.defaultExpansion = [1] //默认只展示第一级

      this.$nextTick(()=>{

      })
    },
    //tree
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    // tree单选
    checkFn(node, data) {
      this.supNameItem = node.name
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
        this.defaultExpansion = [1];
        // this.$refs.tree.setCheckedKeys([]);
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
        console.log(this.ruleForm);
        if (valid) {
          if(this.btnText == '编辑'){
            
          }else if(this.btnText == '新增' && this.dialogText == '菜单'){
            
          }else if(this.btnText == '新增' && this.dialogText == '子菜单'){
            
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
      .el-button .is-circle{
        width: 50px;
        height: 50px;
      }
      .el-dialog{
        width: 15%;
        .el-dialog__body{
          padding: 20px 20px;
        }
      }
    }
  }

  .content{
    overflow-y: none;
    height: calc(100vh - 164px);
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
  }
}
</style>