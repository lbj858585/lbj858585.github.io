/* 调用位置：引人表格成功后的回调
  <input type="file" onchange="importExcel(this,false,importSuccessCallback)" id="uploadFile" />
*/
var isImportSuccess, data;
var importSuccessCallback = function(excelJsonData) {
  isImportSuccess = true;
  data = excelJsonData;
  var namePieceArr = $('#uploadFile').val().split('\\');
  $('#currentFile').text(namePieceArr[namePieceArr.length - 1]);
  $('#uploadFile').val('');
  renderPage(data, $('#horizontalMerge').val(), $('#verticalMerge').val());
};

// 引入成功后切换合并方式
$('#horizontalMerge,#verticalMerge').on('change', function() {
  isImportSuccess && renderPage(data, $('#horizontalMerge').val(), $('#verticalMerge').val());
});

// function selectCustomerDb(obj) {
//   var value = $(obj).text();
//   if ($(obj).css('background-color') === 'rgb(255, 0, 0)') {

// $(obj).css('background-color', 'white');

// } else {

// $(obj).css('background-color', 'red');

// }
// // alert($(obj).prev().text()); 
//  window.open("barCode.html?code="+value);
// }

// 渲染页面
function renderPage(data, horizontalMerge, verticalMerge) {
  console.log(data);
  data = JSON.parse(data);
  var pointer = {};
  var fullkeys = [];
  var trStr = '';
  // 获取各列标题
  for (var item of data) {
    var keys = Object.keys(item);
    fullkeys = keys.length > fullkeys.length ? keys : fullkeys;
  }
  // 生成标题行
  trStr += '<tr>';
  for (var key of fullkeys) {
    pointer[key] = {
      val: '',
      num: 1
    };
    trStr += '<th nowrap style="text-align:center;">' + key + '</th>'
  }
  trStr += '</tr>';
  $('#eatcrab tbody').html(trStr);

  // 生成标题行之外的其他内容
  for (var i = 0; i < data.length; i++) { // 行
    var item = data[i];
    trStr += '<tr>'
    for (var j = 0; j < fullkeys.length; j++) { // 列
      var key = fullkeys[j];
      if (item.hasOwnProperty(key)) {
        // 更新列值
        pointer[key].val = item[key];
        pointer[key].num = 1;
      } else {
        // 补齐列值
        item[key] = pointer[key].val;
        pointer[key].num = pointer[key].num + 1;
      }
      // var align = j == 3 || j == 4 ? 'align="center"' : ';'
      var align = 'align="center"'
      trStr += '<td nowrap '+align+' index="' + i + ',' + j + '" onclick="selectCustomerDb(this)" >' + item[key] + '</td>';
    };
    trStr += '</tr>'
  }
  $('#eatcrab tbody').html(trStr);
  // 否定语义集合，可以自行扩展
  var falsyMeaningArr = ['n', 'N', 'no', 'No', 'NO', 'not', 'Not', 'NOT', 'false', '不', '否', '不合并'];
  // 水平单元格合并（左右方向内容相同）
  if (horizontalMerge && falsyMeaningArr.indexOf(horizontalMerge) == -1) { // 隐式转换后的值为true，且不是否定语义
    var $tds = $('#eatcrab').find('td');
    for (var i = $tds.length - 1; i > 0; i--) {
      var $td = $tds.eq(i);
      var colspan = $td.attr('colspan') || 1;
      var rowIndex = +$td.attr('index').split(',')[0];
      var colIndex = +$td.attr('index').split(',')[1];
      var $prevTd = $('td[index="' + rowIndex + ',' + (colIndex - 1) + '"]');
      if ($prevTd.text() === $td.text()) {
        $prevTd.attr('colspan', ++colspan);
        $td.remove();
      }
    }
  }
  // 垂直单元格合并（上下方向内容相同）
  if (verticalMerge && falsyMeaningArr.indexOf(verticalMerge) == -1) { // 隐式转换后的值为true，且不是否定语义
    var $tds = $('#eatcrab').find('td');
    for (var i = $tds.length - 1; i > 0; i--) {
      var $td = $tds.eq(i);
      var rowspan = $td.attr('rowspan') || 1;
      var rowIndex = +$td.attr('index').split(',')[0];
      var colIndex = +$td.attr('index').split(',')[1];
      var $aboveTd = $('td[index="' + (rowIndex - 1) + ',' + colIndex + '"]');
      if ($aboveTd.text() === $td.text()) {
        $aboveTd.attr('rowspan', ++rowspan);
        $td.remove();
      }
    }
  }
  // 点击复制页面代码功能
  $('#copyboard').val($('#myohmy')[0].outerHTML);
  new ClipboardJS('#copyBtn');
  // 复制功能初始化后，显示按钮
  $('#copyBtn').show();
}
