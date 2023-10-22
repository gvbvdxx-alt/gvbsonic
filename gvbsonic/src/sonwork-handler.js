async function doSonworkStuff() {
  doSonworkLevel()
}
async function doSonworkLevel() {
  window.sprites= [];
  window.tickEngine();
  try {
    var levelrunning = true;
    while (levelrunning) {
      var report = await window.loadLevel(0);
      if (report == "clear") {
        levelrunning = false;
      }
    }
  } catch (e) {
    window.alert(e);
  }
}
