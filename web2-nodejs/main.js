var http = require('http');
var url = require('url');
var fs = require('fs');
var qs = require('querystring');

// refactoring (리팩토링 : 코드 간결화 시키는 작업)
var template = {
    HTML : function(title, list, body, control){
        return `
        <!doctype html>
        <html>
        <head>
            <title>WEB1 - ${title}</title>
            <meta charset="utf-8">
        </head>
        <body>
            <h1><a href="/">Web</a></h1>
            ${list}
            ${control}
            ${body}
        </body>
        </html>     
        `;
    },
    list : function(filelist){
        var list = '<ul>';
        var i = 0;
        while(i < filelist.length){
            list = list + `<li><a href='/?id=${filelist[i]}'>${filelist[i]}</a></li>`
            i++;
        }
        list = list + '</ul>';
        return list;
    }
}

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
                fs.readFile(`data/${queryData.id}`, 'utf-8', function(err, description){
                    var title = queryData.id;
                    var list = template.list(filelist);
                    var html = template.HTML(title, list, 
                        `<h2>${title}</h2>${description}`, 
                        `<a href='/create'>create</a>
                         <a href=/update?id=${title}>update</a>
                         <form action='delete_process' method='post'>
                            <input type='hidden' name='id' value='${title}'>
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
            fs.readFile(`data/${queryData.id}`, function(err, description){
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
            fs.unlink(`data/${id}`, function(err){
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