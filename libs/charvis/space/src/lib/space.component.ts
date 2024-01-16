import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
    ViewEncapsulation,
} from "@angular/core";
import { CSSRendererService } from "./css-renderer/css-renderer.service";
import { DebugService } from "./debug.service";
import { WorldService } from "./simulation/world.service";
import { TtsComponent } from "tts";

// https://github.com/pmndrs/drei

@Component({
    selector: "charvis-space",
    templateUrl: "./space.component.html",
    styleUrls: ["./space.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    standalone: true,
    imports: [TtsComponent],
})
export class SpaceComponent implements AfterViewInit {
    @ViewChild("spaceCanvas") private canvasRef: ElementRef;
    @ViewChild("spaceContainer") private spaceContainerRef: ElementRef;

    constructor(
        private debugService: DebugService,
        private worldService: WorldService,
        private cssRenderer: CSSRendererService,
    ) {}

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
            component.simulationLoop(component.worldService);

            component.debugUpdate(component.debugService);
            requestAnimationFrame(render);

            // component.cssLoop(component.cssRenderer);
        })();
    }

    private startWebGLRendering() {
        this.worldService.init(this.canvas);
    }

    private startCSSRendering() {
        this.cssRenderer.init({
            element: this.container,
            width: this.container.clientWidth,
            height: this.container.clientHeight,
        });
    }

    private simulationLoop(worldService: WorldService) {
        worldService.loop();
    }

    private cssLoop(cssRenderer: CSSRendererService) {
        cssRenderer.loop();
    }

    private debugUpdate(debugService: DebugService) {
        debugService.update();
    }
}
