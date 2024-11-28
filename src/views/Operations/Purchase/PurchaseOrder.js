import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
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

  const [formData, setFormData] = useState({
    po: '',
    poDate: null,
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
  const [fieldErrors, setFieldErrors] = useState({
    po: '',
    poDate: null,
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

  // useEffect(() => {
  //   getAllListOfValuesByOrgId();
  // }, []);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
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
      po: '',
      poDate: null,
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
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.po) errors.po = 'Po is required';
    if (!formData.poDate) errors.poDate = 'Po Date is required';
    if (!formData.customerName) errors.customerName = 'Customer Name is required';
    if (!formData.workOrderNo) errors.workOrderNo = 'Work Order No is required';
    if (!formData.basedOn) errors.basedOn = 'Based On is required';
    if (!formData.quotationNo) errors.quotationNo = 'Quotation No is required';
    if (!formData.purchaseIndentNo) errors.purchaseIndentNo = 'Purchase Indent No is required';
    if (!formData.supplierName) errors.supplierName = 'Supplier Name is required';
    if (!formData.contactPerson) errors.contactPerson = 'Contact Person is required';
    if (!formData.mobileNo) errors.mobileNo = 'Mobile No is required';
    if (!formData.email) errors.email = 'Email is required';
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

      // const detailsVo = partCodeData.map((row) => ({
      //   ...(editId && { id: row.id }),
      //   valueCode: row.valueCode,
      //   valueDescription: row.valueDesc,
      //   active: row.active === 'true' || row.active === true // Convert string 'true' to boolean true if necessary
      // }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        listCode: formData.listCode,
        listDescription: formData.listDescription,
        // listOfValues1DTO: detailsVo,
        createdBy: loginUserName,
        orgId: orgId
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', '/master/updateCreateListOfValues', saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'List of values updated successfully' : 'List of values created successfully');
          // getAllListOfValuesByOrgId();
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'List of value creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'List of value creation failed');
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
                      value={formData.poDate ? dayjs(formData.poDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('poDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.poDate}
                      helperText={fieldErrors.poDate ? fieldErrors.poDate : ''}
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
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
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
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
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
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.basedOn && <FormHelperText>{fieldErrors.basedOn}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.quotationNo}>
                  <InputLabel id="quotationNo">Quotation No</InputLabel>
                  <Select
                    labelId="quotationNo"
                    id="quotationNo"
                    label="Quotation No"
                    onChange={handleInputChange}
                    name="quotationNo"
                    value={formData.quotationNo}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.quotationNo && <FormHelperText>{fieldErrors.quotationNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.purchaseIndentNo}>
                  <InputLabel id="purchaseIndentNo">Purchase Indent No</InputLabel>
                  <Select
                    labelId="purchaseIndentNo"
                    id="purchaseIndentNo"
                    label="Purchase Indent No"
                    onChange={handleInputChange}
                    name="purchaseIndentNo"
                    value={formData.purchaseIndentNo}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.purchaseIndentNo && <FormHelperText>{fieldErrors.purchaseIndentNo}</FormHelperText>}
                </FormControl>
              </div>

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
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
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
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
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
                    id="email"
                    label="Email"
                    name="email"
                    size="small"
                    value={formData.email}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.email}
                    helperText={fieldErrors.email}
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

                                    {/* <td className="border px-2 py-2">
                                      <Autocomplete
                                        options={allAccountName}
                                        getOptionLabel={(option) => option.accountName || ''}
                                        groupBy={(option) => (option.accountName ? option.accountName[0].toUpperCase() : '')}
                                        value={row.accountName ? allAccountName.find((a) => a.accountName === row.accountName) : null}
                                        onChange={(event, newValue) => {
                                          const value = newValue ? newValue.accountName : '';
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, accountName: value } : r))
                                          );
                                          setDetailsTableErrors((prevErrors) =>
                                            prevErrors.map((err, idx) => (idx === index ? { ...err, accountName: '' } : err))
                                          );
                                        }}
                                        size="small"
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Account Name"
                                            variant="outlined"
                                            error={!!detailsTableErrors[index]?.accountName}
                                            helperText={detailsTableErrors[index]?.accountName}
                                          />
                                        )}
                                        sx={{ width: 250 }}
                                      />
                                    </td> */}

                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.item}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, item: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              item: !value ? 'Item is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.item ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.item && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].item}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.itemDescription}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, itemDescription: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemDescription: !value ? 'Item Description is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={
                                          purchaseOrderDetailErrors[index]?.itemDescription ? 'error form-control' : 'form-control'
                                        }
                                      />
                                      {purchaseOrderDetailErrors[index]?.itemDescription && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].itemDescription}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.uom}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, uom: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              uom: !value ? 'UOM is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.uom ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.uom && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].uom}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.taxType}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, taxType: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              taxType: !value ? 'Tax Type is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.taxType ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.taxType && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].taxType}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.qty}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r))
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
                                      {purchaseOrderDetailErrors[index]?.qty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].qty}
                                        </div>
                                      )}
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
                                        onChange={(e) => {
                                          const date = e.target.value;

                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id ? { ...r, unitPrice: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                            )
                                          );

                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              unitPrice: !date ? 'Unit Price is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.unitPrice ? 'error form-control' : 'form-control'}
                                        // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
                                      />
                                      {purchaseOrderDetailErrors[index]?.unitPrice && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].unitPrice}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.amount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              amount: !value ? 'Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.amount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].amount}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.discount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, discount: value } : r))
                                          );
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
                                      {purchaseOrderDetailErrors[index]?.discount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].discount}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.discountAmount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, discountAmount: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              discountAmount: !value ? 'Discount Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.discountAmount ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.discountAmount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].discountAmount}
                                        </div>
                                      )}
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
                                        value={row.sgstAmount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sgstAmount: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sgstAmount: !value ? 'SGST Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.sgstAmount ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.sgstAmount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].sgstAmount}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.cgst}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, cgst: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              cgst: !value ? 'CGST is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.cgst ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.cgst && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].cgst}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.cgstAmount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, cgstAmount: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              cgstAmount: !value ? 'CGST Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.cgstAmount ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.cgstAmount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].cgstAmount}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.igst}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, igst: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              igst: !value ? 'IGST is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.igst ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.igst && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].igst}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.igstAmount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, igstAmount: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              igstAmount: !value ? 'IGST Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.igstAmount ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.igstAmount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].igstAmount}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.taxValue}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, taxValue: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              taxValue: !value ? 'Tax Value is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.taxValue ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.taxValue && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].taxValue}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.landedValue}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPurchaseOrderDetailData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, landedValue: value } : r))
                                          );
                                          setPurchaseOrderDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              landedValue: !value ? 'Landed Value is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={purchaseOrderDetailErrors[index]?.landedValue ? 'error form-control' : 'form-control'}
                                      />
                                      {purchaseOrderDetailErrors[index]?.landedValue && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {purchaseOrderDetailErrors[index].landedValue}
                                        </div>
                                      )}
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
