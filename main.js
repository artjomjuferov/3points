window.gravity = 10; // гравитационная постоянная
window.dt = 0.01; // шаг по времени
window.time = 20;
window.points = new Array(3);
window.run = false;
window.pathPoints = new Array();

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
    }else if (window.points[1] === undefined){
      window.points[1] = (new Point(x, y, "blue"));
      $(".second-point").children(".coords").children(".x-coord").val(x);
      $(".second-point").children(".coords").children(".y-coord").val(y);
    }else if (window.points[2] === undefined){
      window.points[2] = (new Point(x, y, "green"));
      $(".third-point").children(".coords").children(".x-coord").val(x);
      $(".third-point").children(".coords").children(".y-coord").val(y);
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
    this.vx = 0.5-Math.random();
  } else{
    this.vx = _vx;
  } 
  
  if (_vy === undefined){
    this.vy = 0.5-Math.random();
  } else{
    this.vy = _vy;
  }
    
  if (_m === undefined){
    this.m = Math.random();
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
      var dx = points[j].x - points[i].x; 
      var dy = points[j].y - points[i].y;
      var fabs = (gravity * points[i].m * points[j].m)/(dx*dx + dy*dy);
      points[i].forceX = points[i].forceX + fabs * dx * Math.sqrt(dx*dx + dy*dy);
      points[i].forceY = points[i].forceY + fabs * dy * Math.sqrt(dx*dx + dy*dy);
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
    
    points[i].vx += dvx;
    points[i].vy += dvy;
    
    points[i].forceX = 0;
    points[i].forceY = 0;
    
  }
};

// class TESTER, for comparing results aproximate solution with exact solution 

// m(А)=m(Б)=m(В)
// все 3(А, Б, В) тела на одной прямой с одним весом, и АБ=БВ и тело Б всегда на месте, скорости нулевые
// A и В движуться по прямой 
// return средне арефметическую погрешность отклонение от прямой А и Б
var onOneLine = function(iterationN, massN, dt, gravity){
  var error = 0;
  
  for(var j = 1; j <= massN; j++){ 
    var p = [];
    
    p[0] = new Point(10,10,"some",0,0,j);
    p[1] = new Point(20,20,"some",0,0,j);
    p[2] = new Point(30,30,"some",0,0,j);
    
    for(var i = 0; i < iterationN; i++){
      CalcForcesSimple(p, gravity);
      MovePoints(p, dt);
      for(var k = 0; k < p.length; k++){
        var tmp = p[k].x/p[k].y;
        error += Math.abs(1-tmp);
      }
    }
  }
  return error/(iterationN*massN);
}

// m(А)=m(Б)=m(В)
// все 3(А, Б, В) тела на одной прямой с одним весом, и АБ=БВ и тело Б всегда на месте, v(Б) = (0,0), v(А)=v(В) = random() 
// return средне арефметическую погрешность всегда Б на месте
var onOneLine = function(iterationN, massN, dt, gravity){
  var error = 0;
  
  for(var j = 1; j <= massN; j++){ 
    var p = [];
    
    var vx1 = (1-Math.random())*100;
    var vy1 = (1-Math.random())*100;
    var vx3 = (1-Math.random())*100;
    var vy3 = (1-Math.random())*100;
    
    p[0] = new Point(10,10,"some",vx1,vy1,j);
    p[1] = new Point(20,20,"some",0,0,j);
    p[2] = new Point(30,30,"some",vx3,vx3,j);
    
    for(var i = 0; i < iterationN; i++){
      CalcForcesSimple(p, gravity);
      MovePoints(p, dt);
      for(var k = 0; k < p.length; k++){
        var tmp = (Math.abs(p.x-20)+Math.abs(p.y-20))/2;
        error += tmp;
      }
    }
  }
  return error/(iterationN*massN);
}