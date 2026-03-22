// @ts-ignore
import jsPDF from "jspdf";
// @ts-ignore
import autoTable from "jspdf-autotable";

export const exportSalesPDF = async (salesData: any, stats: any, period: string) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Charger le logo
  const loadLogo = async (): Promise<string | null> => {
    try {
      const response = await fetch('/ASMA.png');
      const blob = await response.blob();
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Erreur chargement logo:', error);
      return null;
    }
  };

  const logo = await loadLogo();

  // Couleurs
  const primaryColor = '#2563eb';
  const textColor = '#1e293b';
  const lightGray = '#f1f5f9';

  // En-tête avec logo
  doc.setFillColor(primaryColor);
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  // Ajouter le logo si disponible
  if (logo) {
    try {
      doc.addImage(logo, 'PNG', 15, 8, 20, 20);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text("AS'MA", 40, 22);
    } catch (error) {
      console.error('Erreur ajout logo au PDF:', error);
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(24);
      doc.text("AS'MA", 20, 22);
    }
  } else {
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.text("AS'MA", 20, 22);
  }

  doc.setFontSize(12);
  doc.text('Rapport des Ventes', 20, 30);

  // Informations du rapport
  let yPos = 45;
  doc.setTextColor(textColor);
  doc.setFontSize(10);
  
  const periodText = period === 'week' ? 'Semaine' : period === 'month' ? 'Mois' : 'Annee';
  doc.text(`Periode: ${periodText}`, 20, yPos);
  doc.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, pageWidth - 60, yPos);

  // Section Statistiques
  yPos += 15;
  doc.setFillColor(lightGray);
  doc.rect(15, yPos - 5, pageWidth - 30, 35, 'F');
  
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  doc.text('Statistiques Generales', 20, yPos + 2);

  yPos += 10;
  doc.setFontSize(10);
  doc.setTextColor(textColor);
  
  const col1X = 20;
  const col2X = pageWidth / 2 + 10;
  
  doc.text(`Chiffre d'affaires total:`, col1X, yPos);
  doc.text(`${stats.totalRevenue.toLocaleString('fr-FR', { useGrouping: false })} FCFA`, col1X + 60, yPos);
  
  doc.text(`Nombre de commandes:`, col2X, yPos);
  doc.text(`${stats.totalOrders}`, col2X + 60, yPos);

  yPos += 8;
  doc.text(`Panier moyen:`, col1X, yPos);
  doc.text(`${stats.averageOrderValue.toLocaleString('fr-FR', { useGrouping: false })} FCFA`, col1X + 60, yPos);
  
  doc.text(`Taux de croissance:`, col2X, yPos);
  doc.text(`${stats.growthRate > 0 ? '+' : ''}${stats.growthRate}%`, col2X + 60, yPos);

  // Tableau des ventes détaillées
  yPos += 20;
  doc.setFontSize(12);
  doc.setTextColor(primaryColor);
  doc.text('Details des Ventes', 20, yPos);

  yPos += 5;
  
  autoTable(doc, {
    startY: yPos,
    head: [['Periode', 'Chiffre d\'affaires', 'Commandes', 'Panier moyen']],
    body: salesData.map((item: any) => [
      item.date,
      `${item.revenue.toLocaleString('fr-FR', { useGrouping: false })} FCFA`,
      item.orders.toString(),
      `${item.average.toLocaleString('fr-FR', { useGrouping: false })} FCFA`
    ]),
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: '#ffffff',
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left'
    },
    bodyStyles: {
      fontSize: 9,
      textColor: textColor
    },
    columnStyles: {
      0: { cellWidth: 40 },
      1: { cellWidth: 50, halign: 'right' },
      2: { cellWidth: 30, halign: 'center' },
      3: { cellWidth: 55, halign: 'right' }
    },
    margin: { left: 15, right: 15 },
    didDrawPage: (data: any) => {
      // Pied de page
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      doc.text(
        `Page ${data.pageNumber} sur ${pageCount}`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
  });

  // Pied de page final
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text('AS\'MA - Rapport genere automatiquement', pageWidth / 2, finalY, { align: 'center' });

  // Télécharger le PDF
  const fileName = `rapport-ventes-${periodText.toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};
