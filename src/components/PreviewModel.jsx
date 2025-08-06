import { X } from 'lucide-react';
import html2canvas from 'html2canvas-pro';
import jsPDF from 'jspdf';
import { useRef } from 'react';

function PreviewModel({ onClose, data }) {

const subtotal = data.items.reduce((acc, item) => acc + item.amount, 0);
const discount = (subtotal * data.discountRate) / 100;
const tax = ((subtotal - discount) * (data.sgstTaxRate+data.cgstTaxRate)) / 100;
const sgstAmount = ((subtotal-discount) *data.sgstTaxRate /100);
const cgstAmount = ((subtotal-discount)*data.cgstTaxRate/100);
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

console.log(data);


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
            className=" text-white px-4 py-2 rounded bg-black hover:bg-[#353535f6] hover:cursor-pointer"
          >
            Download as PDF
          </button>
        </div>

        {/* 👇 PDF Content Area */}
      <div ref={pdfContentRef} id="pdf-preview" className="text-sm text-black px-6 py-6 font-sans">
  {/* Header: Logo + Company Name */}
  <div className="flex justify-between items-start mb-2">
    <div className="flex items-center space-x-2">
      {data.companyLogo && (
        <img
          src={data.companyLogo}
          alt="Company Logo"
          className="h-10 w-10 rounded-xl object-contain"
        />
      )}
      <div>
        <h1 className="text-2xl mb-1 font-semibold">{data.companyName || 'Your Company'}</h1>
        {/* Optional address or contact info can be placed here */}
      </div>
    </div>

    {/* You can also move Invoice meta info (number/date) to top right here if preferred */}
  </div>

  {/* Invoice Title - closer to company name */}
  <div className="w-full mt-2 mb-6 ">
    <h1
      className="uppercase text-[9.5rem] text-center font-bold leading-none tracking-widest"
      style={{ transform: 'scaleY(1.1)', transformOrigin: 'center' }}
    >
      Invoice
    </h1>
  </div>

  {/* Invoice Meta */}
  <div className="flex justify-between items-start mb-6 text-base">
    <div>
      <p><span className="font-semibold">Invoice No: </span> #{data.invoiceNumber || 'N/A'}</p>
    </div>
    <div>
      <p><span className="font-semibold">Date:</span> {data.invoiceDate || 'N/A'}</p>
      {data.addDueDate&& <p className='font-semibold'>Due: <span className='font-normal'> {data.dueDate}</span></p>}

    </div>
  </div>

  {/* Client Info */}
  <div className="mb-6 mt-18">
    <h2 className="font-semibold text-lg mb-1">Bill To:</h2>

    <div className='text-[#292929]'>

    <p>{data.clientName}</p>
    <p>{data.clientAddress}</p>
    <p>{data.clientCity}</p>
    <p>{data.clientEmail}</p>
    </div>
  </div>

  {/* Items Table */}
<table className="w-full mt-4 text-left border-collapse">
  <thead className="border-b-2 border-gray-300">
    <tr>
      <th className=" py-2 w-1/2 text-left">Description</th>
      <th className=" py-2 text-right">Quantity</th>
      <th className=" py-2 text-right">Price</th>
      <th className=" py-2 text-right">SubTotal</th>
    </tr>
  </thead>
  <tbody>
    {data.items?.length > 0 ? (
      data.items.map((item, index) => (
        <tr key={index} className="font-semibold text-[#292929] ">
          <td className="py-2">{item.description}</td>
          <td className="py-2 text-right">{item.quantity}</td>
          <td className="py-2 text-right">₹{item.rate}</td>
          <td className="py-2 text-right">₹{item.amount}</td>
        </tr>
      ))
    ) : (
      <tr>
        <td colSpan="4" className="text-center py-3 text-[#292929]">
          No items added.
        </td>
      </tr>
    )}
  </tbody>
</table>


  {/* Notes and Summary */}
  <div className="w-full flex justify-between mt-8">
    {/* Notes */}
    <div className="max-w-[60%]">
      {data.notes && (
        <div>
          <h3 className="font-semibold mb-1">Notes:</h3>
          <p className='text-[#292929]'>{data.notes}</p>
        </div>
      )}
    </div>

    {/* Summary */}
    <div className="w-[250px] space-y-2 text-right">
  <div className="flex justify-between">
    <span className="font-semibold">Discount ({data.discountRate}%)</span>
    <span className="inline-block text-right w-[80px]">₹{discount?.toFixed(2)}</span>
  </div>
  <div className="flex justify-between">
    <span className="font-semibold">SGST ({data.sgstTaxRate}%)</span>
    <span className="inline-block text-right w-[80px]">₹{sgstAmount}</span>
  </div>
  <div className="flex justify-between">
    <span className="font-semibold">CGST ({data.cgstTaxRate}%)</span>
    <span className="inline-block text-right w-[80px]">₹{cgstAmount}</span>
  </div>

  <hr className="my-1 h-[2px] bg-gray-300 border-0" />

  <div className="flex justify-between text-lg font-bold">
    <span>Total</span>
    <span className="inline-block text-right w-[80px]">₹{total?.toFixed(2)}</span>
  </div>
</div>

  </div>

  <hr className="mt-12 h-[2px]  bg-gray-300 border-0" />

</div>



      </div>
    </div>
  );
}

export default PreviewModel;
