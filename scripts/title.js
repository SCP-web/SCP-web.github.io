class TitleManager {

    constructor() {}

    startGame() {
        document.getElementById("title").style.display = "none";
        let container = document.getElementById('map');
        container.style.display = "block";
        mapManager.renderer.setSize(container.getBoundingClientRect().width, container.getBoundingClientRect().height);
    }
}