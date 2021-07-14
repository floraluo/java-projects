const fs = require('fs');
const http = require('http')
const exifParse = require('exif-parser');
const exifr = require('exifr');
const { readFile } = require('fs').promises;
// const getExif = require('get-exif');
const modifyExif = require('modify-exif');
const ExifReader = require('exifreader');

// fs.readFile('http://192.168.1.1:8200/MediaItems/189.jpg',(err, data) => {
//     if (err) throw err;
//     console.log(data);
// })

// const buffer = fs.readFileSync('IMG_2965.HEIC')
// console.log('buffer:',buffer.length)
    
let chunkArray = [];
http.get('http://192.168.1.1:8200/MediaItems/189.jpg', (res) => {
    console.log(res.statusCode)
    res.on('data', (chunk) => {
        chunkArray.push(chunk);
    })
    res.on('end', () => {
        // console.log('jpeg:',exifParse.create(Buffer.concat(chunkArray)).parse());


        exifr.parse(Buffer.concat(chunkArray),true).then(output => {
            // console.log('jpeg:', output);

        })

        // return new Promise((resolve, reject) => {
        //     resolve(Buffer.concat(chunkArray))
        // })
        // console.log(Buffer.concat(chunkArray).toString('hex'));
    })

})

const heicPicBufs = fs.readFileSync('IMG_2965.HEIC')

const tags = ExifReader.load(Buffer.from(heicPicBufs, 'utf-8'));
console.log( tags)

// exifr.parse(heicPicBufs).then(output => {
//     console.log(output)
// })

// console.log(Buffer.from(heicPicBufs))
// console.log('---\nheic:', exifParse.create(Buffer.from(heicPicBufs)).parse())

// console.log(Buffer.from(heicPicBufs).toString('hex'));
