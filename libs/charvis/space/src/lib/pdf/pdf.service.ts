import { Injectable } from "@angular/core";
import { imagePDF } from "./test";

// import pdfjsWorker from "pdfjs-dist/build/pdf.worker";

@Injectable({
    providedIn: "root",
})
export class PDFService {
    constructor() {
        // TODO: load via package
        setTimeout(() => {
            (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc =
                "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.0.379/pdf.worker.mjs";
        }, 2000);
    }

    /**
     * Loads a PDF file and returns an array of canvas elements representing the pages
     * @param pdfUrl
     */
    async loadPdf(pdfUrl: string): Promise<HTMLCanvasElement[]> {
        try {
            const pdf = await (window as any).pdfjsLib.getDocument({
                data: atob(imagePDF),
            }).promise;
            const canvasElements: HTMLCanvasElement[] = [];
            const numPages = pdf.numPages;

            for (let pageNum = 1; pageNum <= numPages; pageNum++) {
                const page = await pdf.getPage(pageNum);
                const viewport = page.getViewport({ scale: 1.5 });
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d");

                canvas.width = viewport.width;
                canvas.height = viewport.height;

                await page.render({
                    canvasContext: context,
                    viewport: viewport,
                }).promise;

                canvasElements.push(canvas);
            }

            return canvasElements;
        } catch (error) {
            console.error("Error loading PDF: ", error);
            throw error;
        }
    }
}
