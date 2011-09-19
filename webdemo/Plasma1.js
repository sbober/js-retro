dojo.provide("webdemo.Plasma1");

dojo.declare("webdemo.Plasma1", null, {
    frames: 0,
    f: 0,
    dist: {},
    fadv: 1,
    solid: null,
    movx: null,
    movy: null,
    constructor: function(demo) {
        var width = demo.bufcvs.width;
        var height = demo.bufcvs.height;

        function dist(a, b, c, d) {
            return Math.sqrt((a - c) * (a - c) + (b - d) * (b - d));
        }
        var pos = 0;
        var solid = new Int16Array(width * height);
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                solid[pos++] = ((
                      Math.sin(dist(i, j, width / 5, height / 3.75) / 8.0)
                    + Math.cos(dist(i, j, width / 1.667, height / 2.4) / 8.0)
                ) * 64);
            }
        }

        var movx = new Int16Array(3 * width * height);
        pos = 0;
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < 3 * width; i++) {
                movx[pos++] = Math.cos(dist(i, j, width / 2.5, height / 1.875) / 8.0) * 64;
            }
        }

        var movy = new Int16Array(width * (height + 2 * width));
        pos = 0;
        for (var j = 0; j < height + 2 * width; j++) {
            for (var i = 0; i < width; i++) {
                movy[pos++] = Math.sin(dist(i, j, width/1.6667, height/3.75) / 7.0) * 64;
            }
        }

        this.solid = solid;
        this.movx = movx;
        this.movy = movy;
    },

    tick: function(ctx) {
        var canvas = ctx.canvas;
        var width = canvas.width;
        var height = canvas.height;
        var pixels = ctx.createImageData(width, height);
        var data = pixels.data;


        this.drawFrame(data, width, height);

        if (this.frames >= 2 * width || this.frames <= 0) this.fadv = - this.fadv;
        ctx.putImageData(pixels, 0, 0);
        return this.frames;
    },

    drawFrame: function(data, width, height) {
        var f = 0;
       
        var r = 0;
        var g = 0;
        var b = 0;

        var pos = 0;
        var solid = this.solid, movx = this.movx, movy = this.movy;
        var frames = this.frames;

        var ppos = 0;
        var posx = frames;
        var posy = frames * width;
        var w2 = 2*width;
        var y, x;
        y = height;
        while(y--) {
            x = width;
            while(x--) {
               f = 
                   movx[posx++] 
                   + movy[posy++] 
                   + solid[ppos++]
                   ;

//               if (f > this.f) this.f = f;
//               f = Math.round(f * 0x4000);
//               f <<= 8;
     
//               pos++;
                data[pos++] = (f & 0xff00) >> 8;
                data[pos++] = (f & 0xff);
//               data[pos++] = (f  & 0xff0000)  >> 16;
//               data[pos++] = (f & 0x00ff00) >> 8;

               pos++;
//               data[pos++] = (f & 0x0000ff);
//pos++;
               data[pos++] = 255;
               
           }
           posx += w2;
       }
      this.frames += this.fadv; 
//       this.frameNumber = this.frameNumber > ;
    }

});
