const express = require('express');
const accountRouter = express.Router();


accountRouter.get('/', (req, res)=>{
    return res.json({
        title: 'login router get'
    })
});

accountRouter.post('/', (req, res)=>{
    return res.json({
        title: 'login router post'
    })
});

accountRouter.delete('/', (req, res)=> {
    return res.json({
        title: 'login router delete'
    })
});


accountRouter.put('/', (req, res)=> {
    return res.json({
        title: 'login router put'
    });
})

module.exports = accountRouter;