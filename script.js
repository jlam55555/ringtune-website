$(function() {
  "use strict";

  // GLOBAL-ish VARIABLES
  var progressions = {
    "I": ["V","V","V","IV","IV","IV","ii","ii","vi","I","III","iii"],
    "i": ["VIb","VIb","V","iv"],
    "ii": ["V","V","iii"],
    "III": ["VIIb"],
    "iii": ["IV","IV","I"],
    "IV": ["V","V","V","V","I","I","I","ii"],
    "iv": ["i","VIIb"],
    "V": ["I","I","I","I","I","vi","vi","i","IV"],
    "vi": ["IV","IV","iii"],
    "VIb": ["iv","III"],
    "VIIb": ["i"]
  };
  var playChord = function(note) { new Audio("res/sound/" + note + ".mp3").play(); };
  var getLength = function() { return 60000/parseInt($("#tempoRange").val()); };
  var used = [];
  var current = "I";

  // HANDLE CLICK OF OPTIONS
  $("#optionsBox").on("click", "img.option", function() {
    current = $(this).data("value");
    playChord(current);
    $("#optionsBox").empty();
    for(var value of progressions[current].filter(function(value, index, array) {
      return index == 0 || value != array[index-1];
    }))
      $("#optionsBox").append("<img data-value='" + value + "' class='option' src='res/icons/" + value + ".png'>");
    used.push(current);
    $("#usedNotes").prepend("<img class='usedNote' data-value='" + current + "' src='res/icons/" + current + ".png'>");
  });

  // PLAY AND STOP THE MUSIC
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

  // RANDOMLY SELECT OPTIONS
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

  // CLEAR BUTTONS
  $("#closeButton").click(function() {
    if(confirm("Are you sure you want to delete your current RingTune?")) {
      used = [];
      current = "I";
      $("div#usedNotes").empty();
      $("div#optionsBox").html("<img class='option' data-value='I' src='res/icons/I.png'>");
    }
  });

  // TEMPO CONTROL
  $("#tempoRange").on("input", function() {
    $("#tempoValue").text($(this).val());
  });

  // BACKGROUND IMAGE REPOSITIONING
  $(window).resize(function() {
    $("img#backgroundLogo").css("top", ($(window).height()-$("img#backgroundLogo").height())/2+"px");
  }).resize();

  // PLAY NOTE IF CLICKED ON (USED LIST)
  $(document).on("click", "img.usedNote", function() {
    playChord($(this).data("value"));    
  });

  // ATTEMPT TO USE THE API
  $.ajax({
    url: "https://api.hooktheory.com/v1/trends/nodes?cp=4,2,4&callback=test",
    type: "GET",
    beforeSend: function(xhr) {
      xhr.setRequestHeader("Authorizaton", "Bearer 7008700b22ddff662480256fb05e79c1");
      xhr.setRequestHeader("Accept", "application/json");
      xhr.setRequestHeader("Content-Type", "application/json");
    },
    success: function(data) {
      console.log(data);
    }
  });
  function test(data) {
    console.log("test");
  }

});
