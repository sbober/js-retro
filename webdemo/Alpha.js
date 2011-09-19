dojo.provide("webdemo.Alpha");

dojo.declare("webdemo.Alpha", null, {
    constructor: function(demo) {
    },
    tick: function(ctx) {
        var canvas = ctx.canvas;
        var width = canvas.width;
        var height = canvas.height;
//        ctx.fillStyle = 'rgba(255,255,255,1)';
//        ctx.fillRect(0, 0, width, height);
        var pixels = ctx.createImageData(width, height);
        var data = pixels.data;

        this.alpha(data, width, height);

        ctx.putImageData(pixels, 0, 0);
        return true;
    },

    alpha: function(data, width, height) {
        for (var y = 30; y <= 40; y++) {
            for (var x = 0; x < width; x++) {
                var off = 4 * (x + y * width) + 3;
                data[off] = x & 255;
            }
        }
    }
});
