dojo.provide("webdemo.Starfield");

dojo.declare("webdemo.Starfield", null, {
    NUM: 1024,
    centerx: null,
    centery: null,
    stars: null,
    constructor: function(demo) {
        this.stars = [];
        for (var i = 0; i < this.NUM; i++) {
            this.init_star(i);
        }
    },

    init_star: function(i) {
        var no = i;
        i++;
        this.stars[no] = {
            xpos: (-10 + 20 * Math.random()) * 3072,
            ypos: (-10 + 20 * Math.random()) * 3072,
            zpos: i,
            speed: 2 + (2 * Math.random() <<0),
//            color: 255 - (i >> 2)
            color: i >> 2
        };
    },

    tick: function(ctx) {
        var canvas = ctx.canvas;
        var width = canvas.width;
        var height = canvas.height;

        var pixels = ctx.createImageData(width, height);
        var data = pixels.data;

        this.starfield(data, width, height);

        ctx.putImageData(pixels, 0, 0);
        return true
    },

    starfield: function(data, width, height) {
        var centerx = width >> 1;
        var centery = height >> 1;
        var pos = -1;
        var i = width * height;
        while (i--) {
            data[pos+=4] = 255;
        }

        var stars = this.stars;
        var star, tempx, tempy;
        for (var i = 0; i < this.NUM; i++) {
            star = stars[i];
            star.zpos -= star.speed;

            if (star.zpos <= 0) this.init_star(i);

            tempx = Math.floor((star.xpos / star.zpos) + centerx);
            tempy = Math.floor((star.ypos / star.zpos) + centery);

            if (tempx < 0 || tempx >= width || tempy < 0 || tempy >= height) {
                this.init_star(i);
                continue;
            }


            var off = 4 * (tempy * width + tempx);
            data[off+3] = star.color;
//            data[ off ] = star.color;
//            data[ off + 1 ] = star.color;
//            data[ off + 2] = star.color;

        }

    },
});
