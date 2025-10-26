let vid
let isPlaying = false
let hoverPlay = false
let showUI = false
let vidPlaying = false

let nearPlaybar = false
let movingPlaybar = false

let nearAudiobar = false
let movingAudiobar = false
let volume = 0.5

function preload() {
  stremioFont = loadFont('Comfortaa-Bold.ttf')
  backButton = loadImage('backButton.png')
  playButton = loadImage('playButton.png')
  pauseButton = loadImage('pauseButton.png')
  audioButton = loadImage('audioButton.png')
  rightUI = loadImage('stremio-shell-ng_JStjHzYsAn.png')
  fullscreenButton = loadImage('exitFC.png')


}

function setup() {
  let CANVAS = createCanvas(windowWidth, windowHeight)
  CANVAS.position(0,0)
  background(0)
  vidInput = createFileInput(handleFile).position(windowWidth/2, windowHeight/2)

}

function handleFile(file) {
  if (file.type === "video") {
    vid = createVideo(file.data)
    vidInput.remove()
    vidPlaying = true
    vid.volume(volume)
    vid.play()
  } else {
    alert("Please upload a video file!");
  }
}

function draw(){

  if (showUI === true && vid) {
    drawStremioUI()
  }

  background(0,0,0,100)

  if (vid) {
    let scale = min(width / vid.width, height / vid.height);
    let drawW = vid.width * scale;
    let drawH = vid.height * scale;
    let x = (width - drawW)/2;
    let y = (height - drawH)/2;
    image(vid, x, y, drawW, drawH);

  }

  // fill('white')
  // text(mouseX, 100, 100)
  // text(mouseY, 100, 120)

}

function drawStremioUI() {

  // Stremio Client UI

  textFont(stremioFont)
  textSize(20)
  fill(255)
  stroke(0)
  noStroke()
  text('The Super Mario Bros. Movie', 85, 60,)


  // Back Button
  image(backButton, 30, 38, 25, 25) 

  // Play Button

  if (mouseX > 50 && mouseX < 80 && mouseY > windowHeight-65 && mouseY < windowHeight-35) {
    hoverPlay = true
  } else {
    hoverPlay = false
  }

  if (vidPlaying === false) {
    image(playButton, 50, windowHeight-65, 30, 30) 
  } else {
    image(pauseButton, 50, windowHeight-65, 30, 30) 
  }

  // Audio

  drawAudioBar()

  //Right side

  //Globe

  image(rightUI, windowWidth-420, windowHeight-75, 390, 53) 
  image(fullscreenButton, windowWidth-70, 25, 45, 45) 

  drawPlaybar()

}

function drawAudioBar() {

  image(audioButton, 105, windowHeight-69, 40, 40) 

  stroke('grey');
  strokeWeight(5);
  line(165, windowHeight-50, 165+120, windowHeight-50)

  stroke('white');
  strokeWeight(5);
  if (movingAudiobar === false) {
    line(165, windowHeight-50, 165+volume*120, windowHeight-50)
  } else {
    line(165, windowHeight-50, mouseX, windowHeight-50)
  }

  // circle
  fill('white')
  noStroke()
  if (movingAudiobar === false) {
    circle(165 + volume*120, windowHeight - 50, 15)
  } else {
    circle(mouseX, windowHeight-50, 15)
  }

  // moving audio bar!! / changing volume!!

  if (mouseX > 165 && mouseX < 165+120 && mouseY > windowHeight-70 && mouseY < windowHeight-40) {
    nearAudiobar = true
    if (mouseIsPressed) {
      movingAudiobar = true
      volume = (map(mouseX, 165, 165+120, 0, 1, true))
      vid.volume(volume)
    } else {
      movingAudiobar = false
    }
  } else {
    movingAudiobar = false
    nearAudiobar = false
  }


}

function drawPlaybar() {

  let vidTime = vid.time()
  let vidDuration = vid.duration()

  // greyed out
  stroke(25, 18, 49)
  line(135, windowHeight-100, windowWidth-150, windowHeight-100)

  // current bar
  stroke(123, 91, 245)
  strokeWeight(7)
  if (movingPlaybar === false) {
    line(135, windowHeight-100, 135 + (vidTime / vidDuration) * (windowWidth - 150 - 135), windowHeight-100)
  } else {
    line(135, windowHeight-100, mouseX, windowHeight-100)
  }

  // circle
  fill(123, 91, 245)
  stroke(160, 118, 255)
  strokeWeight(3.5)
  if (movingPlaybar === false) {
    circle(135 + (vidTime / vidDuration) * (windowWidth - 150 - 135), windowHeight - 100, 15)
  } else {
    circle(mouseX, windowHeight - 100, 15)
    vid.time(map(mouseX, 135, windowWidth - 150, 0, vid.duration(), true))
  }


  // show the time!!

  textFont(stremioFont)
  textSize(18)
  fill(255)
  stroke(0)
  noStroke()

  // Current time
  text(formatTime(vidTime), 30, windowHeight - 93)

  // Total duration
  text(formatTime(vidDuration), windowWidth - 60 - 50, windowHeight - 93)

  if (mouseX > 135 && mouseX < windowWidth-150 && mouseY > windowHeight-200 && mouseY < windowHeight-90) {
    nearPlaybar = true
    if (mouseIsPressed) {
      movingPlaybar = true
    } else {
      movingPlaybar = false
    }
  } else {
    movingPlaybar = false
    nearPlaybar = false
  }

}

function formatTime(seconds) {
  let h = floor(seconds / 3600);
  let m = floor((seconds % 3600) / 60);
  let s = floor(seconds % 60);

  // Add leading zeros
  let hStr = h < 10 ? "0" + h : h;
  let mStr = m < 10 ? "0" + m : m;
  let sStr = s < 10 ? "0" + s : s;

  return hStr + ":" + mStr + ":" + sStr;
}

function keyPressed() {
  if (vid) {
    if (keyCode === ENTER) {
      vid.time(100)
    }
  }
}

function mousePressed() {
  if (vid) {
    if (nearPlaybar === false && nearAudiobar === false) {
      if (vidPlaying === false) {
        vidPlaying = true;
        vid.play();  // use play(), not unpause()
        print('hi');
      } else {
        vidPlaying = false;
        vid.pause();
      }
    }
  }
}

function mouseMoved() {
  if (showUI === false) {
    showUI = true
    setTimeout(disableUI, 5000)
  }
}

function disableUI() {
  showUI = false
  print('DisabledUI')
}