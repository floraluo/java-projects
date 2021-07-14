const router = require('koa-router')()
const api = require('./api');
// const device = require('../controllers/index');
// app.use(indexRouter.routes(), indexRouter.allowedMethods())

router.use('/api', api.routes(), api.allowedMethods());
// router.use('/files', file.routes(), file.allowedMethods());
// router.get('/', device.getDevices)

// router.get('/string', device.getDevices)

// router.get('/json', async (ctx, next) => {
//   ctx.body = {
//     title: 'koa2 json'
//   }
// })

module.exports = router
