import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouterModule, Routes } from "@angular/router";
import { API_URL_TOKEN } from "@charvis/domain/tokens";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { environment } from "../environments/environment";

import { AppComponent } from "./app.component";

const routes: Routes = [
    {
        path: "",
        loadChildren: () => import("@charvis/home").then((m) => m.HomeModule),
    },
    {
        path: "space",
        loadChildren: () => import("@charvis/space").then((m) => m.SpaceModule),
    }
];

const socketConfig: SocketIoConfig = {
    url: environment.api.socketUrl,
    options: {},
};

@NgModule({
    declarations: [ AppComponent ],
    imports: [
        BrowserModule,
        HttpClientModule,
        RouterModule.forRoot(routes),
        SocketIoModule.forRoot(socketConfig),
    ],
    providers: [ { provide: API_URL_TOKEN, useValue: environment.api.url } ],
    bootstrap: [ AppComponent ],
})
export class AppModule {
}
