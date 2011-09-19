dojo.provide("webdemo.Rotzoom");

dojo.declare("webdemo.Rotzoom", null, {
    roto: null,
    roto2: null,
    // image  needs to be 256x256
    tile: null,
    path: 0,
    zpath: 0,

    constructor: function(demo) {
        this.tile = webdemo.__resources.images.tile.data.data;
        this.roto = new Int32Array(256);
        this.roto2 = new Int32Array(256);

        for (var i = 0; i < 256; i++) {
            var rad = i * 1.41176 * 0.0174532;
            var c = Math.sin(rad);
            this.roto[i] = (c + 0.8) * 4096;
            this.roto2[i] = (2 * c) * 4096;
        }

    },
    tick: function(ctx) {
        var canvas = ctx.canvas;
        var width = canvas.width, height = canvas.height;
        var pixels = ctx.createImageData(width, height);
        var data = pixels.data;
        var path  = this.path, zpath = this.zpath;

        this.drawTile(
            data,
            this.roto[path], this.roto[(path + 128) & 255], this.roto2[zpath],
            width, height);

        this.path = (path - 1) & 255;
        this.zpath = (zpath + 1) & 255;

        ctx.putImageData(pixels, 0, 0);
        return true;
    },

    drawTile: function(data, stepx, stepy, zoom, width, height) {
        var tile = this.tile;

        var x, y, i,j, xd, yd, a, b, sx, sy, off, pos;

        pos = 0;
        sx = sy= 0;
        xd = (stepx * zoom) >> 12;
        yd = (stepy * zoom) >> 12;

        for (j = 0; j < height; j++) {
            x = sx; y = sy;
            for (i = 0; i < width; i++) {
                a = x >> 12 & 255;
                b = y >> 12 & 255;

                off = 4 * (b * 256 + a);
                data[pos++] = tile[off];
                data[pos++] = tile[off+1];
                data[pos++] = tile[off+2];
                data[pos++] = tile[off+3];

                x += xd; y += yd;
            }
            sx -= yd; sy += xd;
        }

    }
});
