// 引入Excel文件
function importExcel(obj, rABS, callback) {
  var wb;
  if (!obj.files) {
    return;
  }

  const IMPORTFILE_MAXSIZE = 2 * 1024; //这里可以自定义控制导入文件大小
  var suffix = obj.files[0].name.split(".")[1];

  if (suffix != 'xls' && suffix != 'xlsx') {
    alert('导入的文件格式不正确!');
    return
  }
  if (obj.files[0].size / 1024 > IMPORTFILE_MAXSIZE) {
    alert('导入的表格文件不能大于2M');
    return
  }

  var f = obj.files[0];
  var reader = new FileReader();
  reader.onload = function(e) {
    var data = e.target.result;
    if (rABS) {
      wb = XLSX.read(btoa(fixdata(data)), { //手动转化
        type: 'base64'
      });
    } else {
      wb = XLSX.read(data, {
        type: 'binary'
      });
    }
    var jsonData = JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]));

    callback(jsonData);

  }; // reader.onload闭合
  if (rABS) {
    reader.readAsArrayBuffer(f);
  } else {
    reader.readAsBinaryString(f);
  }
}
