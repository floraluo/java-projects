const Device = require("../utils/Device");
const device = new Device();

/**
 * @api {GET} /api/getfiles?controlUrl=xxx&id=xx
 * @apiParam {String} [controlUrl] 获取设备内容的地址
 * @apiParam {String} [id] 浏览内容的父id，获取根目录时，id=0
 *
 */
exports.getFiles = async (ctx) => {
    const req = ctx.request;
    const req_query = req.query;
    const controlURL = req_query.controlUrl;
    const id = req_query.id;

    ctx.body = await new Promise((resolve, rejected) => {
        device.getAllDir(controlURL, id).then(res => {
            console.log('-----------', res, '-----------');
            // res: 目录列表
            let dirs = [];
            if (res.container) {
                res.container.forEach((dir, index) => {
                    dirs[index] = {}
                    formatData(dir, dirs[index]);
                    // console.log(dirs);
                    dirs[index]['controlURL'] = controlURL;
                })
            }
            if (res.item) {
                const dirsLen = dirs.length;
                res.item.forEach((dir, index) => {
                    dirs[dirsLen + index] = {}
                    formatData(dir, dirs[dirsLen + index]);
                    // dirs[index]['controlURL'] = controlURL;
                })
            }
            
            resolve(dirs);
        })
    })
    function formatData(data, target) {
        Object.keys(data).forEach(key => {
            if (typeof data[key] == "object") {
                if (key == 'res') {
                    target[key] = []
                    if (data[key] instanceof Array) {
                        // target[key] = data[key];
                        // target[key] = []
                        data[key].forEach((file, index) => {
                            target[key][index] = {}
                            formatData(file, target[key][index]);
                            // target[key][index] = Object.assign({}, file);
                            
                        })
                    } else {
                        // target[key] = [data[key]]
                        target[key][0] = {};
                        formatData(data[key], target[key][0]);
                    }
                } else {
                    formatData(data[key], target);
                }
            } else {
                if (target[key]) {
                    target[key + '1'] = data[key];
                } else {
                    target[key] = data[key];
                }
            }
        })
    }
}