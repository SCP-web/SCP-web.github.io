class Gamestate {
    constructor() {
        this.onPointerHoverAux = null;
        this.onPointerDownAux = null;
        this.onKeyDownAux = null;
        this.onResizeAux = null;
    }

    createEventListeners() {
        // console.log("creating event listeners", this);

         this.onPointerHoverAux = (event) => this.onPointerHover(this, event);
         this.onPointerDownAux = (event) => this.onPointerDown(this, event);
         this.onKeyDownAux = (event) => this.onKeyDown(this, event);
         this.onResizeAux = (event) => this.onResize(this, event);

        document.addEventListener("mousemove", this.onPointerHoverAux, false);
        document.addEventListener("touchmove", this.onPointerHoverAux, false);
        document.addEventListener( "mousedown", this.onPointerDownAux, false );
        document.addEventListener( "touchstart", this.onPointerDownAux, false );
        document.addEventListener( "keydown", this.onKeyDownAux, false );
        window.addEventListener("resize", this.onResizeAux);
    }

    destroyEventListeners() {
        // console.log("destroying event listeners", this);

        document.removeEventListener( "mousemove", this.onPointerHoverAux );
        document.removeEventListener( "touchmove", this.onPointerHoverAux );
        document.removeEventListener( "mousedown", this.onPointerDownAux );
        document.removeEventListener( "touchstart", this.onPointerDownAux );
        document.removeEventListener( "keydown", this.onKeyDownAux );    
        window.removeEventListener( "resize", this.onResizeAux );    
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

    onKeyDown(self, event) {
        // console.log(self, event);
    }

    onResize(self, event) {
        // console.log(self, event);
    }
}