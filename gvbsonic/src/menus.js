async function runLevelsInOrder(domus) {
	//You can put intro cutsenes here before the levels start,
	//make sure to use "window.sprites = [];"!
	
	//Also you can have a fade transition by using "window.transitionFadeIn();" and "window.transitionFadeOut();".
	//You can also use that as an async function.
	
    for (var l of window.files.levelorder) {
        var handlerValue = await dolevel(l, false);
		if (handlerValue = "exit") {
			domus();
			return;
		}
    }
	
	//You can put cutsenes here when the game is finished.
	
}

function getIsElectron() {
	return window.isElectron;
}

var windowedMode = true;

window.doMenus = async function () {
	setTitleInfo("Main Menu");
    var isInMenu = true;
    window.curMenu = "main";
    window.SonicmenuMusic = null;
    function playmusic() {
        SonicmenuMusic = new window.AudioApiReplacement(window.files.menumusic.main);
        SonicmenuMusic.looped = true;
        SonicmenuMusic.setVolume(1);
        SonicmenuMusic.play();
        SonicmenuMusic.onended = playmusic;
    }
    playmusic();
	var mainMenuIndex = 0;
	var optionMenuIndex = 0;
	
	
	
    while (isInMenu) {
        switch (curMenu) {
        case 'main':
			var ElectronOnlyMenus = [
				new window.GRender.Sprite(0, 0, window.files.menuStuff.exit, 41, 15),
                new window.GRender.Sprite(0, 0, window.files.menuStuff.options, 87, 15)
			];
			if (!(getIsElectron())) {
				ElectronOnlyMenus = [];
			}
            var selected = await runMenu([
                        new window.GRender.Sprite(0, 0, window.files.menuStuff.play, 46, 15)
                    ].concat(ElectronOnlyMenus), false, mainMenuIndex);
			mainMenuIndex = selected;
            if (selected == 0) {
                isInMenu = false;
				window.transitionFadeIn();
                runLevelsInOrder(window.doMenus);
            }
            if (selected == 1) {
                window.close();
            }
			if (selected == 2) {
                optionMenuIndex = 0;
				window.curMenu = "options";
            }
            break;
		case 'options':
			if (window.remote) {
				var thisWindow = window.currentWindow;
			} else {
				window.alert("Im unable to find the remote access to the main process. :/\nsomething is not right!");
			}
			var fullscreenOption = new window.GRender.TextSprite(0, 0, null, 87, 15);
			fullscreenOption.color = "black";
			fullscreenOption.center = true;
			fullscreenOption.text = "Windowed Mode: ";
			if (windowedMode) {
				fullscreenOption.text += "Yes";
			} else {
				fullscreenOption.text += "No";
			}
			
			var selected = await runMenu([
                        new window.GRender.Sprite(0, 0, window.files.menuStuff.back, 50, 15),
						fullscreenOption
                    ], true, optionMenuIndex);
			optionMenuIndex = selected;
			if (selected == 0) {
				window.curMenu = "main";
			}
			if (selected == 1) {
				windowedMode = !windowedMode;
				thisWindow.setFullScreen(!windowedMode);
			}
            break;
        default:
        }
    }
    SonicmenuMusic.onended = () => {};
    SonicmenuMusic.pause();
}
