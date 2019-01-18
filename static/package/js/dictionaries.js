export default {
  // ******** 角色管理 ******** //
  // 数据范围
  belongsSystemList: [{
    label: "车贷",
    value: 0
  }, {
    label: "crm",
    value: 1
  }, {
    label: "融租",
    value: 2
  }],

  // 角色类型
  roleTypeList: [{
    label: "任务分配",
    value: "assignment"
  }, {
    label: "管理角色",
    value: "security-role"
  }, {
    label: "普通角色",
    value: "user"
  }],

  // 机构类型
  mechanismTypeList: [{
    label: "集团",
    value: 0
  }, {
    label: "机构",
    value: 1
  }, {
    label: "部门",
    value: 2
  }, {
    label: "大区",
    value: 3
  }],

  // ******** 用户管理 ******** //
  // 所属机构 mechanismList 接口获取
  // 所属大区 largeAreaList 接口获取
  // 所属部门 departmentList 接口获取
  // 用户角色 userRoleList 接口获取

  // 职位等级
  userLevelList: [{
    label: "A",
    value: 1
  }, {
    label: "B",
    value: 2
  }, {
    label: "C",
    value: 3
  }, {
    label: "D",
    value: 4
  }, {
    label: "E",
    value: 5
  }, {
    label: "A+",
    value: 6
  }],

  // 快提快调
  fastCarryTransferList: [{
    label: "是",
    value: 1
  }, {
    label: "否",
    value: 0
  }],
}
