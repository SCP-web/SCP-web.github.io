class Gamestate {
    constructor() {

    }

    createEventListeners() {
        // console.log("creating event listeners", this);

        let onPointerHoverAux = (event) => this.onPointerHover(this, event);
        let onPointerDownAux = (event) => this.onPointerDown(this, event);
        let onKeypressAux = (event) => this.onKeypress(this, event);

        document.addEventListener("mousemove", onPointerHoverAux, false);
        document.addEventListener("touchmove", onPointerHoverAux, false);
        document.addEventListener( "mousedown", onPointerDownAux, false );
        document.addEventListener( "touchstart", onPointerDownAux, false );
        document.addEventListener( "keypress", onKeypressAux, false );

        this.destroyEventListeners = () => {
            // console.log("destroying event listeners", this);

            document.removeEventListener( "mousemove", onPointerHoverAux );
            document.removeEventListener( "touchmove", onPointerHoverAux );
            document.removeEventListener( "mousedown", onPointerDownAux );
            document.removeEventListener( "touchstart", onPointerDownAux );
            document.removeEventListener( "keypress", onKeypressAux );    
        }
    }

    enter() {
        this.createEventListeners();
    }

    exit() {
        this.destroyEventListeners();
    }

    onPointerHover(self, event) {
        console.log(self, event);
    }

    onPointerDown(self, event) {
        // console.log(event);
    }

    onKeypress(self, event) {
        // console.log(event);
    }
}