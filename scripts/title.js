class TitleManager {

    constructor() {}

    startGame() {
        document.getElementById("map").style.display = "block";
        document.getElementById("title").style.display = "none";
        let container = document.getElementById('map');
        mapManager.renderer.setSize(container.getBoundingClientRect().width, container.getBoundingClientRect().height);
    }
}