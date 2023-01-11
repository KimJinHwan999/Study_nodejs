// var v1 = 'v1';
// // 10000 개의 코드
// v1 = 'egoing'; // 누가 변수를 재할당했다면..? -> 버그
// var v2 = 'v2';

// 자바스크립트에서 함수는 값이다 ! -> 객체에 멤버로서 추가하자
// 객체는 값을 저장하는 그릇이다.
var o = {
    v1 : 'v1',
    v2 : 'v2',
    f1:function(){
        console.log(this.v1);
    },
    f2:function(){
        console.log(this.v2);
    }
}
// 객체 자신을 참조할 수 있는 this



o.f1();
o.f2();
