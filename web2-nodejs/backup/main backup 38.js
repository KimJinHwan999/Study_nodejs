var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

function templateHTML(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
        <title>WEB1 - ${title}</title>
        <meta charset="utf-8">  
    </head>
    <body>
        <h1><a href="/">WEB</a></h1>
        ${list}
        ${control}
        ${body}
    </body>
    </html> 
    `;
}

function templateList(filelist){
    var list = '<ul>';
    var i = 0;
    while(i < filelist.length){
        list = list + `<li><a href='/?id=${filelist[i]}'>${filelist[i]}</a></li>`;
        i++;
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
            fs.readdir('./data', function(err, filelist){
                var title = 'Welcome';
                var description = 'Welcome Node JS';
                var list = templateList(filelist);
                var template = templateHTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href='/create'>create</a>`); // 홈페이지에선 수정 나오면 안됨
                response.writeHead(200);
                response.end(template);
            });
        }else{
            fs.readdir('./data', function(err, filelist){
                fs.readFile(`data/${queryData.id}`, 'utf-8' ,function(err, description){
                    var title = queryData.id;
                    var list = templateList(filelist);
                    // delete도 post방식으로 보내야함 (링크로 queryString 태워 보내면 안됨)
                    var template = templateHTML(title, list, 
                        `<h2>${title}</h2>${description}`,
                        `<a href='/create'>create</a> 
                        <a href="/update?id=${title}">update</a>
                        <form action="delete_process" method="post" d>
                            <input type="hidden" name="id" value="${title}">
                            <input type="submit" value="delete">
                        </form>`
                    ); 
                        
                    response.writeHead(200);
                    response.end(template);
                });
            });
        }
    }else if(pathname === '/create'){
        fs.readdir('./data', function(err, filelist){
            var title = 'Web - createform';
            var list = templateList(filelist);
            var template = templateHTML(title, list, `<h2>${title}</h2>
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p>
                    <textarea name="description" placeholder="description"></textarea>
                </p>
                <p>
                    <input type="submit">
                </p>
            </form>`, ''); // 여기엔 create나 update는 필요없지만, 공백문자라도 줘서 파라미터 맞춰주기
            response.writeHead(200);
            response.end(template);
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
                response.writeHead(302, {Location : `/?id=${title}`});
                response.end();
            })
        });
    }else if(pathname === '/update'){
        fs.readdir('./data', function(err, filelist){
            fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
                var title = queryData.id;
                var list = templateList(filelist);
                var template = templateHTML(title, list, 
                    `
                    <form action="/update_process" method="post">
                        <input type="hidden" name="id" value="${title}">
                        <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                        <p>
                            <textarea name="description" placeholder="description">${description}</textarea>
                        </p>
                        <p>
                            <input type="submit">
                        </p>
                    </form>
                    `,
                    `<a href='/create'>create</a> <a href="/update?id=${title}">update</a>`); 
                    // 아이디 값이 있으면 수정 나오도록 (localhost:3000/update?id=HTML 과 같이 queryString으로 누굴 수정할 지 정해줘야함)
                response.writeHead(200);
                response.end(template);
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
                fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
                    response.writeHead(302, {Location : `/?id=${title}`});
                    response.end();
                })
            });
        });
    }else if(pathname === '/delete_process'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            fs.unlink(`data/${id}`, function(err){
                response.writeHead(302, {Location : `/`});
                response.end();
            })
        });
    }else{
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);