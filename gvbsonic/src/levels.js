window.fetchJSON = async function fetchJSON(j) {
    var a = await fetch(j);
    var b = await a.text();
    return JSON.parse(b);
  }
  window.levelMusicLoopNumbers = {};
window.loadLevels = async function () {
	await loadBackgroundAssets();
	var levels = await fetchJSON("res/levels.json");
	var bgms = await fetchJSON("res/bgm.json");
  window.files.levelMusic = []; //not even used anymore.
  window.files.levelBGMS = {};
  for (var bgmName of Object.keys(bgms)) {
	  if (bgms[bgmName].loop) {
		  levelMusicLoopNumbers[bgmName] = bgms[bgmName].loop;
	  }
	  window.files.levelBGMS[bgmName] = await window.loadSoundURL(bgms[bgmName].path);
  }
  window.files.levelBackgrounds = []; //not even used anymore.
  var i = 0;
  window.files.levelorder = [];
  while (i < levels.length) {
	window.files.levelorder.push(i);
	i += 1;
  }
  var reallevels = [];
  for (var levelpath of levels) {
	  reallevels.push(await fetchJSON(levelpath));
  }
  window.files.levels = reallevels;
}
