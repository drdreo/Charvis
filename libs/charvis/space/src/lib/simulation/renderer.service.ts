import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Object3D } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
    BaseEvent,
    Event,
    EventDispatcher,
} from "three/src/core/EventDispatcher";

import { simpleFragmentShader, vertexShader } from "./shaders/fragment.shader";

declare module "three" {
    interface Object3D<E extends BaseEvent = Event> extends EventDispatcher<E> {
        bodyId?: number;
    }
}

interface RendererOptions {
    canvas: HTMLCanvasElement;
    width: number;
    height: number;
}

/**
 * The renderer service is responsible for everything visual. Creating meshes, material, lighting etc.
 */
@Injectable({ providedIn: "root" })
export class RendererService {
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private loader = new THREE.TextureLoader();
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;
    //* Scene Properties
    private fieldOfView = 5;
    private nearClippingPlane = 0.1;
    private farClippingPlane = 3000;
    private options: RendererOptions;

    private canvasSize: { width: number; height: number };

    private get aspectRatio(): number {
        return this.canvasSize.width / this.canvasSize.height;
    }

    getScene() {
        return this.scene;
    }

    init(options: RendererOptions) {
        this.options = options;
        this.canvasSize = { width: options.width, height: options.height };
        this.createScene(options);
        this.createRenderer(options);
        this.createControls();
    }

    lockCube(): void {
        const group = this.getAllObjects()[0];
        const prevRotation = group.rotation.clone();
        group.quaternion.copy(this.camera.quaternion);

        let lockX, lockY;

        const lockZ = true;

        if (lockX) group.rotation.x = prevRotation.x;
        if (lockY) group.rotation.y = prevRotation.y;
        if (lockZ) group.rotation.z = prevRotation.z;
    }

    addCube(id?: number): void {
        this.scene.add(this.createCube(id));
    }

    addObject(object: Object3D): void {
        console.debug("Adding object to scene: ", object);
        this.scene.add(object);
    }

    // filter out helper objects that are not in the simulation
    getObjectsWithBody() {
        return this.scene.children.filter(
            (obj) => typeof obj.bodyId === "number",
        );
    }

    getAllObjects() {
        return this.scene.children;
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onCanvasResize(width: number, height: number): void {
        this.canvasSize = { width, height };
        this.camera.aspect = this.aspectRatio;
        this.camera.updateProjectionMatrix(); // maybe not always needed
        this.renderer.setSize(width, height);
    }

    addTestDocument(): void {
        const height = 8;
        const width = 3;
        const geometry = new THREE.BoxGeometry(width, height, 1);
        // const material = new THREE.MeshBasicMaterial({
        //     color: 0xffffff,
        //     map: this.getHtmlTexture(),
        // });

        const material = this.getModernShaderMaterial();
        // center on origin
        const doc = new THREE.Mesh(geometry, material);
        doc.position.setX(width / 2);
        doc.position.setY(height / +2);

        this.addObject(doc);
    }

    private createFloorGrid() {
        const size = 1000;
        const divisions = 1000;

        const gridHelper = new THREE.GridHelper(size, divisions, 0x2080ff);
        this.scene.add(gridHelper);
    }

    private createCube(bodyId?: number): any {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const edges = new THREE.EdgesGeometry(geometry);

        const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xffff00 }),
        );
        line.material.depthTest = false;
        line.material.opacity = 0.45;
        line.material.transparent = true;

        if (bodyId) {
            line.bodyId = bodyId;
            console.log(line.bodyId);
        }
        return line;
    }

    private createScene(options: RendererOptions) {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);

        // const group = this.createGroup();
        // this.scene.add(group);
        // this.scene.add(this.createCube());
        this.scene.add(new THREE.AmbientLight(0x222222));
        this.scene.add(new THREE.AxesHelper(5));

        this.createFloorGrid();

        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            this.aspectRatio,
            this.nearClippingPlane,
            this.farClippingPlane,
        );

        // this.camera.up.set(0,1,0) // this is default
    }

    private createControls() {
        this.controls = new OrbitControls(
            this.camera,
            this.renderer.domElement,
        );
        // this.controls.enableDamping = true
        // this.controls.target.y = 0.5
        this.camera.position.set(0, 20, 400);
        this.controls.update();
    }

    private createGroup() {
        const n = 5;
        const group = new THREE.Group();

        for (let i = 0; i < n; i++) {
            const cube = this.createCube();
            cube.position.x += i * 1.5;
            group.add(cube);
        }

        return group;
    }

    /**
     * Start the rendering loop
     *
     * @private
     * @memberof CubeComponent
     */
    private createRenderer(options: RendererOptions) {
        this.renderer = new THREE.WebGLRenderer({ canvas: options.canvas });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(options.width, options.height);

        this.renderer.setClearColor(0x000000, 0);
        this.renderer.sortObjects = false;
        this.renderer.autoClear = false;

        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.physicallyCorrectLights = true;

        this.onCanvasResize(options.width, options.height);
    }

    private getHtmlTexture(): THREE.CanvasTexture {
        const canvas = document.createElement("canvas");
        canvas.width = 256;
        canvas.height = 256;

        const context = canvas.getContext("2d")!;
        context.fillStyle = "red";
        context.fillRect(0, 0, 256, 256);
        context.fillStyle = "white";
        context.font = "48px serif";
        context.fillText("Hello ThreeJS!", 20, 128);

        return new THREE.CanvasTexture(canvas);
    }

    private getModernShaderMaterial() {
        const uniforms = {
            topColor: { value: new THREE.Color(0xff77ff) },
            bottomColor: { value: new THREE.Color(0x0077ff) },
            uIntensity: { value: 1.0 },
            uResolution: {
                value: new THREE.Vector2(window.innerWidth, window.innerHeight),
            },
        };

        return new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertexShader,
            fragmentShader: simpleFragmentShader,
            wireframe: false,
            glslVersion: THREE.GLSL3,
            transparent: true,
        });
    }
}
