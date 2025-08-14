import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Existing PDF function...
export const downloadDocumentAsPDF = async (documentData) => {
  try {
    // Create a temporary container for rendering
    const container = document.createElement('div');
    container.style.width = '210mm'; // A4 width
    container.style.padding = '20mm';
    container.style.backgroundColor = 'white';
    container.style.fontFamily = 'Arial, sans-serif';
    
    // Add title
    const title = document.createElement('h1');
    title.textContent = documentData.title;
    title.style.marginBottom = '20px';
    container.appendChild(title);
    
    // Render content blocks
    if (Array.isArray(documentData.content)) {
      documentData.content.forEach(block => {
        if (block.type === 'text') {
          const textDiv = document.createElement('div');
          textDiv.innerHTML = block.content;
          textDiv.style.marginBottom = '10px';
          container.appendChild(textDiv);
        } else if (block.type === 'image') {
          const img = document.createElement('img');
          img.src = block.src;
          img.alt = block.alt || '';
          img.style.maxWidth = '100%';
          img.style.marginBottom = '10px';
          container.appendChild(img);
        }
      });
    } else {
      // Handle string content
      const textDiv = document.createElement('div');
      textDiv.innerHTML = documentData.content || 'No content';
      container.appendChild(textDiv);
    }
    
    // Temporarily add to DOM
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    // Convert to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    // Remove from DOM
    document.body.removeChild(container);
    
    // Create PDF
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Download
    pdf.save(`${documentData.title || 'document'}.pdf`);
    
    return true;
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw new Error('Failed to download document');
  }
};

// NEW: Word Document Download
export const downloadAsWord = async (documentData) => {
  console.log('Downloading as Word:', documentData.title);
  try {
    // Create HTML content
    let htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <title>${documentData.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; margin-bottom: 20px; }
            p { line-height: 1.6; margin-bottom: 10px; }
          </style>
        </head>
        <body>
          <h1>${documentData.title}</h1>
    `;

    if (Array.isArray(documentData.content)) {
      documentData.content.forEach(block => {
        if (block.type === 'text') {
          htmlContent += `<div>${block.content}</div>`;
        }
      });
    } else {
      htmlContent += `<div>${documentData.content || 'No content'}</div>`;
    }

    htmlContent += '</body></html>';

    // Create blob and download
    const blob = new Blob([htmlContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentData.title || 'document'}.docx`;
    a.click();
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading Word document:', error);
    throw new Error('Failed to download Word document');
  }
};

// NEW: HTML Download
export const downloadAsHTML = async (documentData) => {
  console.log('Downloading as HTML:', documentData.title);
  try {
    let htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${documentData.title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 40px 20px;
            line-height: 1.6;
            color: #333;
        }
        h1 {
            color: #2c3e50;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
            margin-bottom: 30px;
        }
        .content {
            margin-bottom: 20px;
        }
        img {
            max-width: 100%;
            height: auto;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <h1>${documentData.title}</h1>
    <div class="document-content">
`;

    if (Array.isArray(documentData.content)) {
      documentData.content.forEach(block => {
        if (block.type === 'text') {
          htmlContent += `<div class="content">${block.content}</div>`;
        } else if (block.type === 'image') {
          htmlContent += `<img src="${block.src}" alt="${block.alt || ''}" />`;
        }
      });
    } else {
      htmlContent += `<div class="content">${documentData.content || 'No content'}</div>`;
    }

    htmlContent += `
    </div>
    <footer style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #eee; text-align: center; color: #666;">
        <p>Generated from Google Docs Clone on ${new Date().toLocaleDateString()}</p>
    </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentData.title || 'document'}.html`;
    a.click();
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading HTML:', error);
    throw new Error('Failed to download HTML');
  }
};

// NEW: Plain Text Download
export const downloadAsText = async (documentData) => {
  console.log('Downloading as Text:', documentData.title);
  try {
    let textContent = `${documentData.title}\n`;
    textContent += '='.repeat(documentData.title.length) + '\n\n';

    if (Array.isArray(documentData.content)) {
      documentData.content.forEach(block => {
        if (block.type === 'text') {
          // Strip HTML tags for plain text
          const tempDiv = document.createElement('div');
          tempDiv.innerHTML = block.content;
          textContent += tempDiv.textContent || tempDiv.innerText || '';
          textContent += '\n\n';
        }
      });
    } else {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = documentData.content || 'No content';
      textContent += tempDiv.textContent || tempDiv.innerText || '';
    }

    textContent += `\n\n---\nGenerated on ${new Date().toLocaleDateString()}`;

    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${documentData.title || 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error downloading text:', error);
    throw new Error('Failed to download text file');
  }
};

// NEW: Download with Progress Tracking
export const downloadWithProgress = async (documentData, format, quality, setProgress) => {
  try {
    setProgress(20);
    
    switch (format) {
      case 'pdf':
        setProgress(40);
        await downloadDocumentAsPDF(documentData);
        break;
      case 'docx':
        setProgress(40);
        await downloadAsWord(documentData);
        break;
      case 'html':
        setProgress(40);
        await downloadAsHTML(documentData);
        break;
      case 'txt':
        setProgress(40);
        await downloadAsText(documentData);
        break;
      default:
        throw new Error('Unsupported format');
    }
    
    setProgress(80);
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 500));
    setProgress(100);
    
    return true;
  } catch (error) {
    console.error('Download failed:', error);
    throw error;
  }
};


