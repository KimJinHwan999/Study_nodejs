var http = require('http');
var url = require('url');
var fs = require('fs');

var app = http.createServer(function(request, response){    
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data', function(error, filelist){ // readdir(파일 경로, 콜백함수(error, data){}) -> 원하는 폴더의 파일을 배열로 리턴해줌
                var title = 'Welcome';
                var description = 'Welcome NodeJs';
                var list = '<ul>';                          // list를 변수로 설정하여, 반복문을 태워 폴더 내 파일 명으로 돌려줌
                var i = 0;
                while(i < filelist.length){
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i + 1;
                }
                list = list + '</ul>';
                var template = 
                `
                <!doctype html>
                <html>
                <head>
                <title>WEB1 - ${title}</title>
                <meta charset="utf-8">
                </head>
                <body>
                <h1><a href="/">${title}</a></h1>
                ${list}
                <h2>${title}</h2>
                <p>${description}</p>
                </body>
                </html>
                `;
                response.writeHead(200);
                response.end(template);
            })
        }else{
            fs.readdir('./data', function(error, filelist){
                var title = 'Welcome';
                var description = 'Welcome NodeJs';
                var list = '<ul>';
                var i = 0;
                while(i < filelist.length){
                    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
                    i = i + 1;
                }
                list = list + '</ul>';

                fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
                    var title = queryData.id;
                    var template = 
                    `
                    <!doctype html>
                    <html>
                    <head>
                    <title>WEB1 - ${title}</title>
                    <meta charset="utf-8">
                    </head>
                    <body>
                    <h1><a href="/">${title}</a></h1>
                    ${list}
                    <h2>${title}</h2>
                    <p>${description}</p>
                    </body>
                    </html>
                    `;
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }else{
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);