var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');
var template = require('./lib/template.js');
// 사용자가 입력한 정보(외부에서 들어온 정보)는 다 path로 바꿔줘야함 -> 오염된 정보 쳐내야 함
var path = require('path'); 
var sanitizeHtml = require('sanitize-html');

var app = http.createServer(function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){   // 홈페이지로 갈 때
        if(queryData.id === undefined){    // 홈페이지로 갈 때
            fs.readdir(`data/`, function(err, filelist){
                var title = 'Web';
                var description = 'Welcome Node JS';
                // 파일만 있던 세상에 폴더가 만들어진 느낌!!
                // template이라는 변수에 담아주면 객체 이름과 겹치기 때문에 변수명을 변경해주자!
                var list = template.list(filelist);
                var html = template.HTML(title, list, 
                    `<h2>${title}</h2>${description}`, 
                    `<a href='/create'>create</a>`);
                response.writeHead(200);
                response.end(html);
            });
        }else{  // 리스트에 링크를 눌렀을 때
            fs.readdir(`data/`, function(err, filelist){
                var filteredId = path.parse(queryData.id).base;
                fs.readFile(`data/${filteredId}`, 'utf-8', function(err, description){
                    var title = queryData.id;
                    var sanitizedTitle = sanitizeHtml(title);
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
            var filteredId = path.parse(id).base;
            fs.unlink(`data/${filteredId}`, function(err){
                response.writeHead(302, {Location : `/`});
                response.end();
            });
        });
    }else{  // 쌩뚱맞은 페이지로 갈 때
        response.writeHead(404);
        response.end('Not Found');
    }
});
app.listen(3000);