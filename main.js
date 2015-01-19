window.gravity = 10; // гравитационная постоянная
window.dt = 0.1; // шаг по времени
window.time = 100;
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
      window.points[0] = (new Point(x, y,0, "red"));
      $(".first-point").children(".coords").children(".x-coord").val(x);
      $(".first-point").children(".coords").children(".y-coord").val(y);
      $(".first-point").children(".coords").children(".z-coord").val(0);
    }else if (window.points[1] === undefined){
      window.points[1] = (new Point(x, y,0, "blue"));
      $(".second-point").children(".coords").children(".x-coord").val(x);
      $(".second-point").children(".coords").children(".y-coord").val(y);
      $(".second-point").children(".coords").children(".z-coord").val(0);
    }else if (window.points[2] === undefined){
      window.points[2] = (new Point(x, y,0, "green"));
      $(".third-point").children(".coords").children(".x-coord").val(x);
      $(".third-point").children(".coords").children(".y-coord").val(y);
      $(".third-point").children(".coords").children(".z-coord").val(0);
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
    var z = form.children(".coords").children(".z-coord").val();
    var vx = form.children(".v-coords").children(".x-coord").val();
    var vy = form.children(".v-coords").children(".y-coord").val();
    var vz = form.children(".v-coords").children(".z-coord").val();
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
    if (vz === ""){
      vz = undefined;
    }else{
      vz = parseFloat(vz);
    }

    if (m === ""){
      m = undefined;
    }else{
      m = parseFloat(m);
    }

    if (ind === "f"){
      window.points[0] = (new Point(x, y, z, "red", vx, vy, vz, m));
    } else if (ind === "s"){
       window.points[1] = (new Point(x, y, z,"blue", vx, vy, vz, m));
    } else if (ind === "t"){
       window.points[2] = (new Point(x, y, z, "green", vx, vy, vz, m));
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
  var newPoint = new Point(x, y,0, color);
  window.pathPoints[x][y] = newPoint;
};

var CalcAndDraw = function(points){
  MovePoints(points, window.dt, window.gravity);

  var ctx = window.canvas.getContext('2d');
  ctx.clearCanvas(window.canvas);

  ctx.drawAllPoints(points);
  // $(".first-point").children(".coords").children(".x-coord").val(window.points[1].x);
  // $(".first-point").children(".coords").children(".y-coord").val(window.points[1].y);
  // $(".first-point").children(".coords").children(".z-coord").val(window.points[1].z);
  // $(".first-point").children(".v-coords").children(".x-coord").val(window.points[1].x);
  // $(".first-point").children(".v-coords").children(".y-coord").val(window.points[1].y);
  // $(".first-point").children(".v-coords").children(".z-coord").val(window.points[1].z);
  
  // $(".second-point").children(".coords").children(".x-coord").val(window.points[2].x);
  // $(".second-point").children(".coords").children(".y-coord").val(window.points[2].y);
  // $(".second-point").children(".coords").children(".z-coord").val(window.points[2].z);
  // $(".second-point").children(".v-coords").children(".x-coord").val(window.points[2].x);
  // $(".second-point").children(".v-coords").children(".y-coord").val(window.points[2].y);
  // $(".second-point").children(".v-coords").children(".z-coord").val(window.points[2].z);
  
  // $(".third-point").children(".coords").children(".x-coord").val(window.points[3].x);
  // $(".third-point").children(".coords").children(".y-coord").val(window.points[3].y);
  // $(".third-point").children(".coords").children(".z-coord").val(window.points[3].z);
  // $(".third-point").children(".v-coords").children(".x-coord").val(window.points[3].x);
  // $(".third-point").children(".v-coords").children(".y-coord").val(window.points[3].y);
  // $(".third-point").children(".v-coords").children(".z-coord").val(window.points[3].z);

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

function Point(_x, _y,_z, _color, _vx, _vy, _vz,_m) {
  this.x =  Number(_x);
  this.y =  Number(_y);
  this.z =  Number(_y);
  
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
  if (_vz === undefined){
    this.vz = 0.5-Math.random();
  } else{
    this.vz = _vz;
  }
    
  if (_m === undefined){
    this.m = Math.random();
  } else{
    this.m = _m;
  }

  this.forceX = 0;
  this.forceY = 0;
  this.forceZ = 0;
}

var MovePoints = function(points, dt, gravity){
  for (var i = 0; i < points.length; i++) {
    for (var j = 0; j < points.length; j++) {
      if ((i == j) || (points[i] === undefined) || (points[j] === undefined)){
        continue;
      } 
      var dx = points[j].x - points[i].x; 
      var dy = points[j].y - points[i].y;
      var dz = points[j].z - points[i].z;
      var r = Math.sqrt(Math.pow(dx, 2)+Math.pow(dy, 2)+Math.pow(dz, 2));
      var fabs = (gravity *Math.pow(points[i].m, 2))/Math.pow(r, 2);
      points[i].forceX =+ fabs * dx * r;
      points[i].forceY =+ fabs * dy * r;
      points[i].forceZ =+ fabs * dz * r;
    }
  }
  
  for (var i = 0; i < points.length; i++) {
    if (points[i] === undefined){
      continue;
    }
    
    var dvx = points[i].forceX * dt / points[i].m;
    var dvy = points[i].forceY * dt / points[i].m;
    var dvz = points[i].forceZ * dt / points[i].m;
    
    points[i].x += (points[i].vx + dvx / 2) * dt;
    points[i].y += (points[i].vy + dvy / 2) * dt;
    points[i].z += (points[i].vz + dvz / 2) * dt;
    
    points[i].vx += dvx;
    points[i].vy += dvy;
    points[i].vz += dvz;
    
    points[i].forceX = 0;
    points[i].forceY = 0;
    points[i].forceZ = 0;
    
  }
};


var MovePointsEluer = function(points, dt, gravity){
  
  window.points[0] = (new Point(x, y, z, "red", vx, vy, vz, m));
  window.points[1] = (new Point(x, y, z, "green", vx, vy, vz, m));
  window.points[2] = (new Point(x, y, z, "blue", vx, vy, vz, m));
};
