var xlsx = require('node-xlsx');  
var fs = require('fs');  
//读取文件内容  
var obj = xlsx.parse('public/personal_info/personal_information.xlsx');  
var excelObj=obj[0].data;  
console.log(excelObj);  
var data = [];  
for(var i in excelObj){  
    var arr=[];  
    var value=excelObj[i];  
    for(var j in value){  
        arr.push(value[j]);  
    }  
    data.push(arr);  
}  
var buffer = xlsx.build([  
{  
    name:'sheet1',  
    data:data  
}]);  
//将文件内容插入新的文件中  
fs.writeFileSync('public/personal_info/test.xlsx',buffer,{'flag':'w'});  