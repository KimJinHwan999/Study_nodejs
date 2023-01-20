var express = require('express');
var router = express.Router();

// DB관련
const {Pool} = require('pg');
const pg = new Pool({
  user:'testuser',
  host:'localhost',
  database:'study',
  password:'1234',
  post:'5432'
});

pg.connect(err=>{
  if(err) console.log(err);
  else{
    console.log('DB success');
  }
})


/* GET users listing. */
router.get('/signin', function(req, res, next) {
  pg.query('SELECT userid FROM account', (err, result)=>{
    if(err){
      res.sendStatus(500);
    }else{
      res.status(200).json(result.rows);
    }
  })
});

/* GET users listing. */
router.get('/signup', function(req, res, next) {
  res.send('signup');
});

module.exports = router;
