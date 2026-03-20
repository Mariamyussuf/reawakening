import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

export interface PDFOptions {
    title?: string;
    author?: string;
    subject?: string;
    keywords?: string[];
}

export class PDFGenerator {
    private doc: PDFDocument;
    private buffers: Buffer[];

    constructor(options: PDFOptions = {}) {
        this.buffers = [];
        this.doc = new PDFDocument({
            size: 'A4',
            margins: {
                top: 50,
                bottom: 50,
                left: 50,
                right: 50,
            },
            info: {
                Title: options.title || 'Export',
                Author: options.author || 'Reawakening Ministry',
                Subject: options.subject || 'Document Export',
                Keywords: options.keywords?.join(', ') || '',
            },
        });

        // Collect PDF data
        this.doc.on('data', (chunk: Buffer) => {
            this.buffers.push(chunk);
        });
    }

    addTitle(text: string, fontSize: number = 24) {
        this.doc.fontSize(fontSize).font('Helvetica-Bold').text(text, {
            align: 'center',
        });
        this.doc.moveDown(1);
        return this;
    }

    addHeading(text: string, fontSize: number = 18) {
        this.doc.moveDown(0.5);
        this.doc.fontSize(fontSize).font('Helvetica-Bold').text(text);
        this.doc.moveDown(0.5);
        return this;
    }

    addSubheading(text: string, fontSize: number = 14) {
        this.doc.moveDown(0.5);
        this.doc.fontSize(fontSize).font('Helvetica-Bold').text(text);
        this.doc.moveDown(0.3);
        return this;
    }

    addParagraph(text: string, fontSize: number = 12) {
        // Remove HTML tags for plain text
        const plainText = this.stripHTML(text);
        this.doc.fontSize(fontSize).font('Helvetica').text(plainText, {
            align: 'left',
            lineGap: 5,
        });
        this.doc.moveDown(0.5);
        return this;
    }

    addMetadata(label: string, value: string) {
        this.doc.fontSize(10).font('Helvetica').text(`${label}: ${value}`, {
            indent: 20,
        });
        this.doc.moveDown(0.3);
        return this;
    }

    addDivider() {
        this.doc.moveDown(0.5);
        this.doc.moveTo(50, this.doc.y).lineTo(550, this.doc.y).stroke();
        this.doc.moveDown(1);
        return this;
    }

    addPageBreak() {
        this.doc.addPage();
        return this;
    }

    private stripHTML(html: string): string {
        return html
            .replace(/<[^>]*>/g, '') // Remove HTML tags
            .replace(/&nbsp;/g, ' ')
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'")
            .trim();
    }

    async generate(): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            this.doc.end();

            this.doc.on('end', () => {
                const pdfBuffer = Buffer.concat(this.buffers);
                resolve(pdfBuffer);
            });

            this.doc.on('error', (error) => {
                reject(error);
            });
        });
    }

    getStream(): Readable {
        return this.doc as unknown as Readable;
    }
}
