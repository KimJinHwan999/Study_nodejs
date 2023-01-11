// 배열
var members =['egoing', 'k8805', 'hoya'];   
console.log(members[1]);

var i = 0;
while(i< members.length){
    console.log('array loop', members[i]);
    i = i+1;
}

// 객체
var roles = {
    'programmer':'egoing',
    'designer':'k8805',
    'manager':'hoya'
}
console.log(roles.designer);
console.log(roles['designer']);

// name에는 식별자 (키) 가 들어옴
// value를 얻기 위해선 roles[name];
for(var name in roles){
    console.log('object', name, 'value', roles[name]);
}