import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Object3D } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
    BaseEvent,
    Event,
    EventDispatcher,
} from "three/src/core/EventDispatcher";
import { RendererObjectHelper } from "./renderer-object.helper";

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
    private objectHelper = new RendererObjectHelper();

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
        this.scene.add(this.objectHelper.getLineBox(1, id));
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

    addTestCube(): void {
        const obj = this.objectHelper.getTestBox(5);
        this.addObject(obj);
    }

    createPdfFrame(pdfCanvas: HTMLCanvasElement) {
        const obj = this.objectHelper.getPdf(pdfCanvas);
        this.addObject(obj);
    }

    addTestDocument(pdf: THREE.Mesh): void {
        const obj = this.objectHelper.getTestDocument(pdf);
        this.addObject(obj);
    }

    addPdf(pdfCanvas: HTMLCanvasElement) {
        const obj = this.objectHelper.getPdf(pdfCanvas);
    }

    private createFloorGrid() {
        const grid = this.objectHelper.createFloorGrid();
        this.scene.add(grid);
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
            const cube = this.objectHelper.getLineBox(1);
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
}
