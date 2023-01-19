const express = require('express')  // express 모듈 로드
const app = express()
const fs = require('fs');
const bodyParser = require('body-parser');  // bodyParser 모듈 로드
const compression = require('compression'); // compression 모듈 로드
const indexRouter = require('./routes/index');
const topicRouter = require('./routes/topic');
const helmet = require('helmet');

app.use(helmet());
app.use(express.static('public')); // static 파일 찾아오는 모듈

// bodyParser 사용 (폼 데이터 형식 처리)
// bodyParser가 만들어내는 미들웨어를 표현하는 표현식
// 1. 사용자가 요청할 때 마다 바디파서 미들웨어가 실행 됨 
// 2. post 데이터를 내부적으로 분석해서 가져온 다음에 콜백을 호출하도록 약속
// 3. 콜백의 request.body 프로퍼티를 만들어줌

// form데이터는 이렇게 처리
app.use(bodyParser.urlencoded({ extended: false })); 

// json으로 처리할 땐
// app.use(bodyparser.json())

app.use(compression()); // 우리 어플리케이션은 요청이 들어올 때마다 bodyParser 미들웨어와 compression 미들웨어가 실행됨

// 전체 app에서 readdir 기능이 공통적으로 사용이 된다! (글 목록을 표현해주는 기능)
// 이 기능을 미들웨어로서 처리!
// 모든 코드에서 (모든 라우트에서) request.list를 통해 filelist에 접근 가능하다!
// 하지만 post상황에선 굳이 filelist를 불러올 필요가 없음
// app.use -> app.get으로 바꾸고, get 방식으로 들어오는 모든 요청에 readdir을 받아올 수 있도록 해줌
// 결론 : function(){} 이게 readdir기능을 하는 미들웨어이다. 이것 처럼 express에서는 모든 라우터의 콜백함수는 전부 미들웨어 기능을 하는 것
app.get('*', function(request, response, next){
  fs.readdir('./data', function(error, filelist){
    request.list = filelist;
    // next() 엔 그 다음에 호출되어야 할 미들웨어가 담겨있음
    next();    
  });
})

app.use('/', indexRouter);
// /topic라고 시작하는 주소들에게 topicRouter라는 미들웨어를 적용하겠다는 뜻
app.use('/topic', topicRouter);


// 미들웨어는 순차적으로 실행되기 때문에, 마지막까지 쭉 찾다가 찾는 파일이 없으면 404를 보내줌
// 그렇기 때문에 404는 마지막에 위치시킴
app.use((req, res, next) => { 
  res.status(404).send("Sorry can't find that!")
})

// 에러를 핸들링 하기위한 미들웨어 
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(3000, function(){
  console.log(`Example app listening on port 3000`)
});
  
