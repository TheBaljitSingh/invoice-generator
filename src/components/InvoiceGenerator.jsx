  import { Download, Eye, Plus, Trash2, Upload } from 'lucide-react'
  import React,{useEffect, useState} from 'react'
  import PreviewModel from "../components/PreviewModel"

  const InvoiceGenerator  = ()=>{


    const [invoiceData, setInvoiceData] = useState({
      companyName: '',
      companyAddress: '',
      companyCity: '',
      companyEmail: '',
      companyPhone: '',
      companyLogo: '',


      clientName: '',
      clientAddress: '',
      clientCity: '',
      clientEmail: '',

      invoiceNumber: '',
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',

      items: [], 

      // {
      //   description: '', quantity:1, rate:0, amount:0
      // }

      //additional thing
      notes:'',
      gstTaxRate:0, //Gst
      discountRate:0 


    })
    const [showPreview, setShowPreview]  = useState(false);


    useEffect(()=>{
      if(showPreview){
        document.body.style.overflow = 'hidden';
      }else{
        document.body.style.overflow='auto';
      }

      return ()=>{
              document.body.style.overflow = 'auto';
      }
    },[])

    const handleInputChange = (field, value)=>{
      setInvoiceData(prev=>({
        ...prev,
        [field]:value // doubt why array?
      }))
    }

    const handleItemChange = (index, field, value)=>{

      const updatedItems = [...invoiceData.items];
      updatedItems[index][field] = value;

      if(field==='quantity' || field ==='rate'){

        if(value==0){
          
        }
        updatedItems[index].amount = updatedItems[index].quantity* updatedItems[index].rate;
      }

      setInvoiceData(prev=>({
        ...prev,
        items:updatedItems
      }));

    }

    const addItem = ()=>{
      setInvoiceData(prev => ({
        ...prev,
        items: [...prev.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
      }));
    }

    const removeItem = (index)=>{
      if(invoiceData.items.length>0){ // check the lenght 0 or 1
        setInvoiceData(prev=>({
          ...prev,
          items: prev.items.filter((_, i)=>i!=index)
        }));
      }
    }

    const calculateSubtotal = ()=>{
      const totalSum =  invoiceData.items.reduce((sum, item)=>sum+item.amount, 0); //default is 0 accumulating the sum of items
      return totalSum;
    }

    const calculateDiscount = ()=>{
      return (calculateSubtotal()*invoiceData.discountRate )/100;
    }

    const calculateTax = () => {
      return ((calculateSubtotal() - calculateDiscount()) * invoiceData.gstTaxRate) / 100;
    };

    const calculateTotal = ()=>{
      return calculateSubtotal()-calculateDiscount()+calculateTax();
    }

    const handleLogoUpload = (e)=>{
      const file = e.target.files[0];
      if(file){

        setInvoiceData(prev=>({
          ...prev,
          companyLogo: URL.createObjectURL(file) // why here using result
        }));
      
      }
    }




    return (
      <div className="min-h-screen bg-[url(https://dqy38fnwh4fqs.cloudfront.net/mobile/streak-bg-light.png)] from-blue-50 to-indigo-100 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Left Side - Form (80%) */}
            <div className="lg:w-4/5 bg-white rounded-lg shadow-lg p-6">
              <h1 className="text-3xl font-bold text-gray-800 mb-6">Generate Your Invoice</h1>
              
              <div className="space-y-6">
                
                {/* Company Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Company Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                      <input
                        type="text"
                        value={invoiceData.companyName}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        placeholder="Your Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={invoiceData.companyEmail}
                        onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        placeholder="company@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={invoiceData.companyAddress}
                        onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        placeholder="123, Vrundavan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City, State</label>
                      <input
                        type="text"
                        value={invoiceData.companyCity}
                        onChange={(e) => handleInputChange('companyCity', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        placeholder="City, State 390019"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={invoiceData.companyPhone}
                        onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleLogoUpload}
                          className="hidden"
                          id="logo-upload"
                        />
                        <label
                          htmlFor="logo-upload"
                          className="flex items-center px-3 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50"
                        >
                          <Upload className="w-4 h-4 mr-2" />
                          Upload Logo
                        </label>
                        {invoiceData.companyLogo && (
                          <img src={invoiceData.companyLogo} alt="Logo" className="w-8 h-8 object-contain" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Client Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Client Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Name</label>
                      <input
                        type="text"
                        value={invoiceData.clientName}
                        onChange={(e) => handleInputChange('clientName', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        placeholder="Client Company Name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Email</label>
                      <input
                        type="email"
                        value={invoiceData.clientEmail}
                        onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        placeholder="client@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client Address</label>
                      <input
                        type="text"
                        value={invoiceData.clientAddress}
                        onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        placeholder="4, Uma Char Rasta "
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Client City, State</label>
                      <input
                        type="text"
                        value={invoiceData.clientCity}
                        onChange={(e) => handleInputChange('clientCity', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        placeholder="Client City, State 390019"
                      />
                    </div>
                  </div>
                </div>

                {/* Invoice Details */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Invoice Details</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                      <input
                        type="text"
                        value={invoiceData.invoiceNumber}
                        onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        placeholder="001"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Date</label>
                      <input
                        type="date"
                        value={invoiceData.invoiceDate}
                        onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                        className="w-full p-2 hover:cursor-pointer border border-gray-300 rounded-md  "
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                      <input
                        type="date"
                        value={invoiceData.dueDate}
                        onChange={(e) => handleInputChange('dueDate', e.target.value)}
                        className="w-full hover:cursor-pointer p-2 border border-gray-300 rounded-md  "
                      />
                    </div>
                  </div>
                </div>

                {/* Items */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">Items</h2>
                    <button
                      onClick={addItem}
                      className="flex items-center px-3 py-2 bg-gray-500 hover:cursor-pointer text-white rounded-md  transition-colors"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {invoiceData.items.map((item, index) => (
                      <div key={index} className="grid grid-cols-12 gap-2 items-end">
                        <div className="col-span-5">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-md  "
                            placeholder="Item description"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Qty</label>
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                            className="w-full p-2 border border-gray-300 rounded-md  "
                            min="0"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Rate</label>
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                            className="w-full p-2 border border-gray-300 rounded-md  "
                            min="0"
                            step="0.01"
                          />
                        </div>
                        <div className="col-span-2">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                          <input
                            type="text"
                            value={`₹${item.amount.toFixed(2)}`}
                            readOnly
                            className="w-full p-2 border border-gray-300 rounded-md bg-gray-100"
                          />
                        </div>
                        <div className="col-span-1">
                          <button
                            onClick={() => removeItem(index)}
                            className="p-2 text-red-600 hover:cursor-pointer hover:bg-red-50 rounded-md transition-colors"
                            // disabled={invoiceData.items.length === 0}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Additional Settings */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h2 className="text-xl font-semibold mb-4 text-gray-800">Additional Settings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                      <input
                        type="number"
                        value={invoiceData.gstTaxRate}
                        onChange={(e) => handleInputChange('gstTaxRate', parseFloat(e.target.value) )}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        min="0"
                        step="0.01"
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Discount Rate (%)</label>
                      <input
                        type="number"
                        value={invoiceData.discountRate}
                        onChange={(e) => handleInputChange('discountRate', parseFloat(e.target.value))}
                        className="w-full p-2 border border-gray-300 rounded-md  "
                        min="0"
                        step="0.01"
                        placeholder="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={invoiceData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md  "
                      rows="3"
                      placeholder="Additional notes or payment terms..."
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Preview & Download (20%) */}
            <div className="lg:w-1/5 space-y-4">
              <div className="bg-white rounded-lg shadow-lg p-4 sticky top-4">
                <h3 className="text-lg font-semibold mb-4 text-gray-800">Actions</h3>
                
              
                
                <button
                  onClick={()=>setShowPreview(!showPreview)}
                  className="w-full hover:cursor-pointer flex items-center justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Preview & Download
                </button>

              {
                invoiceData.items.length>0 &&
                <div className="mt-4 p-3 bg-gray-50 rounded-md">
                  <h4 className="font-semibold text-sm mb-2">Invoice Summary</h4>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span>Items:</span>
                      <span>{invoiceData.items.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>₹{calculateSubtotal().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GST:</span>
                      <span>₹{calculateTax().toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold border-t pt-1">
                      <span>Total:</span>
                      <span>₹{calculateTotal().toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              }
              </div>
            </div>
          </div>

        </div>
        {
          showPreview &&
          <PreviewModel onClose={()=>setShowPreview(false)} data={invoiceData} />
        }

        <style jsx>{`
          @media print {
            body * {
              visibility: hidden;
            }
            #invoice-preview, #invoice-preview * {
              visibility: visible;
            }
            #invoice-preview {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
            }
          }
        `}</style>
      </div>
    )
  }

  export default InvoiceGenerator ;