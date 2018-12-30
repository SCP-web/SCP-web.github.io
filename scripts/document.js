class Document extends Gamestate {
    constructor(file, keywords) {
        super();
        // this.name = get.the.file.name;
        this.name = file.match(/(?:.*\/)*(.*)/)[1];
        // this.content = get.the.file.content;

        let tempString = "**Item #:** SCP-9001\n**Object Class:** Safe\nFlexure Strength: > 50 kN\n**Special Containment Procedures:**\nSCP-9001 is to be kept within a locked safe in Site-$$$. The safe should be composed of only opaque materials.\n**Description:**\nSCP-9001 is a reflective black cuboid 10cm in diameter. One face of SCP-9001 is slightly curved, while laser measurements indicate no bumps or depressions of any kind on any other faces. Apart from the curved face, all faced meet each other face at exactly 90 TODO degrees. No part of SCP-9001 can be damaged with conventional tools.\n\n**Addendum:** Monitored research session 9001-1\nParticipants:\tDr Jonas Knecht (K) - Examiner\n\t\t\tDr Cynthia Jefferson (J) - Surpervisor\n\nDate: 10/07/2017\n\nK: Beginning tensile strength testing\n\nK: 100N\n\nK: 200N\n\nK: 500N, I don't think this is going anywhere Cynthia\n\nJ: Move into kilonewton ranges, if we're going to report that this thing is indestructible be'd better at least be sure.\n\nK: 1kN\n\nK: 10kN\n\nK: 25kN\n\nK: 50kN. We'll have to call it there Cynthia, the only deformation is in our instruments.\n";

        this.words = tempString.split(/[\n\s]+/);
        this.separators = tempString
            .match(/[\n\s]+/g)
            .map(s => s
                .replace(/\n/g, "<br>")
                .replace(/\t/g, "&nbsp&nbsp&nbsp&nbsp")
            );
        this.currentWord = 0;
        this.lineBreaks = [];
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
                this.currentWord++;
                if (this.currentWord >= this.words.length - 1)
                    this.currentWord = 0;
                break;
            case "ArrowLeft":
            case "a":
                this.currentWord--;
                if (this.currentWord < 0)
                    this.currentWord = this.words.length - 1;
                break;
            case "ArrowDown":
            case "s":
                // word down
                {
                    if (this.lineBreaks[this.lineBreaks.length - 1] <= this.currentWord) {
                        // cursor is at the bottom
                        break;
                    }
                    let lBreak = this.lineBreaks.findIndex(b => b > this.currentWord);
                    let oldPos = this.getWordMid(this.currentWord);
                    this.currentWord = this.lineBreaks[lBreak];
                    let oldDist = Math.abs(
                        this.getWordMid(this.currentWord) - oldPos
                    );
                    let dist = Math.abs(
                        this.getWordMid(this.currentWord + 1) - oldPos
                    );
                    while (dist < oldDist && this.currentWord < this.lineBreaks[lBreak + 1] - 1) {
                        this.currentWord++;
                        oldDist = dist;
                        dist = Math.abs(
                            this.getWordMid(this.currentWord + 1) - oldPos
                        );
                    }
                }
                break;
            case "ArrowUp":
            case "w":
                // word up
                {
                    let lBreak = this.lineBreaks
                        .reduce((acc, br) => acc += (br <= this.currentWord ? 1 : 0), -2)
                    if (lBreak === -1) // already at the top of the document
                        break;
                    let oldPos = this.getWordMid(this.currentWord);
                    this.currentWord = this.lineBreaks[lBreak];
                    let oldDist = Math.abs(
                        this.getWordMid(this.currentWord) - oldPos
                    );
                    let dist = Math.abs(
                        this.getWordMid(this.currentWord + 1) - oldPos
                    );
                    let lineEnd = lBreak + 1 < this.lineBreaks.length ? this.lineBreaks[lBreak + 1] : this.words.length;
                    while (dist < oldDist && this.currentWord < lineEnd - 1) {
                        this.currentWord++;
                        oldDist = dist;
                        dist = Math.abs(
                            this.getWordMid(this.currentWord + 1) - oldPos
                        );
                    }
                }
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

    onResize(self, event) {
        // update line breaks
        this.lineBreaks = this.findBreaks();
        // update the scroll bar
        $(".nano").nanoScroller();
    }

    updateHtml() {
        document
            .getElementById("document")
            .getElementsByClassName("nano-content")[0]
            .innerHTML = this.processString();
        // update line breaks
        this.lineBreaks = this.findBreaks();
        // update the scroll bar
        $(".nano").nanoScroller();
    }

    processString() {
        let wTags = this.words
            .map(w => "<w>" + w + "</w>")
        
        wTags[this.currentWord] = "<w class='highlight'>" + this.words[this.currentWord] + "</w>";

        let html = "";

        wTags.forEach((w, i) => {
            html += w;
            if (i !== this.words.length - 1)
                html += this.separators[i];
        })
        
        return html;
    }

    findBreaks() {
        let words = document.getElementById("document").getElementsByTagName('w');
        let lastTop = 0;
        let lineBreaks = [];
        for (let i=0; i<words.length; i++) {
            let newTop = words[i].getBoundingClientRect().top;
            if (newTop !== lastTop) {
                // console.log("new line " + words[i].textContent + " at: " + newTop);
                lineBreaks.push(i);
                lastTop = newTop;
            }
        }
        return lineBreaks;
    }

    scanWord() {
        // "scan" the currently highlighted word to see if it references any other articles
        alert(
            "word: " + 
            this.words[this.currentWord]
        );
    }

    getWordBounds(wordIndex) {
        return document
            .getElementById("document")
            .getElementsByTagName('w')[wordIndex]
            .getBoundingClientRect();
    }

    getWordMid(wordIndex) {
        let bounds = this.getWordBounds(wordIndex);
        return bounds.left + (bounds.right - bounds.left) / 2;
    }
}