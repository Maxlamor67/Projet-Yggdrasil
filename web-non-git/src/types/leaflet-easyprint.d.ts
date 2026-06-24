import "leaflet";

declare module "leaflet-easyprint" {
    import type { Control } from "leaflet";

    interface EasyPrintOptions {
        hidden?: boolean;
        exportOnly?: boolean;
    }

    class EasyPrint extends Control {
        constructor(options?: EasyPrintOptions);
        printMap(size: string, filename: string): void;
    }

    export { EasyPrint };
}
