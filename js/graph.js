(function() {
    var requestAnimationFrame = window.requestAnimationFrame 
                             || window.mozRequestAnimationFrame
                             || window.oRequestAnimationFrame 
                             || window.webkitRequestAnimationFrame 
                             || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

var colors = {
    black: '#313131',
    white: '#FFFFFF',
    gray:  'rgba(104, 104, 104, 0.5)',
    blue:  '#59FFED',
    lavender: '#b7a6ee'
}

function CanvasState() {
    var MARGIN = 2;
    var canvas = document.getElementsByTagName('canvas')[0];
    var offset = [canvas.offsetLeft, canvas.offsetTop];
    this.ctx    = canvas.getContext('2d');
    
        //moving state
    this.moving = false;
    this.clickStart = null;
    this.clickEnd   = null;
    //prevent accidentally selecting text
    canvas.addEventListener('selectstart', function(e) { e.preventDefault(); return false; }, false);
    //get a copy of the context, and then...
    var context = this;
    //mouse time!
    canvas.addEventListener('mousedown', function(e) {
        context.moving = true;
        context.clickStart = [e.pageX-offset[0], e.pageY-offset[1]];
    }, true);
    
    canvas.addEventListener('mousemove', function(e) {
        if(context.moving) {
            context.clickEnd = [e.pageX-offset[0], e.pageY-offset[1]];
            context.center[0] += (context.clickEnd[0] - context.clickStart[0]);
            context.center[1] += (context.clickEnd[1] - context.clickStart[1]);
            context.clickStart = context.clickEnd.slice();
        }
    });

    canvas.addEventListener('mouseup', function(e) {
        context.moving = false;
        context.clickStart = null;
        context.clickEnd = null;
    }, true);

    this.clear = function() {
        this.ctx.fillStyle = colors.white;
        this.ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    this.onResize = function() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        this.left = MARGIN;
        this.top = MARGIN;
        this.right = canvas.width - MARGIN;
        this.bottom = canvas.height - MARGIN;
        this.center = [(this.right + this.left) >> 1, (this.bottom + this.top) >> 1]; 
    }

    this.onResize();
    this.clear();
}

CanvasState.prototype.drawHorizontalLine = function(ypos, lineWidth, lineCap, strokeStyle) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.left, ypos);
    this.ctx.lineTo(this.right, ypos);
    
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = lineCap;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke(); 
}

CanvasState.prototype.drawVerticalLine = function(xpos, lineWidth, lineCap, strokeStyle) {
    this.ctx.beginPath();
    this.ctx.moveTo(xpos, cs.top);
    this.ctx.lineTo(xpos, cs.bottom);
    
    this.ctx.lineWidth = lineWidth;
    this.ctx.lineCap = lineCap;
    this.ctx.strokeStyle = strokeStyle;
    this.ctx.stroke(); 
}

CanvasState.prototype.drawVector = function(v) {
    this.ctx.beginPath();
    this.ctx.moveTo(this.center[0], this.center[1]);
    this.ctx.lineTo(this.center[0] + 30*v.x, this.center[1] - 30*v.y);
    
    this.ctx.lineWidth = 2.5;
    this.ctx.lineCap = 'round';
    this.ctx.strokeStyle = colors.lavender;
    this.ctx.stroke();
}

function R2(cs) {
    this.step = 1;
    this.stepWidth = 30;
    this.cs = cs;
    this.drawAll();
}

R2.prototype.drawAxes = function() {
    this.cs.drawHorizontalLine(this.cs.center[1], 3.5, 'round', colors.black);
    this.cs.drawVerticalLine(this.cs.center[0], 3.5, 'round', colors.black);
}

R2.prototype.drawGrid = function() {
    for(var xpos = this.cs.center[0]-this.stepWidth; xpos > cs.left; xpos -= this.stepWidth) {
        this.cs.drawVerticalLine(xpos, 1.5, 'square', colors.gray);
    }

    for(var xpos = this.cs.center[0]+this.stepWidth; xpos < cs.right; xpos += this.stepWidth) {
        this.cs.drawVerticalLine(xpos, 1.5, 'square', colors.gray);
    }

    for(var ypos = this.cs.center[1]-this.stepWidth; ypos > cs.top; ypos -= this.stepWidth) {
        this.cs.drawHorizontalLine(ypos, 1.5, 'square', colors.gray);
    }

    for(var ypos = this.cs.center[1]+this.stepWidth; ypos < cs.bottom; ypos += this.stepWidth) {
        this.cs.drawHorizontalLine(ypos, 1.5, 'square', colors.gray);
    }
}

R2.prototype.drawAll = function() {
    requestAnimationFrame(this.drawAll.bind(this));
    this.cs.clear();
    this.drawGrid();
    this.drawAxes();
}

var cs = new CanvasState();
var r = new R2(cs);
window.onresize = cs.onResize;
