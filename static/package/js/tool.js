// node 加密模块
var crypto = require('crypto');
export default {
  formatDate(date) {
    var date = new Date(date);
    var y = date.getFullYear();
    var m = date.getMonth() + 1;
    m = m < 10 ? ('0' + m) : m;
    var d = date.getDate();
    d = d < 10 ? ('0' + d) : d;
    var h = date.getHours();
    h = h < 10 ? ('0' + h) : h;
    var minute = date.getMinutes();
    var second = date.getSeconds();
    minute = minute < 10 ? ('0' + minute) : minute;
    second = second < 10 ? ('0' + second) : second;
    // return y + '-' + m + '-' + d + ' ' + h + ':' + minute + ':' + second; 带时分秒
    return y + '-' + m + '-' + d;
  },

  // 防抖
  debounce(fn, t){
    let delay = t || 500;
    let timer;
    return function () {
      let args = arguments;
      if(timer){
          clearTimeout(timer);
      }
      timer = setTimeout(() => {
          timer = null;
          fn.apply(this, args);
      }, delay);
    }
  },
  
  // 换肤添加class函数
  toggleClass(element, className) {
    if (!element || !className) {
      return
    }
    element.className = className
  },

  /**
   * @Excel 导出
   * @param data object 数据
   * @param name string excel表名
   * @param that object 上下文
   * */
  downloadExcel(that, data, name) {
    if (!data) {
      return
    }
    let url = window.URL.createObjectURL(new Blob([data]))
    let link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', name + '.xls')
    document.body.appendChild(link)
    link.click()
    that.$message({
      message: name + '导出成功',
      type: 'success'
    })
  },

  // 添加金额千分号
  semicolon(num) {
    num = num.toString().replace(/\$|\,/g, '');

    if (isNaN(num))
      num = "0";
    let sign = (num == (num = Math.abs(num)));
    num = Math.floor(num * 100 + 0.50000000001);
    let cents = num % 100;
    num = Math.floor(num / 100).toString();
    if (cents < 10)
      cents = "0" + cents;
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
      num = num.substring(0, num.length - (4 * i + 3)) + ',' +
      num.substring(num.length - (4 * i + 3));
    return '￥' + (((sign) ? '' : '-') + num + '.' + cents) + '(元)';
  },

  //url获取页面参数
  getParam(id) {
    var url = window.location.href;
    if (url.lastIndexOf('?') == -1) return "";
    var params = url.split('?')[1];
    if (params.length == 0) return "";
    var p = {};
    var r = params.split('&');
    for (var i = 0; i < r.length; i++) {
      if (r[i].indexOf('=') == -1) continue;
      var a = r[i].split('=');
      p[a[0]] = a[1];
    }
    return typeof p[id] == 'undefined' ? '' : decodeURI(p[id]);
  },

  // 全屏
  fullScreen(that) {
    that.isfullScreen = !that.isfullScreen;
    let element = document.documentElement;
    if (that.isfullScreen) {
      if (element.requestFullscreen) {} else if (element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
      } else if (element.webkitRequestFullscreen) {
        element.webkitRequestFullscreen();
      } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.mozExitFullScreen) {
        document.mozExitFullScreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  },

  /**
   * @aes192加密模块
   * @param str string 要加密的字符串
   * @param secret string 要使用的加密密钥(要记住,不然就解不了密啦)
   * @retrun string 加密后的字符串
   * */
  encAse192: function (str, secret) {
    var cipher = crypto.createCipher("aes192", secret); //设置加密类型 和 要使用的加密密钥
    var enc = cipher.update(str, "utf8", "hex"); //编码方式从utf-8转为hex;
    enc += cipher.final("hex"); //编码方式从转为hex;
    return enc; //返回加密后的字符串
  },

  /**
   * @aes192解密模块
   * @param str string 要解密的字符串
   * @param secret string 要使用的解密密钥(要和密码的加密密钥对应,不然就解不了密啦)
   * @retrun string 解密后的字符串
   * */
  decAse192: function (str, secret) {
    var decipher = crypto.createDecipher("aes192", secret);
    var dec = decipher.update(str, "hex", "utf8"); //编码方式从hex转为utf-8;
    dec += decipher.final("utf8"); //编码方式从utf-8;
    return dec;
  }
};
