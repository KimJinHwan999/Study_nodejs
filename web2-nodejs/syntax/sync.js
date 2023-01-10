var fs = require('fs');

/*
console.log('A');
// 동기적
// readFileSync(파일이름, 형식) -> 리턴값이 있어서 변수에 담아줄 수 있음
var result = fs.readFileSync('syntax/sample.txt', 'utf-8'); 
console.log(result);
console.log('C');
*/

console.log('A');
// 비동기적 (없는걸 선호한다)
// readFile(파일이름, 형식, 콜백함수) -> 리턴값이 없어서 변수에 못 담아줌
// NodeJS야, readFile 기능을 이용해서, syntax/sample.txt 여기서 파일 읽어와.
// 읽어오면 콜백함수를 내부적으로 실행시켜. 
fs.readFile('syntax/sample.txt', 'utf-8', function(err, result){
    console.log(result);
}); 
console.log('C');
