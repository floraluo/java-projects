const router = require('koa-router')();
const deviceController = require('../controllers/deviceController')
const fileController = require('../controllers/fileControler')

router.get('/getDevices', deviceController.getDevices);
router.get('/getFiles', fileController.getFiles)
module.exports = router;

