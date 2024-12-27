import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField, Autocomplete } from '@mui/material';
import apiCalls from 'apicall';
import { useEffect, useRef, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { showToast } from 'utils/toast-component';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { FormHelperText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import dayjs from 'dayjs';

const PurchaseOrder = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();
  const [allCustomerName, setAllCustomerName] = useState([]);
  const [allWorkOrderNo, setAllWorkOrderNo] = useState([]);
  const [allSupplierName, setAllSupplierName] = useState([]);
  const [allContactPerson, setAllContactPerson] = useState([]);
  const [allQuotationList, setAllQuotationList] = useState([]);
  const [allPurchaseIndentNo, setAllPurchaseIndentNo] = useState([]);
  const [allItemForPurchaseOrder, setAllItemForPurchaseOrder] = useState([]);
  const [allSgstAndIgst, setAllSgstAndIgst] = useState([]);
  const [allIgstList, setAllIgstList] = useState([]);
  const [gstType, setGstType] = useState('');

  const [formData, setFormData] = useState({
    // po: '',
    poDate: dayjs(),
    customerName: '',
    workOrderNo: '',
    basedOn: '',
    quotationNo: '',
    purchaseIndentNo: '',
    supplierName: '',
    contactPerson: '',
    mobileNo: '',
    email: '',
    city: '',
    state: '',
    country: 'INDIA',
    taxCode: '',
    address: '',
    grossAmount: '',
    totalAmountTax: '',
    netAmount: '',
    amountInWords: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    // po: '',
    poDate: new Date(),
    customerName: '',
    workOrderNo: '',
    basedOn: '',
    quotationNo: '',
    purchaseIndentNo: '',
    supplierName: '',
    contactPerson: '',
    mobileNo: '',
    email: '',
    city: '',
    state: '',
    country: '',
    taxCode: '',
    address: '',
    grossAmount: '',
    totalAmountTax: '',
    netAmount: '',
    amountInWords: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [purchaseOrderDetailData, setPurchaseOrderDetailData] = useState([
    {
      id: 1,
      item: '',
      itemDescription: '',
      uom: '',
      taxType: '',
      qty: '',
      prevRate: '',
      unitPrice: '',
      amount: '',
      discount: '',
      discountAmount: '',
      sgstRate: '',
      sgstAmount: '',
      cgst: '',
      cgstAmount: '',
      igst: '',
      igstAmount: '',
      taxValue: '',
      landedValue: ''
    }
  ]);
  const [purchaseOrderDetailErrors, setPurchaseOrderDetailErrors] = useState([
    {
      item: '',
      itemDescription: '',
      uom: '',
      taxType: '',
      qty: '',
      prevRate: '',
      unitPrice: '',
      amount: '',
      discount: '',
      discountAmount: '',
      sgstRate: '',
      sgstAmount: '',
      cgst: '',
      cgstAmount: '',
      igst: '',
      igstAmount: '',
      taxValue: '',
      landedValue: ''
    }
  ]);

  const columns = [
    { accessorKey: 'listCode', header: 'List Code', size: 140 },
    { accessorKey: 'listDescription', header: 'Description', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  useEffect(() => {
    getAllCustomerName();
    getAllSupplierName();
    calculateTotalValues();
  }, []);

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const inputValue = type === 'checkbox' ? checked : value;
  //   setFormData({ ...formData, [name]: inputValue });
  //   setFieldErrors({ ...fieldErrors, [name]: false });
  // };

  const calculateTotalValues = () => {
    let grossAmount = 0;
    let totalAmountTax = 0;
    let netAmount = 0;
  
    // Iterate through each row to sum up the values
    purchaseOrderDetailData.forEach((row) => {
      grossAmount += parseFloat(row.discountAmount) || 0; // Sum for grossAmount (discountAmount)
      totalAmountTax += parseFloat(row.taxValue) || 0; // Sum for totalAmountTax (taxValue)
      netAmount += parseFloat(row.landedValue) || 0; // Sum for netAmount (landedValue)
    });
  
    // Update formData with calculated values
    setFormData((prevData) => ({
      ...prevData,
      grossAmount: grossAmount.toFixed(2),
      totalAmountTax: totalAmountTax.toFixed(2),
      netAmount: netAmount.toFixed(2),
      amountInWords: convertNumberToWords(netAmount), // Convert netAmount to words
    }));
  };

  const convertNumberToWords = (num) => {
    const a = [
      '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
      'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
    ];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const n = ['Hundred', 'Thousand', 'Million', 'Billion', 'Trillion'];
  
    const numberToWords = (num) => {
      if (num === 0) return 'Zero';
      let str = '';
      let i = 0;
  
      while (num > 0) {
        if (num % 1000 !== 0) {
          str = `${helper(num % 1000)}${n[i]} ${str}`;
        }
        num = Math.floor(num / 1000);
        i++;
      }
      return str.trim();
    };
  
    const helper = (num) => {
      if (num === 0) return '';
      if (num < 20) return a[num];
      if (num < 100) return `${b[Math.floor(num / 10)]} ${a[num % 10]}`;
      return `${a[Math.floor(num / 100)]} Hundred ${helper(num % 100)}`;
    };
  
    return numberToWords(num);
  };
  

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: inputValue
    }));

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: value ? undefined : prevErrors[name]
    }));

    // Handle specific logic for dropdowns and dependent fields
    if (name === 'contactPerson') {
      const selectedContact = allContactPerson.find((contact) => contact.contactperson === value);
      if (selectedContact) {
        setFormData((prevData) => ({
          ...prevData,
          mobileNo: selectedContact.contact,
          city: selectedContact.city,
          state: selectedContact.state,
          taxCode: selectedContact.taxcode,
          address: selectedContact.full_address
        }));

        // Clear errors for mapped fields if valid data is assigned
        setFieldErrors((prevErrors) => ({
          ...prevErrors,
          mobileNo: selectedContact.contact ? undefined : prevErrors.mobileNo,
          city: selectedContact.city ? undefined : prevErrors.city,
          state: selectedContact.state ? undefined : prevErrors.state,
          taxCode: selectedContact.taxcode ? undefined : prevErrors.taxCode,
          address: selectedContact.full_address ? undefined : prevErrors.address
        }));

        // Pass the selected contact person's taxtype to the getAllSgstAndCgst and getAllIgst functions
        setGstType(selectedContact.taxcode);
        getAllSgstAndCgst(gstType);
        getAllIgst(gstType);
      }
    }

    if (name === 'customerName') {
      const selectedCustomer = allCustomerName.find((customer) => customer.customerName === value);
      if (selectedCustomer) {
        getAllWorkOrder(selectedCustomer.customerCode);
      }
    }

    if (name === 'supplierName') {
      const selectedSupplier = allSupplierName.find((supplier) => supplier.supplierName === value);
      if (selectedSupplier) {
        getAllContactPerson(selectedSupplier.supplierName);
      }
    }

    if (name === 'workOrderNo') {
      const selectedWorkOrder = allWorkOrderNo.find((order) => order.workOrderNo === value);
      if (selectedWorkOrder) {
        const { customerCode } = formData; // Ensure `customerCode` is available
        getAllQuotation(customerCode, value);
        getAllPurchaseIndentNo(customerCode, value);
      }
    }

    if (name === 'basedOn') {
      const { customerName, workOrderNo } = formData; // Fetch necessary values from `formData`
      const selectedCustomer = allCustomerName.find((customer) => customer.customerName === customerName);
      if (selectedCustomer) {
        const customerCode = selectedCustomer.customerCode;
        if (value === 'Quotation') {
          getAllQuotation(customerCode, workOrderNo);
        } else if (value === 'Purchase Indent') {
          getAllPurchaseIndentNo(customerCode, workOrderNo);
        }
      }
    }
    // calculateTotalValues();
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmpty(table)) {
        displayRowError(table);
      } else {
        handleAddRow();
      }
    }
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(purchaseOrderDetailData)) {
      displayRowError(purchaseOrderDetailData);
      return;
    }
    const newRow = {
      id: Date.now(),
      item: '',
      itemDescription: '',
      uom: '',
      taxType: '',
      qty: '',
      prevRate: '',
      unitPrice: '',
      amount: '',
      discount: '',
      discountAmount: '',
      sgstRate: '',
      sgstAmount: '',
      cgst: '',
      cgstAmount: '',
      igst: '',
      igstAmount: '',
      taxValue: '',
      landedValue: ''
    };
    setPurchaseOrderDetailData([...purchaseOrderDetailData, newRow]);
    setPurchaseOrderDetailErrors([
      ...purchaseOrderDetailErrors,
      {
        item: '',
        itemDescription: '',
        uom: '',
        taxType: '',
        qty: '',
        prevRate: '',
        unitPrice: '',
        amount: '',
        discount: '',
        discountAmount: '',
        sgstRate: '',
        sgstAmount: '',
        cgst: '',
        cgstAmount: '',
        igst: '',
        igstAmount: '',
        taxValue: '',
        landedValue: ''
      }
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === purchaseOrderDetailData) {
      return (
        !lastRow.item ||
        !lastRow.itemDescription ||
        !lastRow.uom ||
        !lastRow.taxType ||
        !lastRow.qty ||
        !lastRow.prevRate ||
        !lastRow.unitPrice ||
        !lastRow.amount ||
        !lastRow.discount ||
        !lastRow.discountAmount ||
        !lastRow.sgstRate ||
        !lastRow.sgstAmount ||
        !lastRow.cgst ||
        !lastRow.cgstAmount ||
        !lastRow.igst ||
        !lastRow.igstAmount ||
        !lastRow.taxValue ||
        !lastRow.landedValue
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === purchaseOrderDetailData) {
      setPurchaseOrderDetailErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !table[table.length - 1].item ? 'Item is required' : '',
          itemDescription: !table[table.length - 1].itemDescription ? 'Item Description is required' : '',
          uom: !table[table.length - 1].uom ? 'Uom is required' : '',
          taxType: !table[table.length - 1].taxType ? 'Tax Type is required' : '',
          qty: !table[table.length - 1].qty ? 'Qty is required' : '',
          prevRate: !table[table.length - 1].prevRate ? 'Prev Rate is required' : '',
          unitPrice: !table[table.length - 1].unitPrice ? 'Unit Price is required' : '',
          amount: !table[table.length - 1].amount ? 'Amount is required' : '',
          discount: !table[table.length - 1].discount ? 'Discount is required' : '',
          discountAmount: !table[table.length - 1].discountAmount ? 'Discount Amount is required' : '',
          sgstRate: !table[table.length - 1].sgstRate ? 'Sgst Rate is required' : '',
          sgstAmount: !table[table.length - 1].sgstAmount ? 'Sgst Amount is required' : '',
          cgst: !table[table.length - 1].cgst ? 'Cgst is required' : '',
          cgstAmount: !table[table.length - 1].cgstAmount ? 'Cgst Amount is required' : '',
          igst: !table[table.length - 1].igst ? 'Igst is required' : '',
          igstAmount: !table[table.length - 1].igstAmount ? 'Igst Amount is required' : '',
          taxValue: !table[table.length - 1].taxValue ? 'Tax Value is required' : '',
          landedValue: !table[table.length - 1].landedValue ? 'Landed Value is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    // If the row exists, proceed to delete
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const handleClear = () => {
    setFormData({
      // po: '',
      poDate: dayjs(),
      customerName: '',
      workOrderNo: '',
      basedOn: '',
      quotationNo: '',
      purchaseIndentNo: '',
      supplierName: '',
      contactPerson: '',
      mobileNo: '',
      email: '',
      city: '',
      state: '',
      country: 'INDIA',
      taxCode: '',
      address: '',
      grossAmount: '',
      totalAmountTax: '',
      netAmount: '',
      amountInWords: ''
    });
    setFieldErrors({});
    setPurchaseOrderDetailData([
      {
        id: 1,
        item: '',
        itemDescription: '',
        uom: '',
        taxType: '',
        qty: '',
        prevRate: '',
        unitPrice: '',
        amount: '',
        discount: '',
        discountAmount: '',
        sgstRate: '',
        sgstAmount: '',
        cgst: '',
        cgstAmount: '',
        igst: '',
        igstAmount: '',
        taxValue: '',
        landedValue: ''
      }
    ]);
    setPurchaseOrderDetailErrors('');
    setAllWorkOrderNo([]);
    setAllQuotationList([]);
    setAllPurchaseIndentNo([]);
    setAllContactPerson([]);
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    // if (!formData.po) errors.po = 'Po is required';
    // if (!formData.poDate) errors.poDate = 'Po Date is required';
    if (!formData.customerName) errors.customerName = 'Customer Name is required';
    if (!formData.workOrderNo) errors.workOrderNo = 'Work Order No is required';
    if (!formData.basedOn) errors.basedOn = 'Based On is required';
    // if (!formData.quotationNo) errors.quotationNo = 'Quotation No is required';
    // if (!formData.purchaseIndentNo) errors.purchaseIndentNo = 'Purchase Indent No is required';
    if (!formData.supplierName) errors.supplierName = 'Supplier Name is required';
    if (!formData.contactPerson) errors.contactPerson = 'Contact Person is required';
    if (!formData.mobileNo) errors.mobileNo = 'Mobile No is required';
    if (!formData.city) errors.city = 'City is required';
    if (!formData.state) errors.state = 'State is required';
    if (!formData.country) errors.country = 'Country is required';
    if (!formData.taxCode) errors.taxCode = 'Tax Code is required';
    if (!formData.address) errors.address = 'Address is required';
    if (!formData.grossAmount) errors.grossAmount = 'Gross Amount is required';
    if (!formData.totalAmountTax) errors.totalAmountTax = 'Total Amount Tax is required';
    if (!formData.netAmount) errors.netAmount = 'Net Amount is required';
    if (!formData.amountInWords) errors.amountInWords = 'Amount In Words is required';

    let purchaseOrderDetailDataValid = true;
    if (!purchaseOrderDetailData || !Array.isArray(purchaseOrderDetailData) || purchaseOrderDetailData.length === 0) {
      purchaseOrderDetailDataValid = false;
      setPurchaseOrderDetailErrors([{ general: 'Purchase Order Details Data is required' }]);
    } else {
      const newTableErrors = purchaseOrderDetailData.map((row, index) => {
        const rowErrors = {};
        if (!row.item) {
          rowErrors.item = 'Item is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.itemDescription) {
          rowErrors.itemDescription = 'Item Description is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.uom) {
          rowErrors.uom = 'Uom is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.taxType) {
          rowErrors.taxType = 'Tax Type is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.qty) {
          rowErrors.qty = 'Qty is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.prevRate) {
          rowErrors.prevRate = 'Prev Rate is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.unitPrice) {
          rowErrors.unitPrice = 'Unit Price is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.amount) {
          rowErrors.amount = 'Amount is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.discount) {
          rowErrors.discount = 'Discount is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.discountAmount) {
          rowErrors.discountAmount = 'Discount Amount is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.sgstRate) {
          rowErrors.sgstRate = 'SGST Rate is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.sgstAmount) {
          rowErrors.sgstAmount = 'SGSTAmount is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.cgst) {
          rowErrors.cgst = 'CGST is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.cgstAmount) {
          rowErrors.cgstAmount = 'CGST Amount is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.igst) {
          rowErrors.igst = 'IGST is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.igstAmount) {
          rowErrors.igstAmount = 'IGST Amount is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.taxValue) {
          rowErrors.taxValue = 'Tax Value is required';
          purchaseOrderDetailDataValid = false;
        }
        if (!row.landedValue) {
          rowErrors.landedValue = 'Landed Value is required';
          purchaseOrderDetailDataValid = false;
        }

        return rowErrors;
      });
      setPurchaseOrderDetailErrors(newTableErrors);
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && purchaseOrderDetailDataValid) {
      setIsLoading(true);

      const purchaseOrderDetailsDTO = purchaseOrderDetailData.map((row) => ({
        ...(editId && { id: row.id }),
        item: row.item,
        itemDesc: row.itemDescription,
        uom: row.uom,
        taxType: row.taxType,
        qty: parseInt(row.qty),
        prevRate: parseInt(row.prevRate),
        price: parseInt(row.unitPrice),
        discount: parseInt(row.discount),
        sgst: parseInt(row.sgstRate),
        cgst: parseInt(row.cgst),
        igst: parseInt(row.igst),
        hsnSacCode: ''
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: true,
        customerName: formData.customerName,
        workOrderNo: formData.workOrderNo,
        basedOn: formData.basedOn,
        purchaseIndentNo: formData.purchaseIndentNo,
        quotationNo: formData.quotationNo,
        supplierName: formData.supplierName,
        contactPerson: formData.contactPerson,
        mobileNo: parseInt(formData.mobileNo),
        city: formData.city,
        state: formData.state,
        country: formData.country,
        taxCode: formData.taxCode,
        address: formData.address,
        cancel: true,
        remarks: null,
        purchaseOrderDetailsDTO: purchaseOrderDetailsDTO,
        createdBy: loginUserName,
        orgId: orgId
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', '/grn/updateCreatePurchaseOrder', saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Purchase Order updated successfully' : 'Purchase Order created successfully');
          // getAllListOfValuesByOrgId();
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Purchase Order creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Purchase Order creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  // const getAllListOfValuesByOrgId = async () => {
  //   try {
  //     const result = await apiCalls('get', `/master/getListOfValuesByOrgId?orgId=${orgId}`);
  //     setData(result.paramObjectsMap.listOfValuesVO || []);
  //     showForm(true);
  //     console.log('Test', result);
  //   } catch (err) {
  //     console.log('error', err);
  //   }
  // };

  // const getListOfValueById = async (row) => {
  //   console.log('first', row);
  //   setShowForm(true);
  //   try {
  //     const result = await apiCalls('get', `/master/getListOfValuesById?id=${row.original.id}`);

  //     if (result) {
  //       const listValueVO = result.paramObjectsMap.listOfValuesVO[0];
  //       setEditId(row.original.id);

  //       setFormData({
  //         listCode: listValueVO.listCode || '',
  //         listDescription: listValueVO.listDescription || '',
  //         active: listValueVO.active || false,
  //         id: listValueVO.id || 0
  //       });
  //       setPurchaseOrderDetailData(
  //         listValueVO.listOfValues1VO.map((cl) => ({
  //           id: cl.id,
  //           valueCode: cl.valueCode,
  //           valueDesc: cl.valueDescription,
  //           active: cl.active
  //         }))
  //       );

  //       console.log('DataToEdit', listValueVO);
  //     } else {
  //       // Handle erro
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const getAllCustomerName = async () => {
    try {
      const response = await apiCalls('get', `/purchase/getCustomerNameForPurchaseIndent?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllCustomerName(response.paramObjectsMap.customerNameList);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllWorkOrder = async (CustomerCode) => {
    try {
      const response = await apiCalls('get', `/purchase/getWorkOrderNoForPurchaseEnquiry?customerCode=${CustomerCode}&orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllWorkOrderNo(response.paramObjectsMap.workOrderNo);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllSupplierName = async () => {
    try {
      const response = await apiCalls('get', `/purchase/getSupplierNameForPurchaseEnquiry?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllSupplierName(response.paramObjectsMap.SupplierNameList);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllContactPerson = async (supplierName) => {
    try {
      const response = await apiCalls('get', `/grn/getSupplierAddressForPurchaseOrder?orgId=${orgId}&supplierName=${supplierName}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllContactPerson(response.paramObjectsMap.chCode);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllQuotation = async (customerCode, workOrderNo) => {
    try {
      const response = await apiCalls(
        'get',
        `/grn/getQuotationForPurchaseOrder?basedOn=Quotation&customerCode=${customerCode}&orgId=${orgId}&workorderno=${workOrderNo}`
      );
      if (response.status === true) {
        setAllQuotationList(response.paramObjectsMap.chCode);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllPurchaseIndentNo = async (customerCode, workOrderNo) => {
    try {
      const response = await apiCalls(
        'get',
        `/grn/getPurchaseIndentForPurchaseOrder?basedOn=Purchase Indent&customerCode=${customerCode}&orgId=${orgId}&workorderno=${workOrderNo}`
      );
      if (response.status === true) {
        setAllPurchaseIndentNo(response.paramObjectsMap.chCode);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBasedOnChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === 'basedOn') {
      setFormData((prev) => ({
        ...prev,
        purchaseIndentNo: '',
        quotationNo: ''
      }));
      setAllItemForPurchaseOrder([]);
    }

    if (name === 'purchaseIndentNo' && value) {
      getAllItemForPurchaseIndentNo(value, null); // Pass purchaseIndentNo
    }

    if (name === 'quotationNo' && value) {
      getAllItemForPurchaseIndentNo(null, value); // Pass quotationNo
    }
  };

  const getAllItemForPurchaseIndentNo = async (purchaseIndentNo, quotationNo) => {
    try {
      const url = `/grn/getItemForPurchaseOrder?orgId=${orgId}${
        purchaseIndentNo ? `&purchaseIndentNo=${purchaseIndentNo}` : ''
      }${quotationNo ? `&quotationNo=${quotationNo}` : ''}`;

      const response = await apiCalls('get', url);

      if (response.status === true) {
        const items = response.paramObjectsMap.chCode.map((item) => ({
          ...item,
          taxType: item.taxslab // Assuming taxslab is in format '18%'
        }));
        setAllItemForPurchaseOrder(items);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching item data:', error);
    }
  };

  const getAllSgstAndCgst = async (gstType, taxSlab) => {
    try {
      if (gstType && taxSlab) {
        const response = await apiCalls('get', `/grn/getSGSTandCGSTForGRN?gstType=${gstType}&orgId=${orgId}&taxType=${taxSlab}25`);
        if (response.status === true) {
          return response.paramObjectsMap.cgstandsgst;
        } else {
          console.error('API Error:', response);
          return [];
        }
      }
    } catch (error) {
      console.error('Error fetching SGST and CGST data:', error);
      return [];
    }
  };

  const getAllIgst = async (gstType, taxSlab) => {
    try {
      if (gstType && taxSlab) {
        const response = await apiCalls('get', `/grn/getIGSTForGRN?gstType=${gstType}&orgId=${orgId}&taxType=${taxSlab}25`);
        if (response.status === true) {
          return response.paramObjectsMap.igst;
        } else {
          console.error('API Error:', response);
          return [];
        }
      }
    } catch (error) {
      console.error('Error fetching IGST data:', error);
      return [];
    }
  };

  const handleItemSelection = async (event, newValue, row, index) => {
    const selectedItem = newValue || {};
    const { item = '', itemdesc = '', uom = '', indentqty = '', price = '', taxslab = '' } = selectedItem;

    // Update purchase order details
    setPurchaseOrderDetailData((prev) =>
      prev.map((r) =>
        r.id === row.id
          ? {
              ...r,
              item,
              itemDescription: itemdesc,
              uom,
              qty: parseFloat(indentqty),
              unitPrice: parseFloat(price),
              taxType: taxslab,
              amount: (parseFloat(indentqty) * parseFloat(price)).toFixed(2), // Calculate amount
              isFieldsDisabled: true
            }
          : r
      )
    );

    // Clear errors for mapped fields
    setPurchaseOrderDetailErrors((prevErrors) => {
      const newErrors = [...prevErrors];
      newErrors[index] = {
        ...newErrors[index],
        item: '',
        itemDescription: '',
        uom: '',
        qty: '',
        unitPrice: '',
        taxType: ''
      };
      return newErrors;
    });

    // Handle SGST/CGST and IGST based on the tax slab
    try {
      if (taxslab === 'INTER') {
        // INTER: Set SGST and CGST to 0, and use fetched IGST value
        setPurchaseOrderDetailData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  sgstRate: '0',
                  cgst: '0',
                  igst: row.igst || '0' // Use the fetched IGST value
                }
              : r
          )
        );
      } else if (taxslab === 'INTRA') {
        // INTRA: Set IGST to 0, and use fetched SGST and CGST values
        setPurchaseOrderDetailData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  sgstRate: row.sgstRate || '0', // Use the fetched SGST Rate value
                  cgst: row.cgst || '0', // Use the fetched CGST value
                  igst: '0'
                }
              : r
          )
        );
      } else {
        // Default: Fetch SGST/CGST and IGST from API
        const [sgstAndCgstData, igstData] = await Promise.all([getAllSgstAndCgst(gstType, taxslab), getAllIgst(gstType, taxslab)]);

        const sgstRate = sgstAndCgstData?.[0]?.sgstpercentage || '0';
        const cgstRate = sgstAndCgstData?.[0]?.sgstpercentage || '0';
        const igstRate = igstData?.[0]?.igstpercentage || '0';

        setPurchaseOrderDetailData((prev) =>
          prev.map((r) =>
            r.id === row.id
              ? {
                  ...r,
                  sgstRate,
                  cgst: cgstRate,
                  igst: igstRate // Ensure IGST is updated here
                }
              : r
          )
        );
      }
    } catch (error) {
      console.error('Error fetching tax data:', error);
    }
  };

  const calculateFields = (row) => {
    const amount = parseFloat(row.amount) || 0;
    const discountAmount = parseFloat(row.discountAmount) || 0;
    const sgstRate = parseFloat(row.sgstRate) || 0;
    const cgstRate = parseFloat(row.cgst) || 0;
    const igstRate = parseFloat(row.igst) || 0;

    const netAmount = amount - discountAmount;

    const sgstAmount = (netAmount * sgstRate) / 100;
    const cgstAmount = (netAmount * cgstRate) / 100;
    const igstAmount = (netAmount * igstRate) / 100;

    const taxValue = sgstAmount + cgstAmount + igstAmount;
    const landedValue = netAmount + taxValue;

    return {
      sgstAmount: sgstAmount.toFixed(2),
      cgstAmount: cgstAmount.toFixed(2),
      igstAmount: igstAmount.toFixed(2),
      taxValue: taxValue.toFixed(2),
      landedValue: landedValue.toFixed(2)
    };
  };

  const updateField = (index, field, value) => {
    setPurchaseOrderDetailData((prev) =>
      prev.map((row, i) => {
        if (i === index) {
          const updatedRow = { ...row, [field]: value };
          return { ...updatedRow, ...calculateFields(updatedRow) };
        }
        return row;
      })
    );
  };

  const handleList = () => {
    setShowForm(!showForm);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div>
      <ToastContainer />
      <div className="card w-full p-6 bg-base-100 shadow-xl mb-3" style={{ padding: '20px' }}>
        <div className="d-flex flex-wrap justify-content-start mb-4">
          <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
          <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
          <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleList} />
          <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} isLoading={isLoading} margin="0 10px 0 10px" />
        </div>
        {showForm ? (
          <>
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="po"
                    label="PO"
                    name="po"
                    size="small"
                    value={formData.po}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.po}
                    helperText={fieldErrors.po}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="PO Date"
                      value={formData.poDate}
                      onChange={(date) => handleDateChange('poDate', date)}
                      disabled
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                  <InputLabel id="customerName">Customer Name</InputLabel>
                  <Select
                    labelId="customerName"
                    id="customerName"
                    label="Customer Name"
                    onChange={handleInputChange}
                    name="customerName"
                    value={formData.customerName}
                  >
                    {allCustomerName.map((customer) => (
                      <MenuItem key={customer.id} value={customer.customerName}>
                        {customer.customerName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.customerName && <FormHelperText>{fieldErrors.customerName}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.workOrderNo}>
                  <InputLabel id="workOrderNo">Work Order No</InputLabel>
                  <Select
                    labelId="workOrderNo"
                    id="workOrderNo"
                    label="Work Order No"
                    onChange={handleInputChange}
                    name="workOrderNo"
                    value={formData.workOrderNo}
                  >
                    {allWorkOrderNo.map((order) => (
                      <MenuItem key={order.id} value={order.workOrderNo}>
                        {order.workOrderNo}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.workOrderNo && <FormHelperText>{fieldErrors.workOrderNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.basedOn}>
                  <InputLabel id="basedOn">Based On</InputLabel>
                  <Select
                    labelId="basedOn"
                    id="basedOn"
                    label="Based On"
                    onChange={handleInputChange}
                    name="basedOn"
                    value={formData.basedOn}
                  >
                    <MenuItem value="Purchase Indent">Purchase Indent</MenuItem>
                    <MenuItem value="Quotation">Quotation</MenuItem>
                  </Select>
                  {fieldErrors.basedOn && <FormHelperText>{fieldErrors.basedOn}</FormHelperText>}
                </FormControl>
              </div>

              {formData.basedOn === 'Quotation' && (
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.quotationNo}>
                    <InputLabel id="quotationNo">Quotation No</InputLabel>
                    <Select
                      labelId="quotationNo"
                      id="quotationNo"
                      label="Quotation No"
                      onChange={handleBasedOnChange}
                      name="quotationNo"
                      value={formData.quotationNo}
                    >
                      {allQuotationList.map((quotation) => (
                        <MenuItem key={quotation.id} value={quotation.docid}>
                          {quotation.docid}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.quotationNo && <FormHelperText>{fieldErrors.quotationNo}</FormHelperText>}
                  </FormControl>
                </div>
              )}

              {formData.basedOn === 'Purchase Indent' && (
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.purchaseIndentNo}>
                    <InputLabel id="purchaseIndentNo">Purchase Indent No</InputLabel>
                    <Select
                      labelId="purchaseIndentNo"
                      id="purchaseIndentNo"
                      label="Purchase Indent No"
                      onChange={handleBasedOnChange}
                      name="purchaseIndentNo"
                      value={formData.purchaseIndentNo}
                    >
                      {allPurchaseIndentNo.map((purchase) => (
                        <MenuItem key={purchase.id} value={purchase.docid}>
                          {purchase.docid}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.purchaseIndentNo && <FormHelperText>{fieldErrors.purchaseIndentNo}</FormHelperText>}
                  </FormControl>
                </div>
              )}

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.supplierName}>
                  <InputLabel id="supplierName">Supplier Name</InputLabel>
                  <Select
                    labelId="supplierName"
                    id="supplierName"
                    label="Supplier Name"
                    onChange={handleInputChange}
                    name="supplierName"
                    value={formData.supplierName}
                  >
                    {allSupplierName.map((supplier) => (
                      <MenuItem key={supplier.id} value={supplier.supplierName}>
                        {supplier.supplierName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.supplierName && <FormHelperText>{fieldErrors.supplierName}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.contactPerson}>
                  <InputLabel id="contactPerson">Contact Person</InputLabel>
                  <Select
                    labelId="contactPerson"
                    id="contactPerson"
                    label="Contact Person"
                    onChange={handleInputChange}
                    name="contactPerson"
                    value={formData.contactPerson}
                  >
                    {allContactPerson.map((contact) => (
                      <MenuItem key={contact.id} value={contact.contactperson}>
                        {contact.contactperson}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.contactPerson && <FormHelperText>{fieldErrors.contactPerson}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="mobileNo"
                    label="Mobile No"
                    name="mobileNo"
                    size="small"
                    disabled
                    value={formData.mobileNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.mobileNo}
                    helperText={fieldErrors.mobileNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="city"
                    label="City"
                    name="city"
                    size="small"
                    disabled
                    value={formData.city}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.city}
                    helperText={fieldErrors.city}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="state"
                    label="State"
                    name="state"
                    size="small"
                    disabled
                    value={formData.state}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.state}
                    helperText={fieldErrors.state}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="country"
                    label="Country"
                    name="country"
                    size="small"
                    value={formData.country}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.country}
                    helperText={fieldErrors.country}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="taxCode"
                    label="Tax Code"
                    name="taxCode"
                    size="small"
                    disabled
                    value={formData.taxCode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.taxCode}
                    helperText={fieldErrors.taxCode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="address"
                    label="Address"
                    name="address"
                    size="small"
                    disabled
                    value={formData.address}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.address}
                    helperText={fieldErrors.address}
                  />
                </FormControl>
              </div>
            </div>
            {/* <TableComponent formData={formData} setFormData={setFormData} /> */}
            <div className="row mt-2">
              <Box sx={{ width: '100%' }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  textColor="secondary"
                  indicatorColor="secondary"
                  aria-label="secondary tabs example"
                >
                  <Tab value={0} label="Purchase Order Detail" />
                  <Tab value={1} label="Purchase Order Summary" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered ">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                    Item
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Item Description
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    UOM
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Tax Type
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Qty
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Prev-Rate
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Unit Price
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Amount
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Discount (%)
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Discount Amount
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    SGST Rate
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    SGST Amount
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    CGST %
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    CGST Amount
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    IGST %
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    IGST Amount
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Tax Value
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Landed Value
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {purchaseOrderDetailData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            purchaseOrderDetailData,
                                            setPurchaseOrderDetailData,
                                            purchaseOrderDetailErrors,
                                            setPurchaseOrderDetailErrors
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>

                                    <td className="border px-2 py-2">
                                      <Autocomplete
                                        options={allItemForPurchaseOrder}
                                        getOptionLabel={(option) => option.item || ''}
                                        groupBy={(option) => (option.item ? option.item[0] : '')}
                                        value={row.item ? allItemForPurchaseOrder.find((a) => a.item === row.item) : null}
                                        onChange={(event, newValue) => handleItemSelection(event, newValue, row, index)}
                                        size="small"
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Item"
                                            variant="outlined"
                                            error={!!purchaseOrderDetailErrors[index]?.item}
                                            helperText={purchaseOrderDetailErrors[index]?.item}
                                          />
                                        )}
                                        sx={{ width: 250 }}
                                      />
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.itemDescription}
                                        disabled={row.isFieldsDisabled} // Disable the field
                                        className={
                                          purchaseOrderDetailErrors[index]?.itemDescription ? 'error form-control' : 'form-control'
                                        }
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.uom}
                                        disabled={row.isFieldsDisabled} // Disable the field
                                        className={purchaseOrderDetailErrors[index]?.uom ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.taxType}
                                        disabled={row.isFieldsDisabled} // Disable the field
                                        className={purchaseOrderDetailErrors[index]?.taxType ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.qty}
                                        disabled={row.isFieldsDisabled} // Disable the field
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id
                                                ? {
                                                    ...r,
                                                    qty: value,
                                                    amount: value * (r.unitPrice || 0) // Recalculate amount
                                                  }
                                                : r
                                            )
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              qty: !value ? 'Qty is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.prevRate}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, prevRate: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              prevRate: !value ? 'Prev Rate is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.prevRate ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.prevRate && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].prevRate}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.unitPrice}
                                        disabled={row.isFieldsDisabled} // Disable the field
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id
                                                ? {
                                                    ...r,
                                                    unitPrice: value,
                                                    amount: (r.qty || 0) * value // Recalculate amount
                                                  }
                                                : r
                                            )
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              unitPrice: !value ? 'Unit Price is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.unitPrice ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.amount}
                                        disabled // Amount is read-only
                                        className={purchaseOrderDetailErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.discount || ''}
                                        onChange={(e) => {
                                          const value = e.target.value;

                                          // Update discount and discountAmount, and clear calculated fields if discount is cleared
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id
                                                ? {
                                                    ...r,
                                                    discount: value,
                                                    discountAmount:
                                                      r.amount && value
                                                        ? ((parseFloat(r.amount) * parseFloat(value)) / 100).toFixed(2) // Calculate discountAmount
                                                        : '', // Fallback for invalid values
                                                    // Clear calculated fields if discount is cleared
                                                    sgstAmount: value ? calculateFields({ ...r, discount: value }).sgstAmount : '',
                                                    cgstAmount: value ? calculateFields({ ...r, discount: value }).cgstAmount : '',
                                                    igstAmount: value ? calculateFields({ ...r, discount: value }).igstAmount : '',
                                                    taxValue: value ? calculateFields({ ...r, discount: value }).taxValue : '',
                                                    landedValue: value ? calculateFields({ ...r, discount: value }).landedValue : ''
                                                  }
                                                : r
                                            )
                                          );

                                          // Set error if discount is empty
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              discount: !value ? 'Discount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.discount ? 'error form-control' : 'form-control'}
                                      />
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.discountAmount || ''}
                                        disabled // Discount Amount is read-only
                                        className="form-control"
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.sgstRate}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sgstRate: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sgstRate: !value ? 'SGST Rate is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.sgstRate ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.sgstRate && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].sgstRate}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.sgstAmount || ''}
                                        disabled // SGST Amount is read-only
                                        className="form-control"
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.cgst || ''}
                                        onChange={(e) => updateField(index, 'cgst', e.target.value)}
                                        className={purchaseOrderDetailErrors[index]?.cgst ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.cgstAmount || ''}
                                        disabled // CGST Amount is read-only
                                        className="form-control"
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.igst || ''}
                                        onChange={(e) => updateField(index, 'igst', e.target.value)}
                                        className={purchaseOrderDetailErrors[index]?.igst ? 'error form-control' : 'form-control'}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.igstAmount || ''}
                                        disabled // IGST Amount is read-only
                                        className="form-control"
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.taxValue || ''}
                                        disabled // Tax Value is read-only
                                        className="form-control"
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.landedValue || ''}
                                        disabled // Landed Value is read-only
                                        className="form-control"
                                      />
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {value === 1 && (
                  <>
                    <div className="row d-flex">
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="grossAmount"
                            label="Gross Amount"
                            name="grossAmount"
                            size="small"
                            value={formData.grossAmount}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.grossAmount}
                            helperText={fieldErrors.grossAmount}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="totalAmountTax"
                            label="Total Amount Tax"
                            name="totalAmountTax"
                            size="small"
                            value={formData.totalAmountTax}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.totalAmountTax}
                            helperText={fieldErrors.totalAmountTax}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="netAmount"
                            label="Net Amount"
                            name="netAmount"
                            size="small"
                            value={formData.netAmount}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.netAmount}
                            helperText={fieldErrors.netAmount}
                          />
                        </FormControl>
                      </div>

                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="amountInWords"
                            label="Amount In Words"
                            name="amountInWords"
                            size="small"
                            value={formData.amountInWords}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.amountInWords}
                            helperText={fieldErrors.amountInWords}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </>
                )}
              </Box>
            </div>
          </>
        ) : (
          <CommonTable
            data={data && data}
            columns={columns}
            blockEdit={true}
            // toEdit={getListOfValueById}
          />
        )}
      </div>
    </div>
  );
};

export default PurchaseOrder;
