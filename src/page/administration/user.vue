<template>
<!-- 用户管理 -->
  <div class="user mainBox">
    <!-- 操作栏 -->
    <div class="actionBar">
      <el-row class="sherchBar">
        <div>
          <span>搜索：</span>
          <el-input v-model.trim="sherchForm.name" placeholder="请输入用户名 / 姓名 / 手机号" size="medium" clearable @clear="searchClear"></el-input>
        </div>
        <div>
          <span>所属机构：</span>
          <el-select v-model="sherchForm.companyId" placeholder="请选择所属机构" size="medium" @change="mechanismChange" clearable  @clear="searchClear">
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in getMechanismList" :key="index" :disabled="item.isEnable == 1"></el-option>
          </el-select>
        </div>
        <div>
          <span>所属部门：</span>
          <el-select v-model="sherchForm.officeId" placeholder="请选择所属部门" size="medium" @change="departmentChange" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in getDepartmentList" :key="index" :disabled="item.isEnable == 1"></el-option>
          </el-select>
        </div>
        <div>
          <span>大区：</span>
          <el-select v-model="sherchForm.geoId" placeholder="请选择大区" size="medium" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in getLargeAreaList" :key="index" :disabled="item.isEnable == 1"></el-option>
          </el-select>
        </div>
        <div>
          <span>用户角色：</span>
          <el-select v-model="sherchForm.roleId" placeholder="请选择用户角色" size="medium" clearable>
            <el-option :label="item.label" :value="item.value" v-for="(item,index) in userRoleList" :key="index"></el-option>
          </el-select>
        </div>
        <div class="serchBtn">
          <el-button type="primary" plain icon="el-icon-search" size="small" :loading="btnLoading" @click="sherch">查询</el-button>
          <el-button plain size="small" @click="clearSerch">重置</el-button>
        </div>
        <el-button type="primary" icon="el-icon-plus" class="addBtn2" size="small" @click="showDialog('','新增')">新增用户</el-button>
      </el-row>
      <!-- 对话框 -->
      <el-dialog :title="`${dialogText}用户`" :visible.sync="dialogStatus" @close="closeDialog">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">

          <el-row>
            <el-col :span="12">
              <el-form-item label="用户登录名:" prop="loginName">
                <el-input v-model.trim="ruleForm.loginName" placeholder="请输入登录名" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="用户姓名:" prop="name">
                <el-input v-model.trim="ruleForm.name" placeholder="请输入姓名" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="所属机构:" prop="companyId">
                <el-select v-model="ruleForm.companyId" placeholder="请选择所属机构" clearable @change="mechanismChange" :disabled="isSee">
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in getMechanismList" :key="index" :disabled="item.isEnable == 1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="手机号码:" prop="mobile">
                <el-input v-model.trim="ruleForm.mobile" placeholder="请输入手机号码" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="所属部门:" prop="officeId">
                <el-select v-model="ruleForm.officeId" placeholder="请选择所属部门"  clearable :disabled="isSee">
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in getDepartmentList" :key="index" :disabled="item.isEnable == 1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="身份证号:" prop="idcard">
                <el-input v-model.trim="ruleForm.idcard" placeholder="请输入身份证号" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="大区:" prop="geoId">
                <el-select v-model="ruleForm.geoId" placeholder="请选择大区"  clearable :disabled="isSee">
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in getLargeAreaList" :key="index" :disabled="item.isEnable == 1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="工作电话:" prop="phone">
                <el-input v-model.trim="ruleForm.phone" placeholder="请输入工作电话" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="用户角色:" prop="roleId">
                <el-select v-model="ruleForm.roleId" placeholder="请选择用户角色"  clearable :disabled="isSee">
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in userRoleList" :key="index" :disabled="item.isEnable == 1"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="职位等级:" prop="userLevel">
                <el-select v-model="ruleForm.userLevel" placeholder="请选择职位等级"  clearable :disabled="isSee">
                  <el-option :label="item.label" :value="item.value" v-for="(item,index) in dictionaries.userLevelList" :key="index"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row>
            <el-col :span="12">
              <el-form-item label="工作职位:" prop="userJobposition">
                <el-input v-model.trim="ruleForm.userJobposition" placeholder="请输入工作职位" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电子邮箱:" prop="email">
                <el-input v-model.trim="ruleForm.email" placeholder="请输入电子邮箱" clearable :disabled="isSee"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row class="quklftivoInd">
            <el-col :span="8">
              <el-form-item label="快提快调" prop="quklftivoInd">
                <el-radio-group v-model="ruleForm.quklftivoInd" :disabled="isSee">
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
        <el-table-column prop="loginName" label="用户登录名"></el-table-column>
        <el-table-column prop="name" label="用户姓名"></el-table-column>
        <el-table-column prop="mobile" label="手机号码"></el-table-column>
        <el-table-column prop="companyName" label="所属机构"></el-table-column>
        <el-table-column prop="roleName" label="用户角色"></el-table-column>
        <el-table-column prop="userLevel" label="职位等级">
          <template slot-scope="scope">
            {{scope.row.userLevel | dictionariesFilter("userLevelList", scope.row.userLevel)}}
          </template>
        </el-table-column>
        <el-table-column prop="createdStamp" label="创建时间" :formatter="formatDate"></el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <span :class="switchStatu(scope.row.isEnable, 'prohibit','enable')">{{scope.row.isEnable == 0 ? '启用' : '禁用'}}</span>
          </template>
        </el-table-column>

        <!-- 操作 -->
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button type="text" icon="el-icon-search" size="mini" @click="showDialog(scope.row,'查看')">查看</el-button>
            <el-button type="text" icon="el-icon-edit" size="mini" @click="showDialog(scope.row,'编辑')">编辑</el-button>
            <el-button
              type="text" size="mini"
              :icon="switchStatu(scope.row.isEnable, 'el-icon-check', 'el-icon-close')"
              :class="switchStatu(scope.row.isEnable, 'enable','prohibit')"
              @click="enableDisabled(scope.row)"
            >{{switchStatu(scope.row.isEnable, '启用', '禁用') }}</el-button>
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
        :total="paging.totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
export default {
  name: "user",
  data() {
    return {
      dialogStatus:false, //对话框
      dialogText:'', //对话框 title
      isSee:false, //是否查看
      itemMechanism:0,
      itemDepartment:0,

      sherchForm:{
        name:'', //用户名 / 姓名 / 手机号
        companyId:'', //所属机构
        officeId:'', //所属部门
        geoId:'', //大区
        roleId:'' //用户角色
      },

      // 表单
      ruleForm:{
        loginName:'', //用户登录名
        name:'', //用户姓名
        companyId:'', //所属机构
        mobile:'', //手机号码
        officeId:'', //所属部门
        idcard:'', //身份证号
        geoId:'', //大区
        phone:'', //工作电话
        roleId:'', //用户角色
        userLevel:'', //职位等级
        userJobposition:'', //工作职位
        email:'', //电子邮箱
        quklftivoInd:'', //快提快调
      },
      // 验证
      rules:{
        loginName:[
          {required: true, message: '请输入用户登陆名', trigger: 'blur'},
          {pattern: /^[0-9a-zA-Z]+$/, message: '只能是 数字，字母', trigger: ['blur']}
        ],
        name:[{required: true, message: '请输入用户姓名', trigger: 'blur'}],
        companyId:[{required: true, message: '请选择所属机构', trigger: 'change'}],
        mobile:[{required: true, pattern: /^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\d{8}$/, message: '请输入正确的手机号', trigger: ['blur']}],
        officeId:[{required: true, message: '请选择所属部门', trigger: 'change'}],
        idcard:[{pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: '请输入正确的身份证号', trigger: ['blur']}],
        geoId:[{required: true, message: '请选择大区', trigger: 'change'}],
        roleId:[{required: true, message: '请选择用户角色', trigger: 'change'}],
        userLevel:[{required: true, message: '请选择职位等级', trigger: 'change'}]
      },

      // 表格
      tableData: []
    };
  },
  created() {
    this.apiMethod.getUser(this);
  },

  computed:{
    ...mapState(['mechanismList','userRoleList']),
    
    // 机构
    getMechanismList(){
      let itemList = [];
      this.mechanismList.forEach(item => {
        itemList.push({label:item.groupName,value:item.id,isEnable:item.isEnable});
      })
      return itemList
    },
    // 部门
    getDepartmentList(){
      let itemList = [];
      this.mechanismList.forEach(item => {
        if(item.id == this.ruleForm.companyId || item.id == this.itemMechanism){
          item.children.forEach(item2 => {
            itemList.push({label:item2.groupName,value:item2.id,isEnable:item2.isEnable})
          })
        }
      })
      console.log(itemList)
      return itemList
    },
    // 大区
    getLargeAreaList(){
      let itemList = [];
      this.mechanismList.forEach(item => {
        item.children.forEach(item2 => {
          if(item2.id == this.ruleForm.officeId || item2.id == this.itemDepartment){
            item2.children.forEach(item3 => {
              itemList.push({label:item3.groupName,value:item3.id,isEnable:item3.isEnable})
            })
          }
        })
      })
      return itemList
    }
  },

  methods: {
    mechanismChange(val){
      this.itemMechanism = val;
      this.ruleForm.officeId = '';
      this.ruleForm.geoId = '';
      this.sherchForm.officeId = '';
      this.sherchForm.geoId = '';
    },
    departmentChange(val){
      this.itemDepartment = val;
    },

    // 禁用 / 启用
    enableDisabled(scope) {
      this.apiMethod.disabledUser(this, scope);
    },
    // 显示对话框
    showDialog(scope, title){
      this.dialogStatus = true;
      this.dialogText = title;

      this.$nextTick(()=>{
        if(title == '新增'){
          this.isSee = false;
        }else if(title == '查看'){
          this.isSee = true;
          this.apiMethod.getUserInfo(this, {userId:scope.id});
        }else if(title == '编辑'){
          this.isSee = false;
          this.apiMethod.getUserInfo(this, {userId:scope.id});
        }
      });
    },

    //提交
    submit(){
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {
          if(this.dialogText == '新增'){
            this.apiMethod.addUser(this);
          }else if(this.dialogText == '编辑'){
            this.apiMethod.editUser(this);
          }
        } else {
          return false;
        }
      });
    },

    // 查询
    sherch(){
      this.apiMethod.serchUserList(this);
    },
    // 清空筛选条件
    clearSerch(){
      let sherchForm = this.sherchForm;
      for(let item in sherchForm){
        sherchForm[item] = '';
      }
      this.sherchForm = sherchForm;
      this.apiMethod.getUser(this);
    },

    // 清空
    searchClear(){
      this.apiMethod.serchUserList(this);
    },
    
    // 触发分页
    changePaging(){
      this.apiMethod.getUser(this);
    },
  }
};
</script>
<style lang="scss">
.user {
  .actionBar {
    .el-input{
      width: 100%;
    }

    .sherchBar{
      display: flex;
      align-items: center;
      >div{
        display: flex;
        align-items: center;
        padding-left:20px;
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
        width: 202px;
        >span{
          width: 64px;
        }
      }
    }
    .quklftivoInd{
      margin-left: -2px;
      .el-form-item__content{
        // width: 100px;
        .el-radio-group{
          .el-radio{
            margin-right:0;
          }
          label:last-child{
            margin-top: 12px;
            margin-left: 20px;
          }
        }
      }
    }
  }

  .content{
    height: calc(100% - 70px - 40px)!important;
  }

  .el-dialog{
    width: 36%!important;
  }
}
</style>