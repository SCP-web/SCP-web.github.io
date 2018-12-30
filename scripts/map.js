class MapManager extends Gamestate {
    constructor() {
        super();

        this.renderer = new THREE.WebGLRenderer({antialias: true});
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.controls = new THREE.OrbitControls(
            this.camera,
            this.renderer.domElement
        );

        this.controls.enableKeys = false;
        this.controls.enablePan = true;
        this.controls.enableRotate = true;
        this.controls.enableZoom = true;
        this.controls.enableDamping = false;
        
        //   controls.dampingFactor = 0.25;
        //   controls.enableZoom = true;
        //   controls.maxPolarAngle = Math.PI / 2.1;
        this.scene = new THREE.Scene();

        this.ray = new THREE.Raycaster();

        this.sites = [];

        this.selectedSite = undefined;

        this.animating = false;
    }

    addSite(...args) { 
        this.sites.push(new Site(...args));
        this.scene.add(this.sites[this.sites.length - 1].model);
    }

    selectSite(site) {
        this.selectedSite = site;
        this.zoom(
            site.model.viewPos, 
            site.model.camOffset
        );
        this.selectedSite.enter();
    }

    deselectSite() {
        this.selectedSite = undefined;
        this.resetCamera();
    }

    enter() {
        super.enter();
        this.resetCamera();

        console.log("Initialising scene");
        let cam = this.camera;
        let renderer = this.renderer;

        this.container = document.getElementById("map");
        this.container.appendChild(this.renderer.domElement);

        let plane = new THREE.GridHelper(1000, 50);
        plane.material.color = new THREE.Color("gray");
        this.scene.add(plane);
        
        this.addSite(
            "Site 1",
            new THREE.Vector3(0, 0, 0), 
            [
                // new Document("http://127.0.0.1:5500/assets/text/lorem_ipsum.txt"),
                new Document("http://127.0.0.1:5500/assets/text/sites/1/SCP-9001.txt"),
                new Document("http://127.0.0.1:5500/assets/text/sites/1/SCP-9002.txt"),
            ]
        );

        this.animating = true;

        this.animate();
    }

    exit() {
        super.exit();
    }

    getPointer(event) {
        let pointer = event.changedTouches ? event.changedTouches[0] : event;
        let rect = this.container.getBoundingClientRect();
    
        return {
          x: ((pointer.clientX - rect.left) / rect.width) * 2 - 1,
          y: (-(pointer.clientY - rect.top) / rect.height) * 2 + 1,
          button: event.button
        };
    }

    getIntersect(pointer) {
        this.ray.setFromCamera(pointer, this.camera);
        return this.ray.intersectObjects(this.sites.map(scp => scp.model), true)[0] || false;
    }

    onPointerHover(self, event) {
        // console.log(this);  
        let intersect = self.getIntersect(self.getPointer(event));
        if (intersect) {
            //   console.log("hover");
        } else {
            //   console.log("no");
        }
    }

    onPointerDown(self, event) {
        let intersect = self.getIntersect(self.getPointer(event));
        if (intersect) {
            //   console.log("clicked", intersect);
            if  (   intersect.object.managingClass !== undefined &&
                    typeof intersect.object.managingClass.onPointerDown === "function"
                ) {
                this.selectSite(intersect.object.managingClass);
            }
        }
    }

    onResize(self, event) {

        console.log("resizing canvas", self);

        let width = self.container.getBoundingClientRect().width;
        let height = self.container.getBoundingClientRect().height;
        self.renderer.setSize(width, height);
        self.camera.aspect = width / height;
        self.camera.updateProjectionMatrix();
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    /*
    * @param pos: the position we want to look at
    * @param camPos: the position of the camera relative to pos
    */
    zoom(pos, camPos) {
        let cam = this.camera;

        let from = {
            x: cam.position.x,
            y: cam.position.y,
            z: cam.position.z
        };
    
        let to = pos.clone().add(camPos);

        let controls = this.controls;

        // controls.enabled = false;
        controls.enableRotate = false;

        //   console.log("zooming from", from, "to", to);
    
        new TWEEN.Tween(from)
            .to(to, 900)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                cam.position.set(this.x, this.y, this.z);
            })
            .onComplete(function() {
                cam.updateProjectionMatrix();
                controls.update();
            })
            .start();
    
        new TWEEN.Tween(controls.target)
            .to(pos, 900)
            .easing(TWEEN.Easing.Quadratic.Out)
            .onUpdate(function() {
                cam.lookAt(this.x, this.y, this.z);
                controls.target = new THREE.Vector3(this.x, this.y, this.z);
                controls.update();
            })
            .onComplete(function() {
                cam.updateProjectionMatrix();
                // controls.enabled = true;
                controls.enableRotate = true;
                controls.update();
            })
            .start();
        
    }

    resetCamera() {
        this.zoom(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 100, 400));
    }

    animate(mapMan) {

        if (mapMan === undefined) mapMan = this;

        requestAnimationFrame(() => this.animate(mapMan));
        if (this.animating) {
            this.render();
            TWEEN.update();
        }
    }
    
}

