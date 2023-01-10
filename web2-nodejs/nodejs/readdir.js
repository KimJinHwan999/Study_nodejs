var testFolder = './data'; // data폴더의 경로 찾아주기
var fs = require('fs');

fs.readdir(testFolder, function(error, filelist){
    console.log(filelist);  // filelist는 담겨있는 파일의 목록 배열로 반환
});