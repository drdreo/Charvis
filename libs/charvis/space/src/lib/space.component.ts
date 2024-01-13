import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation
} from "@angular/core";
import { CSSRendererService } from "./css-renderer.service";
import { DebugService } from "./debug.service";
import { WebglWorldService } from "./simulation/webgl-world.service";


// https://github.com/pmndrs/drei


@Component({
    selector: "charvis-space",
    templateUrl: "./space.component.html",
    styleUrls: [ "./space.component.scss" ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None // because JS created elements dont work otherwise, todo: refactor to create in template instead
})
export class SpaceComponent implements AfterViewInit {


    @ViewChild('spaceCanvas') private canvasRef: ElementRef;
    @ViewChild('spaceContainer') private spaceContainerRef: ElementRef;


    constructor(
        private debugService: DebugService,
        private webglWorldService: WebglWorldService,
        private cssRenderer: CSSRendererService) {

    }

    private get canvas(): HTMLCanvasElement {
        return this.canvasRef.nativeElement;
    }

    private get container(): HTMLElement {
        return this.spaceContainerRef.nativeElement;
    }

    ngAfterViewInit() {
        this.startWebGLRendering();
        // this.startCSSRendering();

        this.startAnimationLoop();

        this.debugService.enable();
    }

    private startAnimationLoop() {
        const component: SpaceComponent = this;
        (function render() {
            component.simulationLoop(component.webglWorldService);

            component.debugUpdate(component.debugService);
            requestAnimationFrame(render);

            // component.cssLoop(component.cssRenderer);
        }());
    }

    private startWebGLRendering() {
        this.webglWorldService.startWEBGlRendering(this.canvas);
    }

    private startCSSRendering() {
        this.cssRenderer.init({
            element: this.container,
            width: this.container.clientWidth,
            height: this.container.clientHeight
        });
    }

    private simulationLoop(worldService: WebglWorldService) {
        worldService.loop();
    }

    private cssLoop(cssRenderer: CSSRendererService) {
        cssRenderer.loop();
    }

    private debugUpdate(debugService: DebugService) {
        debugService.update();
    }
}
