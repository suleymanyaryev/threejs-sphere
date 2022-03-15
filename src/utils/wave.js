import * as THREE from "three";
import imagesLoaded from "imagesloaded";
import { gsap } from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Emitter from "./emitter";
import someV from "./some-v";
import lodash from "lodash";
import ASScroll from "@ashthornton/asscroll";

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

export class Y {
    constructor(e) {
        this.element = e.dom;
        this.asscroll = e.asscroll;

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
        this.maxPos =
            document.querySelector(".about__separator").getBoundingClientRect()
                .left + window.innerHeight;
        this.minPos = document
            .querySelector(".l__projects")
            .getBoundingClientRect().left;
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

        this.imageStore = this.allImages.map((image) => {
            let imageRect = image.getBoundingClientRect();
            let geometry = new THREE.PlaneGeometry(
                imageRect.width,
                imageRect.height,
                16,
                16
            );
            let material = this.loader.load(image.src);
            material.needsUpdate = !0;
            let materialClone = this.material.clone();
            this.materials.push(materialClone);
            materialClone.uniforms.uImage.value = material;
            let l = new THREE.Mesh(geometry, materialClone);
            this.imagesGroup.add(l);

            return {
                img: image,
                mesh: l,
                top: imageRect.top - window.innerHeight,
                left:
                    imageRect.left -
                    (window.innerWidth +
                        document.querySelector(".l__separator").offsetWidth),
                width: imageRect.width,
                height: imageRect.height,
            };
        });
    }

    setImagesPositions() {
        this.scene.add(this.imagesGroup);
        this.imageStore.forEach((e) => {
            const y =
                -e.top -
                document
                    .querySelector(".projects__container")
                    .getBoundingClientRect().top;

            const x =
                e.left -
                this.viewport.width / 2 +
                e.width / 2 +
                this.viewport.width;

            e.mesh.position.y = y;

            e.mesh.position.x = x;
        });
    }

    addEventListeners() {
        window.addEventListener("resize", this.onResize.bind(this));
        window.addEventListener("wheel", () => {
            this.scrollSpeed =
                ((this.asscroll.currentPos - this.asscroll.targetPos) /
                    this.viewport.width) *
                15;
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

        this.asscroll.currentPos > this.minPos &&
            this.asscroll.currentPos < this.maxPos &&
            (this.setImagesPositions(), this.render());
        window.requestAnimationFrame(this.update);
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }
}

class d extends Emitter {
    constructor({ element: e, elements: t }) {
        super();
        this.selector = e;
        this.selectorChildren = someV({}, t);
        this.create();
        this.addEventListeners();
    }

    create() {
        this.selector instanceof window.HTMLElement
            ? (this.element = this.selector)
            : (this.element = document.querySelector(this.selector));
        this.elements = {};

        lodash.each(this.selectorChildren, (e, t) => {
            e instanceof window.HTMLElement ||
            e instanceof window.NodeList ||
            Array.isArray(e)
                ? (this.elements[t] = e)
                : ((this.elements[t] = document.querySelectorAll(e)),
                  this.elements[t].length === 0
                      ? (this.elements[t] = null)
                      : this.elements[t].length === 1 &&
                        (this.elements[t] = document.querySelector(e)));
        });
    }

    addEventListeners() {}
    removeEventListeners() {}
}

class K extends d {
    constructor(e, t) {
        super({
            componentId: "Projects",
            element: ".l__projects",
            elements: {
                projectsContainer: ".projects__container",
                projectItem: ".project__item",
            },
        });
        this.isDesktop = t;
        this.projectHeight =
            document.querySelector(".projects__introduction").offsetHeight +
            document.querySelector(".projects__container").offsetHeight;
        this.containerHeight = this.elements.projectsContainer.offsetHeight;
        this.asscroll = e;
        this.isDesktop && (this.loadCanvas(), this.initCustomAnimations());
    }

    loadCanvas() {
        new Y({
            dom: document.querySelector(".l__projects"),
            asscroll: this.asscroll,
        });
    }

    initCustomAnimations() {
        gsap.to(".l__projects", {
            scrollTrigger: {
                pin: !0,
                pinSpacing: !0,
                trigger: ".l__projects",
                horizontal: !0,
                end: `${this.containerHeight / 1.8}px`,
            },
        });

        gsap.to(".projects__container", {
            y: this.asscroll.currentPos - this.projectHeight,
            scrollTrigger: {
                trigger: ".l__projects",
                scrub: 0,
                horizontal: !0,
                start: "left left",
                end: `${this.containerHeight}px`,
            },
        });
    }
    addEventListeners() {}
    removeEventListeners() {}
}

class S {
    constructor({ element: e, elements: t, id: o }) {
        this.selector = e;
        this.selectorChildren = someV({}, t);
        this.id = o;
    }
    create() {
        (this.element = document.querySelector(this.selector)),
            (this.elements = {}),
            lodash.each(this.selectorChildren, (e, t) => {
                e instanceof window.HTMLElement ||
                e instanceof window.NodeList ||
                Array.isArray(e)
                    ? (this.elements[t] = e)
                    : (this.elements[t] = document.querySelectorAll(e)),
                    this.elements[t].length === 0
                        ? this.elements[t]
                        : this.elements[t].length === 1 &&
                          (this.elements[t] = document.querySelector(e));
            });
    }
}

gsap.registerPlugin(ScrollTrigger);

class ee extends S {
    constructor(e) {
        super({ id: "main", element: ".l__content", elements: {} });
        this.asscroll = new ASScroll({
            disableRaf: !0,
            touchScrollType: "scrollTop",
        });
        this.isDesktop = e;
        this.initScroll();
        this.initComponents();
    }

    initComponents() {
        new K(this.asscroll, this.isDesktop).create();
    }

    initScroll() {
        const e = this.asscroll;
        gsap.ticker.add(e.update);
        ScrollTrigger.defaults({ scroller: ".l__content" });
        ScrollTrigger.scrollerProxy(".l__content", {
            scrollLeft(t) {
                return arguments.length ? (e.currentPos = t) : e.currentPos;
            },
            getBoundingClientRect() {
                return {
                    top: 0,
                    left: 0,
                    width: window.innerWidth,
                    height: window.innerHeight,
                };
            },
        });
        e.on("update", ScrollTrigger.update);
        ScrollTrigger.addEventListener("refresh", e.resize);
        e.enable({ horizontalScroll: window.innerWidth > 1024, reset: !0 });
    }
}

export class BaseSome {
    constructor() {
        this.isDesktop = window.innerWidth > 1024;
        this.createContent();
    }

    createContent() {
        this.content = document.querySelector(".l__content");
        this.template = this.content.getAttribute("data-template");
        this.template === "mainPage" &&
            (this.currentPage = new ee(this.isDesktop));
    }
}
