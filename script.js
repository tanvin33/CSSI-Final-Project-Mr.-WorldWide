/* global p5, eng, fr, rus, esp */
let p = new p5(() => {});

// Variables
let width,
  height,
  diam,
  backgroundColor,
  img,
  level,
  lang,
  word,
  dict,
  dashWidth,
  wordWidth,
  correctGuesses,
  wrongGuesses,
  guessedLetters,
  sound,
  pDiam;
let backgroundOn, snowmanOn;
let snow = (186, 5, 100);
let engImg, frImg, espImg, rusImg;

// Dictionaries are  in dictionaries.js

/** TO DO ITEMS, IN ORDER OF PRIORITY: 
@Tanvi: Get BackgroundImage function working -- rn it chooses a color 
**/

p.preload = function() {
  sound = p.loadImage(
    "https://cdn.glitch.com/6d043fd2-1b7f-4496-b3b3-fd49659cac2e%2F6868756_preview.png?v=1596034992140"
  );
  engImg = p.loadImage(
    "https://cdn.glitch.com/6d043fd2-1b7f-4496-b3b3-fd49659cac2e%2Fwhitehouse1.png?v=1596118751486"
  );
  frImg = p.loadImage(
    "https://cdn.glitch.com/8cc9724b-7b2e-4e4c-a8e6-250907c5de4c%2FParisInWinter.jpg?v=1595983362129"
  );
  espImg = p.loadImage(
    "https://cdn.glitch.com/8cc9724b-7b2e-4e4c-a8e6-250907c5de4c%2FParkGuell.jpg?v=1595983393098"
  );
  rusImg = p.loadImage(
    "https://cdn.glitch.com/8cc9724b-7b2e-4e4c-a8e6-250907c5de4c%2FRed-Square.jpg?v=1595983432994"
  );
};

p.setup = function() {
  level = getQueryString("level1");
  lang = getQueryString("lang");
  displaySettings();

  startOver();
};

p.draw = function() {
  // chooseBackground();
  drawSnowmanOnce();
  drawPuddle();
  drawDashes();
  centreMsg("Guess the word before the snowman melts away", 0.9);
  eraseSnowman();
  if (p.keyIsPressed && isNotSpecialChar(p.keyCode) && p.keyCode != "32") {
    p.fill(0, 0, 0);
    p.textSize(20);
    if (!guessedLetters.includes(p.key)) {
      // Ensures user only inputs letters that haven't been typed before
      let index = word.indexOf(p.key);
      if (index !== -1) {
        while (index !== -1) {
          // If you guess one letter, it fills in all instances of that letter
          correctGuesses++;
          let letterX =
            0.5 * (width - wordWidth) +
            index * dashWidth * 2 +
            0.5 * (dashWidth - p.textWidth(p.key));
          let letterY = 0.8 * height - 5;
          p.stroke("black");
          p.strokeWeight(1);
          p.text(p.key, letterX, letterY);
          index = word.indexOf(p.key, index + 1);
        }
      } else {
        wrongGuesses++;
        pDiam += 20;
        p.stroke("black");
        p.strokeWeight(1);
        p.text(p.key, 0.1 * width, 0.2 * height + wrongGuesses * 20);
      }
      guessedLetters.push(p.key);
    }
  }

  if (correctGuesses == word.length - findSpaces(word)) {
    youWin();
  }
};

//HELPER FUNCTIONS
/* Function: isNotSpecialChar
 *  This function accepts a keyCode integer and returns true if it is not among the list of keyCodes for special characters.
 */
function isNotSpecialChar(k) {
  if (lang == "eng") {
    return (k > 64 && k < 91) || (k > 96 && k < 123);
  } else if (lang == "fr") {
    return (
      (k > 64 && k < 91) ||
      (k > 96 && k < 123) ||
      k == 48 ||
      k == 50 ||
      k == 55 ||
      k == 57
    ); // à, é, è, ç
  } else if (lang == "esp") {
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 186 || k == 191; // ñ, ç
  } else if (lang == "rus") {
    let specialChars = [
      8,
      9,
      13,
      16,
      17,
      18,
      19,
      20,
      27,
      33,
      32,
      34,
      35,
      36,
      37,
      38,
      39,
      40,
      44,
      45,
      46,
      48,
      49,
      50,
      51,
      52,
      53,
      54,
      55,
      56,
      57,
      187
    ];
    if (specialChars.includes(k)) {
      return false;
    }
    return true;
  }
}

/* Function: findSpaces
 *  This function accepts a string as an input and returns the number of spaces in the string.
 *  This is to check if the correct guesses is equal to the number of characters in the word,
 *  excluding spaces, so that the youWin function can be called.
 */
function findSpaces(phrase) {
  let numSpaces = 0;
  for (let i = 0; i < phrase.length; i++) {
    if (phrase.charAt(i) == " ") {
      numSpaces++; //or "continue"
    }
  }
  return numSpaces;
}

/* Function: getQueryString
 *  This function helps uses QueryString to find a variabe passed by the previous htmlfile.
 */
function getQueryString(field, url) {
  var href = url ? url : window.location.href;
  var reg = new RegExp("[?&]" + field + "=([^&#]*)", "i");
  var string = reg.exec(href);
  return string ? string[1] : null;
}

/* Function: startOver
 *  This function helps create the new game. It is used in setup and restartGame
 */
function startOver() {
  width = 500;
  height = 400;
  diam = 75;
  pDiam = 0;
  p.createCanvas(width, height);
  p.colorMode(p.HSB, 360, 100, 100, 1);
  backgroundColor = 95;
  backgroundOn = false;
  snowmanOn = false;
  p.background(backgroundColor);

  //tests
  console.log(level);
  console.log(lang);

  pickDictionary();
  if (lang == "eng") {
    word = dict[p.floor(p.random(dict.length))];
  } else {
    let foreignWords = Object.keys(dict);
    word = foreignWords[p.floor(p.random(foreignWords.length))];
  }
  dashWidth = 10;
  wordWidth = word.length * dashWidth + (word.length - 1) * dashWidth;
  correctGuesses = 0;
  wrongGuesses = 0;
  guessedLetters = [];
  displaySettings();
  //drawSnowmanOnce();

  p.image(sound, 10, 10, 40, 40); //displays sound image icon
}

/* Function: chooseBackground
 *  This function displays different background images depending on the language selected.
 */
function chooseBackground() {
  if (backgroundOn == false) {
    p.colorMode(p.RGB, 255, 255, 255, 255);
    p.tint(255, 255, 255, 90);
    p.colorMode(p.HSB, 360, 100, 100, 1);
    if (lang == "eng") {
      p.image(engImg, 0, 0, 500, 400);
      console.log("engImg");
    } else if (lang == "fr") {
      p.image(frImg, 0, 0, 500, 400);
    } else if (lang == "esp") {
      p.image(espImg, 0, 0, 500, 400);
    } else if (lang == "rus") {
      p.image(rusImg, 0, 0, 500, 400);
    } else {
      console.log("error");
    }
    p.noTint();

    backgroundOn = true;
  }
}

/* Function: pickDictionary
 *  This function assigns the dict variable to the correct array/JSON object based on
 *  the user's language and difficulty level selection on the home page.
 */
function pickDictionary() {
  if (lang == "eng") {
    if (level == "easy") {
      dict = eng[0];
    } else if (level == "medium") {
      dict = eng[1];
    } else if (level == "hard") {
      dict = eng[2];
    }
  } else if (lang == "fr") {
    if (level == "easy") {
      dict = fr[0];
    } else if (level == "medium") {
      dict = fr[1];
    } else if (level == "hard") {
      dict = fr[2];
    }
  } else if (lang == "esp") {
    if (level == "easy") {
      dict = esp[0];
    } else if (level == "medium") {
      dict = esp[1];
    } else if (level == "hard") {
      dict = esp[2];
    }
  } else if (lang == "rus") {
    if (level == "easy") {
      dict = rus[0];
    } else if (level == "medium") {
      dict = rus[1];
    } else if (level == "hard") {
      dict = rus[2];
    }
  }
}

/* Function: drawDashes
 *  This function draws the blanks for the unknown letters in the word.
 */
function drawDashes() {
  p.stroke(0, 0, 0);
  p.strokeWeight(1);
  for (let i = 0; i < word.length; i++) {
    if (word[i] == " ") {
      continue;
    }
    let startX = 0.5 * (width - wordWidth) + i * 20;
    let endX = 0.5 * (width - wordWidth) + 10 + i * 20;
    p.fill(0, 0, 0);
    p.line(startX, 0.8 * height, endX, 0.8 * height);
  }
}

/* Function: displaySettings
 *  This function displays the chosen language/level
 */
function displaySettings() {
  p.textSize(15);
  p.noStroke();
  p.fill(0, 0, 0);
  if (lang == "eng") {
    p.text("language: english", 0.75 * width, 0.075 * height);
  } else if (lang == "fr") {
    p.text("language: french", 0.75 * width, 0.075 * height);
  } else if (lang == "esp") {
    p.text("language: spanish", 0.75 * width, 0.075 * height);
  } else if (lang == "rus") {
    p.text("language: russian", 0.75 * width, 0.075 * height);
  } else {
    console.log("error");
  }
  p.text("level: " + level, 0.75 * width, 0.125 * height);

  p.textSize(20);
  p.strokeWeight(1);
}

//creates a button functionality for the sound icon
p.mouseClicked = function() {
  if (10 < p.mouseX < 50 && p.mouseY > 12 && p.mouseY < 50) {
    handleSound();
  }
};

/* Function: handleSound
 *  This function handles the text to speech aspect
 uses the Web Speech API 
 documentation: https://wicg.github.io/speech-api/#tts-section
 */
function handleSound() {
  if ("speechSynthesis" in window) {
    // Speech Synthesis supported 🎉
    let msg = new SpeechSynthesisUtterance();

    msg.text = word;
    msg.rate = 0.8;
    msg.pitch = 1.2;
    let voices = window.speechSynthesis.getVoices();

    if (lang == "eng") {
      msg.voices = voices[11];
      msg.lang = "eng";
    } else if (lang == "esp") {
      msg.lang = "es";
    } else if (lang == "fr") {
      msg.lang = "fr";
    } else if (lang == "rus") {
      msg.lang = "ru";
    }

    window.speechSynthesis.speak(msg);
  } else {
    // Speech Synthesis Not Supported 😣
    alert("Sorry, your browser doesn't support text to speech!");
  }
}

/* Function: drawSnowmanOnce
 *  This function draws the snowman at the sart of the game.
 */
function drawSnowmanOnce() {
  if (snowmanOn == false) {
    p.stroke(0, 0, 0);
    p.fill(snow);
    p.ellipse(0.5 * width, 0.35 * height, diam);
    // Hat
    p.fill("black");
    p.rect(0.5 * width - 20, 0.32 * height - 0.75 * diam, 40, 25);
    p.rect(0.5 * width - 30, 91, 60, 10);
    // Body + Buttons
    p.fill(snow);
    p.ellipse(0.5 * width, 0.35 * height + 1.25 * diam, 1.5 * diam);
    p.fill("black");
    p.ellipse(0.5 * width, 0.35 * height + 1.25 * diam - 25, 10);
    p.ellipse(0.5 * width, 0.35 * height + 1.25 * diam, 10);
    p.ellipse(0.5 * width, 0.35 * height + 1.25 * diam + 25, 10);
    p.noFill();
    // Left Arm
    p.line(
      0.5 * width - 0.75 * diam + 3,
      0.35 * height + diam,
      0.5 * width - 1.25 * diam,
      0.35 * height + 0.5 * diam
    );
    // Left Fingers
    p.line(
      0.5 * width - 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width - 1.5 * diam,
      0.35 * height + 0.5 * diam - 15
    );
    p.line(
      0.5 * width - 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width - 1.3 * diam,
      0.35 * height + 0.5 * diam - 20
    );
    p.line(
      0.5 * width - 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width - 1.5 * diam,
      0.35 * height + 0.5 * diam - 3
    );
    // Right Arm
    p.line(
      0.5 * width + 0.75 * diam - 3,
      0.35 * height + diam,
      0.5 * width + 1.25 * diam,
      0.35 * height + 0.5 * diam
    );
    // Right Fingers
    p.line(
      0.5 * width + 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width + 1.5 * diam,
      0.35 * height + 0.5 * diam - 15
    );
    p.line(
      0.5 * width + 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width + 1.3 * diam,
      0.35 * height + 0.5 * diam - 20
    );
    p.line(
      0.5 * width + 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width + 1.5 * diam,
      0.35 * height + 0.5 * diam - 3
    );
    // Carrot Nose + Sad Face
    p.fill("black");
    p.ellipse(0.5 * width - 12.5, 0.35 * height - 10, 5); // left eye
    p.ellipse(0.5 * width + 12.5, 0.35 * height - 10, 5); // right eye
    p.fill("orange");
    p.triangle(
      0.5 * width,
      0.35 * height,
      0.5 * width + 20,
      0.35 * height + 3,
      0.5 * width,
      0.35 * height + 6
    );
    p.noFill();
    p.arc(0.5 * width, 0.35 * height + 17.5, 20, 15, p.TWO_PI, p.PI);
    p.fill(0, 0, 0);
    p.textSize(20);
  }
  snowmanOn = true;
}

function drawPuddle() {
  p.stroke(0, 0, 0);
  p.fill(186, 100, 78);
  if (pDiam > 0) {
    p.ellipse(0.5 * width, 295, pDiam, 10);
  }
}

/* Function: eraseSnowman
 *  This function melts the snowman step-by-step as the number of wrong guesses increases.
 */
function eraseSnowman() {
  if (wrongGuesses >= 1) {
    // Carrot Nose + Sad Face
    p.stroke(snow);
    p.fill(snow);
    p.ellipse(0.5 * width - 12.5, 0.35 * height - 10, 5); // left eye
    p.ellipse(0.5 * width + 12.5, 0.35 * height - 10, 5); // right eye

    p.triangle(
      0.5 * width,
      0.35 * height,
      0.5 * width + 20,
      0.35 * height + 3,
      0.5 * width,
      0.35 * height + 6
    );

    p.arc(0.5 * width, 0.35 * height + 17.5, 20, 15, p.TWO_PI, p.PI);
  }
  if (wrongGuesses >= 2) {
    // Hat
    p.stroke(backgroundColor);
    p.fill(backgroundColor);
    p.rect(0.5 * width - 20, 0.32 * height - 0.75 * diam, 40, 25);
    p.rect(0.5 * width - 30, 91, 60, 10);
  }
  if (wrongGuesses >= 3) {
    // Head
    p.stroke(backgroundColor);
    p.fill(backgroundColor);
    p.ellipse(0.5 * width, 0.35 * height, diam);
  }
  if (wrongGuesses >= 4) {
    // Left Fingers
    p.stroke(backgroundColor);
    p.line(
      0.5 * width - 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width - 1.5 * diam,
      0.35 * height + 0.5 * diam - 15
    );
    p.line(
      0.5 * width - 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width - 1.3 * diam,
      0.35 * height + 0.5 * diam - 20
    );
    p.line(
      0.5 * width - 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width - 1.5 * diam,
      0.35 * height + 0.5 * diam - 3
    );
  }
  if (wrongGuesses >= 5) {
    // Left Arm
    p.stroke(backgroundColor);
    p.line(
      0.5 * width - 0.75 * diam + 3,
      0.35 * height + diam,
      0.5 * width - 1.25 * diam,
      0.35 * height + 0.5 * diam
    );
  }
  if (wrongGuesses >= 6) {
    // Right Fingers
    p.stroke(backgroundColor);
    p.strokeWeight(5);
    p.line(
      0.5 * width + 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width + 1.5 * diam,
      0.35 * height + 0.5 * diam - 15
    );
    p.line(
      0.5 * width + 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width + 1.3 * diam,
      0.35 * height + 0.5 * diam - 20
    );
    p.line(
      0.5 * width + 1.25 * diam,
      0.35 * height + 0.5 * diam,
      0.5 * width + 1.5 * diam,
      0.35 * height + 0.5 * diam - 3
    );
    p.strokeWeight(1);
  }

  if (wrongGuesses >= 7) {
    // Right Arm
    p.stroke(backgroundColor);
    p.line(
      0.5 * width + 0.75 * diam - 3,
      0.35 * height + diam,
      0.5 * width + 1.25 * diam,
      0.35 * height + 0.5 * diam
    );
  }
  if (wrongGuesses >= 8) {
    //  Buttons
    p.stroke(snow);
    p.fill(snow);

    p.ellipse(0.5 * width, 0.35 * height + 1.25 * diam - 25, 10);
    p.ellipse(0.5 * width, 0.35 * height + 1.25 * diam, 10);
    p.ellipse(0.5 * width, 0.35 * height + 1.25 * diam + 25, 10);
  }
  if (wrongGuesses >= 9) {
    // Body
    p.stroke(backgroundColor);
    p.strokeWeight(5);
    p.fill(backgroundColor);
    p.ellipse(0.5 * width, 0.35 * height + 1.25 * diam, 1.5 * diam);

    p.strokeWeight(1);
    youLose();
  }
}
/* Function: youLose
 *  This function prints out the message when the user loses, the word and its English translation
 *  (if answer is not in English), and ends the game.
 */
function youLose() {
  p.noLoop();

  p.noStroke();
  p.fill(backgroundColor);
  p.rect(0, 300, width, height);
  p.rect(0.7 * width, 0, width, 200);

  p.fill(0, 0, 0);
  displaySettings();
  p.stroke(0, 0, 0);
  p.textSize(20);
  centreMsg("Sorry... try again!", 0.08);
  centreMsg("Press SPACE to restart", 0.15);
  centreMsg("The word was " + word, 0.9);
  if (lang !== "eng") {
    centreMsg("In English, this means " + dict[word], 0.97);
  }

  let img2 = p.loadImage(
    "https://cdn.glitch.com/8cc9724b-7b2e-4e4c-a8e6-250907c5de4c%2Fyou-lose-rubber-stamp-vector-11569653.jpg?v=1595983006881"
  );
  p.image(img2, 100, 100, 100, 100);
}

/* Function: youWin
 *  This function prints out the message when the user wins, the word's English translation
 *  (if word is not in English), and ends the game.
 */
function youWin() {
  p.noLoop();

  p.noStroke();
  p.fill(backgroundColor);
  p.rect(0, 300, width, height);
  centreMsg("Guess the word before the snowman melts away", 0.9);

  p.fill(0, 0, 0);
  displaySettings();
  p.textSize(20);

  centreMsg("You win!", 0.08);
  centreMsg("Press SPACE to restart", 0.15);
  centreMsg("The word was " + word, 0.9);
  if (lang !== "eng") {
    centreMsg("In English, this means " + dict[word], 0.97);
  }
}

/* Function: centreMsg
 *  This function accepts a msg string and a float value msgHeight between 0 and 1,
 *  and prints the string in the centre of the screen. The height is a proportion
 *  of the canvas height as given by the value of msgHeight.
 */
function centreMsg(msg, msgHeight) {
  let msgWidth = p.textWidth(msg);
  p.text(msg, (width - msgWidth) / 2, msgHeight * height);
}

/* Functions: p.keyTyped
 *  p.keyTyped is an event listener for when the SPACE key is pressed,
 *  startOver is called to restart the game.
 */
p.keyTyped = function() {
  if (p.keyCode == "32") {
    startOver();
    p.loop();
  }
};
