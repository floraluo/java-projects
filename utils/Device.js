const SSDP = require('node-ssdp').Client;
const Client = require('upnp-device-client');
const fs = require('fs');
const path = require('path');
const xmlParser = require('fast-xml-parser');
const soap = require('./soap');
const EventEmitter = require('events');
class Device extends EventEmitter {
    constructor() {
        super()
        this.device = {
            url: '',
            address: '',
            port: '',
            location: ''
        };
        this.url = '';
        this.address = '';
        this.port = '';
        this.location = '';
        this.name = ''
    }
    getDivece() {
        const client = new SSDP({
            // customLogger: console.log
        })

        client.on('response', async (headers, code, rinfo) => {
            console.log(
                'SSDP response headers:\n',headers,
                '\nSSDP response rinfo:\n', rinfo)
            this.device.address = this.address = rinfo.address;
            this.device.port = this.port = rinfo.port;
            this.device.location = this.location = headers.LOCATION;

            const description = await this.#getDeviceDescription(this.device);
            // const description = await getDeviceDescription.call(this, this.device);
            this.emit('descover', description)
        })

        //传入设备类型查询相关设备
        client.search('urn:schemas-upnp-org:service:ContentDirectory:1')
        // client.search('upnp:rootdevice');

        // Or maybe if you want to scour for everything after 5 seconds
        setTimeout( () => {
            client.stop();
            this.emit('stop')
        }, 500)
    }

    #getDeviceDescription(device) {
        return new Promise((resolve, reject) => {
            const client = new Client(device.location);
            client.getDeviceDescription((err, description) => {
                if (err) throw err;
                resolve(description);
                console.log('getDeviceDescription:\n', description);
                // this.device.name = this.name = description.friendlyName;
            })
        })
    }
    
    getAllDir(controlURL, objectID){
        //  根目录OjectId始终=0
        // 发送soap请求
        const headers = {
            'Content-Type': 'text/xml; charset=utf-8',
            'SOAPAction': '"urn:schemas-upnp-org:service:ContentDirectory:1#Browse"'
        }
        let xml = fs.readFileSync(path.join(__dirname, 'browseroot.data'), 'utf-8');
        if (objectID !== 0) {
            let xml2js = xmlParser.parse(xml);
            xml2js.ObjectID = objectID
            xml = new xmlParser.j2xParser().parse(xml2js)
        }

        return new Promise((resolve, reject) => {
            // 发送一个soap请求
            soap({
                url: controlURL,
                headers: headers,
                xml: xml
            }).then(res => {
                // console.log('soap response:\n', res.response);
                const result = xmlParser.parse(res.response.body)['s:Envelope']['s:Body']['u:BrowseResponse']['Result'].replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/dc:/g, '');
                let contents = xmlParser.parse(result, {
                    attributeNamePrefix: "",
                    attrNodeName: 'attr',
                    ignoreAttributes: false
                })['DIDL-Lite']
                console.log('result: --start--\n', result, '\nresult: --end--\n')
                console.log('contents: --start--\n', contents, '\ncontents: --end--\n')
                // if (contents['container']){
                //     resolve(contents['container']);
                // } else if (contents['item']) {
                //     resolve(contents['item'])
                // }
                resolve({
                    container: contents['container'],
                    item: contents['item']
                })
            })
        })
        
    }
}
function getDeviceDescription(device) {
    return new Promise((resolve, reject) => {
        const client = new Client(device.location);
        client.getDeviceDescription((err, description) => {
            if (err) throw err;
            resolve(description);
            console.log('getDeviceDescription:\n',description);
            // this.device.name = this.name = description.friendlyName;
        })
    })
}
function getControlURL(device) {
    // const description = await getDeviceDescription.call(this, this.device);

    let controlURL = '';
    // this.on('descover', (device) => {
        // const client = new Client('http://192.168.1.1:8200/rootDesc.xml');
        const client = new Client(device.location);

        // Get the device description
        // 拿到服务类型“ContentDirectory”的controlURL，通过controlURL发送soap请求获取服务器上的根目录
        client.getDeviceDescription(async (err, description) => {
            if (err) throw err;
            this.device.name = this.name = description.friendlyName;
            const services = description.services;
            let contentDirService = null;
            Object.keys(services).forEach(key => {
                if (key.match('ContentDirectory')) {
                    contentDirService = services[key];
                    return;
                }
            })
            // this.emit('descoverControlURL', contentDirService.controlURL)

            return controlURL = await Promise.resolve(contentDirService.controlURL);
            // console.log('getDeviceDescription:', description, '----------');
        });

        // Get the device's ContentDirectory service description
        // client.getServiceDescription('ContentDirectory', function (err, description) {
        //     if (err) throw err;
        //     console.log('get service description:', description.actions, '--------');
        // });
    // })
}
// new Device().getAllDir(0);
module.exports = Device;
