import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { MarkdownService } from "./markdown.service";
import { RendererService } from "./renderer.service";
import { SimulationService } from "./simulation.service";
import { SpaceComponent } from "./space.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: "", pathMatch: "full", component: SpaceComponent },
        ]), ],
    declarations: [ SpaceComponent ],
    providers: [ RendererService, SimulationService, MarkdownService ]
})
export class SpaceModule {
}
