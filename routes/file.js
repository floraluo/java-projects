const router = require('koa-router')()
const fileController = require('../controllers/fileControler')

router.get('/getFiles', fileController.getFiles)

module.exports = router;