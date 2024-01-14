import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

@Injectable({
    providedIn: "root",
})
export class TextToSpeechService {
    constructor(private http: HttpClient) {
        if (!("speechSynthesis" in window)) {
            console.error("Speech Synthesis is not Supported 😞 ");
        }
    }

    speak() {
        let utterance = new SpeechSynthesisUtterance("This is a test ");
        speechSynthesis.speak(utterance);
        console.log(speechSynthesis.getVoices());
    }

    requestSpeech() {
        return this.http.get("http://localhost:3001/mp3", {
            responseType: "blob",
        });
    }
}
