'use strict';

/* Polyfil */

if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(searchString, position){
      position = position || 0;
      return this.substr(position, searchString.length) === searchString;
  };
}

var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

var cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

/* Animation data */
var animFrame;
var loopCount = 0;
var loopTotal = 1;
var getWidthOfText;
var tagline_gap;
var ie_tagline_gap_add = 2;
var scaler = 1;
var stampSize = 10;
var stampsStr  = "[[211,132],[209,128],[206,123],[206,116],[206,114],[206,110],[207,104],[210,100],[211,98],[214,93],[216,91],[220,90],[226,90],[227,90],[235,94],[237,95],[238,100],[241,103],[243,108],[243,114],[243,120],[241,124],[240,130],[239,132],[235,134],[233,135],[230,137],[228,138],[227,139],[221,139],[220,139],[219,138],[164,67],[170,67],[176,67],[180,68],[184,67],[187,67],[195,68],[199,67],[205,67],[211,67],[216,67],[221,67],[227,67],[237,67],[242,66],[248,67],[251,67],[256,67],[262,68],[270,68],[277,68],[281,68],[283,67],[286,68],[162,73],[161,77],[161,81],[161,85],[160,92],[160,96],[160,103],[160,107],[160,112],[159,118],[159,123],[159,126],[160,135],[160,136],[160,144],[159,146],[160,149],[288,71],[286,79],[289,84],[289,89],[289,92],[289,97],[288,97],[288,103],[290,114],[291,118],[290,124],[290,129],[289,134],[288,137],[287,145],[287,146],[286,146],[165,148],[172,148],[176,147],[180,147],[185,147],[190,147],[197,147],[198,147],[206,147],[210,147],[214,147],[220,147],[222,147],[227,147],[229,147],[232,147],[235,146],[238,146],[242,146],[245,146],[248,146],[253,146],[257,145],[267,145],[267,145],[274,145],[278,147],[281,147],[281,147],[284,146]]";

var stampsArr = JSON.parse(stampsStr);
var stampsACounter = 0;
var sx = 0;
var sy = 0;
var offsetX = 0;
var offsetY = 0;

/* Variables */
var _iA = {
    amex_logo: "images/logo.png",
    amex_headline: "images/headline.png",
    copy1: "images/copy1.png",
    tcs_copy1: "images/tcs.png",
    cta_copy1: "images/cta.png",
    rd_text: "images/rd_text.png",
    rd_canvas_offset: "0,0",
    rd: "images/rd.png",
    background: "images/background.jpg",
    cta_text: "Search Sale",
    tcs: "",
    tagline_word1: "book&nbsp;travel",
    tagline_word2: "live&nbsp;life",  
    tagline_word3: "",
    tagline_end: "WITHOUT IT<sup><small>&nbsp;MD<small></sup>",
    tagline_start: "DON'T",
    text3: "",
    text2: "",
    text1: "",
    backgroundZoomTime: "3.0",
    backgroundZoom: "0.82",
    city: "GENERIC"
}

var rd_image = new Image();
var add = document.getElementById("add");

var text1 = document.getElementById("text1");
var text2 = document.getElementById("text2");
var text3 = document.getElementById("text3");
var text4 = document.getElementById("text4");

var tagline1 = document.getElementById("tagline1");
var tagline2 = document.getElementById("tagline2");
var tagline3 = document.getElementById("tagline3");
var text_tcs = document.getElementById("text_tcs");
var cta_text = document.getElementById("cta_text");
var bg = document.getElementById("bg");
var rd_text = document.getElementById("rd_text");
var amex_logo = document.getElementById("amex_logo");
var amex_headline = document.getElementById("amex_headline");

var cv = document.getElementById('myCanvas');
var ctx = cv.getContext('2d');
var tl = new TimelineLite({id:"animateAdd"});

document.getElementById("exit").addEventListener("click", function(e){
        Enabler.exit('Exit');
});

/* Load image to canvas */
function makeStamp(x,y) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, stampSize, 0, Math.PI * 2, false);
    //stamps.push([x,y])
    ctx.clip();
    ctx.drawImage(rd_image, 0, 0);
    ctx.restore();
}

function animateStamps() {
        var k = stampsACounter;
        var nx = scaler*stampsArr[k][0]-sx;
        var ny = scaler*stampsArr[k][1]-sy;
        makeStamp(nx,ny);
        stampsACounter++;
}

function loadImageToCanvas(url,co) {
    rd_image.src = url;
    cv.style.left = co[0]+'px';
    cv.style.top = co[1]+'px';
    rd_text.style.left = co[0]+'px';
    rd_text.style.top = co[1]+'px';
    rd_image.onload = function() {
        //console.log('image:',url,'loaded to canvas');
        ctx.drawImage(this, 0, 0, 300, 250);
        var co = getBounds();
        ctx.clearRect(0, 0, 300, 250);
        console.log(co.x1,co.y1,co.rw,co.rh);
//                rd_text.style.width = co.rw + "px";
//                rd_text.style.height = co.rh + "px";
//                rd_text.style.left = co.x1+'px';
//                rd_text.style.top = co.y1+'px';
        //
        // 144
        // 65
        sx = offsetX - co.x1;
        sy = offsetY - co.y1;
        animateAdd();
        setBg();
        add.style.display = "block";
    }
}

/* Tools */
function getBounds() {
    //console.log('getBounds()');
    var w = cv.width;
    var h = cv.height;
    var ctx = cv.getContext('2d');
    //ctx.drawImage(this, 0, 0, w, h);
    var idata = ctx.getImageData(0, 0, w, h),
        buffer = idata.data,
        buffer32 = new Uint32Array(buffer.buffer),
        x, y,
        x1 = w, y1 = h, x2 = 0, y2 = 0;
    for(y = 0; y < h; y++) {
        for(x = 0; x < w; x++) {
            if (buffer32[x + y * w] > 0) {
                if (x < x1) x1 = x;
            }
        }
    }
    for(y = 0; y < h; y++) {
        for(x = w; x >= 0; x--) {
            if (buffer32[x + y * w] > 0) {
                if (x > x2) x2 = x;
            }
        }
    }
    for(x = 0; x < w; x++) {
        for(y = 0; y < h; y++) {
            if (buffer32[x + y * w] > 0) {
                if (y < y1) y1 = y;
            }
        }
    }
    for(x = 0; x < w; x++) {
        for(y = h; y >= 0; y--) {
            if (buffer32[x + y * w] > 0) {
                if (y > y2) y2 = y;
            }
        }
    }
    ctx.save();
    //ctx.beginPath();
    //ctx.arc(x, y, 10, 0, Math.PI * 2, false);
    //stamps.push([x,y])
    //ctx.clip();
    //ctx.drawImage(rd_image, 0, 0);
    //ctx.restore();
    ctx.strokeStyle = '#f00';
    ctx.strokeRect(x1+0.5, y1+0.5, x2-x1, y2-y1);
    var rw = x2-x1;
    var rh = y2-y1;
    var co = {}
    co.x1 = x1;
    co.x2 = x2;
    co.y1 = y1
    co.rw = rw;
    co.rh = rh;
    //console.log(co);
    return co;
}
function getBox(id) {
    var rect = document.getElementById(id).getBoundingClientRect();
   return rect;
}
function getBoxObj(r) {
    var rect = r.getBoundingClientRect();
   return rect;
}
function eqEl(id1,id2) {
    var r1 = document.getElementById(id1);
    var r2 = document.getElementById(id2);
    var rect1 = r1.getBoundingClientRect();
    var rect2 = r2.getBoundingClientRect();
    var x = rect1.x;
    r2.style.left = x+'px';
    r2.style.position = 'absolute';
}
function getWidthOfText(txt, fontname, fontsize) {
    if (getWidthOfText.c === undefined) {
        getWidthOfText.c = document.createElement('canvas');
        getWidthOfText.ctx = getWidthOfText.c.getContext('2d');
    }
    getWidthOfText.ctx.font = fontsize + ' ' + fontname;
    return getWidthOfText.ctx.measureText(txt).width;
}
function getFontSize(text, targetWidth, font) {
    if (getFontSize.c === undefined) {
        getFontSize.c = document.createElement('canvas');
        getFontSize.ctx = getFontSize.c.getContext('2d');
    }
    var size = 1;
    getFontSize.ctx.font = size + 'px ' + font;
    while (getFontSize.ctx.measureText(text).width < targetWidth) {
        size++;
        getFontSize.ctx.font = size + 'px ' + font;
    }
    return size;
}
function calcWidth(str,sw,id) {
    var r = document.getElementById('test_'+id);
    r.innerHTML = str;
    r.rw = 0;
    r.k = 150;
    r.i = 0;
/*    for(r.i=0; r.i<r.k; r.i++) {
        r.style.fontSize = r.i+'px';
        r.rect = r.getBoundingClientRect();
        r.fw = parseInt(r.rect.width)
        if(r.fw >= sw-4 && r.fw < sw+4) {
            //console.log(i,fw,sw,r.style.fontSize);
            r.rw = r.style.fontSize;
        }
    }*/
    while (r.fw < sw+4) {
        r.style.fontSize = r.i+'px';
        r.rect = r.getBoundingClientRect();
        r.fw = parseInt(r.rect.width);
    }
    r.rw = r.style.fontSize;
    //console.log(id,r.rw)
    return r.rw;
}
function setTag(id,sw) {
    var r = document.getElementById(id);
    var str = r.innerText;
    r.style.fontSize = getFontSize(str, sw, 'BetterTimes')+'px';
        //calcWidth(str,sw,id);
    console.log(id,str,r.style.fontSize);
}
function setTags() {
    $('.endings').css('left',$('.begs').width() + tagline_gap + 'px');
    // setTag('vampire1',tagline_gap);
    // setTag('vampire2',tagline_gap);
    // setTag('vampire3',tagline_gap);
    console.log( $('.endings').css('left'));
}
function setBg() {
      scaler = 1;
      _iA.backgroundZoom = 0.95;
      stampSize = 10;
      var bg = document.getElementById("bg");
      bg.style.width = "300px";
      bg.style.height = "250px";
      bg.style.left = "0px";
      bg.style.top = "0px";
      bg.style.transformOrigin = "85% 8%"
  }
function setup() {
    console.log('setup');
    //console.log('on("instantads")');
    bg.style.backgroundImage = "url(" + _iA.background + ")";
    //rd.style.backgroundImage = "url(" + _iA.rd + ")";
    amex_logo.style.backgroundImage = "url(" + _iA.amex_logo + ")";
    amex_headline.style.backgroundImage = "url(" + _iA.amex_headline + ")";
    rd_text.style.backgroundImage = "url(" + _iA.rd_text + ")";
    
    text1.style.backgroundImage = "url(" + _iA.copy1 + ")";
//    text2.style.backgroundImage = "url(" + _iA.copy2 + ")";
//    text3.style.backgroundImage = "url(" + _iA.copy3 + ")";    
    
    //
    tagline_gap = parseInt(_iA.tagline_gap);
    //
      tagline1.innerHTML = '<div class="begs" id="beg1">'+_iA.tagline_start+'</div><div class="vampire" id="vampire1">&nbsp;'+_iA.tagline_word1+'&nbsp;</div><div class="endings" id="ending1">'+_iA.tagline_end+'</div>';
      tagline2.innerHTML = '<div class="begs" id="beg2">'+_iA.tagline_start+'</div><div class="vampire" id="vampire2">&nbsp;'+_iA.tagline_word2+'&nbsp;</div><div class="endings" id="ending2">'+_iA.tagline_end+'</div>';
      tagline3.innerHTML = '<div class="begs" id="beg3">'+_iA.tagline_start+'</div><div class="vampire" id="vampire3">&nbsp;'+_iA.tagline_word3+'&nbsp;</div><div class="endings" id="ending3">'+_iA.tagline_end+'</div>';
    
      text_tcs.style.backgroundImage = "url(" + _iA.tcs_copy1 + ")";
    
    
      cta.style.backgroundImage = "url(" + _iA.cta_copy1 + ")";
    
    var canvas_offset = _iA.rd_canvas_offset.split(',');
    loadImageToCanvas(_iA.rd,canvas_offset);
    if($.browser.ie == true) {
        console.log('IE!!! - instantads')
        tagline_gap = tagline_gap + ie_tagline_gap_add;
        setTags();
        $('.endings').css('left',$('.begs').width() + tagline_gap + 'px');
    } else {
        console.log($.browser)
    }
};
function checkLoops() {
    if (loopCount >= loopTotal) {
        console.log("don't loop");
    } else {
        console.log("loop again");
        loopCount++;
        restartAdd();
    }
}

/* super test comment */

var tagline1, endline, tagline3, tagline1chars;

function restartAnimate() {
    stampsACounter = 0;
    animate();
}

function restartAdd() {
    //setTimeout(restartAnimate,3000);
    ctx.clearRect(0, 0, 300, 250);
    tl.restart();
}

function updateGap() {
	$('.endings').css('left',$('.begs').width() + tagline_gap + 'px');
}

function animateAdd() {

    tagline1 = new SplitText("#tagline1", {type:"words"});
    endline = new SplitText("#ending1", {type:"words"});
    tagline3 = new SplitText("#tagline3", {type:"words"});
    tagline1chars = new SplitText("#vampire1", {type:"chars"});
    
    TweenLite.set("#tagline1", {perspective:400,opacity:1});
    TweenLite.set("#tagline2", {perspective:400,opacity:1});
    TweenLite.set("#tagline3", {perspective:400,opacity:1});
    
    TweenLite.set("#vampire2", {perspective:400});
    TweenLite.set("#vampire3", {perspective:400});
    
    tl.from(text1,0.5,{opacity:0},"+=0");

    tl.to("#blueCover",0.25,{opacity:0},"+=0");
    tl.to(text1,0.5,{opacity:1},"+=1.1");
    tl.from(text_tcs,0.5,{opacity:0},"-=0.5");
    
    tl.to(text1,0.5,{opacity:0, onComplete:function() {
        restartAnimate();
    }},"+=1.6");
    
    tl.to(text_tcs,0.5,{opacity:0},"-=0.5");
    
    
    tl.from(rd_text,1,{opacity:0},"-=0.3");

    tl.add(updateGap,"+=0")
    
    // IE11 patch
    if($.browser.ie == true) {
        console.log('IE!!!')
        //tl.add(setTags,"+=0");
    } else {
        console.log($.browser)
        tl.add(setTags,"+=0");
    }
    
    tl.from("#beg1", 0.4, {opacity:0, y:"-=0", rotationX:90, transformOrigin:"50% 50% -20"},"+=0");
    tl.staggerFrom(tagline1chars.chars, 0.1, {opacity:0,scale:0}, 0.06, "-=0.25");
    tl.staggerFrom(endline.words, 0.4, {opacity:0, y:"-=0", rotationX:90, transformOrigin:"50% 50% -10"}, 0.1, "-=0.25");
    
    if(_iA.tagline_word1.startsWith('l') == true) {
        tl.to(tagline1.words[tagline1.words.length-1],0.2,{opacity:1},"-=0.5");
    } else {
        tl.to(tagline1.words[tagline1.words.length-1],0.2,{opacity:0},"-=0.5");
    }    
    
    //
    if(_iA.tagline_word2 != '') {
        tl.staggerTo(tagline1chars.chars, 0.3, {opacity:0, y:"+=20", rotationX:-90, transformOrigin:"50% 50% 10"}, 0, "+=1.2");
        tl.from("#vampire2", 0.4, {opacity:0, y:"-=0", rotationX:90, transformOrigin:"50% 50% -20"},"-=0.3");
        
        if(_iA.tagline_word2.startsWith('l') == true) {
            tl.to(tagline1.words[tagline1.words.length-1],0.2,{opacity:1},"-=0.5");
        } else {
            tl.to(tagline1.words[tagline1.words.length-1],0.2,{opacity:0},"-=0.5");
        }
    }
    
    //
    if(_iA.tagline_word3 != '') {
        tl.to("#vampire2", 0.3, {opacity:0, y:"+=20", rotationX:-90, transformOrigin:"50% 50% 10"}, "+=1.5");
        tl.from("#vampire3", 0.4, {opacity:0, y:"-=0", rotationX:90, transformOrigin:"50% 50% -20"},"-=0.3");
        
        if(_iA.tagline_word3.startsWith('l') == true) {
            tl.to(tagline1.words[tagline1.words.length-1],0.2,{opacity:1},"-=0.5");
        } else {
            tl.to(tagline1.words[tagline1.words.length-1],0.2,{opacity:0},"-=0.5");
        }
    }
    
    tl.fromTo(bg,_iA.backgroundZoomTime,{rotationZ:0.01, scale:1.2, transformOrigin:"50% 0%"},{scale:1, onComplete:function() {
        
    }},"-="+tl.duration());
    
    tl.add(checkLoops,"+=4");
    
}

function sp(n) {
    document.getElementById('preview').style.backgroundImage = "url('preview/"+n+".png')"; document.getElementById('preview').style.opacity = "0.75";
}

function init() {
    if (!Enabler.isInitialized()) {
        Enabler.addEventListener(studio.events.StudioEvent.INIT, enablerInitialized);
    }
    else {
        enablerInitialized();
    }
    function enablerInitialized() {
        if (!Enabler.isVisible()) {
            Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, adVisible);
        }
        else {
            adVisible();
        }
    }
    function adVisible() {
        setup();
    }
}


function animate() {
    //console.log('-');
    animateStamps();
    animFrame = requestAnimationFrame(animate);
    
    if(stampsACounter >= stampsArr.length) {
        console.log('animFrame', animFrame);
        cancelAnimationFrame(animFrame);
        return;
    }
}

window.onload = function(){
    init();
}