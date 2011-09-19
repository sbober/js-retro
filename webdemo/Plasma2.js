dojo.provide("webdemo.Plasma2");

dojo.declare("webdemo.Plasma2", null, {
    constructor:  function(demo) {
    },

    tick: function(ctx) {
        var canvas = ctx.canvas;
        var width = canvas.width;
        var height = canvas.height;
        var pixels = ctx.createImageData(width, height);
        var data = pixels.data;

        ctx.putImageData(pixels, 0, 0);
    },

    plasma: function() {

    }

    render_add: function(ctx, x1, y1, x2, y2) {
        var helperimgdata = helperimg != null ? helperimg.data : null;
        var k = 0;

        x1 = Math.round(x1 + dim);
        y1 = Math.round(y1 + dim);
        x2 = Math.round(x2 + dim);
        y2 = Math.round(y2 + dim);

        /* common for loop begin */
        var y1_minus_i, y2_minus_i, dist, comb, diff, color;
        for (var i = 0; i < dim; i += 1) {
            /* optimize y coord difference by only looking it up as it changes */
            y1_minus_i = pow2[y1 - i];
            y2_minus_i = pow2[y2 - i];
            for (var j = 0; j < dim; j += 1) {
                comb = diff = sqrttbl[pow2[x1 - j] + y1_minus_i];
                dist = sqrttbl[pow2[x2 - j] + y2_minus_i];
                comb += dist;
                diff -= dist;

                color = colortbl1[((comb & 0x80 ? comb : ~comb) + (diff & 0x80 ? diff : ~diff)) & 0x1ff];
                helperimgdata[k++] = color[0];
                helperimgdata[k++] = color[1];
                helperimgdata[k++] = color[2];
                k++;
            }
        }

        if (ctx.globalAlpha == 1.0)
            ctx.putImageData(helperimg, 0, 0);
        else {
            /* putImageData ignores global alpha */
            helpercanvasctx.putImageData(helperimg, 0, 0);
            /* drawImage, in contrast, uses it, so we get our motion blur. */
            ctx.drawImage(helpercanvas, 0, 0);
        }
    },

});
