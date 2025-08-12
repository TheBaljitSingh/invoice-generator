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

      invoiceNumber: Math.floor(Math.random()*(1000-1)+1),
      invoiceDate: new Date().toISOString().split('T')[0],
      dueDate: '',
      addDueDate:false,

      items: [], 

      

      //additional thing
      notes:'',
      sgstTaxRate:0, //Gst
      cgstTaxRate:0,
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
    },[invoiceData])

    const handleInputChange = (field, value)=>{
      console.log(field, value);

      setInvoiceData(prev=>({
        ...prev,
        [field]:value // doubt why array?
      }))
      console.log(invoiceData)
    }

    const handleAddDueDate = (field, value)=>{
      setInvoiceData(prev=>({
        ...prev,
        [field]:value
      }));
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
      console.log(totalSum);
      return totalSum;

    }

    const calculateDiscount = ()=>{
      
      return (calculateSubtotal()*invoiceData.discountRate )/100 || 0;
    }
    
    const calculateTax = () => {
      const subtotalAfterDiscount = calculateSubtotal() - calculateDiscount();
      const cgst = parseFloat(invoiceData.cgstTaxRate) || 0;
      const sgst = parseFloat(invoiceData.sgstTaxRate) || 0;
      return (subtotalAfterDiscount * (cgst + sgst)) / 100;
  };
    const calculateSgst = ()=>{
        const subtotalAfterDiscount = calculateSubtotal() - calculateDiscount();
        const rate = parseFloat(invoiceData.sgstTaxRate) ||0;
        return (subtotalAfterDiscount*rate /100);
      
    }
    const calculateCgst = () => {
    const subtotalAfterDiscount = calculateSubtotal() - calculateDiscount();
    const rate = parseFloat(invoiceData.cgstTaxRate) || 0;
    return (subtotalAfterDiscount * rate) / 100;
  };

    const calculateTotal = ()=>{
      const totalAmount = calculateSubtotal()-calculateDiscount()+calculateTax();

      return totalAmount;
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


    console.log(invoiceData.cgstTaxRate);



    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Background pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8882_1px,transparent_1px),linear-gradient(to_bottom,#8882_1px,transparent_1px)] bg-[size:14px_24px]"></div>
      
      {/* Main content */}
      <div className="relative z-10 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-white mb-4">
              Create Professional
              <br />
              <span className="bg-gradient-to-r from-blue-300 to-purple-400 bg-clip-text text-transparent">
                Invoices Instantly
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
             Easily generate professional invoices — add branding, calculate taxes, and download in seconds.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Side - Form */}
            <div className="lg:w-4/5 space-y-6">
              
              {/* Company Details */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                  {/* <div className="w-2 h-8 bg-gradient-to-b from-blue-400 to-purple-400 rounded-full mr-3"></div> */}
                  Company Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={invoiceData.companyName}
                      onChange={(e) => handleInputChange('companyName', e.target.value)}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      placeholder="Your Company Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Email</label>
                    <input
                      type="email"
                      value={invoiceData.companyEmail}
                      onChange={(e) => handleInputChange('companyEmail', e.target.value)}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      placeholder="company@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Address</label>
                    <input
                      type="text"
                      value={invoiceData.companyAddress}
                      onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      placeholder="123, Business Street"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">City, State</label>
                    <input
                      type="text"
                      value={invoiceData.companyCity}
                      onChange={(e) => handleInputChange('companyCity', e.target.value)}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      placeholder="City, State 12345"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Phone</label>
                    <input
                      type="tel"
                      value={invoiceData.companyPhone}
                      onChange={(e) => handleInputChange('companyPhone', e.target.value)}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Logo</label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        id="logo-upload"
                      />
                      <label
                        htmlFor="logo-upload"
                        className="flex items-center px-6 py-3 bg-gradient-to-r  text-white rounded-xl cursor-pointer transition-all duration-200 shadow-lg"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        Upload Logo
                      </label>
                      {invoiceData.companyLogo && (
                        <img
                          src={invoiceData.companyLogo}
                          alt="Logo"
                          className="w-12 h-12 object-contain   rounded-xl bg-white/10 p-1"
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Client Details */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                  {/* <div className="w-2 h-8 bg-gradient-to-b from-green-400 to-blue-400 rounded-full mr-3"></div> */}
                  Client Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Client Name</label>
                    <input
                      type="text"
                      value={invoiceData.clientName}
                      onChange={(e) => handleInputChange('clientName', e.target.value)}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      placeholder="Client Name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Client Email</label>
                    <input
                      type="email"
                      value={invoiceData.clientEmail}
                      onChange={(e) => handleInputChange('clientEmail', e.target.value)}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      placeholder="client@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Client Address</label>
                    <input
                      type="text"
                      value={invoiceData.clientAddress}
                      onChange={(e) => handleInputChange('clientAddress', e.target.value)}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      placeholder="Client Address"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Client City, State</label>
                    <input
                      type="text"
                      value={invoiceData.clientCity}
                      onChange={(e) => handleInputChange('clientCity', e.target.value)}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      placeholder="Client City, State 12345"
                    />
                  </div>
                </div>
              </div>

              {/* Invoice Details */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  {/* <div className="w-2 h-8 bg-gradient-to-b from-purple-400 to-pink-400 rounded-full mr-3"></div> */}
                  Invoice Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-white mb-2">Invoice Number</label>
                    <input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => handleInputChange('invoiceNumber', e.target.value)}
                      placeholder="INV-001"
                      className="p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-nonefocus:ring-purple-400  transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium text-white mb-2">Invoice Date</label>
                    <input
                      type="date"
                      value={invoiceData.invoiceDate}
                      onChange={(e) => handleInputChange('invoiceDate', e.target.value)}
                      className="p-4  bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-purple-400  transition-all duration-200 shadow-sm"
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className='flex items-center space-x-1'>

                    <label className="text-sm font-medium text-white mb-2">Due Date</label>
                    <input type='checkbox' className='text-sm font-medium mb-1' value={invoiceData.addDueDate} onChange={(e)=>handleAddDueDate('addDueDate', e.target.checked)  } />
                    </div>
                    <input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => handleInputChange('dueDate', e.target.value)}
                      className="p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none focus:ring-purple-400  transition-all duration-200 shadow-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center">
                    {/* <div className="w-2 h-8 bg-gradient-to-b from-orange-400 to-red-400 rounded-full mr-3"></div> */}
                    Items
                  </h2>
                  <button
                    onClick={addItem}
                    className="flex items-center px-6 py-3 bg-gradient-to-r text-white hover:cursor-pointer transition-all duration-200 shadow-lg"
                  >
                    <Plus className="w-5 h-5 mr-2" />
                    Add Item
                  </button>
                </div>
                
                <div className="space-y-4">
                  {invoiceData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-4 items-end p-4 text-white border border-white/20 rounded-2xl shadow-2xl">
                      <div className="col-span-5">
                        <label className="block text-sm font-medium text-white mb-2">Description</label>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full p-3 border  border-gray-200 rounded-lg focus:outline-none   transition-all"
                          placeholder="Item description"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium  mb-2">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none   transition-all"
                          min="0"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-white mb-2">Rate</label>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => handleItemChange(index, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none   transition-all"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-sm font-medium text-white mb-2">Amount</label>
                        <input
                          type="text"
                          value={`₹${item.amount.toFixed(2)}`}
                          readOnly
                          className="w-full p-3 border border-gray-200 rounded-lg "
                        />
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={() => removeItem(index)}
                          className="p-3 text-red-500 hover:cursor-pointer hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Settings */}
              <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl shadow-2xl">
                <h2 className="text-2xl font-semibold mb-6 text-white flex items-center">
                  {/* <div className="w-2 h-8 bg-gradient-to-b from-cyan-400 to-blue-400 rounded-full mr-3"></div> */}
                  Additional Settings
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">Discount Rate (%)</label>
                    <input
                      type="number"
                      value={invoiceData.discountRate}
                      onChange={(e) => handleInputChange('discountRate', parseFloat(e.target.value))}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">SGST Rate (%)</label>
                    <input
                      type="number"
                      value={invoiceData.sgstTaxRate}
                      onChange={(e) => handleInputChange('sgstTaxRate', parseFloat(e.target.value))}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      min="0"
                      step="0.01"
                      placeholder="18"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">CGST Rate (%)</label>
                    <input
                      type="number"
                      value={invoiceData.cgstTaxRate}
                      onChange={(e) => handleInputChange('cgstTaxRate', parseFloat(e.target.value))}
                      className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                      min="0"
                      step="0.01"
                      placeholder="0"
                    />
                  </div>
                 
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-200 mb-2">Notes</label>
                  <textarea
                    value={invoiceData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    className="w-full p-4 bg-white/5 text-white border border-white/20 rounded-xl placeholder-gray-400 focus:outline-none    transition-all"
                    rows="4"
                    placeholder="Additional notes or payment terms..."
                  />
                </div>
              </div>
            </div>

            {/* Right Side - Preview & Actions */}
            <div className="lg:w-1/5 space-y-6">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-6 sticky top-18">
                <h3 className="text-xl font-semibold mb-6 text-white">Actions</h3>
                
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className="w-full flex items-center hover:cursor-pointer justify-center px-6 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-200 shadow-lg mb-4"
                >
                  <Download className="w-15 h-10 mr-2" />
                  Preview & Download
                </button>

                {invoiceData.items.length > 0 && (
                  <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl ">
                    <h4 className="font-semibold text-lg mb-4 text-white">Invoice Summary</h4>
                    <div className="text-sm space-y-2 text-gray-200">
                      <div className="flex justify-between">
                        <span>Items:</span>
                        <span className="text-white font-medium">{invoiceData.items.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span className="text-white font-medium">₹{calculateSubtotal().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>SGST:</span>
                        <span className="text-white font-medium">₹{calculateSgst().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>CGST:</span>
                        <span className="text-white font-medium">₹{calculateCgst().toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-semibold border-t border-white/30 pt-2 text-white text-lg">
                        <span>Total:</span>
                        <span>₹{calculateTotal().toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                )}

              <div className='pt-3'>
                  <a href="https://peerlist.io/baljitsingh/project/invoice-generator-tool" target="_blank" rel="noreferrer">
                  <img
                    src="https://peerlist.io/api/v1/projects/embed/PRJH9OBAJGBB7MLQE2AMQD6R8MRAJJ?showUpvote=false&theme=light"
                    alt="Invoice Generator Tool"
                    className='w-auto h-[72px]'

                  />
                </a>
              </div>
              </div>
            </div>
          </div>
        </div>
      <div className="text-center text-xs text-gray-300 p-2 mt-2 bottom-0">
        © {new Date().getFullYear()} InvoiceGenerator — A tool by{" "}
        <a
          href="https://www.linkedin.com/in/thebaljitsingh"
          className="hover:text-white  hover:cursor-pointer"
          target="_blank"
          rel="noopener noreferrer"
          >
          Baljit Singh
        </a>.
      </div>
      </div>
   
          {showPreview && (
            <PreviewModel onClose={() => setShowPreview(false)} data={invoiceData} />
          )}
    </div>
    )
  }

  export default InvoiceGenerator ;