class TitleManager extends Gamestate {

    constructor() {
        super();
    }

    startGame() {
        document.getElementById("title").style.display = "none";
        this.exit();
        mapManager.enter();
    }
}