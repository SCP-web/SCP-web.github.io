class Document extends Gamestate {
    constructor(file, keywords) {
        super();
        this.site = null;
        this.name = file.match(/(?:.*\/)*(.*)/)[1];
        this.currentWord = 0;
        this.lineBreaks = [];

        this.loadFile(file).then(text => {
            this.words = text.split(/[\n\s]+/);
            this.separators = text
            .match(/[\n\s]+/g)
            .map(s => s
                .replace(/\n/g, "<br>")
                .replace(/\t/g, "&nbsp&nbsp&nbsp&nbsp")
            );
        });
        
    }

    async loadFile(filepath) {
        let self = this;
        return fetch(filepath)
        .then(
            function(response) {
                if (response.status !== 200) {
                    console.log('Got invalid status code: ' +
                    response.status + ' when fetching text for document ' + this.name, document);
                    return;
                }
                return response.text();
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

    onKeyDown(self, event) {
        // console.log(self, event);

        switch (event.key) {
            case "ArrowRight":
            case "d":
                event.preventDefault();
                this.currentWord++;
                if (this.currentWord >= this.words.length - 1)
                    this.currentWord = 0;
                break;
            case "ArrowLeft":
            case "a":
                event.preventDefault();
                this.currentWord--;
                if (this.currentWord < 0)
                    this.currentWord = this.words.length - 2;
                break;
            case "ArrowDown":
            case "s":
                event.preventDefault();
                {
                    if (this.lineBreaks[this.lineBreaks.length - 2] <= this.currentWord) {
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
                event.preventDefault();

                {
                    let lBreak = this.lineBreaks
                        .reduce((acc, br) => acc += (br <= this.currentWord ? 1 : 0), -2)
                    if (lBreak === -1) {
                         // already at the top of the document
                        break;
                    }
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
                event.preventDefault();
                self.scanWord();
                break;

            case "Escape":
                event.preventDefault();
                self.exit();
                mapManager.enter();
                this.site.enter();
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
        // $(".nano").nanoScroller({ scrollTop: this.getWordBounds(this.currentWord).top });
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
        let lastTop = undefined;
        let lineBreaks = [];
        for (let i = 0; i < words.length; i++) {
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

    debugCheck(message) {
        if (message === undefined)
            message = "";

        let wTags = document
            .getElementById("document")
            .getElementsByTagName('w');

        // if(this.currentWord < 0 || this.currentWord >= this.words.length || typeof this.currentWord !== 'number')
        //     throw new Error("Bad up: " + this.currentWord + " (" + this.words[this.currentWord] + ")");
        // console.log(message, this.lineBreaks);
        // console.log("words:" + words.length, "lineBreaks", lineBreaks.length);
        console.log("top", wTags[0].getBoundingClientRect().top);
    }
}