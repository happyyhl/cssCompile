let postcssSprites = require('postcss-sprites');
let sprites = postcssSprites.default;
let precss = require('precss');
let assets = require('postcss-assets');
let autoprefixer = require('autoprefixer');

module.exports = {
    module: {
        loaders: [
            {
                test:   /\.css$/,
                loader: "style-loader!css-loader!postcss-loader"
            }
        ]
    },
    postcss: [
        autoprefixer,
        precss,
        assets({//主要是用来做base64编码的
            basePath: __dirname + '/client',
            relative: false
        })
    ]
    // postcss: function () {
    //     return [require('autoprefixer'), require('precss')];
    // }
}

//雪碧图相关代码
let spritesConfig = sprites({
    retina: true,//支持retina，可以实现合并不同比例图片
    verbose: true,
    spritePath: './public/images/',//雪碧图合并后存放地址
    stylesheetPath: './public',
    basePath: './',
    filterBy: function (image) {
        //过滤一些不需要合并的图片，返回值是一个promise，默认有一个exist的filter
        //
        if (image.url.indexOf('/images/sprites/') === -1) {
            return Promise.reject();
        }
        return Promise.resolve();
    },
    groupBy: function (image) {
        //将图片分组，可以实现按照文件夹生成雪碧图
        return spritesGroupBy(image);
    },
    hooks: {
        onUpdateRule: function (rule, comment, image) {
            //更新生成后的规则，这里主要是改变了生成后的url访问路径
            return spritesOnUpdateRule(true, rule, comment, image);
        },
        onSaveSpritesheet: function(opts, groups) {
            return spritesOnSaveSpritesheet(true, opts, groups);
        }
    }
});
export function spritesGroupBy(image) {
	   let groups = /\/images\/sprites\/(.*?)\/.*/gi.exec(image.url);
    let groupName = groups ? groups[1] : group;
    image.retina = true;
    image.ratio = 1;
    if (groupName) {
        let ratio = /@(\d+)x$/gi.exec(groupName);
        if (ratio) {
            ratio = ratio[1];
            while (ratio > 10) {
                ratio = ratio / 10;
            }
            image.ratio = ratio;
        }
    }
    return Promise.resolve(groupName);
}

export function spritesOnUpdateRule(isDev, rule, comment, image){
    var spriteUrl = image.spriteUrl;
    image.spriteUrl = '/public/' + spriteUrl;
    postcssSprites.updateRule(rule, comment, image);
}

export function spritesOnSaveSpritesheet(isDev, opts, groups) {
    let file = postcssSprites.makeSpritesheetPath(opts, groups);
    return file;
}




