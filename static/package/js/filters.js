export default{
  // 所属机构 mechanismList 接口获取
  // 所属大区 largeAreaList 接口获取
  // 所属部门 departmentList 接口获取
  // 用户角色 userRoleList 接口获取

  dictionariesFilter(text, name){
    if(name == "belongsSystemList"){ //数据范围
      switch (text) {
        case 0:
            return '车贷';
          break;
        case 1:
            return 'crm';
          break;
        case 2:
            return '融租';
          break;
      }
    }else if(name == "roleTypeList"){ //角色类型
      switch (text) {
        case 'assignment':
            return '任务分配';
          break;
        case 'security-role':
            return '管理角色';
          break;
        case 'user':
            return '普通角色';
          break;
      }
    }else if(name == "userLevelList"){ //职位等级
      switch (text) {
        case 1:
            return 'A';
          break;
        case 2:
            return 'B';
          break;
        case 3:
            return 'C';
          break;
        case 4:
            return 'D';
          break;
        case 5:
            return 'E';
          break;
        case 6:
            return 'A+';
          break;
      }
    }
  }
}