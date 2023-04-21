var inputText = '';
var allWords = [];
var replacementWords = [];

function printOutput ()
{
  var outputHolder = document.getElementById('OutputTextSpace');
  var sOut = "";
  for (var i = 0; i < replacementWords.length; i ++)
  {
    if (i > 0)
    {
      sOut += " "
    }
    sOut = sOut + " " + replacementWords[i];
  }
  sOut += "<br><br>IMAGES and LINKS:"
  for (var i = 0; i < 4; i ++)
  {
    sOut += "<br><a href="+ randomImages[i] + "><b>" + randomImageWords[i] + "</b>: <i>" + randomImages[i] + "</i></a>";
  }
  sOut += "<br><br>Powered By: https://words.bighugelabs.com/ and http://developers.gettyimages.com/en/";
  sOut += "<br>Documentation: <a href=807097_WWW_ExamProjectDocumentation.pdf>Exam Project Documentation</a>"
  outputHolder.innerHTML = sOut;
}

function ProcessInput ()
{
  var inputHolder = document.getElementById('InputTextSpace');
  inputText = inputHolder.value;
  allWords = GetAllInputWords (inputText);
  replacementWords = [];
  GetReplacementWords(allWords);
  get4Images(allWords);
  setInterval(function(){printOutput();}, 200);
}

function GetAllInputWords (inputString)
{
  var aWords = [];
  aWords = inputString.split(" ");

  return aWords;
}

function GetReplacementWords (words)
{
  var l = words.length;
  var rWords = [];
  for (var i = 0; i < l; i ++)
  {
    //Synonyms
    GetSynonym(words[i], i);
  }
}

function GetSynonym (word, index)
{
  var w = word.replace(".", "");
  var synonym = "<b>"+allWords[index]+"</b>";
  replacementWords[index] = synonym;

  var xhttp = new XMLHttpRequest();

  //IF API CALLS ARE EXCEEDED, USE OTHER API KEY:
  var key0 = "57958c5b767e4d8f37f5bd09a8eaff29";
  var key1 = "df7a8f4ca7ba5b61c2b4d87ec91e0b78";
  //API ALTERNATE KEY ABOVE!!! AND USED BELOW:

  xhttp.open("GET", "http://words.bighugelabs.com/api/2/" + key0 + "/" + w.toLowerCase() + "/json", true);
  xhttp.send();
  xhttp.onreadystatechange = function()
  {
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
        var rawText = xhttp.responseText;
        var wordObject = JSON.parse(rawText);
        var allSynonyms = wordObject.noun.syn;
        var randomIndex = Math.floor(Math.random() * allSynonyms.length);
        synonym = allSynonyms[randomIndex];
        if (word[word.length - 1] == '.')
        {
          replacementWords[index] = synonym + ".";
        } else {
          replacementWords[index] = synonym;
        }
    } else {
      setTimeout(function () {
        console.log("working...");
      }, 20);
    }
  }
}

function get4Images (words)
{
  for (var i = 0; i < 4; i ++)
  {
    var randomIndex = Math.floor(Math.random() * words.length);
    GetImages(words[randomIndex], i);
  }
}

var randomImages = [];
var randomImageWords = [];
function GetImages (word, index)
{
  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", "https://api.gettyimages.com/v3/search/images?fields=id,title,thumb,referral_destinations&sort_order=best&phrase=" +  word.toLowerCase(), true);
  xhttp.setRequestHeader("Api-Key", "mcspws4jtz3uvuyzbcw42jgz");
  xhttp.send ();
  xhttp.onreadystatechange = function()
  {
    if (xhttp.readyState == 4 && xhttp.status == 200)
    {
      var rawText = xhttp.responseText;
      var imageObject = JSON.parse(rawText);
      var allImages = imageObject.images;
      var randomIndex = Math.floor(Math.random() * allImages.length);
      var imageURL = allImages[randomIndex].referral_destinations[0].uri;
      randomImages[index] = imageURL;
      randomImageWords[index] = word;
      var randomChoice = Math.random();
      if (randomChoice > 0.5)
      {
        document.getElementById('wordImage' + index).src = imageURL;
      } else
      {
        document.getElementById('wordImage' + index).src = "https://en.wikipedia.org/wiki/" + word;
        randomImages[index] = "https://en.wikipedia.org/wiki/" + word;
      }
    }
  }
}
