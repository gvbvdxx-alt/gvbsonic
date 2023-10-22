//this does a basic check to see if its running via electron,
//and if not, put the click to play screen.
//due to browsers not allowing audio to play unless the page has been interacted with.
//electron does not have that issue, so there is no need of a click to play screen.
function checkForElectron() {
  try {
    if (window.require("@electron/remote")) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}

window.isElectron = checkForElectron();

var scripts = [
  "src/bgs/grey-grid-renderer.js?n=1",
  "src/gvbvdxx-renderer.js?n=1",
  "src/runtime.js?n=1",
  "src/audio.js?n=1",
  "src/tiles.js?n=1",
  "src/tails-npc.js?n=1",
  "src/fade-transition.js?n=1",
  "src/game-ui.js?n=1",
  "src/menus.js?n=1",
  "src/index.js?n=1",
  "src/level.js?n=1",
  "src/levels.js?n=1",
  "src/title-manager.js?n=1",
  "src/menu.js?n=1",
  "src/title.js?n=1",
  "res/characters/sonic.js?n=1",
  "res/characters/tails.js?n=1",
  "res/characters/newsonic.js?n=1",
  "res/characters/maniasonic.js?n=1",
  "res/characters/maniasonicanim.js?n=1",
  "res/characters/supersonic.js?n=1",
  "res/characters/supersonic-anim.js?n=1",
  "res/characters/tailss3.js?n=1",
  "res/characters/tailss3-anim.js?n=1",
  "res/characters.js?n=1",
  "res/characters/sonic-anim.js?n=1",
  "src/backgrounds.js?n=1",
  "src/assets.js?n=1"
];
function loadScript(src) {
  return new Promise((a) => {
    var s = document.createElement("script");
    s.src = src;
    s.onload = a;
    document.body.appendChild(s);
  });
}
async function startGameScripts() {
  for (var script of scripts) {
    await loadScript(script);
  }
}
var gvbsonicGame = document.getElementById("gvbsonicgame");
var clicktostart = document.getElementById("clicktostart");
if (isElectron) {
	window.remote = window.require("@electron/remote");
	window.currentWindow = window.remote.getCurrentWindow();
  startGameScripts();
  clicktostart.hidden = true;
  gvbsonicGame.hidden = false;
} else {
  clicktostart.hidden = false;
  document.body.style.cursor = "pointer";
  document.onclick = function () {
    document.body.style.cursor = "default";
    clicktostart.hidden = true;
    gvbsonicGame.hidden = false;
    document.onclick = null;
    setTimeout(() => {
      startGameScripts();
    },1);
  };
}
