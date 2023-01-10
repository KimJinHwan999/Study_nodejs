/*
function a(){
    console.log('A');
}
*/

// 이름이 없는 익명 함수
var a = function(){ // 자바스크립트에서는 함수가 값이다!
    console.log('A');
}

// 이 기능을 실행한 쪽에게, 함수가 실행이 끝났으니까 그 다음일을 하세요 라고 하고싶으면 인자로 callback받기, 그리고 callback 실행
function slowfunc(callback){ // callback은 a가 가리키는 익명함수를 가리키게 됨
    callback();
}

slowfunc(a);
