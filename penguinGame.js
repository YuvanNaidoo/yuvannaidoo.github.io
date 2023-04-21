var clickCount = 0;
var max = 9;
var deathNum = 0;
var clickedArr = [];
var allImages = [];
var hasEnded = false;

function setDeathNum ()
{
  deathNum = Math.floor(Math.random() * max);
  for (i = 0; i < max; i++)
  {
    clickedArr[i] = 0;
  }
  clickedArr[deathNum] = 2;
  setImages ();
}

function setImages ()
{
  for (i = 0; i < 4; i ++)
  {
    allImages[i] = 'url(images/Bunnies_' + i + '.png)';
  }
}

function ClickCheck(x)
{
  if (!hasEnded)
  {
    if (clickedArr[x] == 0)
    {
      clickedArr[x] = 1;
      clickCount ++;
      var randomNum = Math.floor(Math.random() * 4);
      document.getElementById("p"+x).style.backgroundImage = allImages[randomNum];
      document.getElementById("p"+x).style.borderColor = "#4074a7";
    } else if (clickedArr[x] == 2)
    {
      document.getElementById("p"+x).style.backgroundImage = 'url(images/Bunnies_Dead.png)';
      alert ("Game Over!!! Score: " + clickCount + ". Please Refresh Page To restart");
      hasEnded = true;
      //location.reload(true);
    }

    if (clickCount == 8)
    {
      alert ("You found all the Bunnies. Congratulations. Refresh page to start again.")
    }
  } else
  {
    document.getElementById("p"+x).style.backgroundImage = 'url(images/Bunnies_Dead.png)';
  }
}
