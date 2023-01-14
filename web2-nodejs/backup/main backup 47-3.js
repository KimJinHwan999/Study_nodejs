var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');
// 사용자가 입력한 정보(외부에서 들어온 정보)는 다 path로 바꿔줘야함 -> 오염된 정보 쳐내야 함
var path = require('path'); 
// 웹브라우저가 script 태그를 만나면 자바스크립트를 실행시킴 (공격자가 우리 사이트에 자바스크립트 코드를 심어넣을 수 있음)
// 정보를 필터링 해야함 (1. 스크립트 태그를 지워버리기 2. 스크립트 태그의 꺽쇠를 지워버리기 (&lt;, &gt; 이용해서) 3. 다른 사람이 만든 것 활용하기)
// npm sanitize package 사용하기 (npm 에 등록되어있는 수 많은 모듈들 중 sanitize 사용)
// 1. npm init (우리가 사용한 app을 npm으로 관리하기 위한 절차의 시작) -> npm init -y
// 2. package.json 생성 (우리 프로젝트에 대한 정보 담겨있음 - 다른사람이랑 공유할 거 아니면 그렇게 상관 없음)
// 3. npm install -S sanitize-html(-g는 전역적 -S는 지역적 다운로드) : sanitize-html npm에서 다운로드 -> package.json의 dependencies에 sanitize-html 추가된 것 확인
// 4. var dirty = require('sanitize-html'); 로 모듈 불러오기
// 5. var clean = sanitizeHTML(dirty);  로 세탁해주기
// ** 오류 -> npm을 다운받고 서버 내렸다가 다시 켜주기. pm2가 npm에서 내려받은 sanitize-HTML을 인식 하지 못하는 상황 발생 **
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){   
        if(queryData.id === undefined){  
            fs.readdir(`data/`, function(err, filelist){
                var title = 'Web';
                var description = 'Welcome Node JS';
                var list = template.list(filelist);
                var html = template.HTML(title, list, 
                    `<h2>${title}</h2>${description}`, 
                    `<a href='/create'>create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        }else{  // 리스트에 링크를 눌렀을 때
            fs.readdir(`data/`, function(err, filelist){
                 // 주소창에서 ../password.js로 검색해도 base만 돌려주기때문에 주소를 세탁할 수 있음 (사용자가 의도적으로 디렉토리 접근하는것을 막기)
                 // 외부에서 들어오는 정보의 오염 방지 (readFile(주소) << 이 부분 필터링 해주기)
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf-8', function(err, description){
                    var title = queryData.id;
                    // title은 살균 전 (더러운) 데이터 sanitizeHtml(); 이라는 살균 과정을 통해 sanitizedTitle로 살균된 데이터로 만들기
                    var sanitizedTitle = sanitizeHtml(title);
                    // description은 살균 전 (더러운) 데이터 sanitizeHtml(); 이라는 살균 과정을 통해 sanitizedDescription로 살균된 데이터로 만들기
                    // sanitize-HTMl은 script태그와 같이 예민한 태그가 있으면 아예 통채로 날려버림 , 제목태그와 같은것은 태그는 날리지만 내용은 남겨둠
                    // 허용하고 싶은 태그가 있다면 allowedTags:[]
                    var sanitizedDescription = sanitizeHtml(description, {
                        allowedTags:['h1']
                    });
                    var list = template.list(filelist);
                    var html = template.HTML(sanitizedTitle, list, 
                        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`, 
                        `<a href='/create'>create</a>
                         <a href=/update?id=${sanitizedTitle}>update</a>
                         <form action='delete_process' method='post'>
                            <input type='hidden' name='id' value='${sanitizedTitle}'>
                            <input type='submit' value='delete'>
                         </form>`);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }else if(pathname === '/create'){
        fs.readdir(`data/`, function(err, filelist){
            var title = 'Web';
            var form = `
            <form action='/create_process' method='post'>
                <p><input type='text' name='title' placeholder='title'></p>
                <p><textarea name='description' placeholder='description'></textarea></p>
                <p><input type='submit'></p>
            </form>
            `;
            var list = template.list(filelist);
            var html = template.HTML(title, list, 
                `<h2>${title}</h2>${form}`, 
                `<a href='/create'>create</a>`);
            response.writeHead(200);
            response.end(html);
        });
    }else if(pathname === '/create_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){   
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });           
        });
    }else if(pathname === '/update'){
        fs.readdir(`data/`, function(err, filelist){
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, function(err, description){
                var title = queryData.id;
                var form = `
                <form action='/update_process' method='post'>
                    <p><input type='hidden' name='id' value='${title}'></p>
                    <p><input type='text' name='title' value='${title}'></p>
                    <p><textarea name='description'>${description}</textarea></p>
                    <p><input type='submit'></p>
                </form>
                `;
                var list = template.list(filelist);
                var html = template.HTML(title, list, 
                    `<h2>${title}</h2>${form}`, 
                    `<a href='/create'>create</a>
                     <a href='/update'>update</a>`);
                response.writeHead(200);
                response.end(html);
            });
        });
    }else if(pathname === '/update_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description;
            fs.rename(`data/${id}`, `data/${title}`, function(err){
                fs.writeFile(`data/${title}`, description, function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                })
            })
        });
    }else if(pathname === '/delete_process'){
        var body='';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            // 삭제할 때의 id값도 오염될 수 있기 때문에 주소 세탁해주기
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(err){
                response.writeHead(302, {Location : `/`});
                response.end();
            });
        });
    }else{ 
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);