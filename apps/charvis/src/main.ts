import { enableProdMode, importProvidersFrom } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";


import { environment } from "./environments/environment";
import { AppComponent } from "./app/app.component";
import { provideRouter, Routes } from "@angular/router";
import { withInterceptorsFromDi, provideHttpClient } from "@angular/common/http";
import { BrowserModule, bootstrapApplication } from "@angular/platform-browser";
import { SocketIoConfig, SocketIoModule } from "ngx-socket-io";
import { API_URL_TOKEN } from "@charvis/domain/tokens";

const socketConfig: SocketIoConfig = {
    url: environment.api.socketUrl,
    options: {},
};
const routes: Routes = [
    {
        path: "",
        pathMatch: 'full',
        redirectTo: '/space'
    },
    {
        path: "home",
        loadChildren: () => import("@charvis/home").then((m) => m.HomeModule),
    },
    {
        path: "space",
        loadChildren: () => import("@charvis/space").then((m) => m.SpaceModule),
    }
];



if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, SocketIoModule.forRoot(socketConfig)),
        { provide: API_URL_TOKEN, useValue: environment.api.url },
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(routes),
    ]
})
  .catch((err) => console.error(err));
