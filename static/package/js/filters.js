export default{
  dictionariesFilter(text, name){
    if(name == "dataRangeList"){ //数据范围
      switch (text) {
        case '1':
            return '所有数据';
          break;
        case '2':
            return '所在公司数据';
          break;
        case '3':
            return '所在公司及以下数据';
          break;
        case '4':
            return '所在部门数据';
          break;
        case '5':
            return '所在部门及以下数据';
          break;
        case '6':
            return '仅本人数据';
          break;
      }
    }else if(name == "roleTypeList"){ //角色类型
      switch (text) {
        case '1':
            return '任务分配';
          break;
        case '2':
            return '管理角色';
          break;
        case '3':
            return '普通角色';
          break;
      }
    }else if(name == "mechanismList"){ //所属机构
      switch (text) {
        case '1':
            return '四川公司';
          break;
        case '2':
            return '贵州公司';
          break;
        case '3':
            return '湖南公司';
          break;
        case '4':
            return '山西公司';
          break;
      }
    }else if(name == "departmentList"){ //所属部门
      switch (text) {
        case '1':
            return '总经办';
          break;
        case '2':
            return '财务部';
          break;
        case '3':
            return '人力行政部';
          break;
      }
    }else if(name == "largeAreaList"){ //大区
      switch (text) {
        case '1':
            return '成都一区';
          break;
        case '2':
            return '成都二区';
          break;
        case '3':
            return '成都三区';
          break;
      }
    }else if(name == "userRoleList"){ //用户角色
      switch (text) {
        case '1':
            return '产品经理';
          break;
        case '2':
            return '公证岗';
          break;
      }
    }else if(name == "jobRankList"){ //等级类型
      switch (text) {
        case '1':
            return 'A';
          break;
        case '2':
            return 'B';
          break;
        case '3':
            return 'C';
          break;
        case '4':
            return 'D';
          break;
        case '5':
            return 'E';
          break;
      }
    }
  }
}