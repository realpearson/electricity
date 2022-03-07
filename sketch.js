var sparky;
//var n;

var mouseActive = false;

//Assets
var electricArcLoop;
var start;
var end;

var hiVolt;

function preload() {
  electricArcLoop = loadSound("assets/LectricNoise_Loop_02.wav");
  start = loadSound("assets/ShortZaps_02.wav");
  end = loadSound("assets/ShortZaps_06.wav");

  hiVolt = loadImage('assets/hivolt.png');
}

function setup() {
  //frameRate(15);
  createCanvas(200, 200);
  //noLoop();
  noSmooth();
  noCursor();

  sparky = new Sparks(100, 100);
  beam = new Beamer();

  background(45);
}


function draw() {
  background(45);

  noFill();
  stroke(245, 140, 0);
  strokeWeight(5);
  rect(0, 0, width, height);
  strokeWeight(1);


  push();
  scale(2, 2);
  image(hiVolt, width / 15, height / 7.8);
  //translate(width/ 2, height / 2);
  //sparky.drawLines();
  pop();

  if (mouseX < width && mouseY < height) {

    if (mouseActive) {
      beam.Arc();
    }
    let distance = p5.Vector.dist(beam.startPos, beam.endPos);

    electricArcLoop.setVolume(map(distance, 0, height, 0.3, 1, true));
    electricArcLoop.rate(map(distance, 0, height, 1.5, 1, true))
    start.setVolume(map(distance, 0, height, 0.3, 1, true));
    end.setVolume(map(distance, 0, height, 0.3, 1, true));
  } else {
    if (mouseActive) end.play();
    mouseActive = false;
    electricArcLoop.stop();
  }

  beam.Orbs();

  if (!mouseIsPressed) mouseActive = false;
}

function mousePressed() {
  if (mouseX < width && mouseY < height) {
    mouseActive = true;
    electricArcLoop.play();
    electricArcLoop.playMode('restart');
    electricArcLoop.loop();
    start.play();
  }
}

function touchStarted() {
    if (mouseX < width && mouseY < height) {
    mouseActive = true;
    electricArcLoop.play();
    electricArcLoop.playMode('restart');
    electricArcLoop.loop();
    start.play();
  }
}

function touchEnded(){
  electricArcLoop.stop(0.01);
  if (mouseX < width && mouseY < height && mouseActive) end.play();
}

function mouseReleased() {

  electricArcLoop.stop(0.01);
  if (mouseX < width && mouseY < height && mouseActive) end.play();
}

function Sparks(x, y) {

  this.generation = 0;
  this.numLines = 5;
  this.lengthMult = 10;

  this.drawLines = function() {
    //translate(-50, -this.generation*5);

    stroke(255 - random(59), 255, 255, 100);

    push();
    let angle = random(0.8 * PI, 1.2 * PI);
    rotate(angle);
    //line(0, 0, 0, 5+this.generation *this.lengthMult);
    let polarity = floor(random(0, 2));
    angle > PI ? polarity = -1 : polarity = 1;
    noFill();
    stroke(random(240), random(100, 240), random(240, 255));
    curve(0, 20, 0, 0, 0, 5 + this.generation * this.lengthMult, random(20) * polarity * this.generation, 30 + this.generation * this.lengthMult) * polarity;
    //print("hey");

    pop();

    this.generation++;

    if (this.generation < this.numLines) this.drawLines();
    else this.generation = 0;
  }
}

function Beamer() {
  this.startPos = createVector(30, height / 2);
  this.endPos = createVector(230, 100);

  //Arc Params
  this.minAmp = -10;
  this.maxAmp = 20;
  this.numVerts = 30;
  this.waveShape = 2;


  this.Arc = function() {
    noFill();

    this.endPos.x = mouseX;
    this.endPos.y = mouseY;

    let horizOffset = (this.endPos.x - this.startPos.x);
    let vertOffset = this.endPos.y - this.startPos.y;
    let xyOffset = Math.abs(horizOffset - vertOffset);
    let dist = p5.Vector.dist(this.startPos, this.endPos);

    //--------------------------
    let polarity = floor(random(0, 2));
    polarity == 0 ? polarity = -1 : polarity = 1;
    //--------------------------
    if (floor(random(0, 2)) == 0) stroke(random(240), random(100, 240), random(240, 255));
    else stroke(255);

    strokeWeight(random(1, 3));
    //---------------------------
    beginShape();

    vertex(this.startPos.x, this.startPos.y)

    for (let i = 1; i < this.numVerts - 1; i++) {
      let diag = map(xyOffset, 0, height, 1, 0);
      let yAmp = random(this.minAmp, this.maxAmp) * map(vertOffset, 0, height, 1, diag);
      let xAmp = random(this.minAmp, this.maxAmp) * map(horizOffset, 0, width, 1, diag);
      let distMult = map(dist, 0, height, 0.1, 1);


      //let x = (length/ this.numVerts) * i;
      //let y = random(this.minAmp, this.maxAmp);
      let x = xAmp * distMult; //should get proportionally smaller with vertOffset (0-1)
      let y = yAmp * distMult; // should get proportionally smaller with length (0-1)


      let yShift = (vertOffset / this.numVerts) * i;
      let xShift = (horizOffset / this.numVerts) * i;
      //let yShift = 0;

      if (i % this.waveShape == 0) vertex((this.startPos.x + x * polarity) + xShift, (this.startPos.y + y * polarity) + yShift);
      //else vertex ((this.startPos.x + x * polarity) + xShift, (this.startPos.y - y * polarity)  + yShift);
    }

    vertex(this.endPos.x, this.endPos.y);

    endShape();


    //--------------------------
  }

  this.Orbs = function() {
    noFill();
    if (!mouseIsPressed) stroke(255);
    ellipse(this.startPos.x, this.startPos.y, 25, 25);
    ellipse(mouseX, mouseY, 25, 25);
  }
}