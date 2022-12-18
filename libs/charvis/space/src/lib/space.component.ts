import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from "@angular/core";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";


// https://github.com/pmndrs/drei

@Component({
    selector: "charvis-space",
    templateUrl: "./space.component.html",
    styleUrls: [ "./space.component.scss" ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaceComponent implements AfterViewInit {

    @ViewChild('spaceCanvas') private canvasRef: ElementRef;
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private loader = new THREE.TextureLoader();
    private camera: THREE.PerspectiveCamera;
    private controls: OrbitControls;
    //* Scene Properties
    private fieldOfView = 25;
    private nearClippingPlane = 1;
    private farClippingPlane = 1000;

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    ngAfterViewInit() {
        this.createScene();
        this.startRenderingLoop();
    }

    public animateCube(): void {
        const group = this.scene.children[0];
        const prevRotation = group.rotation.clone();
        group.quaternion.copy(this.camera.quaternion);

        let lockX, lockY;

        const lockZ = true;

        if (lockX) group.rotation.x = prevRotation.x;
        if (lockY) group.rotation.y = prevRotation.y;
        if (lockZ) group.rotation.z = prevRotation.z;
    }

    private createGrid() {
        const size = 100;
        const divisions = 100;
        // const grid = new THREE.InfiniteGridHelper(60, 60);

        const gridHelper = new THREE.GridHelper(size, divisions, 0x2080ff);
        this.scene.add(gridHelper);
    }

    private getAspectRatio() {
        return this.canvas.clientWidth / this.canvas.clientHeight;
    }

    private createCube(): any {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const edges = new THREE.EdgesGeometry(geometry);
        const wireframe = new THREE.WireframeGeometry(geometry);

        // const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
        const line = new THREE.LineSegments(wireframe, new THREE.LineBasicMaterial({ color: 0xffffff }));
        line.material.depthTest = false;
        line.material.opacity = 0.45;
        line.material.transparent = true;
        return line;
        // return new THREE.Mesh(geometry, material);
    }

    private createScene() {
        //* Scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000)

        const group = this.createGroup();
        this.scene.add(group);
        this.scene.add(this.createCube());
        this.scene.add(new THREE.AmbientLight(0x222222));

        this.createGrid();
        //* Camera
        const aspectRatio = this.getAspectRatio();
        this.camera = new THREE.PerspectiveCamera(
            this.fieldOfView,
            aspectRatio,
            this.nearClippingPlane,
            this.farClippingPlane
        )

    }

    /**
     * Start the rendering loop
     *
     * @private
     * @memberof CubeComponent
     */
    private startRenderingLoop() {
        //* Renderer
        // Use canvas element in template
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas });
        this.renderer.setPixelRatio(devicePixelRatio);
        this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);


        // Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.camera.position.set(0, 20, 400);
        this.controls.update();

        const component: SpaceComponent = this;
        (function render() {
            requestAnimationFrame(render);
            component.animateCube();
            component.renderer.render(component.scene, component.camera);
        }());
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
}
