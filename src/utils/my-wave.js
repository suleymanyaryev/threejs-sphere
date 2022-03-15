import * as THREE from "three";
import imagesLoaded from "imagesloaded";

const vertexShader = `varying vec2 vUv;\r
#define PI 3.1415926535897932384626433832795

uniform float uScrollSpeed;\r
uniform vec2 uViewportSizes;\r
uniform float uHoverState;\r
uniform vec2 uHover;\r
uniform float uTime;

uniform mat4 projectionMatrix;
uniform mat4 modelViewMatrix;
attribute vec3 position;
attribute vec2 uv;


void main() {

    vec4 newPosition = modelViewMatrix * vec4(position, 1.0);

    float dist = distance(uv, uHover);

    newPosition.z += sin(newPosition.y / uViewportSizes.y * PI + PI / 2.0) * - (uScrollSpeed * 15.0);

    newPosition.z += (uHoverState * 6.0) * sin(dist * 10.0 + (uTime * 1.5));

    gl_Position = projectionMatrix * newPosition;

    vUv = uv;\r
}`;
const fragmentShader = `
precision mediump float;
uniform sampler2D uImage;

varying vec2 vUv;

void main(){\r
    gl_FragColor=texture2D(uImage,vUv);\r
}`;

var checkScrollSpeed = (function (settings) {
    settings = settings || {};

    var lastPos,
        newPos,
        timer,
        delta,
        delay = settings.delay || 50; // in "ms" (higher means lower fidelity )

    function clear() {
        lastPos = null;
        delta = 0;
    }

    clear();

    return function () {
        newPos = window.scrollY;
        if (lastPos != null) {
            // && newPos < maxScroll
            delta = newPos - lastPos;
        }
        lastPos = newPos;
        clearTimeout(timer);
        timer = setTimeout(clear, delay);
        return delta;
    };
})();

export class Wave {
    constructor() {
        this.element = document.querySelector(".wrapper");

        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };

        this.loader = new THREE.TextureLoader();
        this.scrollSpeed = 0;
        this.clock = new THREE.Clock();
        this.update = this.update.bind(this);
        this.allImages = [...document.querySelectorAll(".project__item__img")];
        this.loadedLength = 0;
        this.maxPos = document
            .querySelector(".app")
            .getBoundingClientRect().height;
        this.minPos = 0;
        this.mouse = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        const promises = new Promise((resolve) => {
            imagesLoaded(
                document.querySelectorAll(".project__item__img"),
                { background: !0 },
                resolve
            );
        });
        this.imagesGroup = new THREE.Group();
        Promise.all([promises]).then(() => {
            this.init();
        });
    }

    init() {
        this.addCanvas();
        this.addScene();
        this.addCamera();
        this.addImages();
        this.setImagesPositions();
        this.onResize();
        this.addEventListeners();
        this.update();
    }

    addCanvas() {
        this.renderer = new THREE.WebGLRenderer({
            antialias: !0,
            alpha: !0,
            powerPreference: "high-performance",
        });

        this.canvas = this.renderer.domElement;
        this.canvas.classList.add("webgl");
        this.element.appendChild(this.canvas);
    }

    addScene() {
        this.scene = new THREE.Scene();
    }

    addCamera() {
        this.camera = new THREE.PerspectiveCamera(
            70,
            this.viewport.width / this.viewport.height,
            100,
            2e3
        );
        this.scene.add(this.camera);
    }

    addImages() {
        this.material = new THREE.RawShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uImage: { value: 0 },
                uHover: { value: new THREE.Vector2(0.5, 0.5) },
                uHoverState: { value: 0 },
                uScrollSpeed: { value: this.scrollSpeed },
                uViewportSizes: {
                    value: new THREE.Vector2(
                        this.viewport.width,
                        this.viewport.height
                    ),
                },
            },
            fragmentShader: fragmentShader,
            vertexShader: vertexShader,
        });

        this.materials = [];

        this.imageStore = this.allImages.map((image, index) => {
            let imageRect = image.getBoundingClientRect();
            let geometry = new THREE.PlaneGeometry(
                400,
                (400 * imageRect.height) / imageRect.width,
                16,
                16
            );
            let material = this.loader.load(image.src);
            material.needsUpdate = !0;
            let materialClone = this.material.clone();
            this.materials.push(materialClone);
            materialClone.uniforms.uImage.value = material;
            let mesh = new THREE.Mesh(geometry, materialClone);
            this.imagesGroup.add(mesh);

            return {
                img: image,
                mesh: mesh,
                top: 600 * index,
                left: 100,
                width: 400,
                height: (400 * imageRect.height) / imageRect.width,
            };
        });
    }

    setImagesPositions() {
        this.scene.add(this.imagesGroup);
        this.imageStore.forEach((e) => {
            const y =
                -e.top -
                document.querySelector(".wrapper").getBoundingClientRect().top;
            const x = 0;

            e.mesh.position.y = y;
            e.mesh.position.x = x;
        });
    }

    addEventListeners() {
        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("wheel", () => {
            this.scrollSpeed = (checkScrollSpeed() / this.viewport.width) * 40;
        });
    }

    onResize() {
        this.viewport = {
            width: window.innerWidth,
            height: window.innerHeight,
        };
        this.camera.position.z = 700;
        this.camera.fov =
            2 *
            Math.atan(this.viewport.height / 2 / this.camera.position.z) *
            (180 / Math.PI);
        this.camera.aspect = this.viewport.width / this.viewport.height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.viewport.width, this.viewport.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.setImagesPositions();
    }

    update() {
        const e = this.clock.getElapsedTime();

        this.materials.forEach((t) => {
            t.uniforms.uTime.value = e;
            t.uniforms.uScrollSpeed.value = this.scrollSpeed;
        });

        this.setImagesPositions();
        this.render();
        window.requestAnimationFrame(this.update);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}
