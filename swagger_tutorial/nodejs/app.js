var express = require('express');
var app = express();

// express의  static 함수를 이용해서 public 폴더를 누구나 문서로 읽을 수 있는 형태로 제공
app.use(express.static('public'));

app.get('/', function(req, res){
    res.send('Hello World');
});

app.get('/adder', function(req, res){
    let one = req.query.one;
    let two = req.query.two;
    let result = Number(one) + Number(two);
    res.send(String(result));
})

app.listen(3000, function(){
    console.log('Server Listening on port 3000!');
});

