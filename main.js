
generatePage();
var quote = null;
var DownloadedImages = 0;
var countDrawImgs = 0;
var pctrs = new Array();
getPictures();
drawPictures();
getText();
drawText();


function generatePage(){
  var canvas = document.createElement("canvas"), 
  body = document.getElementById("body"), 
  download = document.createElement("button"), 
  div = document.createElement("div");

  div.style.width = "100%";
  div.style.display = "flex";
  div.style.flexDirection = "column";
  div.style.alignItems = "center";

  canvas.id = 'canvas';
  canvas.width = 600;
  canvas.height = 600;

  download.id = 'download';
  download.style.margin = '20px';
  download.style.padding = '10px';
  download.innerHTML = 'Download';
  download.style.backgroundColor = 'orange';
  download.style.color = 'black';
  download.style.fontSize = '16px';


  div.appendChild(canvas);
  div.appendChild(download);
  body.appendChild(div);
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

function getPictures(){
  var xSize, ySize;
  for (var i = 0; i < 4; i++) {
    pctrs[i] = new Image();
    pctrs[i].crossOrigin = 'anonymous';
    xSize = getRandomInt(200, 600);
		ySize = getRandomInt(200, 600);
    pctrs[i].src = 'https://source.unsplash.com/collection/1127163/' + xSize + 'x' + ySize;
    pctrs[i].onload = function () {  
      DownloadedImages++;              
    };                              
  }
}

function drawPctr(img, sx, sy, swidth, sheight, x, y, width, height) {
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, sx, sy, swidth, sheight, x, y, width, height);
  countDrawImgs++;
}

function calcCoords(img, width, height) {
  if (width != height)
    if (width < height)
      return [img.naturalWidth * (0.5 - 0.5 / (height / width)), 0,
      img.naturalWidth / (height / width), img.naturalHeight]
    else
      return [0, img.naturalHeight * (0.5 - 0.5 / (width / height)),
        img.naturalWidth, img.naturalHeight / (width / height)]
  else
    return [0, 0, img.naturalWidth, img.naturalHeight]
}

function drawPictures() {
  if (DownloadedImages == 4) {
    var
      x = 0,
      y = 0,
      ox = 150 + Math.round(Math.random() * 250),
      oy = 150 + Math.round(Math.random() * 250),
      h = oy,
      par = [];

    for (var i = 0; i < 2; i++) {
      w = ox;
      par = calcCoords(pctrs[i * 2], w, h);
      drawPctr(pctrs[i * 2], par[0], par[1], par[2], par[3], x, y, w, h);
      x = ox;
      w = 600 - w;
      par = calcCoords(pctrs[i * 2 + 1], w, h);
      drawPctr(pctrs[i * 2 + 1], par[0], par[1], par[2], par[3], x, y, w, h);
      x = 0;
      y = oy;
      h = 600 - h;
    }

    var ctx = canvas.getContext('2d');

    ctx.fillStyle = 'rgba(0,0,0,0.4)';
    ctx.fillRect(0, 0, 600, 600);
  } else {
    setTimeout(drawPictures, 1);
  }
}

function getText() {
  var http = new XMLHttpRequest;

  http.open('GET', 'https://cors-anywhere.herokuapp.com/' +
    'https://api.forismatic.com/api/1.0/?method=getQuote&format=json&lang=en', true);
  http.send();
  http.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      console.log(http.responseText);
      quote = JSON.parse(http.responseText)['quoteText'];
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
  if (quote != null && countDrawImgs == 4) {
    var context = canvas.getContext('2d');

    context.fillStyle = 'azure';
    context.font = '22pt Segoe UI';
    context.textAlign = 'center';
    var x = canvas.width / 2,
      y = canvas.height / 2 + 11;

    formateStrings(context, quote, x, y, 550, 40);
  }
  else {
    setTimeout(drawText, 1);
  }
}