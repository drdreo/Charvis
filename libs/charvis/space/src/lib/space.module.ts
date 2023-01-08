import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CSSRendererService } from "./css-renderer.service";
import { MarkdownService } from "./markdown.service";
import { RendererService } from "./simulation/renderer.service";
import { SimulationService } from "./simulation/simulation.service";
import { WebglWorldService } from "./simulation/webgl-world.service";
import { SpaceComponent } from "./space.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: "", pathMatch: "full", component: SpaceComponent },
        ]), ],
    declarations: [ SpaceComponent ],
    providers: [ RendererService, SimulationService, WebglWorldService, MarkdownService, CSSRendererService ]
})
export class SpaceModule {
}
