import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SpaceComponent } from "./space.component";

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: "", pathMatch: "full", component: SpaceComponent },
        ]), ],
    declarations: [ SpaceComponent ],
})
export class CharvisSpaceModule {
}
