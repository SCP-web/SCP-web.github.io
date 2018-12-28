class Document extends Gamestate {
    constructor(file) {
        super();
        // this.name = get.the.file.name;
        this.name = "Document";
        // this.content = get.the.file.content;

        this.tempString = "**Item #:** SCP-9001\n**Object Class:** Safe\nFlexure Strength: > 50 kN\n**Special Containment Procedures:**\nSCP-9001 is to be kept within a locked safe in Site-$$$. The safe should be composed of only opaque materials.\n**Description:**\nSCP-9001 is a reflective black cuboid 10cm in diameter. One face of SCP-9001 is slightly curved, while laser measurements indicate no bumps or depressions of any kind on any other faces. Apart from the curved face, all faced meet each other face at exactly 90 TODO degrees. No part of SCP-9001 can be damaged with conventional tools.\n\n**Addendum:** Monitored research session 9001-1\nParticipants:\tDr Jonas Knecht (K) - Examiner\n\t\t\tDr Cynthia Jefferson (J) - Surpervisor\n\nDate: 10/07/2017\n\nK: Beginning tensile strength testing\n\nK: 100N\n\nK: 200N\n\nK: 500N, I don't think this is going anywhere Cynthia\n\nJ: Move into kilonewton ranges, if we're going to report that this thing is indestructible be'd better at least be sure.\n\nK: 1kN\n\nK: 10kN\n\nK: 25kN\n\nK: 50kN. We'll have to call it there Cynthia, the only deformation is in our instruments.\n";
        this.loadFile(file);

        this.currentIndex = 0;
    }

    loadFile(filepath) {
        fetch(filepath)
        .then(
            function(response) {
            if (response.status !== 200) {
                console.log('Looks like there was a problem. Status Code: ' +
                response.status);
                return;
            }
        
            // Examine the text in the response
            response.json().then(function(data) {
                // this.tempString = data;
                console.log(data);
            });
            }
        )
        .catch(function(err) {
            console.log('Fetch Error :-S', err);
        });
    }

    enter() {
        document.getElementById("document").style.display = "block";
        this.updateHtml();
        super.enter();
    }

    exit() {
        document.getElementById("document").style.display = "none";
        super.exit();
    }

    onPointerHover() {
        // highlight words based on where the pointer is
    }

    onPointerDown() {
        this.scanWord();
    }

    onkeyDown(self, event) {
        // console.log(self, event);

        switch (event.key) {
            case "ArrowRight":
            case "d":
            this.currentIndex = this.nextSeparator(this.tempString, this.currentIndex) + 1;
            if (this.currentIndex === this.tempString.length + 1)
                this.currentIndex = 0;
                break;
            case "ArrowLeft":
            case "a":
                if (this.currentIndex === 0)
                    this.currentIndex = this.tempString.length;
                this.currentIndex = Math.max(
                    this.tempString.slice(0, this.currentIndex - 1).lastIndexOf(" ") + 1,
                    this.tempString.slice(0, this.currentIndex - 1).lastIndexOf("\n") + 1
                );
                break;
            case "Enter":
            case " ":
                self.scanWord();
                break;
            default:
                break;
        }

        this.updateHtml();
    }

    updateHtml() {
        document
            .getElementById("document")
            .getElementsByClassName("nano-content")[0]
            .innerHTML = this.processString();
        // update the scroll bar
        $(".nano").nanoScroller();
    }

    processString() {

        let nextSeparator = this.nextSeparator(this.tempString, this.currentIndex);

        return this.tempString
                .slice(0, this.currentIndex)
                .concat("<span class='highlight'>")
                .concat(
                    this.tempString
                        .slice(this.currentIndex, nextSeparator)
                ).concat("</span>")
                .concat(
                    this.tempString
                        .slice(nextSeparator) 
                )
                .replace(/\n/g, "<br>")
                .replace(/\t/g, "&nbsp&nbsp&nbsp&nbsp")
    }

    scanWord() {
        alert(
            "currentIndex: " + 
            this.currentIndex + 
            "\nword: " + 
            document.getElementById("document").getElementsByClassName("highlight")[0].textContent +
            "\nnextSeparator: " +
            this.nextSeparator(this.tempString, this.currentIndex)
        );
        // "scan" the currently highlighted word to see if it references any other articles
    }

    nextSeparator(string, index) {
        let nextSpace = string
            .slice(index)
            .indexOf(" ") + index;

        let nextNewline = string
            .slice(index)
            .indexOf("\n") + index;

        let nextSeparator = nextSpace;
        
        if ( (nextNewline !== -1 && nextNewline < nextSpace) || nextSpace === -1)
            nextSeparator = nextNewline;    

        if (nextSeparator === index - 1)
            nextSeparator = string.length;
        
        return nextSeparator
    }

    previousSeparator(string, index) {
        if (index === 0)
            return string.length;
        return Math.max(
            string.slice(0, index - 1).lastIndexOf(" ") + 1,
            string.slice(0, index - 1).lastIndexOf("\n") + 1
        );
    }
}