// 최초에 해야 하는 것은 필요한 라이브러리를 로드하는 것 (require 함수를 사용)
var http = require('http');     // 'http'라는 객체를 로드
var fs = require('fs');         // 파일을 로드하는 'fs'객체
var url = require('url');       // url이라는 모듈을 사용할 것이다.

// http.createServer(); 시작 (서버객체 생성)
// function(req, resp){} : 요청 처리를 위한 함수 (요청을 받았을 때의 처리) 
// request = 클라이언트의 요청 / response = 서버에서 클라이언트로 리턴
var app = http.createServer(function(request,response){     
    var _url = request.url;                             // 요청받은 url 주소를 변수로 담음

    // ----- node.js에서 url을 파싱하여 메타데이터 (쿼리스트링)을 읽어오는 방법!!------
    // Node.js의 url모듈의 parse 기능 사용 : _url을 분석해 (사용자가 요청한 URL주소) 쿼리 스트링 문자열만 추출하는 코드
    // url.parse(_url, true)는 URL에서 쿼리 스트링을 추출해 객체로 변환해주는 코드
    // ex) 'http://site.com/?id=jh&job=dev'
    // queryData = {id : 'jh', job : 'dev'}
    // console.log(queryData.id); -> jh
    var queryData = url.parse(_url, true).query;        
    var pathname = url.parse(_url, true).pathname;      
    
    if(pathname === '/'){       // pathname이 /을 가르킬 때

        if(queryData.id === undefined){ // homepage로 가는 경우 (localhost:3000/ 이후가 정의되지 않은 경우)
            
                var title = 'Welcome';
                var description = 'Hello, Node.js';
                var template = 
                `
                <!doctype html>
                <html>
                <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">WEB</a></h1>
                <ul>
                    <li><a href="/?id=HTML">HTML</a></li>
                    <li><a href="/?id=CSS">CSS</a></li>
                    <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ul>
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html>
                `;
                
                // writeHead는 response 객체의 메소드에서 헤더 정보를 응답에 작성해서 내보내는 것
                // resp.writeHeaed(20, {'Content-Type' : 'text/plain'});
                // 첫 번째 인자는 상태 코드를 지정하고, 두번째 인수에 해더 정보를 연관 배열로 정리
                response.writeHead(200);    
                // resp.write(); : 헤더 정보의 다음에 바디 부분이 되는 콘텐츠를 write로 작성 가능. 여러번 호출 가능

                // resp.end(); : 내용 내보내기가 완료되면 end로 콘텐츠 출력 완료. 
                // 인수로 내보낼 내용의 값을 지정할 수 있다. (template를 넣은 것 처럼) -> 그렇게 하면 인수의 값을 쓴 후에 내용을 완료한다.
                response.end(template);

                // 위 3개로 클라이언트에 반환 내용은 모두 쓸 수 있다.
            
        } else{         // homepage에서 다른 페이지로 이동하는 경우 (localhost:3000/?id=HTML, CSS, JavaScript)
            // 파일로드는 fs객체로 사용. require 함수로 fs 읽고 그 안에있는 메소드를 호출
            // fs.readFile(파일경로, 인코딩, 콜백함수){} (콜백함수 정의 : 함수에 파라미터로 들어가는 함수 / 용도 : 순차적으로 실행하고 싶을 때 씀)
            // readFile은 반환값이 없다. 비동기적으로 실행되는 처리이기 때문.
            // 읽기 작업은 백그라운드에서 이뤄지고, 읽기 시작하는 순간 바로 다음 작업으로 진행하도록 설계. 로드가 완료되면 미리 설정해둔 처리를 호출하고 읽기후의처리를 진행시킴
            // 이러한 "작업이 끝나면 나중에 호출되는 함수"를 콜백함수라고 함. (가져올 파일의 경로에서 파일 로드 -> 인코딩 -> 로드 완료 후 콜백함수에서 처리)
            fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){ // 비동기 처리이기 때문에, 비동기 작업이 완료된 이후에 응답처리를 해준다.
                var title = queryData.id;
                var template = `
                <!doctype html>
                <html>
                <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">WEB</a></h1>
                <ul>
                    <li><a href="/?id=HTML">HTML</a></li>
                    <li><a href="/?id=CSS">CSS</a></li>
                    <li><a href="/?id=JavaScript">JavaScript</a></li>
                </ul>
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            });
        }
        
    }else{      // 쌩뚱맞은 pathname을 가질 때 -> 404페이지
        response.writeHead(404);
        response.end('Not Found');
    }
}); // http.createServer 종료

// http.createServer 종료 되어 http.Server 객체의 준비가 되면, listen 메소드 실행.
// 서버는 대기상태가 됨
// 클라이언트의 요청이 있으면 받아서 처리할 수 있음
// app.listen(포트번호, 호스트이름, 백로그, 콜백함수);
app.listen(3000); 