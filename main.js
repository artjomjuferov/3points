window.gravity = 10; // гравитационная постоянная
window.dt = 2.7; // шаг по времени
window.time = 150;
window.points = new Array(3);
window.run = false;
window.pathPoints = new Array();
window.pathPoints2 = new Array();
window.points2 = new Array(3);
window.fMax = 1;

$(document).ready(function(){
  window.canvas = document.getElementById('myCanvas'); 
  window.canvas2 = document.getElementById('myCanvas2'); 


  $("#myCanvas").click(function(ev){
    var ctx = window.canvas.getContext('2d');
    ctx.clearCanvas(window.canvas);

    var x = ev.pageX - window.canvas.offsetLeft;
    var y = ev.pageY - window.canvas.offsetTop;
  
    if (window.points[0] === undefined){
      window.points[0] = (new Point(x, y, "red"));
      window.points2[0] =  $.extend({}, window.points[0]);
      $(".first-point").children(".coords").children(".x-coord").val(x);
      $(".first-point").children(".coords").children(".y-coord").val(y);
      $(".first-point").children(".v-coords").children(".x-coord").val(window.points[0].vx);
      $(".first-point").children(".v-coords").children(".y-coord").val(window.points[0].vy);
      $(".first-point").children(".v-coords").children(".x-coord").val(window.points[0].vx);
      $(".first-point").children(".weight").val(window.points[0].m);
    }else if (window.points[1] === undefined){
      window.points[1] = (new Point(x, y, "blue"));
      window.points2[1] =  $.extend({}, window.points[1]);
      $(".second-point").children(".coords").children(".x-coord").val(x);
      $(".second-point").children(".coords").children(".y-coord").val(y);
      $(".second-point").children(".v-coords").children(".x-coord").val(window.points[1].vx);
      $(".second-point").children(".v-coords").children(".y-coord").val(window.points[1].vy);
      $(".second-point").children(".weight").val(window.points[1].m);
    }else if (window.points[2] === undefined){
      window.points[2] = (new Point(x, y, "green"));
      window.points2[2] =  $.extend({}, window.points[2]);
      $(".third-point").children(".coords").children(".x-coord").val(x);
      $(".third-point").children(".coords").children(".y-coord").val(y);
      $(".third-point").children(".v-coords").children(".x-coord").val(window.points[2].vx);
      $(".third-point").children(".v-coords").children(".y-coord").val(window.points[2].vy);
      $(".third-point").children(".weight").val(window.points[2].m);
    }else{
      alert("3 points already exist");
    }

    ctx.drawAllPoints(window.points, window.pathPoints);
    window.canvas2.getContext('2d').drawAllPoints(window.points, window.pathPoints2);
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
    
    var ctx2 = window.canvas2.getContext('2d');
    ctx2.clearCanvas(window.canvas2);
    
    window.pathPoints = [];
    
    window.canvas.getContext('2d').drawAllPoints(window.points, window.pathPoints);
    
    window.pathPoints2 = [];
    window.canvas2.getContext('2d').drawAllPoints(window.points2, window.pathPoints2);
    
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

  $("#lagrande").click(function(){
      window.points[0] = (new Point(100, 300, "red", 0, 1, 1));
      window.points2[0] =  $.extend({}, window.points[0]);
      $(".first-point").children(".coords").children(".x-coord").val(window.points[0].x);
      $(".first-point").children(".coords").children(".y-coord").val(window.points[0].y);
      $(".first-point").children(".v-coords").children(".x-coord").val(window.points[0].vx);
      $(".first-point").children(".v-coords").children(".y-coord").val(window.points[0].vy);
      $(".first-point").children(".weight").val(window.points[0].m);
      window.points[1] = (new Point(200, 300, "blue", 0, 0, 10));
      window.points2[1] =  $.extend({}, window.points[1]);
      $(".second-point").children(".coords").children(".x-coord").val(window.points[1].x);
      $(".second-point").children(".coords").children(".y-coord").val(window.points[1].y);
      $(".second-point").children(".v-coords").children(".x-coord").val(window.points[1].vx);
      $(".second-point").children(".v-coords").children(".y-coord").val(window.points[1].vy);
      $(".second-point").children(".weight").val(window.points[1].m);
      window.points[2] = (new Point(300, 300, "green", 0, -1, 1));
      window.points2[2] =  $.extend({}, window.points[2]);
      $(".third-point").children(".coords").children(".x-coord").val(window.points[2].x);
      $(".third-point").children(".coords").children(".y-coord").val(window.points[2].y);
      $(".third-point").children(".v-coords").children(".x-coord").val(window.points[2].vx);
      $(".third-point").children(".v-coords").children(".y-coord").val(window.points[2].vy);
      $(".third-point").children(".weight").val(window.points[2].m);
      window.canvas.getContext('2d').drawAllPoints(window.points, window.pathPoints);
    
      window.canvas2.getContext('2d').drawAllPoints(window.points2, window.pathPoints2);  
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
    ctx.drawAllPoints(window.points, window.pathPoints);
    
    ctx = window.canvas2.getContext('2d');
    ctx.drawAllPoints(window.points2, window.pathPoints2);
  });

});

var addToPathArr = function(point, pathPoints) {
  var x = point.x;
  var y = point.y;
  var color;
  if (point.color === "green"){
    color = "#CEF6C1";
  }else if (point.color === "red"){
     color = "#F1AAA2";
  }else {
     color = "#A2B1F1";
  }
  var newPoint = new Point(x, y, color);
  pathPoints.push(newPoint);
};



CanvasRenderingContext2D.prototype.drawPoint = function (point, r){
  this.beginPath();
  this.fillStyle = point.color;
  this.strokeStyle = point.color;
  this.arc(point.x, point.y, r, 0, 2 * Math.PI, false);
  this.fill();
  this.stroke();
};
CanvasRenderingContext2D.prototype.drawAllPoints = function (points, pathPoints){
  for (var x in pathPoints) {
      this.drawPoint(pathPoints[x], 1);
  }
  
  for (var i = 0; i < points.length; i++) {
      if (points[i] !== undefined){
        this.drawPoint(points[i], 5);
        addToPathArr(points[i], pathPoints);
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

var CalcForces = function(points){
   for (var i = 0; i < points.length; i++) {
    for (var j = 0; j < points.length; j++) {
      if ((i == j) || (points[i] === undefined) || (points[j] === undefined)){
        continue;
      } 
      var dx = points[j].x - points[i].x,
          dy = points[j].y - points[i].y,
          r = Math.sqrt(dx * dx + dy * dy),
          fabs = window.gravity * points[i].m * points[j].m / (r*r);
  
      points[i].forceX += fabs * dx / r;
      points[i].forceY += fabs * dy / r;
    }
  }
};

// ds/dt = v
// dv/dt = a
var a = function(i, points, parX, parY){
  var acc = new P(0, 0);
  
  var fX =0, fY=0;
  for (var j = 0; j < 3; j++) {
    if (i == j) continue;
    
    var dx = points[j].x - (points[i].x + parX),
        dy = points[j].y - (points[i].y + parY),
        r = Math.sqrt(dx * dx + dy * dy),
        fabs = window.gravity * points[i].m * points[j].m / (r*r);
    
    fX += fabs * dx / r;
    fY += fabs * dy / r;
  }
  acc.x = fX/points[i].m;
  acc.y = fY/points[i].m;
  return acc;
}


var EulerMethod = function(points){
  for (var i = 0; i < points.length; i++) {

    var acc = a(i, points,0,0);
    
    points[i].x += (points[i].vx + acc.x * window.dt/2) * window.dt;
    points[i].y += (points[i].vy + acc.y * window.dt/2) * window.dt;
    
    points[i].vx += acc.x * window.dt;
    points[i].vy += acc.y * window.dt;
  }
};


var EulerMethodBetter = function(points){
  CalcForces(points);
  for (var i = 0; i < points.length; i++) {
    if (points[i] === undefined){
      continue;
    }
    
    var aX = points[i].forceX/points[i].m;
    var aY = points[i].forceY/points[i].m;
    
    points[i].x += (points[i].vx + aX*window.dt/2) * window.dt;
    points[i].y += (points[i].vy + aY*window.dt/2) * window.dt;
    
    points[i].vx += aX*window.dt;
    points[i].vy += aY*window.dt;
    
    points[i].forceX = 0;
    points[i].forceY = 0;
    
  }
};


function P(_x, _y){
  this.x = _x;
  this.y = _y;
}


var CalcAndDraw = function(points){
 
  // first method
  var ctx = window.canvas.getContext('2d');
  ctx.clearCanvas(window.canvas);
  RungaKut(points);
  ctx.drawAllPoints(points, window.pathPoints);
  
  // second method
  ctx = window.canvas2.getContext('2d');
  ctx.clearCanvas(window.canvas2);
  EulerMethod(window.points2);
  ctx.drawAllPoints(window.points2, window.pathPoints2);
};

function getMass(points){
  var mass={x:0,y:0};
  for(var i=0;i<3;i++){
    mass.x += points[i].m*points[i].x;
    mass.y += points[i].m*points[i].y;
  }
  mass.x /= 3;
  mass.y /= 3;
  return mass;
}

function functionName(fun) {
  var ret = fun.toString();
  ret = ret.substr('function '.length);
  ret = ret.substr(0, ret.indexOf('('));
  return ret;
}

function TestM(funcSolve, points){
  // initial v must be nil
  console.log("\nЗакон сохранения центра масс");
  var normal = getMass(points);
  var result = {x:0, y:0};
  for(var i=0;i<10000;i++){
    funcSolve(points);
    var m = getMass(points);
    result.x += (normal.x-m.x)*(normal.x-m.x); 
    result.y += (normal.y-m.y)*(normal.y-m.y);
  }
  result.x = Math.sqrt(result.x);
  result.y = Math.sqrt(result.y);
  console.log(result);
  return result;
}

function getI(points){
  var mass={x:0,y:0};
  for(var i=0;i<3;i++){
    mass.x += points[i].m*points[i].vx;
    mass.y += points[i].m*points[i].vy;
  }
  return mass;
}
function TestI(funcSolve, points){
  console.log("\nЗакон сохранения импульса");
  var normal = getI(points);
  var result = {x:0, y:0};
  for(var i=0;i<10000;i++){
    funcSolve(points);
    var m = getI(points);
    result.x += (normal.x-m.x)*(normal.x-m.x); 
    result.y += (normal.y-m.y)*(normal.y-m.y);
    // console.log(result);
  }
  result.x = Math.sqrt(result.x);
  result.y = Math.sqrt(result.y);
  console.log(result);
  return result;
}


// m(А)=m(Б)=m(В)
// все 3(А, Б, В) тела на одной прямой с одной массой, и АБ=БВ и тело Б всегда на месте, скорости нулевые
// A и В движуться по прямой 
var TestOnOneLine = function(method, points){
  var error = 0;
  for(var j = 1; j <= 10000; j++){ 
      method(points);
      var tmp = p[0].x/p[0].y;
      for(var k = 1; k < 2; k++){
        error += (tmp-p[k].x/p[k].y)*(tmp-p[k].x/p[k].y);
      }
  }
  return Math.Sqrt(error);
}


// var points = [];
// points[0] = (new Point(201, 301, "red", -0.2, 0, 1));
// points[1] = (new Point(100, 300, "green", 0.2, 0, 1));
// points[2] = (new Point(502, 304, "blue", 0, 0, 1));
// TestM(EulerMethod, points);

// points[0] = (new Point(201, 301, "red", -0.2, 0, 1));
// points[1] = (new Point(100, 300, "green", 0.2, 0, 1));
// points[2] = (new Point(502, 304, "blue", 0, 0, 1));
// TestM(EulerMethodBetter, points);























var RungaKut = function(points){
  CalcForces(points);
  
  // k1 = v
  // l1 = a(s)
  var k1X = [], k1Y = [], k2X = [], k2Y = [],
      l1X = [], l1Y = [], l2X = [], l2Y = [],
      k3X = [], k3Y = [], k4X = [], k4Y = [],
      l3X = [], l3Y = [], l4X = [], l4Y = [],
      acc;
    
  //k1
  for (var i = 0; i < 3; i++) {
    k1X[i] = points[i].vx;
    k1Y[i] = points[i].vy; 
    
    acc = a(i, points, 0 ,0 );
    l1X[i] = acc.x;
    l1Y[i] = acc.y;
  }
  
  //k2
  for (var i = 0; i < 3; i++) {
    k2X[i] = points[i].vx + l1X[i]*window.dt/2;
    k2Y[i] = points[i].vy + l1Y[i]*window.dt/2; 
  
    acc = a(i, points, l1X[i]*window.dt/2, l1Y[i]*window.dt/2);
    l2X[i] = acc.x;
    l2Y[i] = acc.y;
  }
  
  
  //k3
  for (var i = 0; i < 3; i++) {
    k3X[i] = points[i].vx + l2X[i]*window.dt/2;
    k3Y[i] = points[i].vy + l2Y[i]*window.dt/2; 
  
    acc = a(i, points, l2X[i]*window.dt/2, l2Y[i]*window.dt/2);
    l3X[i] = acc.x;
    l3Y[i] = acc.y;
  }
   
  //k4
  for (var i = 0; i < 3; i++) {
    k4X[i] = points[i].vx + l3X[i]*window.dt;
    k4Y[i] = points[i].vy + l3Y[i]*window.dt; 
    
    acc = a(i, points, l3X[i]*window.dt, l3Y[i]*window.dt);
    l4X[i] = acc.x;
    l4Y[i] = acc.y;
  }
   
  
  for (var i = 0; i < 3; i++) {
    points[i].x += window.dt*(k1X[i]+2*k2X[i]+2*k3X[i]+k4X[i])/6;
    points[i].y += window.dt*(k1Y[i]+2*k2Y[i]+2*k3Y[i]+k4Y[i])/6;
    points[i].vx += window.dt*(l1X[i]+2*l2X[i]+2*l3X[i]+l4X[i])/6;
    points[i].vy += window.dt*(l1Y[i]+2*l2Y[i]+2*l3Y[i]+l4Y[i])/6;
  }
};