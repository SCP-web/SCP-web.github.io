class Gamestate {
    constructor() {

    }

    createEventListeners() {
        // console.log("creating event listeners", this);

        let onPointerHoverAux = (event) => this.onPointerHover(this, event);
        let onPointerDownAux = (event) => this.onPointerDown(this, event);
        let onkeyDownAux = (event) => this.onkeyDown(this, event);
        let onResizeAux = (event) => this.onResize(this, event);

        document.addEventListener("mousemove", onPointerHoverAux, false);
        document.addEventListener("touchmove", onPointerHoverAux, false);
        document.addEventListener( "mousedown", onPointerDownAux, false );
        document.addEventListener( "touchstart", onPointerDownAux, false );
        document.addEventListener( "keydown", onkeyDownAux, false );
        window.addEventListener("resize", onResizeAux);

        this.destroyEventListeners = () => {
            // console.log("destroying event listeners", this);

            document.removeEventListener( "mousemove", onPointerHoverAux );
            document.removeEventListener( "touchmove", onPointerHoverAux );
            document.removeEventListener( "mousedown", onPointerDownAux );
            document.removeEventListener( "touchstart", onPointerDownAux );
            document.removeEventListener( "keydown", onkeyDownAux );    
            window.removeEventListener( "resize", onResizeAux );    
        }
    }

    enter() {
        this.createEventListeners();
        gamestates.push(this);
    }

    exit() {
        gamestates.pop();
        this.destroyEventListeners();
    }

    onPointerHover(self, event) {
        // console.log(self, event);
    }

    onPointerDown(self, event) {
        // console.log(event);
    }

    onkeyDown(self, event) {
        // console.log(self, event);
    }

    onResize(self, event) {
        // console.log(self, event);
    }
}