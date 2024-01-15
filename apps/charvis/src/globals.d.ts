declare global {
    declare const pdfjsLib: any;

    interface Window {
        pdfjsLib: any;
    }
}
