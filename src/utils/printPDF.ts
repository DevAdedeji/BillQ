// utils/printPDF.ts
export const printPDF = (
  documentId1: string,
  documentId2?: string,
  documentId3?: string,
) => {
  // Get the inner HTML of the specified elements
  const getHtml = (id?: string): string =>
    id ? document.getElementById(id)?.innerHTML || "" : "";

  const prtHtml1 = getHtml(documentId1);
  const prtHtml2 = getHtml(documentId2);
  const prtHtml3 = getHtml(documentId3);

  // Clone all stylesheets and inline styles
  let stylesHtml = "";
  const nodes = document.querySelectorAll(
    'link[rel="stylesheet"], style, link[rel="preconnect"], link[href*="fonts"]',
  );
  nodes.forEach((node) => (stylesHtml += (node as HTMLElement).outerHTML));

  // Add print-specific styles
  const printStyle = `
    @media print {
      @page {
        size: A4 portrait;
        margin: 0 !important;
        margin: 10mm !important;
      }
      body {
        width: 100% !important;
        height: 100% !important;
        background: white !important;
        color: black !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }
      .page-break {
        display: block;
        page-break-before: always;
      }
    }
  `;

  // Open a new window for printing
  const WinPrint = window.open("", "_blank", "width=800,height=600");

  if (!WinPrint) return;

  const additionalContent = [
    prtHtml2 ? `<div class="page-break"></div>${prtHtml2}` : "",
    prtHtml3 ? `<div class="page-break"></div>${prtHtml3}` : "",
  ].join("");

  WinPrint.document.write(`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <title>Invoice - ${new Date().toISOString().split("T")[0]}</title>
        ${stylesHtml}
        <style>${printStyle}</style>
      </head>
      <body>
        ${prtHtml1}
        ${additionalContent}
        <script>
          const images = Array.from(document.images);
          let loaded = 0;

          const checkAllLoaded = () => {
            if (loaded === images.length) {
              window.print();
              setTimeout(() => window.close(), 1000);
            }
          };

          images.forEach(img => {
            if (img.complete) {
              loaded++;
              checkAllLoaded();
            } else {
              img.onload = img.onerror = () => {
                loaded++;
                checkAllLoaded();
              };
            }
          });

          if (images.length === 0) checkAllLoaded();
        </script>
      </body>
    </html>
  `);

  WinPrint.document.close();
  WinPrint.focus();
};
