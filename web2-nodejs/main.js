var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var app = http.createServer(function(request, response){
    var _url = request.url;
    var pathname = url.parse(_url, true).pathname;
    var queryData= url.parse(_url, true).query;
    if(pathname === '/'){
        if(queryData.id === undefined){
            fs.readdir(`data/`, function(err, filelist){
                var title = 'Web';
                var description = 'Hello Node JS';
                var list = template.List(filelist);
                var html = template.HTML(title, list, 
                    `<h2>${title}</h2>${description}`,
                    `<a href='/create'>create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        }else{
            fs.readdir(`data/`, function(err, filelist){
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf-8', function(err, description){
                    var title = queryData.id;
                    var sanitizedTitle = sanitizeHtml(title);
                    var sanitizedDescription = sanitizeHtml(description);
                    var list = template.List(filelist);
                    var html = template.HTML(sanitizedTitle, list, 
                        `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
                        ` <a href='/create'>create</a>
                        <a href='/update?id=${sanitizedTitle}'>update</a>
                        <form action='/delete' method='post'>
                            <p><input type='hidden' value='${sanitizedTitle}' name='id'></p>
                            <p><input type='submit' value='삭제'></p>
                        </form>`);
                    response.writeHead(200);
                    response.end(html);
                });
            });
        }
    }else if(pathname === '/create'){
        fs.readdir(`data/`, function(err, filelist){
            var title = 'Web';
            var list = template.List(filelist);
            var html = template.HTML(title, list, 
            `
            <form action="/create_process" method="post">
                <p><input type="text" name="title" placeholder="title"></p>
                <p><textarea name="description" placeholder="description"></textarea></p>
                <p><input type="submit" value="제출">
            </form>
            `, '');
            response.writeHead(200);
            response.end(html);
        });
    }else if(pathname === "/create_process"){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var title = post.title;
            var description = post.description ;
            fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
                response.writeHead(302, {Location: `/?id=${title}`});
                response.end();
            });
        });
    }else if(pathname === "/update"){
        fs.readdir(`data/`, function(err, filelist){
            var filteredId = path.parse(queryData.id).base;
            fs.readFile(`data/${filteredId}`, function(err, description){
                var title = queryData.id;
                var list = template.List(filelist);
                var html = template.HTML(title, list, 
                `<form action="/update_process" method="post">
                    <p><input type="hidden" name="id" value="${title}"></p>
                    <p><input type="text" name="title" value="${title}"></p>
                    <p><textarea name="description">${description}</textarea></p>
                    <p><input type="submit" value="수정">
                </form>`, '');
                response.writeHead(200);
                response.end(html);
            });
        });
    }else if(pathname === "/update_process"){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var title = post.title;
            var description = post.description ;
            fs.rename(`data/${id}`, `data/${title}`, function(err){
                fs.writeFile(`data/${title}`, description, 'utf-8', function(err){
                    response.writeHead(302, {Location: `/?id=${title}`});
                    response.end();
                });
            })
        });
    }else if(pathname === '/delete'){
        var body = '';
        request.on('data', function(data){
            body = body + data;
        });
        request.on('end', function(){
            var post = qs.parse(body);
            var id = post.id;
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(err){
                response.writeHead(302, {Location: `/`});
                response.end();
            });
        });
    }else{
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);