console.log('editor loaded - remove for production versions!!!')
var stamps = [];
var stampsCounter = 0;

function getClickPosition() {
    var x = event.clientX; // Get the horizontal coordinate
    var y = event.clientY; // Get the vertical coordinate
    var co = [x, y];
    makeStamp(x, y)
    stamps.push([x,y])
    console.log(co)
    //nextFrame()
}

document.getElementById('preview').style.backgroundImage = "url('images/n.png')";

function nextFrame() {
    document.getElementById('editor').style.backgroundImage = "url('rd_anim/frames/fr_" + stampsCounter + ".png')";
   
}

function sp(n) {
    document.getElementById('preview').style.backgroundImage = "url('preview/"+n+".jpg')";
     document.getElementById('preview').style.opacity = "0.75";
}

document.body.addEventListener("click", function () {
    getClickPosition();
}, false);

function print_arrow_key(keyCodeNumber) {
    console.log(keyCodeNumber)
    nextFrame();
    if (keyCodeNumber == 39) {
        stampsCounter++
    }
    if (keyCodeNumber == 37) {
        stampsCounter--
    }
}

var stampsArr
function makeStampsArray() {
    stampsArr = JSON.stringify(stamps)
    console.log(stampsArr);
}


function checkKeycode(event) {
    // handling Internet Explorer stupidity with window.event
    // @see http://stackoverflow.com/a/3985882/517705
    var keyDownEvent = event || window.event,
        keycode = (keyDownEvent.which) ? keyDownEvent.which : keyDownEvent.keyCode;
    print_arrow_key(keycode);
    return false;
}

document.onkeydown = checkKeycode;