var oscs;
var playing;
var freqs;
var amps;
var bgClr, graphClr, waveClr, freqClr, textClr;

var state;
var fR;

var introIndex;
var introOsc;
var introOscPlaying = false;
var introFreq = 440;
var introAmp = 0.0;

function setup() {
	var cnv = createCanvas(1000, 720);
  textAlign(LEFT, BASELINE);

  bgClr = color(45, 45, 42);
  graphClr = color(76, 76, 71);
  waveClr = color(255, 100, 100);
  freqClr = color(100, 255, 100);
  textClr = color(230, 220, 195)
  background(bgClr);

	frameRate(20);
	fR = 20;

	state = "INTRO";

	introIndex = 0;

	fft = new p5.FFT();

	introOsc = new p5.Oscillator();
	introOsc.setType('sine');
	introOsc.freq(440);
	introOsc.amp(0.0);
	introOsc.start();

	oscs = [];
  playing = [];
  freqs = [];
  amps = [];
  for (var i = 0; i < 9; i++) {
    var osc = new p5.Oscillator();
  	osc.setType('sine');
    var freq = 240+240*i*2;
  	osc.freq(freq);
  	osc.amp(0.0);
  	osc.start();
    oscs.push(osc);
    playing.push(false);
    freqs.push(freq);
    amps.push(0.0);
  }

	if (state == "INTRO") {
	}
	if (state == "BUILDSQUARE") {
	  drawOscs();
	  drawWaves();
	  drawFreqs();
	}
}

function draw() {
	if (state == "INTRO") {
		fill(textClr);
		if (introIndex == 0) {
			background(bgClr);
			textAlign(CENTER, CENTER);
			textSize(48);
			text("Basics of Sound Synthesis", width/2, height/2);
		}
		else if (introIndex == 1) {
			background(bgClr);
			textAlign(CENTER, BASELINE);
			textSize(42);
			var textStart = 280;
			var textCenter = width/2;
			text("What we'll cover:", textCenter, textStart);
			var lineHeight = 40;
			textSize(32);
			text("Additive Synthesis", textCenter, textStart + lineHeight*1);
			text("Fourier Transforms", textCenter, textStart + lineHeight*2);
			text("Maybe Subtractive Synthesis", textCenter, textStart + lineHeight*3);
			text("Which Would Mean Filters, Too", textCenter, textStart + lineHeight*4);
		}
		else if (introIndex == 2) {
			background(bgClr);
			textAlign(CENTER, BASELINE);
			textSize(42);
			var textStart = 280;
			var textCenter = width/2;
			text("Let's start with a sine wave:", textCenter, textStart);
			drawIntroWave();
		}
		else if (introIndex == 3) {
			background(bgClr);
			textAlign(CENTER, BASELINE);
			textSize(42);
			var lineHeight = 60;
			var textStart = 280 - lineHeight;
			var textCenter = width/2;
			text("Frequency: " + introFreq + " Hz", textCenter, textStart);
			text("Amplitude: " + introAmp + " d", textCenter, textStart + lineHeight);
			drawIntroWave();
		}
	}
	if (state == "BUILDSQUARE") {
	  textAlign(LEFT, BASELINE);
	  drawFreqs();
	}
}


function keyPressed() {
	if (key == "[" || key == "]" || key == "\\") {
		changeFrameRate(key);
	}
	if (state == "INTRO") {
		noStroke();
		if (keyCode == RIGHT_ARROW) {
			if (introIndex < 3) {
				introIndex++;
			}
			else {
				introOsc.amp(0.0, 0.5);
				introAmp = 0.0;
				state = "BUILDSQUARE";
				background(bgClr);
				drawWaves();
				drawOscs();
				drawFreqs();
			}
		}
		if (keyCode == LEFT_ARROW) {
			introIndex--;
		}
		if (keyCode == ESCAPE) {
			introAmp = 0.0;
			introOsc.amp(introAmp, 1.0);
		}
		if (key == "`") {
			introAmp = 1.0;
			introOsc.amp(introAmp, 1.0);
		}
		if (key == "q") {
			introAmp = 0.5;
			introOsc.amp(introAmp, 1.0);
		}
		if (key == "1") {
			introFreq *= 0.5;
			introOsc.freq(introFreq);
		}
		if (key == "2") {
			introFreq *= 2;
			introOsc.freq(introFreq);
		}
		if (key == "3") {
			introFreq -= 100;
			introOsc.freq(introFreq);
		}
		if (key == "4") {
			introFreq += 100;
			introOsc.freq(introFreq);
		}
			if (key == "u" || key == "i" || key == "o" || key == "p") {
				changeTimbre(key);
			}

	}
	if (state == "BUILDSQUARE") {
		buildsquareKeyPressed(key, keyCode);
	}
}

function changeTimbre(key) {
	if (key == "u") {
		introOsc.setType("sine");
	}
	else if (key == "i") {
		introOsc.setType("triangle");
	}
	else if (key == "o") {
		introOsc.setType("sawtooth");
	}
	else if (key == "p") {
		introOsc.setType("square");
	}
}

function changeFrameRate(key) {
	if (key == "[") {
		fR -= 2;
		frameRate(fR);
	}
	else if (key == "]") {
		fR += 2;
		frameRate(fR);
	}
	else if (key == "\\") {
		fR = 24;
		frameRate(fR);
	}
}

function drawIntroWave() {
  var w = 800;
  var h = 300;
  var mx = (width - w)/2;
  var my = 340;

  noStroke();
  fill(graphClr);
  rect(mx, my, w, h);

  var sampleSize = 256*1;
  var waveform = fft.waveform(sampleSize);
  if (sampleSize <= waveform.length) {
    noFill();
    beginShape();
    stroke(waveClr);
    strokeWeight(2);
    for (var i = 0; i < sampleSize; i++){
      var x = map(i, 0, sampleSize, mx+1, mx+w);
      var y = map( waveform[i], -1, 1, my, my+h);
      vertex(x,y);
      if (y < 50) {
        print(i);
      }
    }
    endShape();
		/*
    textAlign(RIGHT, BASELINE);
    fill(bgClr);
    noStroke();
    textSize(18);
    text("\u27F5 Time \u27F6", mx+w-10, my+h-10);
    textAlign(LEFT, BASELINE);
		*/
		noStroke();
  }
  else {
    print("Error: waveform length less than samplesize " +
          sampleSize);
  }
}
