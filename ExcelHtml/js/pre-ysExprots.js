(function (window,undefined) {
    window.ys={
        toTableExcel:toTableExcel,
        toCSV:toCSV,
        toLargerCSV:toLargerCSV,
        haha:function () {
            alert("..........")
        }

    };

 //导出xsl
function  toTableExcel(jsonData,str) {
        for(var i = 0;i < jsonData.length;i++){
            str += '<tr>';
            for(var item in jsonData[i]){
                var cellvalue = jsonData[i][item];
                //不让表格显示科学计数法或者其他格式
                //方法1 tr里面加 style="mso-number-format:'\@';" 方法2  是改为 = 'XXXX'格式
                //如果纯数字且超过15位
                /*var reg = /^[0-9]+.?[0-9]*$/;
                if ((cellvalue.length>15) && (reg.test(cellvalue))){
                    //cellvalue = '="' + cellvalue + '"';
                }*/
                //此处用`取代'，具体用法搜索模板字符串 ES6特性
                str+=`<td style="mso-number-format:'\@';">${cellvalue}</td>`;
                // str+=`<td>${cellvalue}</td>`;
            }
            str+='</tr>';
        }
        var worksheet = '导出结果';
        var uri = 'data:application/vnd.ms-excel;base64,';
//下载的表格模板数据
        var template = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
      xmlns:x="urn:schemas-microsoft-com:office:excel"
      xmlns="http://www.w3.org/TR/REC-html40">
      <head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet>
        <x:Name>${worksheet}</x:Name>
        <x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet>
        </x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
        </head><body><table>${str}</table></body></html>`;
//下载模板
        function base64 (s) { return window.btoa(unescape(encodeURIComponent(s)))}
        window.location.href = uri + base64(template);
    }

//导出csv
function toCSV(jsonData,str){
        //具体数值 遍历
        for(var i = 0 ; i < jsonData.length ; i++ ){
            for(var item in jsonData[i]){

                //增加\t为了不让表格显示科学计数法或者其他格式
                //此处用`取代'，具体用法搜索模板字符串 ES6特性
                str+=`${jsonData[i][item] + '\t,'}`;
            }
            str+='\n';
        }
        var uri = 'data:text/csv;charset=utf-8,\ufeff' + encodeURIComponent(str);
        var link = document.createElement("a");
        link.href = uri;
        link.download =  "导出.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

//导出大csv
function toLargerCSV(str){
        var blob = new Blob([str], {type: "text/plain;charset=utf-8"});
        //解决中文乱码问题
        blob =  new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
        object_url = window.URL.createObjectURL(blob);
        var link = document.createElement("a");
        link.href = object_url;
        link.download =  "导出.csv";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

})(window);
