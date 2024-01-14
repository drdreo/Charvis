import {
    ChangeDetectionStrategy,
    Component,
    ElementRef,
    ViewChild,
} from "@angular/core";
import { CommonModule } from "@angular/common";
import { TextToSpeechService } from "./text-to-speech.service";

@Component({
    selector: "charvis-tts",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./tts.component.html",
    styleUrl: "./tts.component.scss",
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TtsComponent {
    @ViewChild("audioPlayer") audioPlayer!: ElementRef;

    constructor(private ttsService: TextToSpeechService) {
        this.ttsService.requestSpeech().subscribe((data) => {
            this.playAudio(data);
        });
    }

    private playAudio(data: Blob) {
        const blob = new Blob([data], { type: "audio/mpeg" });
        const url = window.URL.createObjectURL(blob);

        this.audioPlayer.nativeElement.src = url;
        this.audioPlayer.nativeElement.play();
    }
}
