<template>
<!-- 用户管理 -->
  <div class="user">
    <!-- 操作栏 -->
    <div class="actionBar">
      <el-row class="sherchBar">
        <div>
          <span>搜索：</span>
          <el-input v-model.trim="sherchForm.sherchInpt" placeholder="请输入用户名 / 姓名 / 手机号" size="medium" clearable></el-input>
        </div>
        <div>
          <span>所属机构：</span>
          <el-select v-model="sherchForm.mechanism" placeholder="请选择所属机构" size="medium" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.mechanismList" :key="index"></el-option>
          </el-select>
        </div>
        <div>
          <span>所属部门：</span>
          <el-select v-model="sherchForm.department" placeholder="请选择所属部门" size="medium" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.departmentList" :key="index"></el-option>
          </el-select>
        </div>
        <div>
          <span>大区：</span>
          <el-select v-model="sherchForm.largeArea" placeholder="请选择大区" size="medium" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.largeAreaList" :key="index"></el-option>
          </el-select>
        </div>
        <div>
          <span>用户角色：</span>
          <el-select v-model="sherchForm.role" placeholder="请选择用户角色" size="medium" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.userRoleList" :key="index"></el-option>
          </el-select>
        </div>
        <div class="serchBtn">
          <el-button type="primary" plain icon="el-icon-search" size="small" :loading="btnLoading" @click="sherch">查询</el-button>
        </div>
        <div class="addBtn">
          <el-button type="primary" icon="el-icon-plus" class="addBtn" size="small" @click="showDialog('','新增')">新增用户</el-button>
        </div>
      </el-row>
      <!-- 对话框 -->
      <el-dialog :title="`${dialogText}用户`" :visible.sync="dialogStatus" @close="closeDialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

          <el-row>
            <el-col :span="12">
              <el-form-item label="用户登录名:" prop="accountNumber">
                <el-input v-model.trim="ruleForm.accountNumber" placeholder="请输入登录名" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户姓名:" prop="userName">
                <el-input v-model.trim="ruleForm.userName" placeholder="请输入姓名" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="所属机构:" prop="mechanism">
                <el-select v-model="ruleForm.mechanism" placeholder="请选择所属机构"  clearable :disabled="isSee">
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.mechanismList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码:" prop="phoneNumber">
                <el-input v-model.trim="ruleForm.phoneNumber" placeholder="请输入手机号码" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="所属部门:" prop="department">
                <el-select v-model="ruleForm.department" placeholder="请选择所属部门"  clearable :disabled="isSee">
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.departmentList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号:" prop="idNumber">
                <el-input v-model.trim="ruleForm.idNumber" placeholder="请输入身份证号" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="大区:" prop="largeArea">
                <el-select v-model="ruleForm.largeArea" placeholder="请选择大区"  clearable :disabled="isSee">
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.largeAreaList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作电话:" prop="workPhone">
                <el-input v-model.trim="ruleForm.workPhone" placeholder="请输入工作电话" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="用户角色:" prop="role">
                <el-select v-model="ruleForm.role" placeholder="请选择用户角色"  clearable :disabled="isSee">
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.userRoleList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职位等级:" prop="jobRank">
                <el-select v-model="ruleForm.jobRank" placeholder="请选择职位等级"  clearable :disabled="isSee">
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.jobRankList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="工作职位:" prop="jobPosition">
                <el-input v-model.trim="ruleForm.jobPosition" placeholder="请输入工作职位" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电子邮箱:" prop="email">
                <el-input v-model.trim="ruleForm.email" placeholder="请输入电子邮箱" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="fastCarryTransfer">
            <el-col :span="8">
              <el-form-item label="快提快调" prop="fastCarryTransfer">
                <el-radio-group v-model="ruleForm.fastCarryTransfer">
                  <el-radio :label="item.value" v-for="(item,index) in dictionaries.fastCarryTransferList" :key="index">{{item.label}}</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div slot="footer" class="dialog-footer">
          <el-button size="mini" @click="closeDialog">取 消</el-button>
          <el-button type="primary" size="mini" @click="submit" :loading="btnLoading" v-if="dialogText != '查看'">提 交</el-button>
        </div>
      </el-dialog>
    </div>
    <!-- 表格 -->
    <div class="content">
      <el-table :data="tableData" border style="width: 100%;" height="100%" v-loading="tableLoading">
        <el-table-column type="index" width="50"></el-table-column>
        <el-table-column prop="accountNumber" label="用户登录名"></el-table-column>
        <el-table-column prop="userName" label="用户姓名"></el-table-column>
        <el-table-column prop="phoneNumber" label="手机号码"></el-table-column>
        <el-table-column prop="mechanism" label="所属机构">
          <template slot-scope="scope">
            {{scope.row.mechanism | dictionariesFilter("mechanismList", scope.row.mechanism)}}
          </template>
        </el-table-column>
        <el-table-column prop="role" label="用户角色">
          <template slot-scope="scope">
            {{scope.row.role | dictionariesFilter("userRoleList", scope.row.role)}}
          </template>
        </el-table-column>
        <el-table-column prop="jobRank" label="职位等级">
          <template slot-scope="scope">
            {{scope.row.jobRank | dictionariesFilter("jobRankList", scope.row.jobRank)}}
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" :formatter="formatDate"></el-table-column>
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
  name: "user",
  data() {
    return {
      dialogStatus:false, //对话框
      dialogText:'', //对话框 title
      isSee:false, //是否查看

      sherchForm:{
        sherchInpt:'', //用户名 / 姓名 / 手机号
        mechanism:'', //所属机构
        department:'', //所属部门
        largeArea:'', //大区
        role:'', //用户角色
      },

      // 表单
      ruleForm:{
        accountNumber:'', //用户登录名
        userName:'', //用户姓名
        mechanism:'', //所属机构
        phoneNumber:'', //手机号码
        department:'', //所属部门
        idNumber:'', //身份证号
        largeArea:'', //大区
        workPhone:'', //工作电话
        role:'', //用户角色
        jobRank:'', //职位等级
        jobPosition:'', //工作职位
        email:'', //电子邮箱
        fastCarryTransfer:'', //快提快调
      },
      // 验证
      rules:{
        accountNumber:[
          {required: true, message: '请输入用户登陆名', trigger: 'blur'},
          {pattern: /^[0-9a-zA-Z]+$/, message: '只能是 数字，字母', trigger: ['blur']}
        ],
        userName:[{required: true, message: '请输入用户姓名', trigger: 'blur'}],
        mechanism:[{required: true, message: '请输入所属机构', trigger: 'change'}],
        phoneNumber:[{pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号', trigger: ['blur']}],
        department:[{required: true, message: '请输入所属部门', trigger: 'change'}],
        idNumber:[{pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: '请输入正确的身份证号', trigger: ['blur']}],
        largeArea:[{required: true, message: '请输入大区', trigger: 'change'}],
        role:[{required: true, message: '请输入用户角色', trigger: 'change'}],
        jobRank:[{required: true, message: '请输入职位等级', trigger: 'change'}]
      },

      // 表格
      tableData: [
        {
          accountNumber:'mxc', //用户登录名
          userName:'马晓川', //用户姓名
          mechanism:'2', //所属机构
          phoneNumber:'13111866951', //手机号码
          department:'2', //所属部门
          idNumber:'511325199506070053 ', //身份证号
          largeArea:'2', //大区
          workPhone:'13111866951', //工作电话
          role:'1', //用户角色
          jobRank:'3', //职位等级
          jobPosition:'3', //工作职位
          email:'724503670@qq.com', //电子邮箱
          fastCarryTransfer:'1', //快提快调
          createTime: Date.now(), //创建时间
          status: 1,
          id:11
        },
        {
          accountNumber:'mxc', //用户登录名
          userName:'马大川', //用户姓名
          mechanism:'1', //所属机构
          phoneNumber:'13111866951', //手机号码
          department:'1', //所属部门
          idNumber:'511325199506070053 ', //身份证号
          largeArea:'3', //大区
          workPhone:'13111866951', //工作电话
          role:'2', //用户角色
          jobRank:'1', //职位等级
          jobPosition:'2', //工作职位
          email:'724503670@qq.com', //电子邮箱
          fastCarryTransfer:'0', //快提快调
          createTime: Date.now(), //创建时间
          status: 0,
          id:12
        }
      ]
    };
  },
  created() { },

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
          let list = this.ruleForm;
          for(let item in list){
            item = ''
          }
          console.log('list：',list)

          this.isSee = false;
        }else if(title == '查看'){
          this.ruleForm = {...scope};
          this.isSee = true;
        }else if(title == '编辑'){
          this.ruleForm = {...scope};
          console.log(this.ruleForm)
          this.isSee = false;
        }
      });
    },

    //提交
    submit(){
      this.$refs['ruleForm'].validate((valid) => {

        if (valid) {
          if(this.dialogText == '新增'){
            console.log(this.ruleForm)
          }else if(this.dialogText == '编辑'){
            console.log(this.ruleForm)
          }
          // this.btnLoading = true;
          // setTimeout(()=>{
          //   this.btnLoading = false;
          //   this.resetFn();
          // },1000)
        } else {
          return false;
        }
      });
    },

    // 查询
    sherch(){
      this.btnLoading = true;
      setTimeout(()=>{
        this.btnLoading = false;
      },1000)
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
    }

  }
};
</script>
<style lang="scss">
.user {
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
      right: 5px;
    }
    .el-input{
      width: 100%;
    }

    .sherchBar{
      display: flex;
      align-items: center;
      >div{
        display: flex;
        align-items: center;
        padding-left: 10px;
        >span{
          color: #606266;
          font-size: 14px;
        }
      }
      >div:nth-child(1){
        width: 268px;
        >span{
          width: 50px;
        }
      }
      >div:not(:first-child){
        width: 224px;
        >span{
          width: 102px;
        }
      }
      >div:nth-child(4){
        width: 174px;
        >span{
          width: 64px;
        }
      }
    }
    .fastCarryTransfer{
      margin-left: -2px;
      .el-form-item__content{
        width: 100px;
        .el-radio-group{
          label:last-child{
            margin-left: 20px;
          }
        }
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
}
</style>