//Alex, Matthew, Zanroe

let playerX = 250,
  playerY = 420,
  playerYOffset = 0;
let leftGloveY = 370,
  rightGloveY = 370;

let gloveResetY = 470;
let bagAngle = 0;
let switchState = 0;

let sequence = [],
  sequenceIndex = 0,
  sequenceCorrect = [];
let roundNumber = 1,
  patternLength = 2;

let sequenceTimer = 10;
let maxSequenceTimer = 10;

let spots = [
  { id: 1, x: -70, y: 125, key: "a" },
  { id: 2, x: 30, y: 125, key: "d" },
  { id: 3, x: -70, y: 250, key: "w" },
  { id: 4, x: 30, y: 250, key: "s" },
];

let redStrikes = 0,
  maxStrikes = 3;
let feedbackColor,
  feedbackTimer = 0;
let bobaFrontImg, bobaBackImg, bobaBackgroundImg;
let punchSFX, errorSFX, dongSFX;

function preload() {
  bobaFrontImg = loadImage("boba_front.png");
  bobaBackImg = loadImage("boba_back.png");
  bobaBackgroundImg = loadImage("boba_background.png");
  punchSFX = loadSound("punch_sound.mp3");
  errorSFX = loadSound("error_sound.mp3");
  dongSFX = loadSound("dong_bell.mp3");
}

function setup() {
  let canvas = createCanvas(450, 500);
  canvas.parent("game-container");
  newPattern();
  feedbackColor = color(255, 255, 0);
}

function draw() {
  background(220);

  switch (switchState) {
    case 0:
      background(180);

      image(bobaFrontImg, 175, 130, 280, 280);

      fill(255);
      textAlign(CENTER);
      textSize(30);
      stroke(0);
      strokeWeight(7);
      text("Boba Boxing Club", 220, 40);

      textSize(16);
      text("Controls:", 100, 150);

      textSize(13);
      text("Punch LEFT", 100, 180);
      text("Punch RIGHT", 100, 230);
      text("↓ Down Arrow (Duck)", 100, 280);
      text("→ Right Arrow (Dodge Right)", 110, 340);
      text("← Left Arrow (Dodge Left)", 110, 400);

      textSize(20);
      text("Press 'SPACE' to play", 220, 100);

      if (keyIsDown(32)) switchState = 1;
      break;

    case 1:
      background(210, 150, 70);
      image(bobaBackgroundImg, 0, 0, 450, 500);

      // SEQUENCE BOARD
      fill(50);
      rect(100, 10, 250, 50, 5);

      fill(255);
      textSize(20);
      textAlign(CENTER, CENTER);

      let startX = 225 - (sequence.length - 1) * 22;

      for (let i = 0; i < sequence.length; i++) {
        if (sequenceCorrect[i]) {
          fill(0, 255, 0);
        } else {
          fill(255);
        }

        text(sequence[i], startX + i * 44, 35);

        if (i < sequence.length - 1) {
          fill(255);
          text(" → ", startX + i * 44 + 22, 35);
        }
      }

      fill(0);
      textSize(18);
      textAlign(LEFT);
      text("Round: " + roundNumber, 5, 35);

      textAlign(RIGHT);
      text("Time: " + ceil(sequenceTimer), 80, 80);

      sequenceTimer -= 1 / 60;

      if (sequenceTimer <= 0) {
        redStrikes++;
        sequenceIndex = 0;
        sequenceCorrect = [];

        sequenceTimer = getRoundTimer();

        dongSFX.stop();
        dongSFX.play();

        setTimeout(() => {
          dongSFX.stop();
        }, 2200);
      }

      // BAG
      push();
      translate(260, 60);
      rotate(radians(bagAngle));

      fill(100);
      rectMode(CORNER);
      stroke(15);
      strokeWeight(10);
      rect(-90, 15, 140, 340);

      noStroke();

      //Number & Color Indicator
      for (let i = 0; i < spots.length; i++) {
        if (spots[i].id === sequence[sequenceIndex] && roundNumber <= 4) {
          fill(255, 255, 0);
        } else {
          fill(200);
        }

        ellipse(spots[i].x, spots[i].y, 75);

        if (roundNumber <= 4) {
          fill(0);
          textSize(30);
          textAlign(CENTER, CENTER);
          text(spots[i].id, spots[i].x, spots[i].y);
        }
      }

      pop();

      if (feedbackTimer > 0) feedbackTimer--;

      // GUARD
      let leftGloveX = playerX - 10;
      let rightGloveX = playerX + 90;

      if (keyIsDown(DOWN_ARROW)) {
        leftGloveX = lerp(playerX - 10, playerX + 25, 0.2);
        rightGloveX = lerp(playerX + 90, playerX + 55, 0.2);
      }

      // ARMS
      stroke(0);
      strokeWeight(10);

      line(
        playerX + 15,
        500 + playerYOffset,
        playerX - 10,
        470 + playerYOffset
      );

      line(
        playerX - 10,
        470 + playerYOffset,
        playerX - 10,
        leftGloveY + playerYOffset
      );

      line(
        playerX + 65,
        500 + playerYOffset,
        playerX + 90,
        470 + playerYOffset
      );

      line(
        playerX + 90,
        470 + playerYOffset,
        playerX + 90,
        rightGloveY + playerYOffset
      );

      // PLAYER
      noStroke();
      fill(0);
      ellipse(playerX + 40, 500 + playerYOffset, 75);

      // GLOVES
      fill(200, 0, 0);
      ellipse(playerX - 10, leftGloveY + playerYOffset, 50);
      ellipse(playerX + 90, rightGloveY + playerYOffset, 50);

      // STRIKES
      for (let i = 0; i < maxStrikes; i++) {
        let x = 380 + i * 25;
        let y = 35;

        strokeWeight(3);

        if (i < redStrikes) {
          stroke(255, 0, 0);
        } else {
          stroke(100);
        }

        line(x - 8, y - 8, x + 8, y + 8);
        line(x + 8, y - 8, x - 8, y + 8);
      }

      noStroke();

      if (redStrikes >= maxStrikes) switchState = 2;

      checkInputs();
      break;

    case 2:
      background(50, 0, 0);

      image(bobaBackImg, 110, 240, 280, 280);
      imageMode(CORNER);

      fill(255);
      textAlign(CENTER);

      textSize(75);
      text("K.O.", 225, 75);

      textSize(25);
      text("Final Round: " + roundNumber, 225, 150);

      textSize(20);
      fill(200);
      text("Press 'R' to Try Again", 225, 200);
      break;
  }
}

function checkInputs() {
  // LEFT GLOVE
  if (keyIsDown(87)) { // W
    leftGloveY = lerp(leftGloveY, 180, 0.3);
    bagAngle = -5;
  } else if (keyIsDown(65)) { // A
    leftGloveY = lerp(leftGloveY, 310, 0.3);
    bagAngle = -5;
  } else {
    leftGloveY = lerp(leftGloveY, gloveResetY, 0.2);
  }

  // RIGHT GLOVE
  if (keyIsDown(83)) { // S
    rightGloveY = lerp(rightGloveY, 180, 0.3);
    bagAngle = 5;
  } else if (keyIsDown(68)) { // D
    rightGloveY = lerp(rightGloveY, 310, 0.3);
    bagAngle = 5;
  } else {
    rightGloveY = lerp(rightGloveY, gloveResetY, 0.2);
  }

  // Duck
  if (keyIsDown(DOWN_ARROW)) {
    playerYOffset = lerp(playerYOffset, 30, 0.2);
  } else {
    playerYOffset = lerp(playerYOffset, 0, 0.2);
  }

  bagAngle = lerp(bagAngle, 0, 0.9);

  // DODGE
  if (keyIsDown(LEFT_ARROW)) {
    playerX = lerp(playerX, 100, 0.2);
  } else if (keyIsDown(RIGHT_ARROW)) {
    playerX = lerp(playerX, 300, 0.2);
  } else {
    playerX = lerp(playerX, 200, 0.1);
  }
}

function keyPressed() {
  if (key === " ") switchState = 1;

  // RESET
  if (switchState === 2 && (key === "r" || key === "R")) {
    redStrikes = 0;
    roundNumber = 1;
    sequenceIndex = 0;
    sequenceTimer = getRoundTimer();
    newPattern();
    switchState = 1;
  }

  if (switchState === 1) {
    let currentTarget = sequence[sequenceIndex];
    let correctKey = "";

    if (currentTarget === 1) correctKey = "w";
    if (currentTarget === 2) correctKey = "s";
    if (currentTarget === 3) correctKey = "a";
    if (currentTarget === 4) correctKey = "d";

    // CORRECT
    if (key === correctKey) {
      punchSFX.play();

      sequenceCorrect[sequenceIndex] = true;
      sequenceIndex++;

      if (sequenceIndex >= sequence.length) {
        roundNumber++;
        sequenceTimer = getRoundTimer();
        newPattern();
      }

    // WRONG
    } else if (
      key === "w" ||
      key === "s" ||
      key === "a" ||
      key === "d"
    ) {
      errorSFX.play();
      redStrikes++;
      sequenceIndex = 0;
      sequenceCorrect = [];
      sequenceTimer = getRoundTimer();
    }
  }
}

function newPattern() {
  sequence = [];

  if (roundNumber <= 4) {
    patternLength = 2;
  } else if (roundNumber <= 8) {
    patternLength = 3;
  } else if (roundNumber <= 12) {
    patternLength = 4;
  } else if (roundNumber <= 16) {
    patternLength = 5;
  } else {
    patternLength = 6;
  }

  for (let i = 0; i < patternLength; i++) {
    sequence.push(floor(random(1, 5)));
  }

  sequenceIndex = 0;
  sequenceCorrect = [];
}

function getRoundTimer() {

  if (roundNumber <= 4) {
    return 10;

  } else if (roundNumber <= 6) {
    return 9;

  } else if (roundNumber <= 8) {
    return 8;

  } else if (roundNumber <= 10) {
    return 7;

  } else if (roundNumber <= 12) {
    return 6;

  } else if (roundNumber <= 14) {
    return 5;

  } else {
    return 4;
  }
}
