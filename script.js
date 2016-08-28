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
  var getLength = function() {
    return 60000/parseInt($("#tempoRange").val());
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
      playTimeouts[i] = setTimeout(function() { playChord(used[i]); }, i*getLength());
    playTimeouts.push(setTimeout(function() { $("#playButton").click(); }, used.length*getLength()));
  });
  $("#stopButton").click(function() {
    for(var i of playTimeouts)
      clearTimeout(i);
    playTimeouts = [];
  }); 
  $("#randomButton").click(function() {
    for(let i = 0; i < 10; i++) {
      if(used.length == 0) {
        $("img.option").click();
        continue;
      }
      setTimeout(function() {
        var progression = progressions[used[used.length-1]];
        var currentValue = progression[Math.floor(Math.random()*progression.length)];
        $("img.option[data-value=" + currentValue + "]").click();
      }, i*getLength());
    }
  });
  $("#closeButton").click(function() {
    if(confirm("Are you sure you want to delete your current RingTune?")) {
      used = [];
      current = "I";
      $("div#usedNotes").empty();
      $("div#optionsBox").html("<img class='option' data-value='I' src='res/icons/I.png'>");
    }
  });
  $("#tempoRange").on("input", function() {
    $("#tempoValue").text($(this).val());
  });
});
