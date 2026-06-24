import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import type { Planning } from "@/types/planning";

export class PlanningPdfGenerator {
  private doc: jsPDF;

  constructor() {
    this.doc = new jsPDF();
  }

  generate(planning: Planning, mapScreenshot?: string | null): void {
    const teamName = planning.equipe.name;
    const today = new Date().toLocaleDateString("fr-FR");

    // En-tête
    this.doc.setFontSize(20);
    this.doc.text(`Planning - ${teamName}`, 14, 22);

    this.doc.setFontSize(11);
    this.doc.text(`Généré le ${today}`, 14, 30);

    let yPosition = 40;

    // Ajouter la carte si disponible
    if (mapScreenshot) {
      console.log("PDF Generator: Adding map screenshot to PDF");
      console.log("Screenshot format:", mapScreenshot.substring(0, 50));

      this.doc.setFontSize(12);
      this.doc.text("Zone d'intervention:", 14, yPosition);
      yPosition += 8;

      const imgWidth = 180;
      const imgHeight = 120;

      try {
        this.doc.addImage(mapScreenshot, "PNG", 14, yPosition, imgWidth, imgHeight, undefined, "FAST");
        console.log("PDF Generator: Map image added successfully");
        yPosition += imgHeight + 10;
      } catch (error) {
        console.error("PDF Generator: Error adding image to PDF:", error);
      }
    } else {
      console.log("PDF Generator: No map screenshot provided");
    }

    // Informations équipe (si membres disponibles)


    if (planning.equipe.employes && planning.equipe.employes.length > 0) {
      this.doc.setFontSize(12);
      this.doc.text("Membres de l'équipe:", 14, yPosition);
      this.doc.setFontSize(10);
      yPosition += 6;

      planning.equipe.employes.forEach((employe) => {
        const employeName = `${employe.firstName} ${employe.lastName}`;
        this.doc.text(`- ${employeName}`, 20, yPosition);
        yPosition += 5;
      });

      yPosition += 5;
    }

    // Tableau des actions

    const tableData: string[][] = planning.actions.map((action) => [
      action.date,
      action.time,
      action.action,
      action.equipmentName,
      action.length !== null ? action.length.toString() : "-",
      action.quantity.toString(),
    ]);

    autoTable(this.doc, {
      startY: yPosition,
      head: [["Date", "Heure", "Action", "Équipement", "Longueur", "Quantité"]],
      body: tableData,
      styles: {
        fontSize: 9,
        cellPadding: 3,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 10 },
    });

    // Footer
    const pageCount = this.doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(8);
      this.doc.text(
        `Page ${i} / ${pageCount}`,
        this.doc.internal.pageSize.getWidth() / 2,
        this.doc.internal.pageSize.getHeight() - 10,
        { align: "center" }
      );
    }
  }

  save(filename: string): void {
    this.doc.save(filename);
  }
}

export function generatePlanningPdf(planning: Planning, mapScreenshot?: string | null): void {
  const generator = new PlanningPdfGenerator();
  generator.generate(planning, mapScreenshot);

  const teamName = planning.equipe.name.replace(/\s+/g, "_");
  const date = new Date().toISOString().split("T")[0];
  const filename = `planning_${teamName}_${date}.pdf`;

  generator.save(filename);
}
