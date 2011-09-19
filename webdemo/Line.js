dojo.provide("webdemo.Line");

dojo.declare("webdemo.Line", null, {
    index: null,
    colors: null,
    frames: 0,
    coords: null,
    NUM: 200,
    times: 3,
    constructor: function(demo) {
        var width = demo.bufcvs.width;
        var height = demo.bufcvs.height;
        this.index = [];
        this.colors = [];
        var base = 255 / this.NUM;
        for (var i = 0; i <= this.NUM; i++) {
            var col = base * i <<0;
            this.colors[i] = col;

            col = col.toString(16);
            if (col.length == 1) col = "0" + col;

            this.index[i] = '#' + col + col + col;
        }
        this.init(width, height);
    },

    init: function(width, height) {
        var coords = [];
        var fx = 1 + Math.random() * 10;
        var fy = 1 + Math.random() * 10;
        var offset = 1 + Math.random() * 10;
        var ox = width/2, oy = height / 2, radius = height /2;

        for (var pos = 0; pos <= 25; pos += 0.02) {
            coords.push([
                [ (ox + radius * (Math.cos(pos/fx) * Math.sin(pos))) <<0,
                  (oy + radius * (Math.sin(pos/fy) * Math.cos(pos))) <<0
                ],
                [ (ox + radius * (Math.cos(pos/fx) * Math.sin(pos + offset))) <<0,
                  (oy + radius * (Math.sin(pos/fy) * Math.cos(pos + offset))) <<0
                ]
            ]);
        }

        this.coords = coords;
    },

    tick: function(ctx) {
        var canvas = ctx.canvas;
        var width = canvas.width;
        var height = canvas.height;
        index = this.index;
        var pixels = ctx.createImageData(canvas.width, canvas.height);
        var frames = this.frames;
        var fired = false;
        for (var i = this.NUM; i >= 0; i-=2) {
            var pair = this.coords[frames-i];
            if(!pair) continue;
            //console.log("test");
            fired = true;
            var col = this.colors[i];
            this.linedraw2(pixels, pair[0][0], pair[1][0], pair[0][1], pair[1][1], col);
        }
        this.frames++;

        if(!fired) {
            this.frames = 0;
            this.times--;
            this.init(width, height)
        }
        ctx.putImageData(pixels, 0, 0);

        return this.times;
    },

    linedraw2: function(pixels, x0, x1, y0, y1, col) {
        var width = 4 * pixels.width;
        var data = pixels.data;
        var temp, adjup, adjdown, error, xadv, dx, dy, whole, initpc, finalpc, i, runlen;
        var pos;

        if (y0 > y1) {
            temp = y0; y0 = y1; y1 = temp;
            temp = x0; x0 = x1; x1 = temp;
        }

        pos = 4 * x0 + y0 * width;

        if ((dx = x1 - x0) < 0) {
            xadv = -4;
            dx = -dx;
        }
        else {
            xadv = 4;
        }

        dy = y1 - y0;

        if (dx == 0) {
            for (i = 0; i <= dy; i++) {
                data[pos] = col;
                data[pos+1] = col;
                data[pos+2] = col;
                data[pos+3] = 255;

                pos += width;
            }
            return;
        }

        if (dy == 0) {
            for (i = 0; i <= dx; i++) {
                data[pos] = col;
                data[pos+1] = col;
                data[pos+2] = col;
                data[pos+3] = 255;

                pos += xadv;
            }
            return;
        }

        if (dx == dy) {
            for (i = 0; i <= dx; i++) {
                data[pos] = col;
                data[pos+1] = col;
                data[pos+2] = col;
                data[pos+3] = 255;

                pos += xadv + width;
            }
            return;
        }

        if (dx > dy) {
            whole = dx / dy <<0;

            adjup = (dx % dy) * 2;
            adjdown = dy * 2;

            error = (dx % dy) - (dy * 2);

            initpc = (whole >> 1) + 1;
            finalpc = initpc;

            if ((adjup == 0) && ((whole & 0x01) == 0)) {
                initpc--;
            }

            if ((whole & 0x01) != 0) {
                error += dy;
            }

            pos = this.drawhorizontal(data, pos, width, xadv, initpc, col);

            for (i = 0; i < (dy -1); i++) {
                runlen = whole;
                if ((error += adjup) > 0) {
                    runlen++;
                    error -= adjdown;
                }
                pos = this.drawhorizontal(data, pos, width, xadv, runlen, col);
            }
            pos = this.drawhorizontal(data, pos, width, xadv, finalpc, col);
            return;
        }
        else {
            whole = dy / dx <<0;
            adjup = (dy % dx) * 2;
            adjdown = dx * 2;
            error = (dy % dx) - (dx * 2);
            initpc = (whole >> 1) + 1;
            finalpc = initpc;

            if ((adjup == 0) && ((whole & 0x01) == 0)) {
                initpc--;
            }

            if ((whole & 0x01) != 0) {
                error += dx;
            }

            pos = this.drawvertical(data, pos, width, xadv, initpc, col);

            for (i = 0; i < (dx -1); i++) {
                runlen = whole;
                if ((error += adjup) > 0) {
                    runlen++;
                    error -= adjdown;
                }
                pos = this.drawvertical(data, pos, width, xadv, runlen, col);
            }
            pos = this.drawvertical(data, pos, width, xadv, finalpc, col);
            return
        }
    },

    drawhorizontal: function(data, pos, width, xadv, runlen, col) {
        var i;
        var workpos = pos;

        for (i = 0; i < runlen; i++) {
            data[workpos] = col;
            data[workpos+1] = col;
            data[workpos+2] = col;
            data[workpos+3] = 255;

            workpos += xadv;
        }
        return workpos + width;
    },

    drawvertical: function(data, pos, width, xadv, runlen, col) {
        var i;
        var workpos = pos;

        for (i = 0; i < runlen; i++) {
            data[workpos] = col;
            data[workpos+1] = col;
            data[workpos+2] = col;
            data[workpos+3] = 255;

            workpos +=  width;
        }
        return workpos + xadv;
    },

    linedraw1: function(pixels, x0, x1, y0, y1, col) {
        var steep = Math.abs(y1 - y0) > Math.abs(x1 - x0);
        var tmp;
        if (steep) {
            tmp = x0; x0 = y0; y0 = tmp;
            tmp = x1; x1 = y1; y1 = tmp;
        }
        if (x0 > x1) {
            tmp = x0; x0 = x1; x1 = tmp;
            tmp = y0; y0 = y1; y1 = tmp;

        }
        var deltax = x1 - x0;
        var deltay = Math.abs(y1 - y0);

        var error = deltax >> 1;
        var ystep = (y0 < y1) ? 1 : -1;
        var y = y0;

        for (var x = x0; x <= x1; x++) {
            steep ? this.plot(pixels, y,x, col) : this.plot(pixels, x, y, col);
            error -= deltay;
            if (error < 0) {
                y += ystep;
                error += deltax
            }
        }

    },

    linedraw: function(pixels, x0, x1, y0, y1, col) {
        var dx, dy, stepx, stepy, counter;
        dx = x1 - x0;
        dy = y1 - y0;
        if (dx < 0) {
            dx = -dx;
            stepx = -1;
        }
        else {
            stepx = 1;
        }

        if (dy < 0) {
            dy = -dy;
            stepy = -1;
        }
        else {
            stepy = 1;
        }

        this.plot(pixels, x0, y0, col);

        dx <<= 1;
        dy <<= 1;

        if (dx > dy) {
            counter = dx;

            while (x0 != x1) {
                if (counter <= 0) {
                    y0 += stepy;
                    counter += dx;
                }

                x0 += stepx;

                counter -= dy;

                this.plot(pixels, x0, y0, col);
            }
        }
        else {
            counter = dy >> 1;
            while (y0 != y1) {
                if (counter <= 0) {
                    x0 += stepx;
                    counter += dy;
                }

                y0 += stepy;
                counter -= dx;

                this.plot(pixels, x0, y0, col);
            }
        }
    },

    plot: function(pixels, x, y, col) {
        //console.log("plot x/y/col: " + [x,y,col]);
        var off = (x + y * pixels.width) * 4;
        pixels.data[off] =  pixels.data[off+1] = pixels.data[off+2] = col;
        pixels.data[off+3] = 255;
    }
});

