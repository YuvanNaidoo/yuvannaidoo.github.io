setInterval(resizeProfilePic, 1000/60);

function resizeProfilePic(){
    var a = document.getElementById('cv_profilePic_border');
    var p = document.getElementById('cv_profilePic_parent');
    var pW = p.offsetWidth - p.offsetWidth/20;
    var pH = p.offsetHeight - p.offsetHeight/20;

    if (pW > pH)
    {
      a.style.width = pH + "px";
      a.style.height = pH + "px";

      var l = pW / 2 - a.offsetWidth / 2;
      var t = p.offsetHeight/40
      a.style.left = l + "px";
      a.style.top = t + "px";
    } else{
      a.style.width = pW + "px";
      a.style.height = pW + "px";

      var t = pH / 2 - a.offsetHeight / 2;
      a.style.top = t + "px";
      var t = p.offsetWidth/40
      a.style.left = t + "px";
    }
  }
