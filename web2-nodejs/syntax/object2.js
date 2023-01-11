// array, object

// 자바스크립트에서 조건문(statement), 반복문 (statement)은 값이 아니다.
// var i = if(true){
//     console.log(1);
// };

// var w = while(true){
//     console.log(1);
// };


// 자바스크립트에서 함수는 처리해야할 일에 대한 구문 (statement) 이자 값이다.
// 값인 이유는 함수를 변수에 넣을 수 있다.
var f = function f1(){
    console.log(1+1);
    console.log(1+2);
}
console.log(f);
f();

// 배열에 함수를 담음
var a = [f];
// 배열의 원소로서 함수가 존재할 수 있음
a[0]();

// 객체에도 함수를 담을 수 있음
var o = {
    func:f
}
// 객체에 담긴 함수를 실행
o.func();


