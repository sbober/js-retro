dojo.provide("webdemo.Colorcycle");

dojo.declare("webdemo.Colorcycle", null, {
    red: null,
    green: null,
    blue: null,
    xstart: null,
    ystart: null,
    xadv: 3,
    yadv: 2,
    constructor: function(demo) {
        var width = demo.bufcvs.width;
        var height = demo.bufcvs.height;
        this.xstart = width / 2 <<0;
        this.ystart = height / 2 <<0;

        this.red = new Uint8Array(4*width*height);
        this.green = new Uint8Array(4*width*height);
        this.blue = new Uint8Array(4*width*height);

        for (var y = 0; y < 2 * height; y++) {
            for (var x = 0; x < 2 * width; x++) {
                // calculate sine based on distance
                var x2 = x - width;
                var y2 = y - height;
                var d = Math.sqrt(x2*x2 + y2*y2);
                var b = Math.sin(d/6.0);

                // calculate RGB values based on sine
                var r = b * 200;
                var g = 100 + b * 100;
                var b = 235 + b * 20;
                var off = x + y * 2 * width;

                this.red[off] = Math.max(0, Math.min(255, r));
                this.green[off] = Math.max(0, Math.min(255, g));
                this.blue[off] = Math.max(0, Math.min(255, b));
            }
        }


    },

    tick: function(ctx) {
        var canvas = ctx.canvas;
        var width = canvas.width;
        var height = canvas.height;
        var pixels = ctx.createImageData(width, height);
        var data = pixels.data;
        this.circles(data, width, height);
        ctx.putImageData(pixels, 0, 0);

        this.xstart += this.xadv;
        this.ystart += this.yadv;

        if (this.xstart <= 0 || this.xstart >= width) this.xadv = -this.xadv;
        if (this.ystart <= 0 || this.ystart >= height) this.yadv = -this.yadv;
        return true;
    },

    circles: function(data, width, height) {
        var pos = 0; // index position into imagedata array

        // walk left-to-right, top-to-bottom; it's the
        // same as the ordering in the imagedata array:

        var xstart = this.xstart, ystart = this.ystart,
            red = this.red, green = this.green, blue = this.blue;
        var xend = width + xstart;
        var yend = height + ystart;
        var off = xstart + 2 * width * ystart;;
        for (var y = ystart; y < yend; y++) {
            for (var x = xstart; x < xend; x++) {

                off++;
                // set red, green, blue, and alpha:
                data[pos++] = red[off];
                data[pos++] = green[off];
                data[pos++] = blue[off];
                data[pos++] = 0xff; // alpha
            }
            off += width;
        }
    }
});
