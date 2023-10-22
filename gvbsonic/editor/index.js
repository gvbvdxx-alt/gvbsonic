window.files = {}; //"fake" the assets variable.
var renderer = new window.GRender.Render(
        document.getElementById("editor"),
        true);
setInterval(() => {
    var cvs = document.querySelector('canvas');
    var right = document.getElementById("right");
    var scale = right.getBoundingClientRect().width / 600;
    var w = ((scale) * 600);
    var h = ((scale) * 360);
    cvs.style.width = w + "px";
    cvs.style.height = h + "px";
    cvs.style.position = "absolute";
    cvs.style.top = "50%";
    cvs.style.marginTop = -h / 2 + "px";
}, 1000 / 60)
var TilesScale = {};
var ghzTiles = {};
async function loadGHZTiles() {
    ghzTiles = {};
}
var editorc = document.getElementById("editor");
var loadingstat = document.getElementById("loadings");
var tileinfo = document.getElementById("tileinfo");
var dataout = document.getElementById("data");
var lfile = document.getElementById("lfile");
var save = document.getElementById("save");
var loadfromurl = document.getElementById("loadfromurl");
var url = document.getElementById("url");
var textvalue = document.getElementById("textvalue");
var savetext = document.getElementById("savetext");
var monitorTypes = {
    "Ring Monitor": {
        type: "ring",
        spriteLocation: {
            x: 28,
            y: 97,
            width: 56,
            height: 64,
        },
    },
    "Eggman Monitor": {
        type: "eggman",
        spriteLocation: {
            x: 425,
            y: 0,
            width: 56,
            height: 64,
        },
    },
};
window.renderer = renderer;
var animationframe = [];
window.HDRendering = false;
// initialize the timer variables and start the animation
window.tickAsync = function () {
    return new Promise((a) => {
        var fps,
        fpsInterval,
        startTime,
        now,
        then,
        elapsed;
        function startAnimating(fps) {
            fpsInterval = 1000 / fps;
            then = Date.now();
            startTime = then;
            animate();
        }
        var timeout = null;
        function animate() {
            // calc elapsed time since last loop

            now = Date.now();
            elapsed = now - then;

            // if enough time has elapsed, draw the next frame

            if (elapsed > fpsInterval) {
                a();
                clearTimeout(timeout);
            } else {
                setTimeout(animate, 1);
            }
        }
        startAnimating(60);
    });
};
window.tickfastAsync = function () {
    return new Promise((a) => {
        setTimeout(a, 1);
    });
};
window.waitAsync = function (secs) {
    return new Promise((a) => {
        setTimeout(a, secs * 1000);
    });
};
var editorsprite = null;
var tiles = [];
var parts = [];
var levels = [];
var scroll = [0, 0];
var cr = window.renderer.createImage;
window.filesLoaded = 0;
window.renderer.createImage = async function (url) {
    try {
        var img = await cr(url);

        window.filesLoaded += 1;
        loadingstat.innerHTML = "Loading files... " + window.filesLoaded;
        return img;
    } catch (e) {
        window.alert(e);
    }
};
var enablekey = false;
var currenttile = 0;
window.disableYLock = false;
var ylock = document.getElementById("ylock");
ylock.oninput = function () {
    window.disableYLock = ylock.checked;
};
setInterval(() => {
    ylock.checked = window.disableYLock;
}, 1000 / 60)
var gridtoggle = true;
var selectedlayer = 0;
window.fetchJSON = async function fetchJSON(j) {
    var a = await fetch(j);
    var b = await a.text();
    return JSON.parse(b);
};
var bgm = document.getElementById("bgm");
var bg = document.getElementById("bg");
var levelTitle = document.getElementById("title");
function scr_wrap_angle(argument0) {
    /* Wrap the Angle */
    var temp;
    temp = argument0;
    while (temp < 0.0)
        temp += 360;
    while (temp >= 360.0)
        temp -= 360;
    return temp;
}
(async function () {
    try {
        var supportsrotation = false;
        window.files.signposts = {
            sonic: await window.renderer.createImage("res/items/goals/signpost-sonic.png")
        };
        editorc.onmouseover = function () {
            enablekey = true;
        };
        editorc.onmouseout = function () {
            enablekey = false;
        };
        tiles = await window.loadTiles();
        editorsprite = new window.GRender.Sprite(
                0,
                0,
                tiles[currenttile],
                128,
                128);
        var bgms = await window.fetchJSON("res/bgm.json");
        for (var bgmname of Object.keys(bgms)) {
            var option = document.createElement("option");
            option.textContent = bgmname;
            option.value = bgmname;
            bgm.append(option);
        }

        await loadGHZTiles();
        await loadBackgroundAssets();
        for (var bgname of Object.keys(window.files.bgAssets)) {
            var option = document.createElement("option");
            option.textContent = bgname;
            option.value = bgname;
            bg.append(option);
        }
        var s1 = await renderer.createImage("editor/s1.png");
        var s2 = await renderer.createImage("editor/s2.png");
        editorsprite.trs = 0.5;
        function addTile(x, y, id, type, layer, t, dir) {
            var widthheight = [1, 1];
            if (tiles[id]) {
                widthheight = [tiles[id].width, tiles[id].height];
            }
            var tile = new window.GRender.Sprite(
                    0,
                    0,
                    tiles[id],
                    widthheight[0],
                    widthheight[1]);
            tile.sx = x;
            tile.sy = y;
            tile.stype = type;
            tile.sid = id;
            tile.slayer = layer;
            tile.stext = t;
            tile.direction = dir;
            levels.push(tile);
        }
        function removeTile(x, y, layer) {
            var a = [];
            for (var t of levels) {
                if (
                    !(
                        Math.round(t.sx / 20) * 20 == Math.round(x / 20) * 20 &&
                        Math.round(t.sy / 20) * 20 == Math.round(y / 20) * 20 &&
                        t.slayer == layer)) {
                    a.push(t);
                }
            }
            levels = a;
        }
        parts = [];
        levels = [];
        loadingstat.hidden = true;
        renderer.mouseDetectionEnabled = true;
        var bgsprs = [];
        async function reloadBG() {

            bgsprs = await createBGSprites(window.files.bgAssets[bg.value]);

        }
        reloadBG();
        bg.onchange = reloadBG;
        window.loadLevel = function loadLevel(j) {
            bg.value = "defaultBlueBG";
			levelTitle.value = "";
            if (j.background) {
                bg.value = j.background;
            }
			if (j.title) {
                levelTitle.value = j.title;
            }
            if (j.BGM) {
                bgm.value = j.BGM;
            }
			if (j.BGM) {
                bgm.value = j.BGM;
            }
            reloadBG();
            window.disableYLock = j.disableYLock;
            levels = [];
            for (var obj of j.tiles) {
                addTile(obj.x, obj.y * -1, obj.id, obj.type, obj.layer, obj.text, obj.dir);
            }
        };
		window.saveLevel = function () {
            var j = {
                disableYLock: window.disableYLock,
                background: bg.value,
                BGM: bgm.value,
				title: levelTitle.value,
                tiles: []
            };
            for (var l of levels) {
                j.tiles.push({
                    x: l.sx,
                    y: l.sy * -1,
                    type: l.stype,
                    id: l.sid,
                    layer: l.slayer,
                    text: l.stext,
                    dir: l.direction
                });
            }
            return j;
        };
        loadfromurl.onclick = async function () {
            var j = JSON.parse(await(await fetch(url.value)).text());
            window.loadLevel(j);
        };
        lfile.onchange = function () {
            if (lfile.files[0]) {
                var r = new FileReader();
                r.onload = function () {
                    try {
                        var j = JSON.parse(r.result);
                        window.loadLevel(j);
                    } catch (e) {
                        window.alert("Failed to load JSON. \n" + e);
                    }
                };
                r.readAsText(lfile.files[0]);
            }
            lfile.value = "";
        };
        dataout.onchange = function () {};
        
        savetext.onclick = function () {
            document.getElementById("exporttext").value = JSON.stringify(
                    window.saveLevel(),
                    null,
                    "\t");
        };
        save.onclick = function () {
            var blob = new Blob([JSON.stringify(window.saveLevel(), null, "\t")], {
                type: "application/json",
            });
            var url = URL.createObjectURL(blob);
            var a = document.createElement("a");
            a.href = url;
            a.download = "gvbvdxx sonic engine level.json";
            a.click();
        };
        setInterval(() => {}, 10);
        var shiftHeld = false;
        window.onkeydown = function (e) {
            if (enablekey) {
                if (e.key.toLowerCase() == "shift") {
                    shiftHeld = true;
                }
                if (e.key == "r") {
                    //reset the scroll to 0,0.
                    scroll[0] = 0;
                    scroll[1] = 0;
                }
                if (e.key == "a") {
                    //rotate sprites!
                    if (supportsrotation) {
                        editorsprite.direction = scr_wrap_angle((editorsprite.direction + 45) - 90) + 90;
                    }
                }
                if (e.key == "l") {
                    selectedlayer += 1;
                    if (selectedlayer > 3) {
                        selectedlayer = 0;
                    }
                }
                if (e.key == "ArrowLeft") {
                    scroll[0] += 128;
                    e.preventDefault();
                }
                if (e.key == "ArrowRight") {
                    scroll[0] -= 128;
                    e.preventDefault();
                }
                if (e.key == "ArrowUp") {
                    scroll[1] += 128;
                    e.preventDefault();
                }
                if (e.key == "ArrowDown") {
                    scroll[1] -= 128;
                    e.preventDefault();
                }
                if (e.key == " ") {
                    //remember, the space bar is a whitespace of the event key value.
                    try {
                        addTile(
                            editorsprite.sx,
                            editorsprite.sy,
                            editorsprite.sid,
                            editorsprite.stype,
                            selectedlayer,
                            editorsprite.stext,
                            editorsprite.direction);
                    } catch (e) {
                        window.alert(e);
                    }
                    e.preventDefault();
                }
                if (e.key == "c") {
                    removeTile(editorsprite.sx, editorsprite.sy, selectedlayer);
                    e.preventDefault();
                }
            }
        };
        window.onkeyup = function (e) {
            if (e.key.toLowerCase() == "shift") {
                shiftHeld = false;
            }
        };
        var i = 0;
        var tileSelection = document.getElementById("tileSelection");
        var tileselectionfetch = await(await fetch("editor/tileselect.json")).json();
        function createButton(tileButton) {
            var newimg = document.createElement("img");
            if (tileButton.src) {
                newimg.src = tileButton.src;
            }
            if (tileButton.usedefault) {
                newimg.src = tiles[tileButton.id].src;
            }
            if (tileButton.defaulttile) {
                currenttile = tileButton.id;
            }
            var button = document.createElement("button");
            button.setAttribute("tileid", tileButton.id);
            button.onclick = function () {
                currenttile = this.getAttribute("tileid");
            };
            button.className = "tileSelect";
            button.append(newimg);
            return button;
        }
        for (var tileButton of tileselectionfetch.tileSelectButtons) {
            if (tileButton.islength) {
                var i = 0;
                var id = tileButton.startingNumber;
                while (tileButton.length > i) {
                    var data = {
                        usedefault: true,
                        id: tileButton.id + id
                    };
                    var button = createButton(data);
                    tileSelection.append(button);
                    i += 1;
                    id += 1;
                }
            } else {
                if (!tileButton.headertext) {
                    var button = createButton(tileButton);
                    tileSelection.append(button);
                } else {
                    if (i > 0) {
                        var br = document.createElement("br");
                        tileSelection.append(br);
                    }
                    var b = document.createElement("b");
                    b.textContent = tileButton.text;
                    tileSelection.append(b);
                    var br = document.createElement("br");
                    tileSelection.append(br);
                }
            }
            i += 1;
        }
        var bluebgspr = new window.GRender.SquareSprite(0, 0, null, 600, 360);
        bluebgspr.color = "#00a2ff";

        while (true) {
            await window.tickAsync();
            var i = 0;
            for (var button of tileSelection.children) {
                if (currenttile == button.getAttribute("tileid")) {
                    button.setAttribute("selected", true);
                } else {
                    button.setAttribute("selected", false);
                }
                i += 1;
            }
            if (!window.disableYLock) {
                if (scroll[1] < 0) {
                    scroll[1] = 0;
                }
            }
            if (scroll[0] > 0) {
                scroll[0] = 0;
            }
            editorsprite.image = tiles[currenttile];
            editorsprite.sid = currenttile;
            if (editorsprite.image) {
                editorsprite.width = tiles[currenttile].width;
                editorsprite.height = tiles[currenttile].height;
            }
            gridtoggle = true;
            supportsrotation = false;
            if (document.getElementById("grid").checked) {
                gridtoggle = false;
            }
            if (editorsprite.sid == "Motobug") {
                gridtoggle = false;
            }
            if (editorsprite.sid == "Ring") {
                gridtoggle = false;
            }
            if (editorsprite.sid == "Level exit") {
                gridtoggle = false;
            }
            if (editorsprite.sid == "Switch layer to 1") {
                gridtoggle = false;
            }
            if (editorsprite.sid == "Switch layer to 2") {
                gridtoggle = false;
            }
            if (editorsprite.sid == "Spring") {
                gridtoggle = false;
                supportsrotation = true;
            }
            if (monitorTypes[editorsprite.sid]) {
                gridtoggle = false;
            }
            if (gridtoggle) {
                editorsprite.sx =
                    Math.round((renderer.mousePos[0] - scroll[0]) / 128) * 128;
                editorsprite.sy =
                    Math.round((renderer.mousePos[1] - scroll[1]) / 128) * 128;
            } else {
				if (shiftHeld) {
					editorsprite.sx =
						Math.round((renderer.mousePos[0] - scroll[0]) / 1) * 1;
					editorsprite.sy =
						Math.round((renderer.mousePos[1] - scroll[1]) / 1) * 1;
				} else {
					editorsprite.sx =
						Math.round((renderer.mousePos[0] - scroll[0]) / 4) * 4;
					editorsprite.sy =
						Math.round((renderer.mousePos[1] - scroll[1]) / 4) * 4;
				}
            }

            function doRunSprite(s) {
                s.scale = 1;
                s.imageLocation = null;
                s.stype = "tile";
                s.type = "norm";
                if (s.sid == "Motobug") {
                    s.y += 50;
                    s.stype = "motobug";
                }
                if (s.sid == "Switch layer to 1") {
                    s.stype = "s1";
                    s.image = s1;
                    s.width = 36;
                    s.height = 36;
                }
                if (s.sid == "Switch layer to 2") {
                    s.stype = "s2";
                    s.image = s2;
                    s.width = 36;
                    s.height = 36;
                }
                if (s.sid == "Level exit") {
                    s.stype = "sign";
                }
                if (s.sid == "Spring") {
                    s.width = 28;
                    s.height = 16;
                    s.stype = "springRed";
                    s.imageLocation = {
                        x: 132,
                        y: 0,
                        width: 28,
                        height: 16,
                    };
                }
                //if (s.sid == 41) {
                //    s.type = "text";
                //    s.stype = "text";
                //    s.color = "black";
                //    s.text = s.stext;
                //    s.size = 15;
                //    s.center = true;
                //    s.height = 15;
                //}
                if (monitorTypes[s.sid]) {
                    s.scale = 0.5;
                    s.stype = "monitor-" + monitorTypes[s.sid].type;
                    s.imageLocation = monitorTypes[s.sid].spriteLocation;
                    s.width = 56;
                    s.height = 64;
                }
                if (TilesScale[s.sid]) {
                    s.scale = TilesScale[s.sid];
                }
                if (s.sid == "Ring") {
                    s.stype = "ring";
                    s.imageLocation = {
                        x: 0,
                        y: 0,
                        width: 16,
                        height: 16,
                    };
                    s.width = 16;
                    s.height = 16;
                }
                if (ghzTiles[s.sid]) {
                    s.width = 128;
                    s.height = 128;
                    s.image = ghzTiles[s.sid];
                }
                if (s.slayer == selectedlayer) {
                    s.trs = 1;
                } else {
                    s.trs = 0.6;
                }
            }
            editorsprite.x = scroll[0] + editorsprite.sx;
            editorsprite.y = scroll[1] + editorsprite.sy;
            if (textvalue.value.length > 0) {
                editorsprite.stext = textvalue.value;
            } else {
                editorsprite.stext = null;
            }
            tileinfo.innerHTML = `X: ${editorsprite.sx} Y: ${editorsprite.sy} ID: ${editorsprite.sid} Layer: ${selectedlayer}`;
            doRunSprite(editorsprite);
            var a = [];
            var b = [];
            var realStuff = [];
            for (var ti of levels) {
                if (ti.stype == "tile") {
                    a.push(ti);
                } else {
                    b.push(ti);
                }
            }
            if (!supportsrotation) {
                editorsprite.direction = 90;
            }
            for (var bgspr of bgsprs) {
                bgspr.x = bgspr.bgpos[0];
                bgspr.y = (scroll[1] * bgspr.bgmult) + bgspr.bgpos[1];
            }
            for (var ti of b.concat(a)) {
                ti.x = scroll[0] + ti.sx;
                ti.y = scroll[1] + ti.sy;
                doRunSprite(ti);
                if (!(Math.abs(ti.x) > 360 + ((ti.width * ti.scale) / 2) ||
                        Math.abs(ti.y) > 400 + ((ti.height * ti.scale) / 2))) {
                    realStuff.push(ti);
                }
            }
            renderer.drawSprites([bluebgspr].concat(bgsprs).concat(realStuff).concat(editorsprite));
        }
    } catch (e) {
        window.alert(e);
    }
})();
