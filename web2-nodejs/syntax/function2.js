// 자바스크립트 내장 객체 (반올림을 해줌 -> 입력값에 따라 달라짐)
console.log(Math.round(1.6)); // 2
console.log(Math.round(1.4)); // 1

// 첫 번째 입력값과 두 번째 입력값 더해주는 함수
function sum(x, y){ // 파라미터 (매개변수) 넣어주기
    console.log(x+y);
}

sum(2,4); // 입력값 하나하나를 아규먼트 (인자)

// 우리가 만든 sum은 융통성이 떨어짐 (항상 찍히는걸 봐야함)
// Math.round는 값으로 출력되기 때문에 결과를 광범위하게 응용할 수 있음
console.log(Math.round(1.6));

function sum2(x , y){
    console.log('a');
    return x + y;
    console.log('b'); // return을 만나면 즉시 값을 되돌려주며 함수가 종료됨 (출력안됨))
}
console.log(sum2(2,4));