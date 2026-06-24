declare module "jspdf-autotable" {
  import { jsPDF } from "jspdf";

  interface AutoTableOptions {
    startY?: number;
    head?: string[][];
    body?: string[][];
    styles?: {
      fontSize?: number;
      cellPadding?: number;
    };
    headStyles?: {
      fillColor?: number[];
      textColor?: number;
      fontStyle?: string;
    };
    alternateRowStyles?: {
      fillColor?: number[];
    };
    margin?: { top?: number };
  }

  function autoTable(doc: jsPDF, options: AutoTableOptions): void;

  export default autoTable;
}
