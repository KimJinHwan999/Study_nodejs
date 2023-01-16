const express = require('express');
const router = express.Router();

const accountRouter = require('./accountRotuer');



router.use('/accounts', accountRouter);
// router.use('/actors', actorsRouter);


module.exports = router;

// app.use('/login', loginRouter);
// app.use('/admin', adminRouter);
