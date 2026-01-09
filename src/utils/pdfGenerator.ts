
// PDF Generator Utility for PartnerFit
// Based on APEX Priority Technical Specification

declare const jspdf: any;
declare const html2canvas: any;

export interface PDFData {
    corpName: string;
    startupName: string;
    score: number;
    riskLevel: string;
    analysis: any[];
    date: string;
    scenario: {
        title: string;
        desc: string;
        checklist: string[];
    };
    authorQuote: string;
}

export const generateExecutivePDF = async (data: PDFData, lang: any) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // ---------------------------------------------------------
    // PAGE 1: EXECUTIVE COVER
    // ---------------------------------------------------------

    // Header Image
    try {
        doc.addImage('https://static.wixstatic.com/media/aefc44_7e7efd586e6449d086fed0e5c107d554~mv2.png', 'PNG', 0, 0, pageWidth, 60);
    } catch (e) {
        console.error("Header image failed", e);
    }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text("PARTNERFIT", pageWidth / 2, 85, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("EXECUTIVE SYNERGY REPORT", pageWidth / 2, 95, { align: 'center' });

    // Client Info Box
    doc.setDrawColor(230, 230, 230);
    doc.setFillColor(249, 249, 249);
    doc.roundedRect(20, 110, pageWidth - 40, 50, 5, 5, 'FD');

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text("PREPARED FOR:", 30, 125);

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text(`${data.corpName} vs ${data.startupName}`, 30, 138);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`DATE: ${data.date}`, 30, 150);

    // Synergy Score Highlight
    doc.setFillColor(16, 185, 129); // Emerald-500
    doc.roundedRect(60, 175, pageWidth - 120, 40, 5, 5, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.text("OVERALL SYNERGY SCORE", pageWidth / 2, 190, { align: 'center' });

    doc.setFontSize(36);
    doc.text(`${data.score}%`, pageWidth / 2, 208, { align: 'center' });

    // Intro Text
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(11);
    const introText = lang.knowledgeHub.aboutText || "This report details the friction equalizer results and strategic alignment between the parties.";
    const splitIntro = doc.splitTextToSize(introText, pageWidth - 60);
    doc.text(splitIntro, 30, 235);

    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("© 2025 Cristaliza ROI Calculator. Powered by Ephata Solutions.", pageWidth / 2, pageHeight - 15, { align: 'center' });

    // ---------------------------------------------------------
    // PAGE 2: STRATEGIC DASHBOARD
    // ---------------------------------------------------------
    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(16, 185, 129);
    doc.text("STRATEGIC DASHBOARD", 20, 25);

    doc.setDrawColor(16, 185, 129);
    doc.line(20, 28, 60, 28);

    // Radar Chart Capture (from DOM)
    const chartElement = document.querySelector('.recharts-wrapper');
    if (chartElement) {
        try {
            const canvas = await html2canvas(chartElement, {
                scale: 2,
                backgroundColor: null,
                logging: false
            });
            const imgData = canvas.toDataURL('image/png');
            // Center the chart
            doc.addImage(imgData, 'PNG', 30, 40, pageWidth - 60, 100);
        } catch (e) {
            console.error("Chart capture failed", e);
            doc.text("[Radar Chart Visualization]", pageWidth / 2, 80, { align: 'center' });
        }
    } else {
        doc.text("[Visualization Not Found]", pageWidth / 2, 80, { align: 'center' });
    }

    // Executive Recommendation Box
    doc.setDrawColor(200, 200, 200);
    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, 150, pageWidth - 40, 100, 5, 5, 'FD');

    // Marcio Avatar
    try {
        doc.addImage('https://static.wixstatic.com/media/aefc44_188001b5d33541539abae5edc409ef08~mv2.png', 'PNG', 25, 155, 15, 15);
    } catch (e) { }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("MARCIO ALMEIDA", 45, 162);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("GLOBAL STRATEGIC CONSULTANT", 45, 166);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(16, 185, 129);
    doc.text(data.scenario.title.toUpperCase(), 30, 185);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    const splitDesc = doc.splitTextToSize(data.scenario.desc, pageWidth - 60);
    doc.text(splitDesc, 30, 195);

    // Personal Quote
    doc.setFont("helvetica", "italic");
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const splitQuote = doc.splitTextToSize(`"${data.authorQuote}"`, pageWidth - 70);
    doc.text(splitQuote, 35, 225);

    // ---------------------------------------------------------
    // PAGE 3: DETAILED FRICTION ANALYSIS
    // ---------------------------------------------------------
    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.setTextColor(0, 0, 0);
    doc.text("DETAILED FRICTION ANALYSIS", 20, 25);

    const tableData = data.analysis.map(item => [
        item.label,
        item.corpVal,
        item.startVal,
        item.delta,
        item.status.toUpperCase()
    ]);

    (doc as any).autoTable({
        startY: 35,
        head: [['Dimension', 'Corp Value', 'Startup Value', 'Delta', 'Status']],
        body: tableData,
        theme: 'striped',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 9, font: 'helvetica' },
        columnStyles: {
            0: { fontStyle: 'bold' },
            3: { halign: 'center', fontStyle: 'bold' },
            4: { halign: 'center' }
        }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 20;

    doc.setFontSize(14);
    doc.setTextColor(16, 185, 129);
    doc.text("STRATEGIC ACTION CHECKLIST", 20, finalY);

    doc.setFontSize(10);
    doc.setTextColor(60, 60, 60);
    data.scenario.checklist.forEach((item, index) => {
        doc.text(`[ ] ${item}`, 25, finalY + 10 + (index * 8));
    });

    // 150 projects success blurb
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(180, 180, 180);
    doc.text("Methodology based on 150+ real cases and proprietary Ephata frameworks.", 20, pageHeight - 20);

    // ---------------------------------------------------------
    // PAGE 4: NEXT STEPS & CTAs
    // ---------------------------------------------------------
    doc.addPage();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(16, 185, 129);
    doc.text("NEXT STEPS", pageWidth / 2, 50, { align: 'center' });

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text("ELEVATE YOUR PARTNERSHIP GOVERNANCE", pageWidth / 2, 60, { align: 'center' });

    // CTAs with Links
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);

    doc.textWithLink("1. Schedule a Strategy Session", pageWidth / 2 - 40, 90, { url: 'https://wa.me/5519987102155' });
    doc.textWithLink("2. Access Synapsys Ecosystem", pageWidth / 2 - 40, 105, { url: 'https://synapsys.marcioalmeida.co/' });
    doc.textWithLink("3. Download Complete Portfolio", pageWidth / 2 - 40, 120, { url: 'https://www.ephata.solutions/download-portfolio' });
    doc.textWithLink("4. Visit Official Website", pageWidth / 2 - 40, 135, { url: 'https://www.ephata.solutions/portfolio' });

    // QR Code
    try {
        doc.addImage('https://static.wixstatic.com/media/aefc44_348853445c534f4ba8db4c8298408e4f~mv2.png', 'PNG', pageWidth / 2 - 25, 160, 50, 50);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text("SCAN TO DEEPEN THE STRATEGY", pageWidth / 2, 215, { align: 'center' });
    } catch (e) { }

    // Final Logo
    try {
        doc.addImage('https://static.wixstatic.com/media/aefc44_ba339e9f1dc7452a940f0d128d6c4dfb~mv2.png', 'PNG', pageWidth / 2 - 30, 240, 60, 25);
    } catch (e) { }

    doc.save(`${data.corpName}_vs_${data.startupName}_SynergyReport.pdf`);
};

export const generatePortfolioPDF = async (analyses: any[], lang: any) => {
    const { jsPDF } = jspdf;
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // Header
    try {
        doc.addImage('https://static.wixstatic.com/media/aefc44_7e7efd586e6449d086fed0e5c107d554~mv2.png', 'PNG', 0, 0, pageWidth, 50);
    } catch (e) { }

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(lang.portfolio.boardSummaryTitle.toUpperCase(), pageWidth / 2, 70, { align: 'center' });

    const avgScore = analyses.length > 0
        ? Math.round(analyses.reduce((acc, curr) => acc + curr.score, 0) / analyses.length)
        : 0;

    doc.setFontSize(12);
    doc.text(`${lang.portfolio.avgScore}: ${avgScore}%`, pageWidth / 2, 80, { align: 'center' });
    doc.text(`${lang.portfolio.totalAnalyses}: ${analyses.length}`, pageWidth / 2, 88, { align: 'center' });

    const tableData = analyses.map(item => [
        item.corpName,
        item.startupName,
        `${item.score}%`,
        item.riskLevel,
        new Date(item.createdAt).toLocaleDateString()
    ]);

    (doc as any).autoTable({
        startY: 100,
        head: [[lang.identity.corpLabel, lang.identity.startupLabel, lang.portfolio.score, lang.diagnosis.levelLabel, 'Date']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [16, 185, 129] },
        styles: { fontSize: 8 }
    });

    doc.save(`Portfolio_Executive_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
};
