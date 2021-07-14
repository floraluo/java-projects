const axios = require('axios').default;

function soap(opts = {
    method: 'POST',
    url: '',
    headers: {},
    xml: '',
    timeout: 10000,
    proxy: {},
    maxBodyLength: Infinity,
    maxContentLength: Infinity,
    extraOpts: {},
}) {
    const {
        method,
        url,
        headers,
        xml,
        timeout,
        proxy,
        maxBodyLength,
        maxContentLength,
        extraOpts,
    } = opts;

    return new Promise((resolve, reject) => {
        axios({
            method: method || 'POST',
            url,
            headers,
            data: xml,
            timeout,
            proxy,
            maxBodyLength,
            maxContentLength,
            ...extraOpts,
        }).then((response) => {
            resolve({
                response: {
                    headers: response.headers,
                    body: response.data,
                    statusCode: response.status,
                },
            });
        }).catch((error) => {
            if (error.response) {
                reject(error.response.data);
            } else {
                reject(error);
            }
        });
    });
}
module.exports = soap;