/*****************
  サムネイル画像生成
 ****************/
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

var argvLen = process.argv.length;
var dir = [];
if(argvLen > 2) {
    //引数あり
    for(let i = 2; i < argvLen; i++) {
        dir[i - 2] = process.argv[i];
    }
} else {
    //引数がない場合は全ディレクトリ
    dir = fs.readdirSync("./");
    dir = dir.filter(function(file){
        return fs.statSync(path.join("./", file)).isDirectory() 
    })
}

dir.forEach((category) => {
    var imgPath = "./" + category
    console.log(imgPath)

    //画像ファイル取得
    var images = fs.readdirSync(imgPath);
    images = images.filter(function(file){
        return file.split('.')[1] === "jpg" || file.split('.')[1] === "jpeg" || file.split('.')[1] === "png" 
    })
    console.log(images)
    //サムネイルファイル取得
    var thumbnails = fs.readdirSync(imgPath + '/thumbnail')
    thumbnails = thumbnails.filter(function(file){
        return file.split('.')[1] === "jpg" || file.split('.')[1] === "jpeg" || file.split('.')[1] === "png"
    })
    console.log(thumbnails)

    images.forEach((image) => {
        var fileName = image.split('.')[0];
        if(!thumbnails.includes(fileName + ".jpg")) {
            //サムネイル画像が存在しない場合
            var thumbnail = sharp(imgPath + "/" + image);
            thumbnail.resize(600,null);
            thumbnail.toFile(imgPath + "/thumbnail/" + fileName + ".jpg")
            .then(() => {
                console.log("created thumbnail: " + imgPath + "/thumbnail/" + fileName + ".jpg")
            })
            .catch(error => {
                console.log(error);
            });       
        }
    })
})

