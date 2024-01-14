import { enableProdMode, importProvidersFrom } from "@angular/core";

import { environment } from "./environments/environment";
import { AppComponent } from "./app/app.component";
import { provideRouter, Routes } from "@angular/router";
import {
    provideHttpClient,
    withInterceptorsFromDi,
} from "@angular/common/http";
import { bootstrapApplication, BrowserModule } from "@angular/platform-browser";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { API_URL_TOKEN } from "@charvis/domain/tokens";

const socketConfig: SocketIoConfig = {
    url: environment.api.socketUrl,
    options: {},
};
const routes: Routes = [
    {
        path: "",
        pathMatch: "full",
        redirectTo: "/space",
    },
    {
        path: "home",
        loadComponent: () =>
            import("@charvis/home").then((mod) => mod.HomeComponent),
    },
    {
        path: "space",
        loadComponent: () =>
            import("@charvis/space").then((m) => m.SpaceComponent),
    },
];

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(
            BrowserModule,
            SocketIoModule.forRoot(socketConfig),
        ),
        { provide: API_URL_TOKEN, useValue: environment.api.url },
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(routes),
    ],
}).catch((err) => console.error(err));
