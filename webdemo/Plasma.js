dojo.provide("webdemo.Plasma");

dojo.declare("webdemo.Plasma", null, {
    constructor: function(demo) {
    },
    tick: function(ctx) {
        var canvas = ctx.canvas;
        var width = canvas.width;
        var height = canvas.height;
        var pixels = ctx.createImageData(width, height);
        var data = pixels.data;

        ctx.putImageData(pixels, 0, 0);
    },

    plasma: function(data, width, height) {
        
    },
});
