import { ChangeDetectionStrategy, Component, OnDestroy } from "@angular/core";
import {
    FormControl,
    FormGroup,
    Validators,
    AbstractControl,
    ReactiveFormsModule,
} from "@angular/forms";
import { Router } from "@angular/router";
import { roomNameValidator } from "@charvis/utils";
import { HomeInfo } from "@charvis/api-interfaces";
import { SocketService } from "@charvis/data-access";
import { takeUntil, Subject, Observable } from "rxjs";
import { AsyncPipe } from "@angular/common";

@Component({
    selector: "charvis-home",
    templateUrl: "./home.component.html",
    styleUrls: ["./home.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ReactiveFormsModule, AsyncPipe],
})
export class HomeComponent implements OnDestroy {
    homeInfo$: Observable<HomeInfo>;
    loginForm = new FormGroup({
        username: new FormControl("", {
            updateOn: "blur",
            validators: [Validators.required, Validators.minLength(2)],
        }),
        room: new FormControl("", {
            validators: [Validators.required, roomNameValidator(/^\w+$/i)],
        }),
    });
    isJoinable = true;
    private unsubscribe$ = new Subject<void>();

    constructor(
        private router: Router,
        private socketService: SocketService,
    ) {
        this.socketService.leave(); // try to leave if a user comes from a room

        this.socketService
            .roomJoined()
            .pipe(takeUntil(this.unsubscribe$))
            .subscribe(({ userID, room }) => {
                sessionStorage.setItem("userID", userID);
                this.router.navigate(["/room", room]);
            });

        this.homeInfo$ = this.socketService.getHomeInfo();
    }

    get username(): AbstractControl<string | null, string | null> | null {
        return this.loginForm.get("username");
    }

    get room(): AbstractControl<string | null, string | null> | null {
        return this.loginForm.get("room");
    }

    ngOnDestroy(): void {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    onRoomClick(name: string) {
        this.room?.patchValue(name);
    }

    start(): void {
        this.socketService.start();
    }

    joinRoom() {
        const username = this.username?.value;
        const roomName = this.room?.value;
        if (this.loginForm.valid && username && roomName) {
            this.socketService.join(username, roomName);
        }
    }

    spectateRoom() {
        const roomName = this.room?.value;

        if (this.loginForm.valid && roomName) {
            this.socketService.joinAsSpectator(roomName);
        }
    }

    generateRoomName(): void {
        const randomName = Math.random().toString(36).substring(8);

        this.room?.patchValue(randomName);
    }
}
