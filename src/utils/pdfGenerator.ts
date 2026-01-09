
// PDF Generator Utility for PartnerFit
// Executive Board Meeting Quality

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

const addFooter = (doc: any, pageNumber: number, date: string) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    const footerText = `Confidential Strategy Report | Ephata Solutions© | ${date} | Page ${pageNumber}`;
    doc.text(footerText, pageWidth / 2, pageHeight - 10, { align: 'center' });
};

const addHeaderLogo = async (doc: any) => {
    const pageWidth = doc.internal.pageSize.getWidth();
    const logoWidth = pageWidth * 0.8;
    const xPos = (pageWidth - logoWidth) / 2;

    try {
        // Pré-carregar imagem para validar
        const img = new Image();
        img.crossOrigin = 'anonymous';
        await new Promise<void>((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('Logo failed to load'));
            img.src = 'https://static.wixstatic.com/media/aefc44_7e7efd586e6449d086fed0e5c107d554~mv2.png';
            // Timeout de 5 segundos
            setTimeout(() => reject(new Error('Logo load timeout')), 5000);
        });

        doc.addImage(img.src, 'PNG', xPos, 15, logoWidth, logoWidth * 0.18);
    } catch (e) {
        console.error("Header logo failed to load, using text fallback", e);
        // Fallback: Adicionar texto em vez de logo
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(16, 185, 129);
        doc.text("EPHATA SOLUTIONS", pageWidth / 2, 25, { align: 'center' });
    }
};

export const generateExecutivePDF = async (data: PDFData, lang: any) => {
    try {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();

        // ---------------------------------------------------------
        // PAGE 1: EXECUTIVE COVER
        // ---------------------------------------------------------
        await addHeaderLogo(doc);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(26);
        doc.setTextColor(0, 0, 0);
        doc.text("PARTNERFIT SYNERGY ENGINE", pageWidth / 2, 85, { align: 'center' });

        doc.setFontSize(14);
        doc.setTextColor(110, 110, 110);
        doc.text("STRATEGIC SOVEREIGNTY REPORT", pageWidth / 2, 95, { align: 'center' });

        // Client Info Box (Premium Style)
        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.5);
        doc.setFillColor(252, 252, 252);
        doc.roundedRect(20, 120, pageWidth - 40, 50, 4, 4, 'FD');

        doc.setFontSize(9);
        doc.setTextColor(150, 150, 150);
        doc.text("ECOSYSTEM PARTNERSHIP ANALYZED:", 30, 133);

        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text(data.corpName.toUpperCase() || "CORPORATE", 30, 148);

        doc.setFontSize(14);
        doc.setTextColor(16, 185, 129);
        doc.text("&", 30, 157);

        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text(data.startupName.toUpperCase() || "STARTUP", 30, 168);

        // Synergy Score Highlight
        doc.setDrawColor(240, 240, 240);
        doc.setFillColor(245, 245, 245);
        doc.circle(pageWidth / 2, 215, 28, 'F');

        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text("SYNERGY ALIGNMENT", pageWidth / 2, 203, { align: 'center' });

        doc.setFontSize(38);
        doc.setTextColor(16, 185, 129);
        doc.text(`${data.score}%`, pageWidth / 2, 222, { align: 'center' });

        doc.setFontSize(10);
        doc.setTextColor(150, 150, 150);
        doc.text(`GOVERNANCE STATUS: ${data.riskLevel}`, pageWidth / 2, 235, { align: 'center' });

        addFooter(doc, 1, data.date);

        // ---------------------------------------------------------
        // PAGE 2: WAR ROOM DIAGNOSIS
        // ---------------------------------------------------------
        doc.addPage();
        await addHeaderLogo(doc);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(0, 0, 0);
        doc.text("I. STRATEGIC WAR ROOM DIAGNOSIS", 20, 65);

        // Radar Chart Dom Capture (High Resolution)
        // Aguardar renderização completa do chart
        await new Promise(resolve => setTimeout(resolve, 500));

        const chartElement = document.querySelector('.diagnosis-radar-container');
        if (chartElement) {
            try {
                const canvas = await html2canvas(chartElement as HTMLElement, {
                    scale: 3,
                    backgroundColor: "#ffffff",
                    logging: false,
                    useCORS: true,
                    allowTaint: true,
                    removeContainer: false,
                    imageTimeout: 15000,
                    windowWidth: chartElement.scrollWidth,
                    windowHeight: chartElement.scrollHeight
                });
                const imgData = canvas.toDataURL('image/png', 1.0);
                doc.addImage(imgData, 'PNG', 30, 75, pageWidth - 60, 100);
            } catch (e) {
                console.error("Radar chart capture failed", e);
                doc.setDrawColor(200, 200, 200);
                doc.setFillColor(250, 250, 250);
                doc.rect(40, 80, pageWidth - 80, 80, 'FD');
                doc.setFontSize(10);
                doc.setTextColor(150, 150, 150);
                doc.text("[Radar Chart - Capture Failed]", pageWidth / 2, 115, { align: 'center' });
                doc.text("Please view the interactive version online", pageWidth / 2, 125, { align: 'center' });
            }
        } else {
            console.warn("Radar chart element not found");
            doc.setDrawColor(200, 200, 200);
            doc.setFillColor(250, 250, 250);
            doc.rect(40, 80, pageWidth - 80, 80, 'FD');
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text("[Radar Chart - Element Not Found]", pageWidth / 2, 120, { align: 'center' });
        }

        // Executive Appraisal
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(16, 185, 129);
        doc.text(`EXECUTIVE APPRAISAL: ${data.scenario.title}`, 20, 185);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(11);
        doc.setTextColor(60, 60, 60);
        const splitDesc = doc.splitTextToSize(data.scenario.desc, pageWidth - 40);
        doc.text(splitDesc, 20, 195);

        doc.setDrawColor(16, 185, 129);
        doc.line(20, 225, pageWidth - 20, 225);

        doc.setFont("helvetica", "italic");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        const splitQuote = doc.splitTextToSize(`"${data.authorQuote}"`, pageWidth - 60);
        doc.text(splitQuote, 30, 240);
        doc.setFont("helvetica", "bold");
        doc.text("- Marcio Almeida, Strategic Consultant", pageWidth - 30, 265, { align: 'right' });

        addFooter(doc, 2, data.date);

        // ---------------------------------------------------------
        // PAGE 3: FRICTION ANALYSIS
        // ---------------------------------------------------------
        doc.addPage();
        await addHeaderLogo(doc);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(20);
        doc.text("II. DETAILED FRICTION ANALYSIS", 20, 65);

        const tableData = data.analysis.map(item => [
            item.label.toUpperCase() || item.id.toUpperCase(),
            item.corpVal,
            item.startVal,
            item.delta,
            item.status.toUpperCase()
        ]);

        (doc as any).autoTable({
            startY: 75,
            head: [['STRATEGIC DIMENSION', 'CORPORATE', 'STARTUP', 'FRICTION', 'STATUS']],
            body: tableData,
            theme: 'grid',
            headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], fontSize: 10, fontStyle: 'bold' },
            styles: { fontSize: 9, font: 'helvetica', cellPadding: 5 },
            columnStyles: { 3: { fontStyle: 'bold', halign: 'center' }, 4: { fontStyle: 'bold' } }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 20;

        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.setTextColor(0, 0, 0);
        doc.text("GOVERNANCE MITIGATION ACTION PLAN", 20, finalY);

        doc.setFontSize(11);
        doc.setTextColor(80, 80, 80);
        data.scenario.checklist.forEach((item, index) => {
            doc.setFillColor(16, 185, 129);
            doc.circle(25, finalY + 12 + (index * 12), 1, 'F');
            doc.text(item, 30, finalY + 14 + (index * 12));
        });

        addFooter(doc, 3, data.date);

        // ---------------------------------------------------------
        // PAGE 4: NEXT STEPS & CONSULTANCY
        // ---------------------------------------------------------
        doc.addPage();
        await addHeaderLogo(doc);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.setTextColor(0, 0, 0);
        doc.text("PRÓXIMOS PASSOS E CONSULTORIA", pageWidth / 2, 85, { align: 'center' });

        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(1);
        doc.line(pageWidth / 2 - 40, 90, pageWidth / 2 + 40, 90);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(13);
        doc.setTextColor(60, 60, 60);
        const ctaParagraph = "A sinergia detectada é o primeiro marco estratégico. Para converter esses coeficientes em resultados tangíveis e neutralizar riscos de governança, uma intervenção de alto nível é o caminho recomendado.";
        const splitCta = doc.splitTextToSize(ctaParagraph, pageWidth - 80);
        doc.text(splitCta, pageWidth / 2, 105, { align: 'center' });

        // Official WhatsApp QR
        try {
            const qrImg = new Image();
            qrImg.crossOrigin = 'anonymous';
            await new Promise<void>((resolve, reject) => {
                qrImg.onload = () => resolve();
                qrImg.onerror = () => reject(new Error('QR Code failed to load'));
                qrImg.src = 'https://static.wixstatic.com/media/aefc44_348853445c534f4ba8db4c8298408e4f~mv2.png';
                setTimeout(() => reject(new Error('QR Code load timeout')), 5000);
            });

            doc.addImage(qrImg.src, 'PNG', pageWidth / 2 - 30, 135, 60, 60);
            doc.setFontSize(10);
            doc.setTextColor(150, 150, 150);
            doc.text("ESCANEIE PARA CONTATO EXECUTIVO DIRETO", pageWidth / 2, 205, { align: 'center' });
        } catch (e) {
            console.error("QR Code failed to load", e);
            // Fallback: mostrar apenas texto
            doc.setFontSize(12);
            doc.setTextColor(16, 185, 129);
            doc.text("CONTATO DIRETO VIA WHATSAPP", pageWidth / 2, 165, { align: 'center' });
            doc.setFontSize(10);
            doc.setTextColor(100, 100, 100);
            doc.text("+55 19 98710-2155", pageWidth / 2, 175, { align: 'center' });
        }

        // Links (Board Ready)
        doc.setFont("helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);

        let currentY = 220;

        // Icon symbols or numbering
        doc.text("1. Agendar Reunião Estratégica via WhatsApp", 30, currentY);
        doc.link(30, currentY - 5, 120, 8, { url: 'https://api.whatsapp.com/send?phone=5519987102155&text=Quero%20uma%20reuni%C3%A3o' });
        doc.setTextColor(16, 185, 129);
        doc.setFontSize(9);
        doc.text("➞ Clique para abrir o canal seguro", 30, currentY + 6);

        currentY += 22;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("2. Conectar-se com Marcio Almeida (LinkedIn)", 30, currentY);
        doc.link(30, currentY - 5, 120, 8, { url: 'https://www.linkedin.com/in/marcioalmeidaco/' });
        doc.setTextColor(16, 185, 129);
        doc.setFontSize(9);
        doc.text("➞ Acompanhar liderança de pensamento global", 30, currentY + 6);

        currentY += 22;
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(12);
        doc.text("3. Portfólio de Soluções Ephata (Web Site)", 30, currentY);
        doc.link(30, currentY - 5, 120, 8, { url: 'https://www.ephata.solutions/portfolio' });
        doc.setTextColor(16, 185, 129);
        doc.setFontSize(9);
        doc.text("➞ Conhecer o Ecossistema de Engenharia de Inovação", 30, currentY + 6);

        addFooter(doc, 4, data.date);

        doc.save(`PartnerFit_Report_${data.corpName}_${data.startupName}.pdf`);
    } catch (error) {
        console.error("PDF generation failed", error);
        alert("Erro ao gerar PDF. Por favor, tente novamente.");
        throw error;
    }
};

export const generatePortfolioPDF = async (analyses: any[], lang: any) => {
    try {
        const { jsPDF } = jspdf;
        const doc = new jsPDF();
        const pageWidth = doc.internal.pageSize.getWidth();
        const date = new Date().toLocaleDateString();

        // PAGE 1: AGGREGATE SUMMARY
        await addHeaderLogo(doc);

        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text("COFRE ESTRATÉGICO: SUMÁRIO BOARD", pageWidth / 2, 85, { align: 'center' });

        doc.setFontSize(11);
        doc.setTextColor(120, 120, 120);
        doc.text("CONSOLIDATED ECOSYSTEM SYNERGY ANALYTICS", pageWidth / 2, 92, { align: 'center' });

        // Summary Cards in PDF
        doc.setDrawColor(240, 240, 240);
        doc.setFillColor(248, 248, 248);
        doc.roundedRect(20, 110, pageWidth - 40, 40, 3, 3, 'FD');

        const avgScore = analyses.length > 0
            ? Math.round(analyses.reduce((acc, curr) => acc + curr.score, 0) / analyses.length)
            : 0;

        doc.setFontSize(10);
        doc.setTextColor(16, 185, 129);
        doc.text("MÉDIA DE SINERGIA GLOBAL", 35, 125);
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text(`${avgScore}%`, 35, 138);

        doc.setFontSize(10);
        doc.setTextColor(16, 185, 129);
        doc.text("TOTAL DE PROJETOS", pageWidth - 80, 125);
        doc.setFontSize(22);
        doc.setTextColor(0, 0, 0);
        doc.text(analyses.length.toString(), pageWidth - 80, 138);

        const tableData = analyses.map(item => [
            item.corpName.toUpperCase(),
            item.startupName.toUpperCase(),
            `${item.score}%`,
            item.riskLevel,
            new Date(item.createdAt).toLocaleDateString()
        ]);

        (doc as any).autoTable({
            startY: 165,
            head: [['CORPORAÇÃO', 'STARTUP', 'NOTA', 'NÍVEL DE RISCO', 'DATA']],
            body: tableData,
            theme: 'striped',
            headStyles: { fillColor: [0, 0, 0], textColor: [255, 255, 255], fontSize: 9 },
            styles: { fontSize: 8, font: 'helvetica', cellPadding: 3 }
        });

        addFooter(doc, 1, date);

        doc.save(`PartnerFit_Vault_Summary_${new Date().toISOString().split('T')[0]}.pdf`);
    } catch (error) {
        console.error("Portfolio PDF generation failed", error);
        alert("Erro ao gerar PDF do portfólio. Por favor, tente novamente.");
        throw error;
    }
};
