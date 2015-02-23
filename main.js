window.gravity = 10; // гравитационная постоянная
window.dt = 1; // шаг по времени
window.time = 100;
window.points = new Array(3);
window.run = false;
window.pathPoints = new Array();
window.fMax = 1;

$(document).ready(function(){
  window.canvas = document.getElementById('myCanvas'); 


  $("#myCanvas").click(function(ev){
    var ctx = window.canvas.getContext('2d');
    ctx.clearCanvas(window.canvas);

    var x = ev.pageX - window.canvas.offsetLeft;
    var y = ev.pageY - window.canvas.offsetTop;
  
    if (window.points[0] === undefined){
      window.points[0] = (new Point(x, y, "red"));
      $(".first-point").children(".coords").children(".x-coord").val(x);
      $(".first-point").children(".coords").children(".y-coord").val(y);
      $(".first-point").children(".v-coords").children(".x-coord").val(window.points[0].vx);
      $(".first-point").children(".v-coords").children(".y-coord").val(window.points[0].vy);
      $(".first-point").children(".v-coords").children(".x-coord").val(window.points[0].vx);
      $(".first-point").children(".weight").val(window.points[0].m);
    }else if (window.points[1] === undefined){
      window.points[1] = (new Point(x, y, "blue"));
      $(".second-point").children(".coords").children(".x-coord").val(x);
      $(".second-point").children(".coords").children(".y-coord").val(y);
      $(".second-point").children(".v-coords").children(".x-coord").val(window.points[1].vx);
      $(".second-point").children(".v-coords").children(".y-coord").val(window.points[1].vy);
      $(".second-point").children(".weight").val(window.points[1].m);
    }else if (window.points[2] === undefined){
      window.points[2] = (new Point(x, y, "green"));
      $(".third-point").children(".coords").children(".x-coord").val(x);
      $(".third-point").children(".coords").children(".y-coord").val(y);
      $(".third-point").children(".v-coords").children(".x-coord").val(window.points[2].vx);
      $(".third-point").children(".v-coords").children(".y-coord").val(window.points[2].vy);
      $(".third-point").children(".weight").val(window.points[2].m);
    }else{
      alert("3 points already exist");
    }

    ctx.drawAllPoints(window.points);
  });

  $("#stop").click(function () {
    stop();
    $('#status').html("stopped");
  });

  $("#reset").click(function () {
    stop();
    $('#status').html("stopped");
    
    var ctx = window.canvas.getContext('2d');
    ctx.clearCanvas(window.canvas);
    
    for (var x in window.pathPoints) {
      for (var y in window.pathPoints[x]){
        window.pathPoints[x][y] = undefined;
      }
      window.pathPoints[x] = undefined;
    }
    window.pathPoints = [];
    window.canvas.getContext('2d').drawAllPoints(window.points);
    
  });

  $("#start").click(function () {
    start();
    $("#status").html("running");
  });

  $(".dt").change(function(){
    window.dt = parseFloat($(this).val());    
  });
  $(".time").change(function(){
      window.time = parseFloat($(this).val());    
  });
  $(".gravity").change(function(){
    window.gravity = parseFloat($(this).val());
  });
  $(".dt").change(function(){
    window.dt = parseFloat($(this).val());
  });
  $(".fMax").change(function(){
    window.fMax = parseFloat($(this).val());
  });


  $(".add").click(function(){
    var form = $(this).parent();

    var ind = form.attr('class')[0];
    
    var x = form.children(".coords").children(".x-coord").val();
    var y = form.children(".coords").children(".y-coord").val();
    var vx = form.children(".v-coords").children(".x-coord").val();
    var vy = form.children(".v-coords").children(".y-coord").val();
    var m = form.children(".weight").val();
    
    if (vx === ""){
      vx = undefined;
    }else{
      vx = parseFloat(vx);
    }

    if (vy === ""){
      vy = undefined;
    }else{
      vy = parseFloat(vy);
    }

    if (m === ""){
      m = undefined;
    }else{
      m = parseFloat(m);
    }

    if (ind === "f"){
      window.points[0] = (new Point(x, y, "red", vx, vy, m));
    } else if (ind === "s"){
       window.points[1] = (new Point(x, y, "blue", vx, vy, m));
    } else if (ind === "t"){
       window.points[2] = (new Point(x, y, "green", vx, vy, m));
    }

    var ctx = window.canvas.getContext('2d');
    ctx.clearCanvas(window.canvas);
    ctx.drawAllPoints(window.points);
  });

});

var addToPathArr = function(point) {
  var x = point.x;
  var y = point.y;
  if (window.pathPoints[x] === undefined){
    window.pathPoints[x] = new Array();
  }
  var color;
  if (point.color === "green"){
    color = "#CEF6C1";
  }else if (point.color === "red"){
     color = "#F1AAA2";
  }else {
     color = "#A2B1F1";
  }
  var newPoint = new Point(x, y, color);
  window.pathPoints[x][y] = newPoint;
};

var CalcAndDraw = function(points){
  CalcForcesSimple(points, window.gravity);
  MovePoints(points, window.dt);

  var ctx = window.canvas.getContext('2d');
  ctx.clearCanvas(window.canvas);

  ctx.drawAllPoints(points);
};



CanvasRenderingContext2D.prototype.drawPoint = function (point, r){
  this.beginPath();
  this.fillStyle = point.color;
  this.strokeStyle = point.color;
  this.arc(point.x, point.y, r, 0, 2 * Math.PI, false);
  this.fill();
  this.stroke();
};
CanvasRenderingContext2D.prototype.drawAllPoints = function (points){
  for (var x in window.pathPoints) {
    for (var y in window.pathPoints[x]){
      this.drawPoint(window.pathPoints[x][y], 1);
    }
  }
  
  for (var i = 0; i < points.length; i++) {
      if (points[i] !== undefined){
        this.drawPoint(points[i], 5);
        addToPathArr(points[i]);
      } 
  };
  
 
};
CanvasRenderingContext2D.prototype.clearCanvas = function(canvas){
    this.clearRect(0, 0, canvas.width, canvas.height);
}

var stop = function(){
    if (window.run === true) {
        clearInterval(window.interval);
        window.run = false;
        return true;
    }
    return false;
}

var start = function(){
    if (window.run === false) {
        window.interval = setInterval(function(){
            CalcAndDraw(window.points);
        }, window.time);
        window.run = true;
        return true;
    }
    return false;
}

var reset = function(){
    window.run = false;
    clearInterval(window.interval);
    window.t = 0;
}

//////////////////////////////
////////issue 3 points//////// 
//////////////////////////////

function Point(_x, _y, _color, _vx, _vy, _m) {
  this.x =  Number(_x);
  this.y =  Number(_y);
  
  this.color = _color;
  
  if (_vx === undefined){
    this.vx = (0.5-Math.random())/100;
  } else{
    this.vx = _vx;
  } 
  
  if (_vy === undefined){
    this.vy = (0.5-Math.random())/100;
  } else{
    this.vy = _vy;
  }
    
  if (_m === undefined){
    this.m = (Math.random())*100;
  } else{
    this.m = _m;
  }

  this.forceX = 0;
  this.forceY = 0;
}

var CalcForcesSimple = function(points, gravity){
   for (var i = 0; i < points.length; i++) {
    for (var j = 0; j < points.length; j++) {
      if ((i == j) || (points[i] === undefined) || (points[j] === undefined)){
        continue;
      } 
      var dx = points[j].x - points[i].x,
          dy = points[j].y - points[i].y,
          r_2 = 1 / (dx * dx + dy * dy),
          r_1 = Math.sqrt(r_2),
          fabs = window.gravity * points[i].m * points[j].m * r_2;
  
      if (fabs > window.fMax)
          fabs = window.fMax; 
  
      points[i].forceX += fabs * dx * r_1;
      points[i].forceY += fabs * dy * r_1;
    }
  }
};

var MovePoints = function(points, dt){
  for (var i = 0; i < points.length; i++) {
    if (points[i] === undefined){
      continue;
    }
    
    var dvx = points[i].forceX * dt / points[i].m;
    var dvy = points[i].forceY * dt / points[i].m;
    
    points[i].x += (points[i].vx + dvx / 2) * dt;
    points[i].y += (points[i].vy + dvy / 2) * dt;
    
    points[i].vx = points[i].vx + dvx;
    points[i].vy = points[i].vy + dvy;
    
    points[i].forceX = 0;
    points[i].forceY = 0;
    
  }
};
