const express = require('express')  
const app = express()
var fs = require('fs');
var path = require('path');
var bodyParser = require('body-parser');  
var compression = require('compression'); 
var sanitizeHtml = require('sanitize-html');
var template = require('./lib/template.js');

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(compression()); 

const { swaggerUi, specs } = require("./swagger/swagger")

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

/**
 * @swagger
 * paths:
 *  /:
 *    get:
 *      summary: "홈페이지"
 *      description: "홈페이지"
 *      tags: [Datas]
 *      responses:
 *        "200":
 *          description: 홈페이지
 *          
 */

/**
 * @swagger
 * paths:
 *  /page/{pageId}:
 *    get:
 *      summary: "특정 데이터 조회 Path 방식"
 *      description: "요청 경로에 값을 담아 서버에 보낸다."
 *      tags: [Datas]
 *      parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         description: 페이지 아이디
 *         schema:
 *          type: string
 *      responses:
 *        "200":
 *          description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (데이터 조회)
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 *                    users:
 *                      type: object
 *                      example:
 *                          {pageId : HTML}
 */

/**
 * @swagger
 * paths:
 *  /create:
 *    get:
 *      summary: "데이터 등록 페이지로 이동"
 *      description: "데이터 등록 페이지로 이동"
 *      tags: [Datas]
 *      responses:
 *        "200":
 *          description: 데이터 등록 페이지로 이동
 *        
 */

/**
 * @swagger
 *  paths:
 *   /create:
 *    post:
 *     summary: "데이터 등록"
 *     description: "POST 방식으로 데이터를 등록한다."
 *     tags: [Datas]
 *     requestBody:
 *      description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (데이터 등록)
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: text
 *                description: "글 제목"
 *              description:
 *                type: textarea
 *                description: "글 내용"
 */

/**
 * @swagger
 * paths:
 *  /update/{pageId}:
 *    get:
 *      summary: "특정 데이터 조회 Path 방식"
 *      description: "요청 경로에 값을 담아 서버에 보낸 후 update 페이지로 이동"
 *      tags: [Datas]
 *      parameters:
 *       - in: path
 *         name: pageId
 *         required: true
 *         description: 페이지 아이디
 *         schema:
 *          type: string
 *      responses:
 *        "200":
 *          description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (데이터 조회)
 *          content:
 *            application/json:
 *              schema:
 *                type: object
 *                properties:
 *                    ok:
 *                      type: boolean
 *                    users:
 *                      type: object
 *                      example:
 *                          {pageId : HTML}
 */

/**
 * @swagger
 *  paths:
 *   /update_process:
 *    post:
 *     summary: "데이터 수정"
 *     description: "POST 방식으로 데이터를 수정한다."
 *     tags: [Datas]
 *     requestBody:
 *      description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (데이터 등록)
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: hidden
 *                description: "기존 글 제목"
 *              title:
 *                type: text
 *                description: "글 제목"
 *              description:
 *                type: textarea
 *                description: "글 내용"
 */

/**
 * @swagger
 *  paths:
 *   /delete_process:
 *    post:
 *     summary: "데이터 수정"
 *     description: "POST 방식으로 데이터를 삭제한다."
 *     tags: [Datas]
 *     requestBody:
 *      description: 사용자가 서버로 전달하는 값에 따라 결과 값은 다릅니다. (데이터 등록)
 *      required: true
 *      content:
 *        application/x-www-form-urlencoded:
 *          schema:
 *            type: object
 *            properties:
 *              id:
 *                type: hidden
 *                description: "삭제 할 글 제목"
 */


/**
 * @path {GET} http://localhost:3000/
 * @description 요청 데이터 값이 없고 반환 값이 있는 GET Method
 */

app.get('/', function(request, response){
  fs.readdir('./data', function(error, filelist){
      var title = 'Welcome';
      var description = 'Hello, Node.js';
      var list = template.list(filelist);
      var html = template.HTML(title, list,
        `<h2>${title}</h2>${description}`,
        `<a href="/create">create</a>`
      );
      response.send(html);
    });
});

/**
 * @path {GET} http://localhost:3000/page/pageId
 * @description 요청 경로에 값을 담아 서버에 보낸다.
 */
app.get('/page/:pageId', function(request, response){
    fs.readdir('./data', function(error, filelist){
      var filteredId = path.parse(request.params.pageId).base;
      fs.readFile(`./data/${filteredId}`, 'utf8', function(err, description){
        var title = request.params.pageId;
        var sanitizedTitle = sanitizeHtml(title);
        var sanitizedDescription = sanitizeHtml(description, {
          allowedTags:['h1']
        });
        var list = template.list(filelist);
        var html = template.HTML(sanitizedTitle, list,
          `<h2>${sanitizedTitle}</h2>${sanitizedDescription}`,
          ` <a href="/create">create</a>
            <a href="/update/${sanitizedTitle}">update</a>
            <form action="/delete_process" method="post">
              <input type="hidden" name="id" value="${sanitizedTitle}">
              <input type="submit" value="delete">
            </form>`
        );
        response.send(html);
      });
    });
  });
  
  /**
 * @path {GET} http://localhost:3000/create
 * @description 데이터 등록 페이지로 이동
 */
  app.get('/create', function(request, response){
    fs.readdir('./data', function(error, filelist){
      var title = 'WEB - create';
      var list = template.list(filelist);
      var html = template.HTML(title, list, `
        <form action="/create" method="post">
          <p><input type="text" name="title" placeholder="title"></p>
          <p>
            <textarea name="description" placeholder="description"></textarea>
          </p>
          <p>
            <input type="submit">
          </p>
        </form>
      `, '');
      response.send(html);
    });
  });
  
  /**
 * @path {POST} http://localhost:3000/create
 * @description POST 방식으로 데이터를 등록한다.
 */
  app.post('/create', function(request, response){
    var post = request.body;
    var title = post.title;
    var description = post.description;
    fs.writeFile(`data/${title}`, description, 'utf8', function(err){
      response.writeHead(302, {Location: `/?id=${title}`});
      response.end();
    });
  });
  
  /**
 * @path {GET} http://localhost:3000/update/:pageId
 * @description 요청 경로에 값을 담아 서버에 보낸 후 update 페이지로 이동
 */
  app.get('/update/:pageId', function(request, response){
    fs.readdir('./data', function(error, filelist){
      var filteredId = path.parse(request.params.pageId).base;
      fs.readFile(`data/${filteredId}`, 'utf8', function(err, description){
        var title = request.params.pageId;
        var list = template.list(filelist);
        var html = template.HTML(title, list,
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
          `<a href="/create">create</a> <a href="/update/${title}">update</a>`
        );
        response.send(html);
      });
    });
  });
  
  /**
 * @path {POST} http://localhost:3000/update_process
 * @description POST 방식으로 데이터를 수정한다.
 */
  app.post('/update_process', function(request, response){
      var post = request.body;
      var id = post.id;
      var title = post.title;
      var description = post.description;
      fs.rename(`data/${id}`, `data/${title}`, function(error){
        fs.writeFile(`data/${title}`, description, 'utf8', function(err){
          response.redirect(`/page/${title}`);
        })
      });
  });
  
  /**
 * @path {POST} http://localhost:3000/delete_process
 * @description POST 방식으로 데이터 삭제
 */
  app.post('/delete_process', function(request, response){
      var post = request.body;
      var id = post.id;
      var filteredId = path.parse(id).base;
      fs.unlink(`data/${filteredId}`, function(error){
        response.redirect('/');
      })
  });

// http listen port 생성 서버 실행
app.listen(3000, () => console.log("success"))

