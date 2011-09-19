dojo.provide("webdemo.Canvas");

dojo.require("dojo.DeferredList");

dojo.declare("webdemo.Canvas", null, {
    WIDTH: 640,
    HEIGHT: 480,
    SCALE: 1,
    canvas: null,
    context: null,
    bufcvs: null,
    bufctx: null,

    running: false,
    lastTime: null,
    frames: 0,

    effects: ['Starfield'],//['Colorcycle'],//['Rotzoom', 'Plasma1', 'Line'],
    curFX: null,

    constructor: function(canvas) {
        this.context = canvas.getContext('2d');
        this.canvas = canvas;
        canvas.width = this.WIDTH * this.SCALE;
        canvas.height = this.HEIGHT * this.SCALE;

//        this.bufcvs = dojo.create('canvas');
//        this.bufcvs.width = this.WIDTH;
//        this.bufcvs.height = this.HEIGHT;
//        this.bufctx = this.bufcvs.getContext('2d');
        this.bufcvs = this.canvas;
        this.bufctx = this.context;
        this.context.mozImageSmoothingEnabled = false;
        this.bufctx.mozImageSmoothingEnabled = false;
        this.context.globalCompositeOperation = 'copy';

        // requestAnimationFrame shim with setTimeout fallback
        window.requestAnimFrame = (function(){
            return  window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    window.oRequestAnimationFrame ||
                    window.msRequestAnimationFrame ||
                    function(/* function FrameRequestCallback */ callback,
                             /* DOMElement Element */ element){
                        window.setTimeout(callback, 1000 / 60);
                    };
        })();
    },

    start: function() {
        dojo.create('button', {
            onclick: 'webdemo.__demo.stop()',
            innerHTML: 'Stop'
        }, dojo.body());
        this.running = true;
        this.lastTime = Date.now();
        this.run();
    },
    run: function() {
        if (!this.running) return;

        if (!this.curFX) {
            var fxname = this.effects.shift();
            if (!fxname) {
                this.running = false;
                dojo.byId('status').innerHTML = 'Stopped.';
                return;
            }
            var module = "webdemo." + fxname;
            dojo.require(module);
            this.curFX = new webdemo[fxname](this);
        }

        this.tick();
        this.render();

        var passedTime = (Date.now() - this.lastTime)/1000;
        if (passedTime >= 2) {
            var fps = this.frames / passedTime <<0;
            dojo.byId('status').innerHTML = "" + fps + " FPS";
            this.frames = 0;
            this.lastTime = Date.now();
        }
        this.frames++;

        requestAnimFrame(dojo.hitch(this, 'run'), dojo.byId('canvas'));
    },

    stop: function() {
        this.running = false;
        dojo.byId('status').innerHTML = 'Stopped.';
    },

    tick: function() {
        //this.bufctx.clearRect(0, 0, this.WIDTH, this.HEIGHT);
        //this.context.clearRect(0, 0, this.WIDTH * this.SCALE, this.HEIGHT * this.SCALE);
        var go_on = this.curFX.tick(this.bufctx);
        if (!go_on) this.curFX = null;
    },

    render: function() {
        //this.context.drawImage(this.bufcvs, 0, 0, this.WIDTH, this.HEIGHT, 0, 0, this.WIDTH * this.SCALE, this.HEIGHT * this.SCALE);

    },

    loadResources: function() {
        var images = ['lightbulb', 'tile'];

        var list = images.map(function(name) {
            var img = dojo.create('img');
            var dfd = new dojo.Deferred();
            var con = dojo.connect(img, 'onload', function(evt) {
                var canvas = dojo.create('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                var ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                var pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);

                webdemo.__resources.images[name] = {img: img, data: pixels};
                dojo.disconnect(con);
                dfd.resolve();
            });
            img.src = "res/gfx/" + name + ".png";
            return dfd;
        });

        return new dojo.DeferredList(list);
    }
});

