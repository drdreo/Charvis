import { Injectable } from "@angular/core";
import { Vec3 } from "cannon-es";
import CannonDebugger from "cannon-es-debugger";
import { Quaternion, Vector3 } from "three";
import { RendererService } from "./renderer.service";
import { SimulationService } from "./simulation.service";
import { PDFService } from "../pdf/pdf.service";

@Injectable({ providedIn: "root" })
export class WebglWorldService {
    private cannonDebugger: any;

    constructor(
        private renderer: RendererService,
        private simulation: SimulationService,
        private pdfService: PDFService,
    ) {}

    loop(): void {
        this.simulation.step(1 / 60); // Advance the simulation by 1/60th of a second
        this.cannonDebugger.update();

        const bodies = this.simulation.getBodies();
        const meshes = this.renderer.getObjectsWithBody();
        // Update the position and orientation of the meshes to match the bodies in the simulation
        for (const mesh of meshes) {
            const bodyId = mesh.bodyId;
            if (!bodyId) {
                console.warn("Mesh has no body");
                continue;
            }

            const body = bodies[bodyId];
            if (!body) {
                console.warn("Could not find body for mesh: ", mesh.id);
                continue;
            }
            mesh.position.copy(convertVecToVector(body.position));
            mesh.quaternion.copy(body.quaternion as unknown as Quaternion);
        }
        // component.renderer.lockCube();
        this.renderer.render();
    }

    startWEBGlRendering(canvas: HTMLCanvasElement): void {
        this.renderer.init({
            canvas: canvas,
            width: canvas.clientWidth,
            height: canvas.clientHeight,
        });
        // this.simulation.init(); // creates dummy bodies

        // testing PDFs
        setTimeout(() => {
            this.pdfService
                .loadPdf("assets/test.pdf")
                .then((canvasElements) => {
                    canvasElements.forEach((canvasElement) => {
                        this.renderer.addPdf(canvasElement);
                    });
                });
        }, 3000);
        // this.renderer.addTestDocument();
        // const bodies = this.simulation.getBodies();
        // bodies.forEach((body) => this.renderer.addCube(body.id));

        this.cannonDebugger = CannonDebugger(
            this.renderer.getScene(),
            this.simulation.getWorld(),
            {},
        );

        window.addEventListener(
            "resize",
            () => {
                console.log("resize", canvas.clientWidth);

                this.renderer.onCanvasResize(
                    canvas.clientWidth,
                    canvas.clientHeight,
                );
            },
            false,
        );

        // this.addResizeObserver(canvas: HTMLCanvasElement);
    }

    private addResizeObserver(canvas: HTMLCanvasElement): void {
        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                console.log("width", entry.contentRect.width);
                console.log("height", entry.contentRect.height);
            });
        });

        observer.observe(canvas);
    }
}

function convertVecToVector(vec: Vec3) {
    return new Vector3(vec.x, vec.y, vec.z);
}
