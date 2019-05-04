generatePage();

function generatePage(){
  var canvas = document.createElement("canvas"); 
  var body = document.getElementById("body");
  var download = document.createElement("button");

  canvas.id = 'canvas';
  canvas.width = 600;
  canvas.height = 600;

  body.style.width = '100%';
  body.style.display = 'flex';
  body.style.flexDirection = 'column';
  body.style.alignItems = 'center';

  download.id = 'download';
  download.innerHTML = 'Download';
  download.style.backgroundColor = 'orange';
  download.style.color = 'white';
  download.style.padding = '10px 25px';
  download.style.fontSize = '20px';
  download.style.visibility = 'hidden';
  download.onclick =
    function () {
      var canv = document.getElementById('canvas');
      var dataURL = canv.toDataURL("image/jpg");
      var link = document.createElement("a");
      link.href = dataURL;
      link.download = "quote.jpg";
      link.click();
    };

  body.appendChild(canvas);
  body.appendChild(download);
}

var quote = null;
var DownloadedImages = 0;
var pctrs = new Array();
getPictures();

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function getPictures(){
  var xSize, ySize;
  for (var i = 0; i < 4; i++) {
    pctrs[i] = new Image();
    pctrs[i].crossOrigin = 'anonymous';
    xSize = getRandomInt(200, 300);
		ySize = getRandomInt(200, 300);
    pctrs[i].src = 'https://source.unsplash.com/collection/1127163/' + xSize + 'x' + ySize;
    pctrs[i].onload = function () {  
      DownloadedImages++;  
      if (DownloadedImages == 4){
        drawPictures();
      }         
    };                              
  }
}

function drawPctr(img, sx, sy, swidth, sheight, x, y, width, height) {
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
}

function drawPictures() {
      var x = 0;
      var y = 0;
      var ox = 150 + Math.round(Math.random() * 250);
      var oy = 150 + Math.round(Math.random() * 250);
      var h = oy;
    for (var i = 0; i < 2; i++) {
      w = ox;
      drawPctr(pctrs[i * 2], 0, 0, pctrs[i * 2].naturalWidth, pctrs[i * 2].naturalHeight, x, y, w, h);
      x = ox;
      w = 600 - w;
      drawPctr(pctrs[i * 2 + 1], 0, 0, pctrs[i * 2 + 1].naturalWidth, pctrs[i * 2 + 1].naturalHeight, x, y, w, h);
      x = 0;
      y = oy;
      h = 600 - h;
    }

    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, 600, 600);
    getText();
}

async function getText() {
  var http = new XMLHttpRequest;
  http.open('GET', 'https://cors-anywhere.herokuapp.com/' +
    'https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=ru', true);
  http.send();
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(http.responseText);
      quote = JSON.parse(http.responseText)['quoteText'];
      drawText();
    }
  }
}

function formateStrings(context, text, x, y, maxWidth, lineHeight) {
  var
    words = text.split(" "),
    countWords = words.length,
    countRaws = Math.floor(context.measureText(text).width / 550),
    line = "";
  y -= countRaws * (lineHeight / 2);
  for (var n = 0; n < countWords; n++) {
    var
      testLine = line + words[n] + " ",
      testWidth = context.measureText(testLine).width;

    if (testWidth > maxWidth) {
      context.fillText(line, x, y);
      line = words[n] + " ";
      y += lineHeight;
    }
    else {
      line = testLine;
    }
  }
  context.fillText(line, x, y);
}

function drawText() {
    var context = canvas.getContext('2d');
    context.fillStyle = 'azure';
    context.font = '22pt Segoe UI';
    context.textAlign = 'center';
    var x = canvas.width / 2,
      y = canvas.height / 2 + 11;
    formateStrings(context, quote, x, y, 550, 40);
    download.style.visibility = 'visible';
}