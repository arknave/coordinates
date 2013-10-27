var colors = {
    black: '#313131',
    white: '#FFFFFF',
    gray:  'rgba(104, 104, 104, 0.5)'
}

function CanvasState() {
    this.canvas = document.getElementsByTagName('canvas')[0];
    this.ctx    = this.canvas.getContext('2d');
    
    this.MARGIN = 2;
    this.left = this.MARGIN;
    this.top = this.MARGIN;
    this.right = this.canvas.width - this.MARGIN;
    this.bottom = this.canvas.height - this.MARGIN;

    this.center = [(this.right + this.left) >> 1, (this.bottom + this.top) >> 1]; 
    this.clear();
}

CanvasState.prototype.clear = function() {
    this.ctx.fillStyle = colors.white;
    this.ctx.fillRect(0, 0, this.width, this.height);
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

function R2(cs) {
    this.step = 1;
    this.stepWidth = 30;
    this.drawAxes(cs);
    this.drawGrid(cs);
}

R2.prototype.drawAxes = function(cs) {
    cs.drawHorizontalLine(cs.center[1], 3.5, 'round', colors.black);
    cs.drawVerticalLine(cs.center[0], 3.5, 'round', colors.black);
}

R2.prototype.drawGrid = function(cs) {
    for(var xpos = cs.center[0]-this.stepWidth; xpos > cs.left; xpos -= this.stepWidth) {
        cs.drawVerticalLine(xpos, 1.5, 'square', colors.gray);
    }

    for(var xpos = cs.center[0]+this.stepWidth; xpos < cs.right; xpos += this.stepWidth) {
        cs.drawVerticalLine(xpos, 1.5, 'square', colors.gray);
    }

    for(var ypos = cs.center[1]-this.stepWidth; ypos > cs.top; ypos -= this.stepWidth) {
        cs.drawHorizontalLine(ypos, 1.5, 'square', colors.gray);
    }

    for(var ypos = cs.center[1]+this.stepWidth; ypos < cs.bottom; ypos += this.stepWidth) {
        cs.drawHorizontalLine(ypos, 1.5, 'square', colors.gray);
    }
}

var cs = new CanvasState();
var r = new R2(cs);
