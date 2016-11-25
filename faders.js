// An extremely simple demo of the flowing points visualization.
// public domain method demo by Terry Brown, terrynbrown@gmail.com

// get canvas element and size
var canv = document.getElementById('fade_canv');
var width = parseFloat(canv.width);
var height = parseFloat(canv.height);

var faders_n = 250;   // faders to show
var faders = [];      // list of active faders
var fader_age = 200;  // max. age of a fader

function new_fader() {
    // return a new fader
    return {
        // position across canvas, 0-1
        pos: Math.random(),
        // vertical offset
        offs: (0.5-Math.random())*height*0.2,
        age: 0,
        speed: 0.5
    };
}

// create initial faders
for (var i=0; i<faders_n; i++) {
    faders.push(new_fader());
    // randomize ages so they're not synchronized
    faders[faders.length-1].age = Math.random()*fader_age;
}

var ctx = canv.getContext('2d');

function fade() {
    for (var f=0; f<faders_n; f++) {
        var fader = faders[f];
        var x = fader.pos * width;
        // convert canvas position to angle in range pi to 3*pi
        var a = fader.pos*2*Math.PI + Math.PI;
        var y = fader.offs + Math.sin(a) * height*0.3 + height/2;
        // red brightness relative to speed
        var c = parseInt(256*fader.speed*1.2);
        // opacity also relative to speed
        var o = fader.speed
        // draw a colored dot
        ctx.fillStyle = "rgba("+c+",255,255,"+o+")"
        ctx.fillRect(x, y, 1, 1);
        // move the fader along, wrap if needed
        fader.pos += fader.speed / width;
        if (fader.pos > 1) {
            fader.pos -= 1;
        }
        // accelerate by cosine
        fader.speed += 0.002 * Math.cos(a);
        // replace fader if aged out
        fader.age += 1;
        if (fader.age > fader_age) {
            faders[f] = new_fader();
        }
    }
    
    // decrease opacity across the image
    var imageData = ctx.getImageData(0, 0, width, height);
    data = imageData.data;
    for(var i = 0; i < data.length; i += 4) {
        // data[i], [i+1], [i+2], [i+3], are R, G, B, and alpha
        // either
        data[i + 3] = Math.max(0, data[i + 3]-1);
        // or (this never fades to clear)
        // data[i + 3] *= 0.97;
    }
    ctx.putImageData(imageData, 0, 0);
    
    // use timeout to loop, otherwise display doesn't update
    setTimeout(fade, 0);
}

fade();
