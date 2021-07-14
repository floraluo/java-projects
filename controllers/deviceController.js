const Device = require("../utils/Device");
const device = new Device();


const DLNAServer = {
    index: (ctx) => {
        ctx.body = 'koa2 string'
    },
    /**
     * @api {GET} /api/getDevices 获取设备列表
     * @apiSuccess {String} [udn] uuid
     * @apiSuccess {String} [name] 设备名称
     * @apiSuccess {String} [icons] 设备图标
     * @apiSuccess {String} [controlURL] 获取设备内容描述的地址
     */
    getDevices: async (ctx) => {
        // ctx.set('Access-Control-Allow-Origin', 'http://localhost:3001');

        let devices = []
        ctx.body = await new Promise((resolve, reject) => {

            device.on('descover', result => {
                console.log('descover:\n', result);
                devices.push({
                    udn: result.UDN,
                    name: result.friendlyName,
                    icons: result.icons,
                    controlURL: result['services']['urn:upnp-org:serviceId:ContentDirectory']['controlURL']
                });
            })
            device.on('stop', () => {
                resolve(devices)
            })

            device.getDivece();
        })
    },
    /**
     * @api {GET} /api/getDirs?controlUrl=xxx&id=xx
     * @apiParam {String} [controlUrl] 获取设备内容的地址
     * @apiParam {String} [id] 浏览内容的父id，获取根目录时，id=0
     * 
     */
    getDirs: async (ctx) => {
        const req = ctx.request;
        const req_query = req.query;
        const controlURL = req_query.controlUrl;
        const id = req_query.id;

        ctx.body = await new Promise((resolve, rejected) => {
            device.getAllDir(controlURL, id).then(res => {
                console.log('request getAllDir: -----start------\n', res,'\nrequest getAllDir: ------end-----');
                // res: 目录列表
                let dirs = [];
                res.forEach((dir, index) => {
                    dirs[index] = {}
                    formatData(dir, dirs[index]);
                    // console.log(dirs);
                    dirs[index]['controlURL'] = controlURL;
                })
                resolve(dirs);
            })
        })
        function formatData(data, target) {
            Object.keys(data).forEach(key => {
                if (typeof data[key] == "object") {
                    formatData(data[key], target);
                } else {
                    target[key] = data[key];
                }
            })
        }
        

    },
    getDirsOrFiles: (ctx, deviceData, id) => {
        const services = deviceData.services;
        let controlURL = null;
        Object.keys(services).forEach(key => {
            if (key.match('ContentDirectory')) {
                controlURL = services[key].controlURL;
                return;
            }
        })
        device.getAllDir(controlURL, id).then(res => {
            // res: 目录列表
            let dirs = [];
            res.forEach((dir, index) => {
                dirs[index] = {}
                formatData(dir, dirs[index]);
                // console.log(dirs);
                dirs[index]['controlURL'] = controlURL;
            })

            console.log(dirs)
            // TODO:返回数据到客户端
            // return dirs;

            function formatData(data, target) {
                Object.keys(data).forEach(key => {
                    if (typeof data[key] == "object") {
                        formatData(data[key], target);
                    } else {
                        target[key] = data[key];
                    }
                })
            }
        })

    },
    getAllDir: (id = 0) => {

        device.getAllDir(id);
    },
    getSubDir: (dir, id) => {
        device.getAllDir(dir.controlURL, '3$B').then(res => {
            console.log(res)
            // if ( res)
        })
    }
}
// TODO: start 测试代码
// DLNAServer.getDevices();
// DLNAServer.getDirListByDevice(deviceData, 0)
// DLNAServer.getSubDir(dirs[0], 64)
// TODO: end-------
module.exports = DLNAServer;


