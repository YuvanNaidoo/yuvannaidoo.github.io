//Constants
var fUT = 0.02;//Fixed Update Time
var startParticleCount = 10;//How many particles to make on start
var maxParticleSpeed = 50;//greatest starting speed for particles
var marginPercentage = 1;//margin for creation and bounce
var particleRadius = 2;
var particleFillColour = 'orange';
var particleStrokeColour = 'orange';
var lineColour = 'orange';
var minConnectionDistance = 250;//minimum distance to draw lines

//Global Variables
var particleSpace;//div element in document
var canvas;//created canvas
var drawContext;//getContext of canvas created
var allPos = [];//positions of all particles
var allVel = [];//velcoities of all particles
var pCount = 0;//counter - number of particles
var hasAddedMouse = 0;//0=false, 1=true

function Start (particleSpaceName, canvasName)
{
  particleSpace = document.getElementById(particleSpaceName);
  CreateCanvas (canvasName);
  CreateParticles (startParticleCount);
  var fixedUpdater = setInterval(FixedUpdate, fUT * 1000);
}

function FixedUpdate ()
{
  UpdateCanvasSize ();
  MoveParticles ();
  UpdateVelocities ();
}

//Creates Canvas
function CreateCanvas (canvasID)
{
  canvas = document.createElement('canvas');
  canvas.id = canvasID;
  canvas.width = particleSpace.offsetWidth;
  canvas.height = particleSpace.offsetHeight;
  particleSpace.appendChild(canvas);
  drawContext = canvas.getContext('2d');
}

//Makes canvas responsive
function UpdateCanvasSize ()
{
  canvas.width = particleSpace.offsetWidth;
  canvas.height = particleSpace.offsetHeight;
  drawContext = canvas.getContext('2d');
  DrawParticles(allPos);
}

//Creates theoretical particles as positions
function CreateParticles (count)
{
  var pC = pCount;
  for (var i = pC; i < pC + count; i ++)
  {
    var margin = [canvas.width / 100 * marginPercentage, canvas.height / 100 * marginPercentage]
    var randomStart = getRandomStartPos([canvas.width,canvas.height], margin);
    var randomVel = GetNewVelocity(maxParticleSpeed, maxParticleSpeed);
    allPos[i] = [randomStart[0], randomStart[1]];
    allVel[i] = [randomVel[0], randomVel[1]];
    pCount ++;
  }
}

//Generates a random vector
function getRandomStartPos (subSpaceDimensions, marginSizes)
{
  var randomX = Math.floor(Math.random() * (subSpaceDimensions[0] - marginSizes[0] * 2) + marginSizes[0]);
  var randomY = Math.floor(Math.random() * (subSpaceDimensions[1] - marginSizes[1] * 2) + marginSizes[1]);
  var randomPosition = [randomX, randomY];
  return randomPosition;
}

//Draws all particles on canvas
function DrawParticles (allPositions)
{
  drawContext.clearRect(0, 0, canvas.width, canvas.height);
  for (var i = 0; i < pCount; i ++)
  {
    var c = drawContext;
    var p = allPos[i];
    c.beginPath ();
    c.arc(p[0],p[1],particleRadius,0,2*Math.PI);
    c.strokeStyle = particleStrokeColour;
    c.fillStyle = particleFillColour;
    c.stroke();
    c.fill();
    c.closePath ();

    //Draw Lines
    DrawLines(p, allPos);
  }
}

//Generates new vector
function GetNewVelocity (maxX, maxY)
{
  var randomX = maxX - (Math.random() * 2 * maxX);
  var randomY = maxY - (Math.random() * 2 * maxY);
  var newRandomVel = [randomX, randomY];
  return newRandomVel;
}

//Applys movement to particles from velocity array
function MoveParticles ()
{
  for (var i = 0; i < pCount; i ++)
  {
    var cPos = allPos[i];
    var cVel = allVel[i];

    var nPos = [cPos[0] + (cVel[0] * fUT), cPos[1] + (cVel[1] * fUT)];
    allPos[i] = nPos;
  }
}

//Changes direction of particles when they hit walls
function UpdateVelocities ()
{
  var s = canvas;
  var marginSize = [s.width / 100 * marginPercentage, s.height / 100 * marginPercentage];
  var boundryH = [s.offsetLeft + marginSize[0], s.offsetLeft + s.width - marginSize[0]];
  var boundryV = [s.offsetTop + marginSize[1], s.offsetTop + s.height - marginSize[1]];

  for (var i = 0; i < pCount; i ++)
  {
    var cPos = allPos[i];
    var cVel = allVel[i];

    //Change Horizontal Direction
    if (cPos[0] < boundryH[0])
    {
      if (cVel[0] < 0)
      {
        cVel = [-cVel[0], cVel[1]];
      }
    } else if (cPos[0] > boundryH[1])
    {
      if (cVel[0] > 0)
      {
        cVel = [-cVel[0], cVel[1]];
      }
    }

    //Change Vertical Direction
    if (cPos[1] < boundryV[0])
    {
      if (cVel[1] < 0)
      {
        cVel = [cVel[0], -cVel[1]];
      }
    } else if (cPos[1] > boundryV[1])
    {
      if (cVel[1] > 0)
      {
        cVel = [cVel[0], -cVel[1]];
      }
    }

    allVel[i] = cVel;
  }
}

//Draws Lines between close particles
function DrawLines (startPos, allPositions)
{
  var s = startPos;
  for (var i = 0; i < pCount; i ++)
  {
    var a = allPositions[i];
    var sTOa = [a[0] - s[0], a[1] - s[1]];
    var distance = Math.sqrt((sTOa[0] * sTOa[0]) + (sTOa[1] * sTOa[1]));

    if (distance < minConnectionDistance)
    {
      var c = drawContext;
      c.beginPath ();
      c.moveTo(s[0], s[1]);
      c.lineTo(a[0], a[1]);
      c.strokeStyle = lineColour;
      c.stroke();
      c.closePath ();
    }
  }
}

function TrackMouseAsParticle (event)
{
  if (hasAddedMouse == 0)
  {
    pCount ++;
    hasAddedMouse = 1;
    var xPos = event.clientX - 6;
    var yPos = event.clientY - 6;
    var mousePos = [xPos, yPos];
    allPos[pCount - 1] = mousePos;
    allVel[pCount - 1] = [0,0];
  } else
  {
    var xPos = event.clientX - 6;
    var yPos = event.clientY - 6;
    var mousePos = [xPos, yPos];
    allPos[pCount - 1] = mousePos;
    allVel[pCount - 1] = [0,0];
  }
}
