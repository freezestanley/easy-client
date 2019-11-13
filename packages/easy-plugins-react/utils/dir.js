const fs = require('fs')
module.exports = {
    copyFolder: /**
    * 拷贝目录
    * @param {*} from 
    * @param {*} to 
    */
   function copyFolder(from, to) {        // 复制文件夹到指定目录
       let files = [];
       if (fs.existsSync(to)) {           // 文件是否存在 如果不存在则创建
         files = fs.readdirSync(from);
         files.forEach(function (file, index) {
           var targetPath = from + "/" + file;
           var toPath = to + '/' + file;
           if (fs.statSync(targetPath).isDirectory()) { // 复制文件夹
             copyFolder(targetPath, toPath);
           } else {                                    // 拷贝文件
             fs.copyFileSync(targetPath, toPath);
           }
         });
       } else {
         fs.mkdirSync(to);
         copyFolder(from, to);
       }
     },
     /**
   * 新建文件夹
   * @param {*} path 
   */
  createFolder: function createFolder(path) {
    fs.mkdir(path, function (err) {
      if (err) {
        return console.error(err);
      }
    });
  },
  delDir:
  //删除文件夹
  function delDir(path) {
    let files = [];
    if (fs.existsSync(path)) {
      files = fs.readdirSync(path);
      files.forEach((file, index) => {
        let curPath = path + "/" + file;
        if (fs.statSync(curPath).isDirectory()) {
          delDir(curPath); //递归删除文件夹
        } else {
          fs.unlinkSync(curPath); //删除文件
        }
      });
      fs.rmdirSync(path);
    }
  }
}