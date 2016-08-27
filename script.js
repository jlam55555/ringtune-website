$(function() {
  "use strict";
  var progressions = {
    "I": ["V","IV","vi","III","iii"],
    "i": ["VIb","V","iv"],
    "ii": ["V","iii"],
    "III": ["VIIb"],
    "iii": ["IV","I"],
    "IV": ["I","V","ii"],
    "iv": ["i","VIIb"],
    "V": ["vi","I","i","IV"],
    "vi": ["IV","iii"],
    "VIb": ["iv","III"],
    "VIIb": ["i"]
  };
  var playChord = function(note) {
    new Audio("res/sound/" + note + ".mp3").play();
  };
  var used = [];
  var current = "I";
  $("#optionsBox").on("click", "img.option", function() {
    current = $(this).data("value");
    playChord(current);
    $("#optionsBox").empty();
    for(var value of progressions[current])
      $("#optionsBox").append("<img data-value='" + value + "' class='option' src='res/icons/" + value + ".png'>");
    used.push(current);
    $("#usedNotes").prepend("<img class='usedNote' src='res/icons/" + current + ".png'>");
  });
  var playTimeouts = [];
  $("#playButton").click(function() {
    if(playTimeouts.length > 0) $("#stopButton").click();
    for(let i = 0; i < used.length; i++)
      playTimeouts[i] = setTimeout(function() { playChord(used[i]); }, i*200);
    playTimeouts.push(setTimeout(function() { $("#playButton").click(); }, used.length*200));
  });
  $("#stopButton").click(function() {
    for(var i of playTimeouts)
      clearTimeout(i);
    playTimeouts = [];
  }); 
});
