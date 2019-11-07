class Site extends Gamestate {
    constructor(name, pos, documents) {
        super();

        // this.debug = true;

        this.name = name;
        
        let geometry = new THREE.BoxGeometry(100, 100, 100);
        let material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        this.model = new THREE.Mesh(geometry, material);
        this.model.position.copy(pos);
        this.model.viewPos = this.model
            .position
            .clone()
            .add(new THREE.Vector3(-300, 0, 0));
        this.model.camOffset = this.model
            .position
            .clone()
            .add(new THREE.Vector3(0, 100, 400));    
        this.model.managingClass = this;

        this.documents = [];
        this.addDocuments(documents);

        this.selectedButton = null;
    }

    enter() {
        $('#map canvas').css('pointer-events', 'none');
        document.getElementById("doc-list").setAttribute('class', "opened");
        super.enter();
        this.updateDocList();
    }

    exit() {
        $('#map canvas').css('pointer-events', 'auto');
        document.getElementById("doc-list").setAttribute('class', "closed");
        super.exit();
    }

    createEventListeners() {
        super.createEventListeners();

        $("#doc-list>li").mouseenter((event) => {
            this.selectButton($(event.target));
        });

        $("#doc-list>li").mouseleave((event) => {
            $(event.target).removeClass("selected");
            this.selectedButton = null;
        });

        $("#doc-list>li").click((event) => {
            $(event.target).removeClass("selected");
            this.activateButton();
        });
    }

    destroyEventListeners() {
        super.destroyEventListeners();

        $("#doc-list>li").unbind("mouseenter");
        $("#doc-list>li").unbind("mouseleave");
        $("#doc-list>li").unbind("click");
    }

    addDocuments(...args) {
        for (let arg of args) {
            if (arg.constructor === Array) {
                this.documents = this.documents.concat(arg);
            } else {
                this.documents.push(document);
            }
        }

        if(this.debug) console.log('Site ' + this.name + 'added documents:', this.documents);
    }

    updateDocList() {
        this.destroyDocList();
        this.createDocList();
    }

    destroyDocList() {

        // console.log("Site " + this.name + " destroying event doclist");

        $('#doc-list').children(':not(:last-child)').remove();
        this.destroyEventListeners();
    }

    createDocList() {

        let docList = $('#doc-list');
        this.documents.forEach((doc, i) => {
            let listItem = document.createElement("li");
            listItem.innerHTML = doc.name;
            $(listItem).insertBefore('#doc-list>li:last');
            if(this.debug) console.log("Site " + this.name + " added document " + doc.name + ":", listItem);
        });

        this.selectButton(docList.children("li:first"));
        
        this.createEventListeners();
    }

    selectNextButton() {
        if (this.selectedButton === null || this.selectedButton.index() === $("#doc-list>li").length - 1) {
            this.selectButton($("#doc-list>li:first"));
        } else {
            this.selectButton(this.selectedButton.next());
        }
    }

    selectPreviousButton() {
        if (this.selectedButton === null || this.selectedButton.index() === 0) {
            this.selectButton($("#doc-list>li:last"));
        } else {
            this.selectButton(this.selectedButton.prev());
        }
    }

    selectButton(button) {
        if (this.selectedButton !== null) {
            this.selectedButton.removeClass("selected");
        }
        this.selectedButton = button;
        // TODO: might want make the selected document have text: ">&nbsp" + doc.name
        this.selectedButton.addClass("selected");
    }

    activateButton() {
        if (this.selectedButton === null)
            return;

        if (this.selectedButton.parent().index() < this.documents.length - 1)
            this.openDocument();
        else
            this.exit();
    }

    openDocument() {
        this.exit();
        getGamestate().exit();
        let documentToShow = this.documents[this.selectedButton.index()];
        if(this.debug) console.log('Site ' + this.name + ' opening document', (this.selectedButton.index() + 1) + ":", documentToShow.name);
        documentToShow.site = this;
        documentToShow.enter();
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

    onResize(self, event) {
        getGamestate(-2).onResize(getGamestate(-2), event);
        // let width = self.container.getBoundingClientRect().width;
        // let height = self.container.getBoundingClientRect().height;
        // self.renderer.setSize(width, height);
        // self.camera.aspect = width / height;
        // self.camera.updateProjectionMatrix();
    }
}