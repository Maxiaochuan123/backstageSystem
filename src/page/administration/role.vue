<template>
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
                      <el-option :label="item.label" :value="item.value" v-for="(item,index) in dataRangeList" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="角色类型:" prop="roleType">
                    <el-select v-model="ruleForm.roleType" placeholder="请选择角色类型"  clearable :disabled="isSee">
                      <el-option :label="item.label" :value="item.value" v-for="(item,index) in roleTypeList" :key="index"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              
            </el-form>

            <div slot="footer" class="dialog-footer">
              <el-button size="mini" @click="closeDialog">取 消</el-button>
              <el-button type="primary" size="mini" @click="addFnc" :loading="btnLoading" v-if="dialogText != '查看'">确 定</el-button>
            </div>
          </el-dialog>
        </el-col>
      </el-row>
    </div>
    <!-- 表格 -->
    <div class="content">
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="roleName" label="角色名称"></el-table-column>
        <el-table-column prop="englishName" label="英文名称"></el-table-column>
        <el-table-column prop="dataRange" label="数据范围"></el-table-column>
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
            <el-button type="text" class="danger" icon="el-icon-delete" size="mini" @click="showDialog(scope.row,'删除')">删除</el-button>
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
      dialogStatus:false, //新增 or 编辑 对话框
      dialogText:'', //对话框 title
      isSee:false, //是否查看

      // 数据范围 ArrList
      dataRangeList:[{
        label:"所有数据",
        value:"1"
      },{
        label:"所在公司数据",
        value:"2"
      },{
        label:"所在公司及以下数据",
        value:"3"
      },{
        label:"所在部门数据",
        value:"4"
      },{
        label:"所在部门及以下数据",
        value:"5"
      },{
        label:"仅本人数据",
        value:"6"
      }],

      // 角色类型 ArrList
      roleTypeList:[{
        label:"任务分配",
        value:"1"
      },{
        label:"管理角色",
        value:"2"
      },{
        label:"普通角色",
        value:"3"
      }],

      // 表单
      ruleForm:{
        roleName:"", //角色名称
        englishName:"", //英文名称
        roleDescribe:"", //角色描述
        dataRange:"", //数据范围
        roleType:"", //角色类型
      },
      // 验证
      rules:{
        roleName:[{required: true, message: '请输入角色名称', trigger: 'blur'}],
        englishName:[{required: true, message: '请输入英文名称', trigger: 'blur'}],
        roleDescribe:[{required: true, message: '请输入角色描述', trigger: 'blur'}],
        dataRange:[{required: true, message: '请输入数据范围', trigger: 'change'}],
        roleType:[{required: true, message: '请输入角色类型', trigger: 'change'}],
      },

      // 表格
      tableData: [
        {
          roleName: "业务总监",
          englishName: "prodManager",
          dataRange: "仅本人数据",
          roleDescribe: "公证",
          roleType: "任务分配", //角色类型
          status: 1
        },
        {
          roleName: "产品经理",
          englishName: "ChargeLeader",
          dataRange: "所在部门及以下数据",
          roleDescribe: "内勤主管",
          roleType: "管理角色", //角色类型
          status: 0
        }
      ]
    };
  },
  created() {},

  methods: {
    // 禁用 / 启用
    enableDisabled(index, scope) {
      scope.status = scope.status == 1 ? 0 : 1;
    },
    // 显示对话框
    showDialog(scope, title){
      this.dialogStatus = true;
      this.dialogText = title;
      
      this.$nextTick(()=>{
        if(title == '新增'){
          this.isSee = false;
        }else if(title == '查看'){
          this.ruleForm = {...scope};
          this.isSee = true;
        }else if(title == '编辑'){
          this.ruleForm = {...scope};
          this.isSee = false;
        }
      });

    },
    
    // 新增 or 编辑
    addFnc(){
      this.$refs['ruleForm'].validate((valid) => {
        
        if (valid) {
          if(this.dialogText == '新增'){
            console.log('新增')
          }else if(this.dialogText == '编辑'){
            console.log('编辑')
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
  }

  .content{
    height: calc(100% - 90px);
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
  .content::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 4px;
  }

  .content::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 4px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.1);
    background: #c0c0c0;
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
  

  // .el-form-item__content {
  //   display: flex;
  //   justify-content: space-between;
  // }
  .el-form-item__content::after,
  .el-form-item__content::before {
    content: none;
  }
  .el-table__expanded-cell[class*="cell"] {
    padding: 4px 98px 4px 70px;
  }
  // .el-form-item {
  //   margin-bottom: 0px;
  // }
  .el-dialog{
    width: 40%;
  }
}
</style>