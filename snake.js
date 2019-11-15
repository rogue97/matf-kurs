var canvas = document.getElementById("board");
var context = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var clear = function() {
 context.fillStyle = "#2c3e50";
 context.fillRect(0, 0, canvas.width, canvas.height); 
};

var Position = function(x, y) {
  this.x = x;
  this.y = y;
  
  this.add = function(pos) {
    this.x += pos.x;
    this.y += pos.y;
  };
  
  this.clone = function() {
    return new Position(this.x, this.y);
  };
  
  this.bounds = function(x, y, width, height) {
    if(this.x < x || this.y < y || this.x > x + width || this.y > y + height)
      return false;
    return true;
  };
};


var Food = function(pos) {
  this.pos = pos;
  this.rad = 10;
  
  this.draw = function() {
    context.fillStyle = "#2980b9";
    context.beginPath();
    context.arc(this.pos.x, this.pos.y, this.rad, 0, 2*Math.PI);
    context.fill();
  };
}

var foods = [];

var Snake = function() {
  this.len = 1;
  this.parts = [new Position(parseInt(canvas.width/2), parseInt(canvas.height/2))];
  this.speed = 5;
  this.radius = 10;
  this.dir = new Position(this.speed, 0);
  this.movement = [this.dir.clone()];
  
  this.update = function() {
    for(var i = 0; i < this.len; i++) {
      this.parts[i].add(this.movement[i]);
      if(!this.parts[i].bounds(0, 0, canvas.width, canvas.height)) {
        return false;
      }
      
      for(var j = 0; j < i; j++) {
        if(this.parts[j].bounds(this.parts[i].x - this.speed+1, this.parts[i].y - this.speed+1, 2*this.speed-2, 2*this.speed-2))
          return false;
      }
    }
    
    for(var i = foods.length-1; i >= 0; i--) {
      if(this.parts[0].bounds(foods[i].pos.x-foods[i].rad, foods[i].pos.y-foods[i].rad, 2*foods[i].rad, 2*foods[i].rad)) {
         foods.splice(i, 1);
         this.grow();
         }
    }
    
    this.movement.pop();
    this.movement.unshift(this.dir.clone());
    return true;
  };
  
  this.draw = function() {
      context.fillStyle = "#c0392b";
    for(var i = 0; i < this.len; i++) {
      context.beginPath()
      context.arc(this.parts[i].x, this.parts[i].y, this.radius, 0, 2*Math.PI);
      context.fill();
    }
  };
  
  this.grow = function() {
    this.parts.unshift(new Position(this.parts[0].x + this.dir.x, this.parts[0].y + this.dir.y));
    this.movement.unshift(this.dir.clone());
    this.len++;
  };
  
  this.moveLeft = function() {
    this.dir = new Position(-this.speed, 0);
  };
  
  this.moveDown = function() {
    this.dir = new Position(0, this.speed);
  };
  
  this.moveUp = function() {
    this.dir = new Position(0, -this.speed);
  };
  
  this.moveRight = function() {
    this.dir = new Position(this.speed, 0);
  };
};

var steve = new Snake();

var random = function() {
  return new Position(Math.floor(Math.random() * (canvas.width)), Math.floor(Math.random() * (canvas.height)));
};

var draw = function() {
  clear();
  
  if(Math.random() > 0.99 || foods.length == 0) {
    foods.push(new Food(random()))
  }
  
  if(!steve.update()) {
    console.log("game over");
    steve = new Snake();
    foods = [];
  }
  steve.draw();
  
  for(var i = 0; i < foods.length; i++) {
    foods[i].draw();
  }
  
  requestAnimationFrame(draw);
};

window.addEventListener("keydown", function(e) {
  switch(e.keyCode) {
    case 37: steve.moveLeft();
            break;
    case 38: steve.moveUp();
            break;
    case 39: steve.moveRight();
            break;
    case 40: steve.moveDown();
            break;
                  }
});

draw();