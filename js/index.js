let titleManager = new TitleManager();
let mapManager = new MapManager();

let gamestates = [];
function getGamestate(num) {

    if (num === undefined)
        num = -1;
    if (typeof num === "number") {
        if (num < 0 ) {
            if (-num > gamestates.length)
                throw new RangeError("Gamestate " + num + " out of bounds");
            return gamestates[gamestates.length + num];
        } else {
            if (num >= gamestates.length)
                throw new RangeError("Gamestate " + num + " out of bounds");
            return gamestates[num];
        }

    }

}

function initDocument() {
    // https://github.com/jamesflorentino/nanoScrollerJS
    $(".nano").nanoScroller();
    $(".nano").nanoScroller({ alwaysVisible: true });
    $(".nano-pane").css("display", "block");
    mapManager.container = document.getElementById("map");
    mapManager.container.appendChild(mapManager.renderer.domElement);
    titleManager.enter();
}