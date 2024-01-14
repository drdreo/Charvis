import { Injectable } from "@angular/core";
import Stats from "three/examples/jsm/libs/stats.module";

@Injectable({
    providedIn: "root",
})
export class DebugService {
    private stats = new (Stats as any)();

    enable() {
        this.stats.showPanel(1);
        document.body.appendChild(this.stats.dom);
    }

    update() {
        this.stats.update();
    }
}
