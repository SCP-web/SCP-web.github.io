let titleManager = new TitleManager();
let mapManager = new MapManager();
function initDocument() {
    // https://github.com/jamesflorentino/nanoScrollerJS
    $(".nano").nanoScroller();
    $(".nano").nanoScroller({ alwaysVisible: true });
    $(".nano-pane").css("display", "block");
    mapManager.enter();
}