class TitleManager extends Gamestate {

    constructor() {
        super();
        this.selectedButton = null;
    }

    startGame() {
        document.getElementById("title").style.display = "none";
        this.exit();
        mapManager.enter();
    }

    createEventListeners() {
        super.createEventListeners();

        $(".menu-items>li").mouseenter((event) => {
            this.selectButton($(event.target).children("span"));
        });

        // $(".menu-items>li").mouseleave((event) => {
        //     $(event.target).children("span").removeClass("selected");
        // });

    }

    destroyEventListeners() {
        super.destroyEventListeners();
        $(".menu-items>li").unbind("mouseenter");
        // $(".menu-items>li").unbind("mouseleave");
    }

    onKeyDown(self, event) {
        switch (event.key) {
            case "ArrowDown":
            case "s":
                event.preventDefault();
                this.selectNextButton();
                break;
            case "ArrowUp":
            case "w":
                event.preventDefault();
                this.selectPreviousButton();
                break;

            case "Enter":
            case " ":
                event.preventDefault();
                this.activateButton();
                break;
            default:
                break;
        }
    }

    selectNextButton() {
        if (this.selectedButton === null || this.selectedButton.parent().index() === $(".menu-items>li").length - 1) {
            this.selectButton($(".menu-items>li:first>span"));
        } else {
            this.selectButton(this.selectedButton.parent().next().children("span"));
        }
    }

    selectPreviousButton() {
        if (this.selectedButton === null || this.selectedButton.parent().index() === 0) {
            this.selectButton($(".menu-items>li:last>span"));
        } else {
            this.selectButton(this.selectedButton.parent().prev().children("span"));
        }
    }

    activateButton() {
        switch (this.selectedButton.parent().index()) {
            case 0:
                this.startGame();
                break;
        
            default:
                console.error("Undefined behaviour for menu button " + this.selectedButton.text());
                break;
        }
    }

    selectButton(button) {
        if (this.selectedButton !== null) {
            this.selectedButton.removeClass("selected");
        }
        this.selectedButton = button;
        button.addClass("selected");
    }
}