const pdf = require('pdf-parse');
const mammoth = require('mammoth');

class PDFParser {
  async extractText(buffer, mimeType) {
    try {
      if (mimeType === 'application/pdf') {
        const data = await pdf(buffer);
        return {
          text: data.text,
          pages: data.numpages,
          info: data.info
        };
      } else if (mimeType.includes('word')) {
        const result = await mammoth.extractRawText({ buffer });
        return {
          text: result.value,
          pages: null,
          info: {}
        };
      }
      throw new Error('Unsupported file type');
    } catch (error) {
      throw new Error(`Failed to parse document: ${error.message}`);
    }
  }
}

module.exports = new PDFParser();