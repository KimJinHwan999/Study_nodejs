// 모듈을 이용하면 파일로 쪼개서 독립시킬 수 있음
var M = {
    v: 'v',
    f: function(){
        console.log(this.v);
    }
}

// 모듈 객체 (M이 가리키는 객체를 모듈 바깥에서 사용할 수 있도록 exports)
module.exports = M;