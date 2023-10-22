var level = null;
window.filesloaded = 0;
(async function () {
  var text = document.getElementById("loadingtext");
  var loadang = 0;
  text.hidden = false;
  window.files.mutliConnecting = await window.renderer.createImage(
    "res/multiplayer/connecting.png"
  );
  window.files.sonic = await window.renderer.createImage(
    "res/characters/sonic.png"
  );
  window.files.tails = await window.renderer.createImage(
    "res/characters/tails.png"
  );
  window.files.newsonic = await window.renderer.createImage(
    "res/characters/newsonic.png"
  );
  window.files.maniaSonic = await window.renderer.createImage(
    "res/characters/maniasonic.png"
  );
  window.files.tailss3 = await window.renderer.createImage(
    "res/characters/tailss3.png"
  );
  window.files.superSonic = await window.renderer.createImage(
    "res/characters/supersonic.png"
  );
  window.files.menuStuff = {
	//menu backgrounds.
	newmenubg: await window.renderer.createImage("res/menu/latest/newmenubg.png"),
	//main menu items.
    exit: await window.renderer.createImage("res/menu/latest/exit.png"),
	options: await window.renderer.createImage("res/menu/latest/options.png"),
	play: await window.renderer.createImage("res/menu/latest/play.png"),
	//misc menu items.
	back: await window.renderer.createImage("res/menu/latest/back.png")
  };
  window.files.signposts = {
    sonic: await window.renderer.createImage(
      "res/items/goals/signpost-sonic.png"
    ),
  };
  window.files.jingles = {
    levelClear: await window.loadSoundURL("res/music/jingles/StageClear.ogg"),
    title: await window.loadSoundURL("res/music/jingles/TitleV2.mp3"),
  };
  window.files.tileScales = {};
  window.files.springspritesheet = JSON.parse(
    await (await fetch("res/items/spring/red.json")).text()
  );
  window.files.monitorSpriteSheet = JSON.parse(
    await (await fetch("res/items/monitor/monitor.json")).text()
  );
  window.files.gvbsonicLogoSpritesheet = JSON.parse(
    await (await fetch("res/title/gvbsonic.json")).text()
  );
  window.files.gvbsonicLogo = await window.renderer.createImage(
    "res/title/gvbsonic.png"
  );
  window.files.gvbsonicBG = await window.renderer.createImage(
    "res/title/gvbsonic-bg.png"
  );
  window.files.monitor = await window.renderer.createImage(
    "res/items/monitor/monitor.png"
  );
  window.files.logo = await window.renderer.createImage(
    "res/title/sonicandtails.png"
  );
  window.files.titlebg = await window.renderer.createImage(
    "res/title/ehzbg.png"
  );
  window.files.ring = await window.renderer.createImage("res/items/ring.png");
  window.files.sonic1Tiles = {};
  var sfxpcharge = await window.loadSoundURL("res/sfx/PeelCharge.wav");
  window.files.menumusic = {
    main: await window.loadSoundURL("res/music/menu/MainMenu.mp3"),
  };
  window.files.music = {};
  window.files.sfx = {
    flyTired: await window.loadSoundURL("res/sfx/tired.wav"),
    fly: await window.loadSoundURL("res/sfx/fly.wav"),
    skid: await window.loadSoundURL("res/sfx/skid.mp3"),
    jump: await window.loadSoundURL("res/sfx/jump.wav"),
    spin: sfxpcharge,
    spindash: await window.loadSoundURL("res/sfx/SpindashCharge.wav"),
    spindashRelease: await window.loadSoundURL("res/sfx/release.wav"),
    ring: await window.loadSoundURL("res/sfx/ring.wav"),
    looseRings: await window.loadSoundURL("res/sfx/looseRings.wav"),
    destory: await window.loadSoundURL("res/sfx/Explosion.wav"),
    death: await window.loadSoundURL("res/sfx/death.wav"),
    spring: await window.loadSoundURL("res/sfx/spring.wav"),
    menubleep: await window.loadSoundURL("res/sfx/MenuBleep.wav"),
    menuaccept: await window.loadSoundURL("res/sfx/MenuAccept.wav"),
    peelCharge: await window.loadSoundURL("res/sfx/PeelCharge.wav"),
    peelRelease: await window.loadSoundURL("res/sfx/PeelRelease.wav"),
    continue: await window.loadSoundURL("res/sfx/continue.mp3"),
  };
  try {
  } catch (e) {
    window.alert(e);
  }
  var urlfont = "res/fonts/slkscr.ttf";
  async function loadFonts() {
    const font = new FontFace("pixel", `url(${urlfont})`, {
      style: "normal",
      weight: "100",
      stretch: "condensed",
    });
    await font.load();
    document.fonts.add(font);
    document.body.classList.add("fonts-loaded");
  }
  await loadFonts();
  try {
    await window.loadLevels();
    window.files.tiles = await window.loadTiles();
  } catch (e) {
    window.alert("failed to load tile files: " + e);
  }
  try {
  } catch (e) {
    window.alert("failed to load level " + e);
  }
  try {
    window.levelspr = new window.GRender.Sprite(0, 0, null, 32, 32);
    var collisioncvs = document.createElement("canvas");
    var ctx = collisioncvs.getContext("2d");
    collisioncvs.width = 3;
    collisioncvs.height = 3;
    ctx.fillRect(0, 0, 3, 3);
    window.files.pointcollision = new window.CollisionMask(
      ctx.getImageData(0, 0, 3, 3)
    );
  } catch (e) {
    window.alert(e);
  }
  await window.initCharData();
  var loading = document.getElementById("loading");
  var app = document.getElementById("app");
  loading.hidden = true;
  document.onclick = null;
  app.hidden = false;
  await window.startGame();
})();
