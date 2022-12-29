import { AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, ViewChild } from "@angular/core";
import { Vec3 } from "cannon-es";
import CannonDebugger from 'cannon-es-debugger'
import { Quaternion, Vector3 } from "three";
import { CSS3DObject } from "three/examples/jsm/renderers/CSS3DRenderer";
import { addHTML } from "./css-renderer.service";
import { MarkdownService } from "./markdown.service";
import { RendererService } from "./renderer.service";
import { SimulationService } from "./simulation.service";


import * as cssRend from './css-renderer.service';

// https://github.com/pmndrs/drei

// Table example: https://gist.github.com/Keith-Morris/9c4eebacf91617a822e2

@Component({
    selector: "charvis-space",
    templateUrl: "./space.component.html",
    styleUrls: [ "./space.component.scss" ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpaceComponent implements AfterViewInit {


    @ViewChild('spaceCanvas') private canvasRef: ElementRef;
    private cannonDebugger: any;


    constructor(private renderer: RendererService, private simulation: SimulationService, private markdown: MarkdownService) {

    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    ngAfterViewInit() {
       // this.startWEBGlRendering();

        const markdownObject = this.markdown.html;


        cssRend.init();
        cssRend.animate();
        cssRend.addHTML(markdownObject)
    }

    private startWEBGlRendering(){
        this.renderer.init({ canvas: this.canvas, width: this.canvas.clientWidth, height: this.canvas.clientHeight });
        this.simulation.init(); // creates dummy bodies

        const bodies = this.simulation.getBodies();
        bodies.forEach((body) => this.renderer.addCube(body.id));

        this.cannonDebugger = CannonDebugger(this.renderer.getScene(), this.simulation.getWorld(), {});

        this.startAnimationLoop();

        window.addEventListener('resize', () => {
            this.renderer.onCanvasResize(this.canvas.clientWidth, this.canvas.clientHeight);
        }, false);


        // this.addResizeObserver();
    }

    private startAnimationLoop() {
        let first = true;
        const component: SpaceComponent = this;
        (function render() {

            component.simulation.step(1 / 60); // Advance the simulation by 1/60th of a second
            component.cannonDebugger.update();

            const bodies = component.simulation.getBodies();
            const meshes = component.renderer.getObjectsWithBody();
            // Update the position and orientation of the meshes to match the bodies in the simulation
            for (const mesh of meshes) {
                const bodyId = mesh.bodyId;
                if (!bodyId) {
                    console.warn('Mesh has no body');
                    continue;
                }

                const body = bodies[bodyId];
                if (!body) {
                    console.warn('Could not find body for mesh: ', mesh.id);
                    continue;
                }
                mesh.position.copy(convertVecToVector(body.position));
                mesh.quaternion.copy(body.quaternion as unknown as Quaternion);

                if (first) {

                    first = false;
                    console.log(body.velocity);
                }
            }
            requestAnimationFrame(render);
            // component.renderer.lockCube();
            component.renderer.render();
        }());
    }

    private addResizeObserver() {
        const observer = new ResizeObserver(entries => {
            entries.forEach(entry => {
                console.log("width", entry.contentRect.width);
                console.log("height", entry.contentRect.height);
            });
        });

        observer.observe(this.canvas);
    }
}

function convertVecToVector(vec: Vec3) {
    return new Vector3(vec.x, vec.y, vec.z);
}