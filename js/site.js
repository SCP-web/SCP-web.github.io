class Site extends Gamestate {
    constructor(name, pos, documents) {
        super();
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

        this.selectedDoc = 0;
        this.documents = [];
        this.addDocuments(documents);
    }

    enter() {
        document.getElementById("doc-list").setAttribute('class', "opened");
        super.enter();
    }

    exit() {
        document.getElementById("doc-list").setAttribute('class', "closed");
        super.exit();
    }

    addDocuments(...args) {
        for (let arg of args) {
            if (arg.constructor === Array) {
                this.documents = this.documents.concat(arg);
            } else {
                this.documents.push(document);
            }
        }
        console.log("Documents", this.documents);
        this.updateDocList();
    }

    openDocument() {
        console.log("opening document", this.selectedDoc + ":", this.documents[this.selectedDoc].name);
        document.getElementById("map").style.display = "none";
        this.exit();
        getGamestate().exit();
        this.documents[this.selectedDoc].enter();
    }

    incrementDocList() {
        if (this.selectedDoc < this.documents.length - 1)
            this.selectedDoc++;
        this.updateDocList();
    }

    decrementDocList() {
        if (this.selectedDoc > 0)
            this.selectedDoc--;
        this.updateDocList();
    }

    updateDocList() {
        this.destroyDocList();
        this.createDocList();
    }

    destroyDocList() {
        let docList = document.getElementById("doc-list");
        while (docList.firstChild) {
            docList.removeChild(docList.firstChild);
        }
    }

    createDocList() {
        let docList = document.getElementById("doc-list");
        let selectedDoc = this.selectedDoc;
        this.documents.forEach((doc, i) => {
            let listItem = document.createElement("li");

            if (selectedDoc === i) {
                // listItem.innerHTML = ">&nbsp" + doc.name;
                listItem.setAttribute('class', "selected");
            } 
            // else {
            //     listItem.innerHTML = doc.name;
            // }
            listItem.innerHTML = doc.name;

            docList.appendChild(listItem);
        });
    }

    onKeyDown(self, event) {
        // console.log(event);

        switch (event.key) {
            case "ArrowUp":
            case "w":
                self.decrementDocList();
                break;
            case "ArrowDown":
            case "s":
                self.incrementDocList();
                break;
            case "Enter":
            case " ":
                self.openDocument();
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