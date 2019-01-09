<template>
<!-- 角色管理 -->
  <div class="role">
    <!-- 操作栏 -->
    <div class="actionBar">
      <el-row class="row">
        <el-col :span="2" :offset="22">
          <!-- 新增 -->
          <el-button type="primary" icon="el-icon-plus" class="addBtn" size="small" @click="showDialog('','新增')">新增角色</el-button>
          <!-- 对话框 -->
          <el-dialog :title="`${dialogText}角色`" :visible.sync="dialogStatus" @close="closeDialog">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

              <el-row>
                <el-col :span="12">
                  <el-form-item label="角色名称:" prop="roleName">
                    <el-input v-model.trim="ruleForm.roleName" placeholder="请输入角色名称" clearable :disabled="isSee"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="英文名称:" prop="englishName">
                    <el-input v-model.trim="ruleForm.englishName" placeholder="请输入英文名称" clearable :disabled="isSee"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="角色描述:" prop="roleDescribe">
                    <el-input v-model.trim="ruleForm.roleDescribe" placeholder="请输入角色描述" clearable :disabled="isSee"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="数据范围:" prop="dataRange">
                    <el-select v-model="ruleForm.dataRange" placeholder="请选择数据范围"  clearable :disabled="isSee">
                      <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.dataRangeList" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角色类型:" prop="roleType">
                    <el-select v-model="ruleForm.roleType" placeholder="请选择角色类型"  clearable :disabled="isSee">
                      <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.roleTypeList" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-form>
            <el-row>
              <el-col :span="12">
                <div class="filter">
                  <span>权限过滤：</span>
                  <el-input v-model="filterText" placeholder="输入关键字进行过滤" size="mini" prefix-icon="iconfont icon-guolv" @clear="filterClear" :disabled="isSee" clearable></el-input>
                </div>
                <div class="tree">
                  <p><span>*</span>权限:</p>
                  <!-- v-if="treeStatus" 手动销毁组件 防止数据不同步 -->
                  <el-tree ref="tree" class="filter-tree" accordion v-if="treeStatus"
                    :data="data2" :props="defaultProps"
                    :default-expanded-keys="defaultExpansion"
                    show-checkbox node-key="id"
                    :filter-node-method="filterNode">
                  </el-tree>
                </div>
              </el-col>
            </el-row>

            <div slot="footer" class="dialog-footer">
              <el-button size="mini" @click="closeDialog">取 消</el-button>
              <el-button type="primary" size="mini" @click="submit" :loading="btnLoading" v-if="dialogText != '查看'">提 交</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content">
      <el-table :data="tableData" border style="width: 100%;" height="100%" v-loading="tableLoading">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="englishName" label="英文名称"></el-table-column>
        <el-table-column prop="dataRange" label="数据范围">
          <template slot-scope="scope">
            {{scope.row.dataRange | dictionariesFilter("dataRangeList", scope.row.dataRange)}}
          </template>
        </el-table-column>
        <el-table-column prop="roleDescribe" label="角色描述"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="switchStatu(scope.row.status, 'enable','prohibit')">{{scope.row.status == 0 ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-search" size="mini" @click="showDialog(scope.row,'查看')">查看</el-button>
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog(scope.row,'编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.status, 'el-icon-close', 'el-icon-check')"
              :class="switchStatu(scope.row.status, 'prohibit','enable')"
              @click="enableDisabled(scope.$index, scope.row)"
            >{{switchStatu(scope.row.status, '禁用', '启用') }}</el-button>
            <el-button type="text" class="danger" icon="el-icon-delete" size="mini" @click="deletItem(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
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
export default {
  name: "role",
  data() {
    return {
      dialogStatus:false, //对话框
      dialogText:'', //对话框 title
      isSee:false, //是否查看

      // tree
      treeStatus:false,
      filterText: '', //过滤
      filterTempDefExp:[], //过滤恢复初始展开项
      defaultExpansion:[], //tree 默认展开项
      data2: [{
        id: 1,
        label: '功能菜单',
        children: [{
          id: 11,
          label: '系统管理',
          children: [{
            id: 111,
            label: '机构管理',
            children: [{
              id: 1111,
              label: '查看',
            },{
              id: 1112,
              label: '修改'
            }]
          }]
        },{
          id: 22,
          label: '系统管理2',
          children: [{
            id: 222,
            label: '机构管理',
            children: [{
              id: 2221,
              label: '查看',
            },{
              id: 2222,
              label: '修改'
            }]
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label',
        disabled: () => this.isSee ? true : false
      },

      // 表单
      ruleForm:{
        roleName:"", //角色名称
        englishName:"", //英文名称
        roleDescribe:"", //角色描述
        dataRange:"", //数据范围
        roleType:"", //角色类型
        rolePermissions: [] //角色权限
      },
      // 验证
      rules:{
        roleName:[{required: true, message: '请输入角色名称', trigger: 'blur'}],
        englishName:[{required: true, message: '请输入英文名称', trigger: 'blur'}],
        roleDescribe:[{required: true, message: '请输入角色描述', trigger: 'blur'}],
        dataRange:[{required: true, message: '请输入数据范围', trigger: 'change'}],
        roleType:[{required: true, message: '请输入角色类型', trigger: 'change'}]
      },

      // 表格
      tableData: [
        {
          roleName: "业务总监",
          englishName: "prodManager",
          dataRange: "6",
          roleDescribe: "公证",
          roleType: "1",
          rolePermissions: [1111,1112],
          status: 1,
          id:11
        },
        {
          roleName: "产品经理",
          englishName: "ChargeLeader",
          dataRange: "5",
          roleDescribe: "内勤主管",
          roleType: "2",
          rolePermissions: [1112,2221],
          status: 0,
          id:12
        }
      ]
    };
  },
  created() { },

  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  methods: {
    // 禁用 / 启用
    enableDisabled(index, scope) {
      scope.status = scope.status == 1 ? 0 : 1;
    },

    // 显示对话框
    showDialog(scope, title){
      this.dialogStatus = true;
      this.dialogText = title;
      this.treeStatus = true;
      this.defaultExpansion = [1] //默认只展示第一级

      this.$nextTick(()=>{
        if(title == '新增'){
          this.$nextTick(()=>{

          })
          this.isSee = false;
        }else if(title == '查看'){
          this.ruleForm = {...scope};
          this.$nextTick(()=>{
            this.defaultExpansion = scope.rolePermissions;
            this.$refs.tree.setCheckedKeys(scope.rolePermissions);
          })
          this.isSee = true;

        }else if(title == '编辑'){
          this.ruleForm = {...scope};
          this.$nextTick(()=>{
            this.defaultExpansion = scope.rolePermissions;
            this.$refs.tree.setCheckedKeys(scope.rolePermissions);
            this.filterTempDefExp = scope.rolePermissions;
          })
          console.log(this.ruleForm)
          this.isSee = false;
        }
      });
    },

    // tree
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },

    //提交
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          this.ruleForm.rolePermissions = this.$refs.tree.getCheckedKeys();

          if(this.ruleForm.rolePermissions.length <= 0){
            this.$message.error('请选择权限');
          }else{
            if(this.dialogText == '新增'){
              console.log('新增')
            }else if(this.dialogText == '编辑'){
              console.log('编辑')
            }
              // this.btnLoading = true;
              // setTimeout(()=>{
              //   this.btnLoading = false;
              //   this.resetFn();
              // },1000)
            }

      //   } else {
      //     return false;
        }
      });
    },

    //删除
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
    },

    // 当清除 filterText时，恢复初始展开状态
    filterClear(){
      this.treeStatus = false;
      setTimeout(() => {
        this.treeStatus = true;
        this.$nextTick(()=>{
          if(this.dialogText == '编辑'){
            this.defaultExpansion = this.filterTempDefExp;
            this.$refs.tree.setCheckedKeys(this.filterTempDefExp);
          }else if(this.dialogText == '新增'){
            this.defaultExpansion = [1];
            this.$refs.tree.setCheckedKeys([]);
          }
        })
      });
    }
  }
};
</script>
<style lang="scss">
.role {
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
    .el-input, .el-select{
      width: 100%;
    }
    .addBtn{
      position: absolute;
      right: 10px;
    }
    .el-input{
      width: 100%;
    }
    .filter{
      padding-left: 28px;
      display: flex;
      align-items: center;
      .el-input{
        width: 54%;
      }
    }
    .tree{
      display: flex;
      align-items: baseline;
      padding-left: 28px;
      box-sizing: border-box;
      >p{
        span{
          color: #f56c6c;
          margin-right: 4px;
        }
      }
      .el-tree__empty-block{
        width: 200px;
      }
    }
  }

  .content{
    overflow-y: none;
    height: calc(100vh - 164px);
    background-color: #fff;
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
    }
    .el-pagination__jump{
      margin-left: 0px;
    }
  }

  .el-form-item__content::after,
  .el-form-item__content::before {
    content: none;
  }
  .el-table__expanded-cell[class*="cell"] {
    padding: 4px 98px 4px 70px;
  }
  .el-dialog{
    width: 36%;
  }
  .el-tree{
    margin-top: 8px;
  }
}
</style>