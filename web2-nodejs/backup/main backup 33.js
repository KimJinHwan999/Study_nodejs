var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

function templateHTML(title, list, body){
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - Welcome</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">${title}</a></h1>
        ${list}
        <a href='/create'>create</a>
        ${body}
    </body>
    </html>
    `;
}

function templateList(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list = list + `<li><a href='/?id=${filelist[i]}'>${filelist[i]}</a></li>`
        i++;
    }
    list = list + '</ul>';
    return list;
}

var app = http.createServer(function(req, resp){
    var _url = req.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;


    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data', function(err, filelist){
                var title = 'Welcome';
                var description = 'Welcome NodeJS';
                var list = templateList(filelist);
                var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                resp.writeHead(200);
                resp.end(template);
            })
        }else{
            fs.readdir('./data', function(err, filelist){
                fs.readFile(`./data/${queryData.id}`, function(err, description){
                    var title = queryData.id;
                    var list = templateList(filelist);
                    var template = templateHTML(title, list, `<h2>${title}</h2>${description}`);
                    resp.writeHead(200);
                    resp.end(template);
                });
            });
        }
    }else if(pathname === '/create'){ // create 버튼 눌렀을 때 날라오는 곳
        fs.readdir('./data', function(err, filelist){ // 홈페이지 코드 재활용
            var title = 'Web - create';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `
            <form action="http://localhost:3000/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>
            `);
            resp.writeHead(200);
            resp.end(template);
        });
    }else if(pathname === '/create_process'){   // form에서 데이터를 작성하고 날렸을 때 날라오는 곳
        var body='';
        req.on('data', function(data){
            body = body + data; // 콜백이 실행될 때 마다 데이터를 body에 추가해줌
        }); // 웹브라우저가 포스트로 데이터 전송할 때 데이터가 엄청 많으면 데이터를 한번에 처리하다가는 컴퓨터에 무리가 갈수도?
            // 노드js에서는 데이터가 많은 경우를 대비해서 사용방법을 제공
            // 특정한 양 만큼 서버에서 수신할 때 마다 콜백함수를 호출하도록 약속 (100에서 20만큼)
            // data라는 인자를 통해서 수신한 정보를 넘겨주기로 약속함
        req.on('end', function(){ // 더이상 들어올 정보가 없으면 end에 해당되는 콜백을 실행 (실행되면 정보 수신이 끝났다는 의미)
            var post = qs.parse(body);  // post 데이터에 post 정보를 파싱해서 넣어줌 정보를 객체화!!!!!!!
            var title = post.title;
            var description = post.description;
            fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
                resp.writeHead(302, {Location: `/?id=${title}`}); // 200은 성공 302는 임시적으로 새로운 URL로 이동했다는 뜻 (쇼핑몰에서일시적으로 품절되었음을 알릴 때) 301은 영구이동 (해당 URL이 영구적으로 변경되었다는 뜻 -> 웹사이트가 도메인을 변경했거나 개편했을 때 사용)
                resp.end('success');
            })
        })
    } else{
        resp.writeHead(404);
        resp.end('Not Found');
    }
});
app.listen(3000);