var http = require('http');
var url = require('url');
var fs = require('fs');

function templateHTML(title, list, body){ // HTML 템플릿 공통되는 부분 함수화
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB - ${title}</title>
        <meta charset="utf-8">
    </head>
    <body>
        <h1><a href="/">WEB2</a></h1>
        ${list}
        ${body}
    </body>
    </html>
    `;
}

function templateList(filelist){    // List 함수화
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
        i = i + 1;
    }
    list = list + '</ul>';
    return list;
}

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;

    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir('./data', function(error, filelist){
                var title = 'Welcome';
                var description = 'Welcome Node JS';
                var list = templateList(filelist);  // List 함수 대입
                var template = templateHTML(title, list, `<h2>${title}</h2>${description}`); // HTML template 함수 대입
                response.writeHead(200);
                response.end(template);
            })
        }else{
            fs.readdir('./data', function(error, filelist){
                fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
                    var title = queryData.id;
                    var list = templateList(filelist);  // List 함수 대입
                    var template = templateHTML(title, list, `<h2>${title}</h2>${description}`); // HTML template 함수 대입
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