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
                  <el-form-item label="英文名称:" prop="enname">
                    <el-input v-model.trim="ruleForm.enname" placeholder="请输入英文名称" clearable :disabled="isSee || isEdit"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="24">
                  <el-form-item label="角色描述:" prop="description">
                    <el-input v-model.trim="ruleForm.description" placeholder="请输入角色描述" clearable :disabled="isSee"></el-input>
                  </el-form-item>
                </el-col>
              </el-row>

              <el-row>
                <el-col :span="12">
                  <el-form-item label="角色类型:" prop="roleType">
                    <el-select v-model="ruleForm.roleType" placeholder="请选择角色类型"  clearable :disabled="isSee || isEdit">
                      <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.roleTypeList" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                
              </el-row>
            </el-form>
            <el-row>
              <el-col :span="12">
                <div class="tree">
                  <p><span>*</span>权限:</p>
                  <!-- v-if="treeStatus" 手动销毁组件 防止数据不同步 -->
                  <el-tree ref="tree" class="filter-tree" accordion v-if="treeStatus"
                    :data="relationResList" :props="defaultProps"
                    :default-expanded-keys="defaultExpansion"
                    show-checkbox node-key="id">
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
        <el-table-column prop="enname" label="英文名称"></el-table-column>
        <el-table-column prop="belongsSystem" label="所属系统">
          <template slot-scope="scope">
            {{scope.row.belongsSystem | dictionariesFilter("belongsSystemList", scope.row.belongsSystem)}}
          </template>
        </el-table-column>
        <el-table-column prop="description" label="角色描述"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="switchStatu(scope.row.isEnable, 'enable','prohibit')">{{scope.row.isEnable == 0 ? '禁用' : '启用'}}</span>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="240">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-search" size="mini" @click="showDialog(scope.row,'查看')">查看</el-button>
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog(scope.row,'编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.isEnable, 'el-icon-close', 'el-icon-check')"
              :class="switchStatu(scope.row.isEnable, 'prohibit','enable')"
              @click="enableDisabled(scope.row)"
            >{{switchStatu(scope.row.isEnable, '禁用', '启用') }}</el-button>
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
export default {
  name: "role",
  data() {
    return {
      dialogStatus:false, //对话框
      dialogText:'', //对话框 title
      isSee:false, //是否查看
      isEdit:false, //是否可编辑
      defaultExpansion:[], //tree 默认展开项
      defaultProps: {
        children: 'children',
        label: 'name',
        disabled: () => this.isSee ? true : false
      },
      // relationResList2:[{
      //   id:1,
      //   name:'用户关联',
      //   parentId:0,
      //   children:[{
      //     id:2,
      //     name:'用户列表',
      //     parentId:1,
      //     children:[{
      //       id:4,
      //       name:'查看',
      //       parentId:2,
      //     },{
      //       id:5,
      //       name:'修改',
      //       parentId:2,
      //     }]
      //   },{
      //     id:3,
      //     name:'用户列表2',
      //     parentId:1,
      //     children:[{
      //       id:6,
      //       name:'查看',
      //       parentId:3,
      //     },{
      //       id:7,
      //       name:'修改',
      //       parentId:3,
      //     }]
      //   }]
      // }],

      // 表单
      ruleForm:{
        roleName:"", //角色名称
        enname:"", //英文名称
        description:"", //角色描述
        belongsSystem:"", //所属系统
        roleType:"", //角色类型
        resourcesId: [], //角色权限(前端使用)
        reqResourcesId: [] //角色权限(后端使用)
      },
      // 验证
      rules:{
        roleName:[{required: true, message: '请输入角色名称', trigger: 'blur'}],
        enname:[{required: true, message: '请输入英文名称', trigger: 'blur'}],
        description:[{required: true, message: '请输入角色描述', trigger: 'blur'}],
        belongsSystem:[{required: true, message: '请输入数据范围', trigger: 'change'}],
        roleType:[{required: true, message: '请输入角色类型', trigger: 'change'}]
      },

      // 关联资源列表 relationResList 来自计算属性

      // 表格
      tableData: []
    };
  },
  created() { 
    this.apiMethod.getRole(this);
  },
  computed:{
    ...mapState(['relationResList'])
  },

  methods: {
    // 禁用 / 启用
    enableDisabled(scope) {
      this.apiMethod.disabledRole(this, scope)
    },

    // 显示对话框
    showDialog(scope, title){
      this.dialogStatus = true;
      this.dialogText = title;
      this.treeStatus = true;
      this.defaultExpansion = [1] //默认只展示第一级

      this.$nextTick(()=>{
        this.isEdit = false;
        this.isSee = false;

        if(title == '新增'){
          this.$nextTick(()=>{

          })
        }else if(title == '查看'){
          this.isEdit = true;
          this.isSee = true;

          this.ruleForm = {...scope};
          this.$nextTick(()=>{
            this.defaultExpansion = scope.resourcesId;
            // this.$refs.tree.setCheckedKeys(scope.resourcesId);
          })

        }else if(title == '编辑'){
          this.isEdit = true;
          this.isSee = false;

          this.ruleForm = {...scope};
          this.$nextTick(()=>{
            this.defaultExpansion = scope.resourcesId;
            // this.$refs.tree.setCheckedKeys(scope.resourcesId);
            // this.filterTempDefExp = scope.resourcesId;
          })
        }
      });
    },

    //提交
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          // 设置 tree 选中项 id
          this.ruleForm.resourcesId = this.$refs.tree.getCheckedKeys();
          this.ruleForm.reqResourcesId = [
            ...this.$refs.tree.getHalfCheckedKeys(),
            ...this.$refs.tree.getCheckedKeys()
          ]
          this.ruleForm.resourcesId = JSON.stringify(this.ruleForm.resourcesId);
          this.ruleForm.reqResourcesId = JSON.stringify(this.ruleForm.reqResourcesId);

          delete this.ruleForm.createdStamp;
          
          if(this.ruleForm.resourcesId.length <= 0){
            this.$message.error('请选择权限');
          }else{
            if(this.dialogText == '新增'){
              this.ruleForm.resourcesId = JSON.stringify(this.ruleForm.resourcesId);
              this.apiMethod.addRole(this);
            }else if(this.dialogText == '编辑'){
              delete this.ruleForm.belongsSystem; delete this.ruleForm.enname; delete this.ruleForm.roleType; delete this.ruleForm.description;
              
              console.log(this.ruleForm)
              // this.apiMethod.editRole(this);
            }
          }

        } else {
          return false;
        }
      });
    },

    //删除
    deletItem(scope){
      this.apiMethod.deleteRole(this, scope)
    },

    // 触发分页
    changePaging(){
      this.apiMethod.getRole(this);
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