// ============================================================
// EcoSphere — Export Service (PDF/CSV)
// ============================================================

import PDFDocument from 'pdfkit';
import { Parser } from 'json2csv';
import { Response } from 'express';

export class ExportService {
  /**
   * Generates a beautifully formatted PDF report and pipes it to the response stream.
   */
  generatePDF(res: Response, data: any, title: string = 'Sustainability Report') {
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${title.replace(/\s+/g, '_').toLowerCase()}.pdf"`);

    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    // Header
    doc
      .fillColor('#059669') // Tailwind emerald-600
      .fontSize(24)
      .text('EcoSphere', { align: 'left' })
      .fillColor('#64748b') // Tailwind slate-500
      .fontSize(10)
      .text(`Generated on: ${new Date().toLocaleDateString()}`, { align: 'right' })
      .moveDown(2);

    // Title
    doc
      .fillColor('#0f172a') // Tailwind slate-900
      .fontSize(18)
      .text(title, { align: 'center' })
      .moveDown();

    // Body/Data representation (simple for now)
    doc.fontSize(12).fillColor('#334155'); // slate-700
    
    // We will just stringify the data recursively for a basic representation,
    // in a real app this would map over specific arrays and draw tables.
    Object.entries(data).forEach(([key, value]) => {
      doc
        .font('Helvetica-Bold')
        .text(key.toUpperCase() + ':')
        .font('Helvetica')
        .text(Array.isArray(value) ? `[ ${value.length} items ]` : String(value))
        .moveDown(0.5);
    });

    // Footer
    doc
      .fontSize(10)
      .fillColor('#94a3b8')
      .text(
        'EcoSphere Management Platform - Empowering Sustainable Business',
        50,
        doc.page.height - 50,
        { align: 'center', lineBreak: false }
      );

    doc.end();
  }

  /**
   * Generates a CSV string from an array of objects.
   */
  generateCSV(res: Response, data: any[], filename: string = 'export') {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}.csv"`);

    try {
      if (data.length === 0) {
        return res.send('');
      }

      const json2csvParser = new Parser();
      const csv = json2csvParser.parse(data);
      res.send(csv);
    } catch (err) {
      console.error('Error generating CSV:', err);
      res.status(500).json({ error: 'Failed to generate CSV' });
    }
  }
}

export const exportService = new ExportService();
