import { X } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useRef } from 'react';

function PreviewModel({ onClose, data }) {

const subtotal = data.items.reduce((acc, item) => acc + item.amount, 0);
const discount = (subtotal * data.discountRate) / 100;
const tax = ((subtotal - discount) * data.gstTaxRate) / 100;
const total = subtotal - discount + tax;


  const previewModelRef = useRef();
  const pdfContentRef = useRef();

  const closePreview = (e) => {
    if (previewModelRef.current === e.target) {
      onClose();
    }
  };

const handleDownloadPDF = async () => {
  const element = pdfContentRef.current;

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true, // In case of remote images
  });

  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // PDF page dimensions
  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  // Define margins (in mm)
  const marginX = 10; // left/right
  const marginY = 10; // top/bottom

  // Calculate available width and height
  const availableWidth = pdfWidth - marginX * 2;
  const availableHeight = pdfHeight - marginY * 2;

  // Original image size
  const imgProps = {
    width: canvas.width,
    height: canvas.height,
  };

  // Calculate scale ratio to fit within available area
  const ratio = Math.min(availableWidth / imgProps.width, availableHeight / imgProps.height);

  const imgWidth = imgProps.width * ratio;
  const imgHeight = imgProps.height * ratio;

  const x = marginX;
  const y = marginY;

  pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);
  pdf.save(`Invoice_${data.companyName}-${data.invoiceNumber}.pdf`);
};


  return (
    <div
      ref={previewModelRef}
      onClick={closePreview}
      className="fixed inset-0 bg-opacity-40 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute top-12 right-4 text-gray-600 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-400 rounded"
        >
        <X size={24} />
        </button>
      <div className="relative  w-[800px] rounded-lg shadow-lg p-6 max-h-[90vh] overflow-y-auto bg-white">



        {/* 👇 Download Button */}
        <div className="text-right mb-4 ">
          <button
            onClick={handleDownloadPDF}
            className=" text-white px-4 py-2 rounded bg-green-600 hover:cursor-pointer"
          >
            Download as PDF
          </button>
        </div>

        {/* 👇 PDF Content Area */}
         <div ref={pdfContentRef} id="pdf-preview" className="text-sm  text-gray-700 space-y-4 " >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{data.companyName || 'Your Company'}</h1>
              <p>{data.companyAddress}</p>
              <p>{data.companyCity}</p>
              <p>{data.companyEmail}</p>
              <p>{data.companyPhone}</p>
            </div>

            {data.companyLogo && (
              <img
                src={data.companyLogo}
                alt="Company Logo"
                className="w-24 h-24 object-contain"
              />
            )}
          </div>

          <hr />

          {/* Client Info */}
          <div>
            <h2 className="font-semibold text-lg">Bill To:</h2>
            <p>{data.clientName}</p>
            <p>{data.clientAddress}</p>
            <p>{data.clientCity}</p>
            <p>{data.clientEmail}</p>
          </div>

          {/* Invoice Info */}
          <div className="flex justify-between">
            <p><span className="font-medium">Invoice #: </span>{data.invoiceNumber}</p>
            <p><span className="font-medium">Invoice Date: </span>{data.invoiceDate}</p>
            <p><span className="font-medium">Due Date: </span>{data.dueDate}</p>
          </div>

          {/* Item Table */}
          <table className="w-full mt-4 border border-gray-300 text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-3 py-2">Description</th>
                <th className="border px-3 py-2">Qty</th>
                <th className="border px-3 py-2">Rate</th>
                <th className="border px-3 py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items?.length > 0 ? (
                data.items.map((item, index) => (
                  <tr key={index}>
                    <td className="border px-3 py-2">{item.description}</td>
                    <td className="border px-3 py-2">{item.quantity}</td>
                    <td className="border px-3 py-2">₹{item.rate}</td>
                    <td className="border px-3 py-2">₹{item.amount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-3 text-gray-400">No items added.</td>
                </tr>
              )}
            </tbody>
          </table>

      {/* Summary */}
{/* Summary */}
<div className="w-full flex justify-between">
  {/* Notes */}
  <div >

    {data.notes && (
      <div className="mt-4">
        <h3 className="font-medium">Notes:</h3>
        <p>{data.notes}</p>
      </div>
    )}
    </div>
    <div className="space-y-1 w-[250px] flex flex-col items-end">
    <div className="flex justify-between w-full">
      <span>Subtotal:</span>
      <span>₹{subtotal.toFixed(2)}</span>
    </div>
    <div className="flex justify-between w-full">
      <span>Discount ({data.discountRate}%):</span>
      <span>₹{discount.toFixed(2)}</span>
    </div>
    <div className="flex justify-between w-full">
      <span>GST ({data.gstTaxRate}%):</span>
      <span>₹{tax.toFixed(2)}</span>
    </div>
    <hr className="w-full" />
    <div className="flex justify-between w-full font-bold">
      <span>Total:</span>
      <span>₹{total.toFixed(2)}</span>
    </div>
  </div>
</div>




          
        </div>

      </div>
    </div>
  );
}

export default PreviewModel;
