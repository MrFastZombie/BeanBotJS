const im = require('imagemagick');
const fetch = require('node-fetch');
const fs = require('fs');

async function download(imageURL, fileName) {
    try {
        if(!fs.existsSync('./temp/'+fileName+'.png')) {
            fetch(imageURL).then(res => res.body.pipe(fs.createWriteStream('./temp/'+fileName+'.png')));
            return './temp/'+fileName+'.png';
        } else {
            let fileID = parseInt(fileName.replace(/\D/g, ''));
            let fileN = fileName.replace(/[0-9]/g, '');
            return await download(imageURL, fileN+(fileID+1));
        }
    } catch (error) {
        console.error(error);
    }
}

module.exports = {
    delImage: (filePath) => {
        fs.unlinkSync(filePath);
    },
    meme: async (topText, bottomText, imageURL) => {
        let image = await download(imageURL, 'magik1');
        im.convert([image, '-gravity', 'north', '-font', 'impact', '-annotate', '0', topText, image.split('.')[0]+'im.png'], function(err, result) {
            if(err) throw err;
            console.log("convert restult:" + result);
        });
        return image;
    }
}

/*function meme(topText, bottomTest, imageURL){
    let image = download(imageURL);
    return image;
}*/