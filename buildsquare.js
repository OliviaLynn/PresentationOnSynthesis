
function drawWaves() {
  var w = 500;
  var h = 330;
  var mx = 480;
  var my = 20;

  noStroke();
  fill(graphClr);
  rect(mx, my, w, h);

  var sampleSize = 256*2;
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
    textAlign(RIGHT, BASELINE);
    fill(bgClr);
    noStroke();
    textSize(18);
    text("\u27F5 Time \u27F6", mx+w-10, my+h-10);
    textAlign(LEFT, BASELINE);
  }
  else {
    print("Error: waveform length less than samplesize " +
          sampleSize);
  }

}

function drawFreqs() {
  var w = 500;
  var h = 330;
  var mx = 480;
  var my = 370;

  noStroke();
  fill(graphClr);
  rect(mx, my, w, h);

  //var sampleSize = 256*4;
  var bins = 1024;
  if (16 <= bins && bins <= 1024) {
    var spectrum = fft.analyze(bins);
    noStroke();
    fill(freqClr);
    for (var i = 0; i < bins; i++){
      var barX = map(i, 0, bins/4, mx, mx+w);
      var barY = h + my;
      var barH = -(my+h) + map(spectrum[i], 0, 260, my+h, my);
      var barW = 1.5; //w/bins - 2;
      rect(barX, barY, barW, barH)
    }
    textAlign(RIGHT, BASELINE);
    fill(bgClr);
    textSize(18);
    text("\u27F5 Frequency \u27F6", mx+w-10, my+h-10);
    textAlign(LEFT, BASELINE);
  }
  else {
    print("Error: <bins> must be a power of two between 16 " +
          "and 1024, but is set to: " + bins);
  }
}

function drawOscs() {
  var mx = 20; //360;
  var my = 20;
  var oscH = (height-my)/oscs.length; //height+margins btwn
  var gWidth = 200;

  fill(bgClr);
  noStroke();
  rect(mx+gWidth+2, 0, 200, height);

  function labels(idx) {
    var cY = my + (idx+1)*oscH - 22;
    if (amps[idx] > 0) fill(textClr);
    else fill(graphClr);
    textSize(20);
    text(freqs[idx] + " Hz", mx+210, cY-2);
    textSize(48);
    var dbText = 0;
    if (amps[idx] > 0) dbText = nf(amps[idx], 1, 2);
    text(dbText, mx+208, cY-26);
    var offset = textWidth(dbText, 1, 2);
    textSize(20);
    text("dB", mx+208+offset+10, cY-26);
  }

  for (var i = 0; i < oscs.length; i++) {
    	labels(i);
  }
  for (var j = 0; j < oscs.length; j++) { // yuck async
		drawOscGraph(mx, my + j*oscH, gWidth, oscH - my, j);
  }
}

function drawOscGraph(x, y, gW, gH, idx) {
  noStroke();
  fill(graphClr);
  rect(x, y, gW, gH);
  if (amps[idx] > 0) {
  //if (true) {
    noFill();
    beginShape();
    stroke(waveClr);
    strokeWeight(2);
    for (var i = 0; i < gW-2; i++){
      var factor = 0.1;
      var val = i * factor;
      var x0 = x + i + 1;
      var a = amps[idx];
      var k = idx + 1;
      var y0 = map(sin(val * (2*k - 1) * 0.5)*a, -1, 1, y+2, y+gH-2);
      vertex(x0,y0);
    }
    endShape();
  }
}

function buildsquareKeyPressed(key, keyCode) {
  	if (keyCode == LEFT_ARROW) {
      introIndex = 3;
      state = "INTRO";
    }
    if (key == "u") {
      toSquareWave();
    }
    if (key == "o") {
      toSawWave();
    }
  	var index = -1;
  	if (key == "`") index = 0;
  	if (key == "1") index = 1;
  	if (key == "2") index = 2;
  	if (key == "3") index = 3;
  	if (key == "4") index = 4;
  	if (key == "5") index = 5;
  	if (key == "6") index = 6;
  	if (key == "7") index = 7;
  	if (key == "8") index = 8;
    if (index != -1) {
      if (playing[index]) {
        oscs[index].amp(0.0, 0.01);
        playing[index] = false;
        amps[index] = 0.0;
      }
      else {
        var k = index + 1;
        var a = 1.0 * (1/(2*k - 1)); // 2k-1, where k starts at 1
        oscs[index].amp(a, 0.01);
        playing[index] = true;
        amps[index] = a;
      }
      drawOscs();
      setTimeout(drawWaves, 50);
    }
    if (keyCode == 32) { // Space was pressed
      drawOscs();
      drawWaves();
    }
    if (keyCode == ESCAPE) { // Escape stops all sound
      for (var i = 0; i < oscs.length; i++) {
        oscs[i].amp(0.0, 0.01);
        playing[i] = false;
        amps[i] = 0.0;
      }
      drawOscs();
      setTimeout(drawWaves, 50);
    }
}

function toSquareWave() {
    for (var i = 0; i < 9; i++) {
      var freq = 240+240*i*2;
      oscs[i].freq(freq);
    }
}

function toSawWave() {
    for (var i = 0; i < 9; i++) {
      var freq =
      oscs[i].freq(freq);
    }

}
