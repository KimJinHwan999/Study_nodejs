const express = require('express')  
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');  
const compression = require('compression'); 
const sanitizeHtml = require('sanitize-html');
const template = require('./lib/template.js');
const { swaggerUi, specs } = require("./swagger/swagger")
const indexRouter = require('./routers');
const app = express()

app.use(express.json())
// app.use(express.urlencoded({ extended: true }))
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(compression()); 

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs))

app.use('/', indexRouter);


app.use((req, res, next) =>{
  res.status(404).send('Not Found');
})


// http listen port 생성 서버 실행
app.listen(3000, () => console.log("success"))

