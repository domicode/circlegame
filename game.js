var level = 1
var score = 0


function nextLevel() {
  $("#nextlevel").click(function(event) {
    level += 1
    window.game = new Game(level, score);
    window.game.start();    
    });
  $("#restartlevel").click(function(event) {
    level = level;
    score = 0;
    window.game = new Game(level, score);
    window.game.start();    
  });
}





$(document).ready(function() {

  window.game = new Game(level, score);
  window.game.start();
  nextLevel();
    
});



function Circle() {

  this.diameter = game.minDiameter + Math.random() * 55;
  this.speed = game.maxSpeed + Math.random() * game.minSpeed;
  this.x = Math.random() * game.width-this.diameter;
  this.y = Math.random() * game.heigth-this.diameter;


  this.render = function() {
    var _this = this;
    this.$me = $('<div class="circle"></div>')
    .css("left", this.x)
    .css("top", this.y)
    .css("width", this.diameter)
    .css("height", this.diameter)
    .css("background", rgb)
    .css("border-color", rgb)
    .on("mouseover", function() {
      _this.kill();
    });

    $("#gamefield").append(this.$me);
  };

  this.move = function() {
    var _this = this;
    this.$me.animate({
      top: Math.random() * game.heigth,
      left: Math.random() * game.width,
    }, {
        duration: this.speed,
        complete: function(){
        _this.move();
      }
    });
  };

  this.kill = function() {
    this.$me.css("background-color", "red")
      .effect({
        effect: "explode", 
        duration: 200,
        pieces: 30, 
        complete: function() {
          $(this).remove()
          window.score += 100
          $("#score").text("Score: " +window.score);
          $("#tocollect").text("Circles left: "+window.game.circleCount)
          if (window.game.circleCount == 0) {
            $("#win").show();
            $("#highlightCountdown").hide();
            clearTimeout(game.timeOut);
          }
        },
        queue: false
      });  
    window.game.circleCount -=1;
  }
}



function Game(level, score) {

  this.heigth = $(window).height()+30;
  this.width = $(window).width()+30;
  var level = level;
  var amount = Math.floor((this.heigth*this.width)/18000*(1+level*0.05));
  this.minDiameter = 25;
  this.time =  Math.floor(amount*(600/(1+level*0.15)));
  this.maxSpeed = 4000/(level/4);
  this.minSpeed = 10000/(level/4);
  this.circles = [] 
  this.circleCount = amount;
  score = score
  timer(this.time);

  // Mobile optimization
  if(mobile()) {
    amount = amount/4;
    this.minDiameter = 70;
  };


  Circle.init = function() {
    var circle = new Circle();
    circle.render();
    circle.move();
    return circle;
  };


  this.start = function() {
    for (var i = 0; i < this.circleCount; i++) {
      this.circles.push(Circle.init());
    }    
    this.timeOut = setTimeout(this.stop, this.time);

    timer(this.time);
    $("#tocollect").text("Circles left: "+amount);
    $("#score").text("Score: " +window.score);
    $("#level").text("Level: "+ level);
    $("#highlightCountdown").show();
    $("#win").hide()
    $("#lost").hide()
  };



  this.stop = function() {
    for (var i = 0; i < amount; i++) {
      window.game.circles[i].$me.remove();
    }
    if (window.game.circleCount != 0) {
      $("#lost").show();
      $("#highlightCountdown").hide();
    }
  }

}


//mobile check 

function mobile() {
  if (screen.availTop == 0) {
    return true;
  }
}


// countdown function 
function timer(time) {

  $('#highlightCountdown').removeClass('highlight'). 
    countdown('option', {until: +time/1000-1}); 

  $('#highlightCountdown').countdown({until: +0, 
      onTick: highlightLast5,
      format: 'S'}); 
       
  function highlightLast5(periods) { 
      if ($.countdown.periodsToSeconds(periods) === 5) { 
          $(this).addClass('highlight'); 
      } 
  } 
};


   

// Random color selector
function rgb() {
  var r = Math.floor(Math.random()*255);
  var g = Math.floor(Math.random()*255);
  var b = Math.floor(Math.random()*255);
  var rgb = "rgb("+r+","+g+","+b+")"
  return rgb
}


