import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputLabel, Autocomplete, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormHelperText } from '@mui/material';
import Draggable from 'react-draggable';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import Paper from '@mui/material/Paper';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import Checkbox from '@mui/material/Checkbox';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import sampleFile from '../../../assets/sample-files/sample_data_buyerorder.xls';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}
const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function PurchaseInvoice() {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [allItemCode, setAllItemCode] = useState([]);
  const [editId, setEditId] = useState('');
  const [allGrnNo, setAllGrnNo] = useState([]);
  const [allPoNo, setAllPoNo] = useState([]);
  const [allSupplierName, setAllSupplierName] = useState([]);
  const [invoiceNo, setInvoiceNo] = useState('');
  const [formData, setFormData] = useState({
    invoiceDate: dayjs(),
    supplierName: '',
    poNo: '',
    grnNo: '',
    grnDate: null,
    location: '',
    inwardNo: '',
    supplierCode: '',
    gstState: '',
    gstNo: '',
    isReverseCharge: '',
    address: '',
    currency: '',
    exchangeRate: '',
    grnClearTime: '',
    dcNo: '',
    dcDate: null,
    gstType: '',
    customerName: '',
    // 2nd table
    grossAmount: '',
    totalAmountTax: '',
    netAmount: '',
    remarks: '',
    cnt: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    invoiceDate: dayjs(),
    supplierName: '',
    poNo: '',
    grnNo: '',
    grnDate: null,
    location: '',
    inwardNo: '',
    supplierCode: '',
    gstState: '',
    gstNo: '',
    isReverseCharge: '',
    address: '',
    currency: '',
    exchangeRate: '',
    grnClearTime: '',
    dcNo: '',
    dcDate: null,
    gstType: '',
    customerName: '',
    // 2nd table
    grossAmount: '',
    totalAmountTax: '',
    netAmount: '',
    remarks: '',
    cnt: ''
  });

  const listViewColumns = [
    { accessorKey: 'supplierName', header: 'Supplier Name', size: 140 },
    { accessorKey: 'invoiceDate', header: 'Invoice Date', size: 140 },
    { accessorKey: 'invoiceNo', header: 'Invoice No', size: 140 }
  ];

  const [itemDetailsTable, setItemDetailsTable] = useState([
    {
      id: 1,
      itemName: '',
      itemCode: '',
      sacCode: '',
      taxType: '',
      primaryUnit: '',
      poRate: '',
      receivedQuantity: '',
      acceptQuantity: '',
      unitPrice: '',
      amount: '',
      sgst: '',
      cgst: '',
      igst: '',
      taxValue: '',
      landedValue: '',
      poDetailId: ''
    }
  ]);
  const [itemTableErrors, setItemTableErrors] = useState([
    {
      id: 1,
      itemName: '',
      itemCode: '',
      sacCode: '',
      taxType: '',
      primaryUnit: '',
      poRate: '',
      receivedQuantity: '',
      acceptQuantity: '',
      unitPrice: '',
      amount: '',
      sgst: '',
      cgst: '',
      igst: '',
      taxValue: '',
      landedValue: '',
      poDetailId: ''
    }
  ]);

  // const [file, setFile] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectAll, setSelectAll] = useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleSaveSelectedRows = async () => { }
  const handleSelectAll = () => { }
  const getMachineMasterById = () => { }
  useEffect(() => {
    getSupplierName();
    getPurchaseInvoiceNo();
    getAllPurchaseInvoiceByOrgId();
  }, []);

  const handleClear = () => {
    setFormData({
      invoiceDate: dayjs(),
      supplierName: '',
      poNo: '',
      grnNo: '',
      grnDate: null,
      location: '',
      inwardNo: '',
      supplierCode: '',
      gstState: '',
      gstNo: '',
      isReverseCharge: '',
      address: '',
      currency: '',
      exchangeRate: '',
      grnClearTime: '',
      dcNo: '',
      dcDate: null,
      gstType: '',
      customerName: '',
      // 2nd table
      grossAmount: '',
      totalAmountTax: '',
      netAmount: '',
      remarks: '',
      cnt: ''
    });
    setFieldErrors({
      invoiceDate: dayjs(),
      supplierName: '',
      poNo: '',
      grnNo: '',
      grnDate: null,
      location: '',
      inwardNo: '',
      supplierCode: '',
      gstState: '',
      gstNo: '',
      isReverseCharge: '',
      address: '',
      currency: '',
      exchangeRate: '',
      grnClearTime: '',
      dcNo: '',
      dcDate: null,
      gstType: '',
      customerName: '',
      // 2nd table
      grossAmount: '',
      totalAmountTax: '',
      netAmount: '',
      remarks: '',
      cnt: ''
    });
    setItemDetailsTable([
      {
        id: 1,
        itemName: '',
        itemCode: '',
        sacCode: '',
        taxType: '',
        primaryUnit: '',
        poRate: '',
        receivedQuantity: '',
        acceptQuantity: '',
        unitPrice: '',
        amount: '',
        sgst: '',
        cgst: '',
        igst: '',
        taxValue: '',
        landedValue: '',
        poDetailId: ''
      }
    ]);
    setItemTableErrors('');
    setEditId('');
    getPurchaseInvoiceNo();
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';


    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));
     switch (name) {
          case 'grnNo': {
            const selectedGRNNo = allGrnNo.find((a) => a.grnNo === value);
            if (selectedGRNNo) {
              setFormData((prevData) => ({
                ...prevData,
                grnDate: selectedGRNNo.grnDate ? dayjs(selectedGRNNo.grnDate, 'YYYY-MM-DD') : dayjs(),
                dcDate: selectedGRNNo.invdcDate ? dayjs(selectedGRNNo.invdcDate, 'YYYY-MM-DD') : dayjs(),
                dcNo: selectedGRNNo.invdcNo || '',
                address: selectedGRNNo.address || '',
                gstNo: selectedGRNNo.gstNo || '',
                supplierCode: selectedGRNNo.supplierCode || '',
                gstType: selectedGRNNo.gstType || '',
                customerName: selectedGRNNo.customerName || '',
                exchangeRate: selectedGRNNo.exchangeRate || '',
                location: selectedGRNNo.location || '',
                currency: selectedGRNNo.currency || '',
                inwardNo: selectedGRNNo.inwordNo || '',
                grnClearTime: selectedGRNNo.grnClearTime || ''
              }));
              getAllItemCode(selectedGRNNo.grnNo);
            }
            break;
          }
          default:
          break;
        }

    if (!errorMessage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === 'text' || type === 'textarea' ? value.toUpperCase() : value
      }));

      // Preserve cursor position for text inputs
      if (type === 'text' || type === 'textarea') {
        setTimeout(() => {
          const inputElement = document.getElementsByName(name)[0];
          if (inputElement && inputElement.setSelectionRange) {
            inputElement.setSelectionRange(selectionStart, selectionEnd);
          }
        }, 0);
      }
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRowItem = () => {
    if (isLastRowEmptyItem(itemDetailsTable)) {
      displayRowErrorItem(itemDetailsTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      itemName: '',
      itemCode: '',
      sacCode: '',
      taxType: '',
      primaryUnit: '',
      poRate: '',
      receivedQuantity: '',
      acceptQuantity: '',
      unitPrice: '',
      amount: '',
      sgst: '',
      cgst: '',
      igst: '',
      taxValue: '',
      landedValue: '',
      poDetailId: ''
    };
    setItemDetailsTable([...itemDetailsTable, newRow]);
    setItemTableErrors([
      ...itemTableErrors,
      {
        itemName: '',
        itemCode: '',
        sacCode: '',
        taxType: '',
        primaryUnit: '',
        poRate: '',
        receivedQuantity: '',
        acceptQuantity: '',
        unitPrice: '',
        amount: '',
        sgst: '',
        cgst: '',
        igst: '',
        taxValue: '',
        landedValue: '',
        poDetailId: ''
      }
    ]);
  };

  const isLastRowEmptyItem = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === itemDetailsTable) {
      return (
        !lastRow.itemName ||
        !lastRow.itemCode ||
        !lastRow.sacCode ||
        !lastRow.taxType ||
        !lastRow.unitPrice ||
        !lastRow.primaryUnit ||
        !lastRow.poRate ||
        !lastRow.receivedQuantity ||
        !lastRow.acceptQuantity ||
        !lastRow.amount ||
        !lastRow.sgst ||
        !lastRow.cgst ||
        !lastRow.igst ||
        !lastRow.taxValue ||
        !lastRow.landedValue ||
        !lastRow.poDetailId
      );
    }
    return false;
  };

  const displayRowErrorItem = (table) => {
    if (table === itemDetailsTable) {
      setItemTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          itemName: !table[table.length - 1].itemName ? 'Item Name is required' : '',
          itemCode: !table[table.length - 1].itemCode ? 'Item Code is required' : '',
          sacCode: !table[table.length - 1].sacCode ? 'Sac Code is required' : '',
          taxType: !table[table.length - 1].taxType ? 'Tax Type is required' : '',
          unitPrice: !table[table.length - 1].unitPrice ? 'Unit Price is required' : '',
          primaryUnit: !table[table.length - 1].primaryUnit ? 'Primary Unit is required' : '',
          poRate: !table[table.length - 1].poRate ? 'PO Rate is required' : '',
          receivedQuantity: !table[table.length - 1].receivedQuantity ? 'Received Quantity is required' : '',
          acceptQuantity: !table[table.length - 1].acceptQuantity ? 'Accept Quantity is required' : '',
          amount: !table[table.length - 1].amount ? 'Amount is required' : '',
          sgst: !table[table.length - 1].sgst ? 'Sgst is required' : '',
          cgst: !table[table.length - 1].cgst ? 'Cgst is required' : '',
          igst: !table[table.length - 1].igst ? 'Igst is required' : '',
          taxValue: !table[table.length - 1].taxValue ? 'Tax Value is required' : '',
          landedValue: !table[table.length - 1].landedValue ? 'Landed Value is required' : '',
          poDetailId: !table[table.length - 1].poDetailId ? 'PO Detail Id is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
    const rowIndex = table.findIndex((row) => row.id === id);
    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };

  const handleView = () => {
    setShowForm(!showForm);
  };

  const getSupplierName = async () => {
    try {
      const response = await apiCalls('get', `/purchase/getSupplierNameForPurchaseEnquiry?orgId=${orgId}`);
      setAllSupplierName(response.paramObjectsMap.SupplierNameList || []);
      console.log('Item Name', response.paramObjectsMap.SupplierNameList || []);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getPoNo = async (supplierCode) => {
    try {
      const response = await apiCalls('get', `/purchaseReturn/getPurchaseOrderPoNumber?orgId=${orgId}&supplierCode=${supplierCode}`);
      setAllPoNo(response.paramObjectsMap.purchaseOrderVO || []);
      console.log('Po No', response.paramObjectsMap.purchaseOrderVO || []);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getGrnNo = async (poNo) => {
    try {
      const response = await apiCalls('get', `/purchaseReturn/getGrnNoAndGrnDateFromGrnDetails?orgId=${orgId}&poNo=${poNo}`);
      setAllGrnNo(response.paramObjectsMap.grnVO || []);
      console.log('Grn No', response.paramObjectsMap.grnVO || []);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllItemCode = async (grnNo) => {
    try {
      const result = await apiCalls('get', `/purchaseReturn/getItemCodeAndItemDescFromGrn?grnNo=${grnNo}&orgId=${orgId}`);
      setAllItemCode(result.paramObjectsMap.grnVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const handleSave = async () => {
    const errors = {};
    if (!formData.customerName) {
      errors.customerName = 'Customer Name is required';
    }
    if (!formData.poNo) {
      errors.poNo = 'PO No is required';
    }
    if (!formData.grnNo) {
      errors.grnNo = 'GRN No is required';
    }
    if (!formData.dcDate) {
      errors.dcDate = 'DC Date  is required';
    }
    if (!formData.supplierName) {
      errors.supplierName = 'Supplier Name is required';
    }
    if (!formData.supplierCode) {
      errors.supplierCode = 'Supplier Id is required';
    }
    if (!formData.grnDate) {
      errors.grnDate = 'GRN Date is required';
    }
    if (!formData.gstState) {
      errors.gstState = 'GST State is required';
    }
    if (!formData.gstType) {
      errors.gstType = 'GST Type  is required';
    }
    if (!formData.contactPerson) {
      errors.contactPerson = 'Contact Person is required';
    }
    if (!formData.inwardNo) {
      errors.inwardNo = 'Inward No  is required';
    }
    if (!formData.location) {
      errors.location = 'Location is required';
    }
    if (!formData.grossAmount) {
      errors.grossAmount = 'Gross Amount is required';
    }
    if (!formData.netAmount) {
      errors.netAmount = 'Net Amount is required';
    }
    if (!formData.totalAmountTax) {
      errors.totalAmountTax = 'Total Amount Tax is required';
    }
    if (!formData.remarks) {
      errors.remarks = 'Remarks  is required';
    }
    if (!formData.cnt) {
      errors.cnt = 'CNT is required';
    }
    if (!formData.isReverseCharge) {
      errors.isReverseCharge = 'Is Reverse Charge is required';
    }
    if (!formData.address) {
      errors.address = 'address is required';
    }
    if (!formData.currency) {
      errors.currency = 'Currency is required';
    }
    if (!formData.exchangeRate) {
      errors.exchangeRate = 'Exchange Rate Tax is required';
    }
    if (!formData.grnClearTime) {
      errors.grnClearTime = 'GRN Clear Time  is required';
    }
    if (!formData.dcNo) {
      errors.dcNo = 'DC No is required';
    }
    if (!formData.gstNo) {
      errors.gstNo = 'GST No is required';
    }
    if (!formData.address) {
      errors.address = 'Address is required';
    }

    let itemTableDataValid = true;
    const newItemTableErrors = itemDetailsTable.map((row) => {
      const rowErrors = {};
      if (!row.itemName) {
        rowErrors.itemName = 'Item Name is required';
        itemTableDataValid = false;
      }
      if (!row.itemCode) {
        rowErrors.itemCode = 'Item Desc is required';
        itemTableDataValid = false;
      }
      if (!row.sacCode) {
        rowErrors.sacCode = 'SAC Code is required';
        itemTableDataValid = false;
      }
      if (!row.taxType) {
        rowErrors.taxType = 'Tax Type is required';
        itemTableDataValid = false;
      }
      if (!row.unitPrice) {
        rowErrors.unitPrice = 'Unit Price  is required';
        itemTableDataValid = false;
      }
      if (!row.primaryUnit) {
        rowErrors.primaryUnit = 'Primary Unit is required';
        itemTableDataValid = false;
      }
      if (!row.poRate) {
        rowErrors.poRate = 'PO Rate is required';
        itemTableDataValid = false;
      }

      if (!row.receivedQuantity) {
        rowErrors.receivedQuantity = 'Received Quantity is required';
        itemTableDataValid = false;
      }
      if (!row.acceptQuantity) {
        rowErrors.acceptQuantity = 'Accept Quantity is required';
        itemTableDataValid = false;
      }
      if (!row.amount) {
        rowErrors.amount = 'Amount is required';
        itemTableDataValid = false;
      }
      if (!row.sgst) {
        rowErrors.sgst = 'SGST is required';
        itemTableDataValid = false;
      }
      if (!row.cgst) {
        rowErrors.cgst = 'CGST  is required';
        itemTableDataValid = false;
      }
      if (!row.igst) {
        rowErrors.igst = 'Igst is required';
        itemTableDataValid = false;
      }
      if (!row.taxValue) {
        rowErrors.taxValue = 'Tax Value is required';
        itemTableDataValid = false;
      }
      if (!row.landedValue) {
        rowErrors.landedValue = 'Landed Value is required';
        itemTableDataValid = false;
      }
      if (!row.poDetailId) {
        rowErrors.poDetailId = 'PO Detail Id is required';
        itemTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);
    setItemTableErrors(newItemTableErrors);

    if (Object.keys(errors).length === 0 && (itemTableDataValid)) {
      const PurchaseInvoiceVO = itemDetailsTable.map((row) => ({
        ...(editId && { id: row.id }),
        hsnSacCode: row.sacCode,
        acceptQty: parseInt(row.acceptQty),
        cgst: parseInt(row.cgst),
        igst: parseInt(row.igst),
        poRate: parseInt(row.poRate),
        rejectQty: parseInt(row.rejectQty),
        sgst: parseInt(row.sgst),
        unitPrice: parseInt(row.unitPrice),
        itemCode: row.itemCode,
        itemName: row.itemName,
        primaryUnit: row.primaryUnit,
        taxtype: row.taxType
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        finYear: finYear,
        orgId: orgId,
        purchaseInvoiceItemDTO: PurchaseInvoiceVO,
        address: formData.address,
        supplierName: formData.supplierName,
        exchangeRate: parseInt(formData.exchangeRate),
        gstState: parseInt(formData.gstState),
        invDcDate: dayjs(formData.dcDate).format('YYYY-MM-DD'),
        grnDate: dayjs(formData.grnDate).format('YYYY-MM-DD'),
        supplierCode: formData.supplierCode,
        poNo: formData.poNo,
        location: formData.location,
        isReverseChrg: formData.isReverseCharge,
        invDcNo: formData.dcNo,
        inWardNo: formData.inwardNo,
        gstType: formData.gstType,
        gstNo: formData.gstNo,
        grnNo: formData.grnNo,
        customerName: formData.customerName,
        currency: formData.currency,
        cnt: formData.cnt
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/purchaseReturn/createUpdatePurchaseInvoice`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Purchase Invoice Updated Successfully' : 'Purchase Invoice Created successfully');
          getAllPurchaseInvoiceByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.message || 'Purchase Invoice creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Purchase Invoice creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };
  const getPurchaseInvoiceNo = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/purchaseReturn/getPurchaseInvoiceDocId?orgId=${orgId}`
      );
      setInvoiceNo(response.paramObjectsMap.purchaseInvoiceDocId);

    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllPurchaseInvoiceByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/purchaseReturn/getAllPurchaseInvoiceByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.purchaseInvoiceVO || []);
      // showForm(true);
      console.log('purchaseInvoiceVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllPurchaseInvoiceById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/purchaseReturn/getPurchaseInvoiceById?id=${row.original.id}`);

      if (result) {
        const piVO = result.paramObjectsMap.purchaseInvoiceVO;
        console.log(result.paramObjectsMap.purchaseInvoiceVO.docId);
        setEditId(row.original.id);
        setInvoiceNo(piVO.docId);
        setFormData({
          invoiceDate: piVO.docDate ? dayjs(piVO.docDate, 'YYYY-MM-DD') : dayjs(),
          supplierName: piVO.supplierName,
          poNo: piVO.poNo,
          grnNo: piVO.grnNo,
          location: piVO.location,
          grnDate: piVO.grnDate ? dayjs(piVO.grnDate, 'YYYY-MM-DD') : dayjs(),
          inwardNo: piVO.inWardNo,
          dcDate: piVO.invDcDate ? dayjs(piVO.invDcDate, 'YYYY-MM-DD') : dayjs(),
          supplierCode: piVO.supplierCode,
          orgId: piVO.orgId,
          gstState: piVO.gstState,
          gstNo: piVO.gstNo,
          isReverseCharge: piVO.isReverseChrg,
          address: piVO.address,
          currency: piVO.currency,
          exchangeRate: piVO.exchangeRate,
          grnClearTime: piVO.grnClearTime,
          dcNo: piVO.invDcNo,
          gstType: piVO.gstType,
          customerName: piVO.customerName,
          grossAmount: piVO.grossAmount,
          totalAmountTax: piVO.totalAmountTax,
          netAmount: piVO.netAmount,
          cnt: piVO.cnt,
          remarks: piVO.remarks,
        });
        setItemDetailsTable(
          piVO.purchaseInvoiceItemVO.map((row) => ({
            id: row.id,
            itemCode: row.itemCode,
            itemName: row.itemName,
            sacCode: row.hsnSacCode,
            taxType: row.taxtype,
            primaryUnit: row.primaryUnit,
            poRate: row.poRate,
            receivedQuantity: row.rejectQty,
            acceptQuantity: row.acceptQty,
            unitPrice: row.unitPrice,
            amount: row.amount,
            sgst: row.sgst,
            cgst: row.cgst,
            igst: row.igst,
            taxValue: row.taxValue,
            landedValue: row.landedValue,
            // poDetailId: row.landedValue
          }))
        );

        console.log('DataToEdit', piVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleBulkUploadOpen = () => {
    setUploadOpen(true);
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false);
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };

  return (
    <>
      <div>
        <ToastComponent />
      </div>
      <div className="card w-full p-6 bg-base-100 shadow-xl" style={{ padding: '20px' }}>
        <div className="row d-flex ml">
          <div className="d-flex flex-wrap justify-content-start mb-4" style={{ marginBottom: '20px' }}>
            <ActionButton title="Search" icon={SearchIcon} onClick={() => console.log('Search Clicked')} />
            <ActionButton title="Clear" icon={ClearIcon} onClick={handleClear} />
            <ActionButton title="List View" icon={FormatListBulletedTwoToneIcon} onClick={handleView} />
            <ActionButton title="Save" icon={SaveIcon} onClick={handleSave} />
          </div>

          {showForm ? (
            <>
              <div className="row d-flex ml">
                <div className="col-md-3 mb-3">
                  <TextField
                    id="invoiceNo"
                    label="Purchase Invoice No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="invoiceNo"
                    value={invoiceNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Purchase Invoice Date"
                        value={formData.invoiceDate}
                        onChange={(date) => handleDateChange('invoiceDate', date)}
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.supplierName}>
                    <InputLabel id="supplierName">
                      <span>
                        Supplier Name <span className="asterisk">*</span>
                      </span>
                    </InputLabel>
                    <Select
                      labelId="supplierName"
                      id="supplierName"
                      label="supplierName"
                      onChange={(event) => {
                        const selectedSupplier = allSupplierName.find(item => item.supplierName === event.target.value);
                        handleInputChange({
                          target: {
                            name: 'supplierName',
                            value: selectedSupplier.supplierName
                          }
                        });
                        handleInputChange({
                          target: {
                            name: 'supplierCode',
                            value: selectedSupplier.supplierCode
                          }
                        });
                        getPoNo(selectedSupplier.supplierCode);
                      }}
                      name="supplierName"
                      value={formData.supplierName}
                    >
                      {allSupplierName.map((item) => (
                        <MenuItem key={item.id} value={item.supplierName}>
                          {item.supplierName}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.supplierName && <FormHelperText style={{ color: 'red' }}>Supplier Name is required</FormHelperText>}
                  </FormControl>
                </div>
                {/* <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.supplierName}>
                    <InputLabel id="supplierName">
                      {
                        <span>
                          Supplier Name <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="supplierName"
                      id="supplierName"
                      label="supplierName"
                      onChange={handleInputChange}
                      name="supplierName"
                      value={formData.supplierName}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.supplierName}>
                          {item.supplierName}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.supplierName && <FormHelperText style={{ color: 'red' }}>Supplier Name is required</FormHelperText>}
                  </FormControl>
                </div> */}
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.poNo}>
                    <InputLabel id="poNo">
                      {
                        <span>
                          PO No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="poNo"
                      id="poNo"
                      label="poNo"
                      onChange={(event) => {
                        const selectedPoNo = allPoNo.find(item => item.poNo === event.target.value);
                        handleInputChange({
                          target: {
                            name: 'poNo',
                            value: selectedPoNo.poNo
                          }
                        });
                        getGrnNo(selectedPoNo.poNo);
                      }}
                      name="poNo"
                      value={formData.poNo}
                    >
                      {allPoNo.map((item) => (
                        <MenuItem key={item.id} value={item.poNo}>
                          {item.poNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.poNo && <FormHelperText style={{ color: 'red' }}>PO No is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.grnNo}>
                    <InputLabel id="grnNo">
                      {
                        <span>
                          GRN No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="grnNo"
                      id="grnNo"
                      label="grnNo"
                      onChange={handleInputChange}
                      name="grnNo"
                      value={formData.grnNo}
                    >
                      {allGrnNo.map((item) => (
                        <MenuItem key={item.id} value={item.grnNo}>
                          {item.grnNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.grnNo && <FormHelperText style={{ color: 'red' }}>GRN No is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="GRN Date"
                        disabled
                        value={formData.grnDate ? dayjs(formData.grnDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('grnDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.grnDate}
                        helperText={fieldErrors.grnDate ? fieldErrors.grnDate : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="location"
                    disabled
                    label={
                      <span>
                        Location <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.location ? fieldErrors.location : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.location}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="inwardNo"
                    disabled
                    label='Inward No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="inwardNo"
                    value={formData.inwardNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.inwardNo ? fieldErrors.inwardNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.inwardNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="supplierCode"
                    disabled
                    label='Supplier Code'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="supplierCode"
                    value={formData.supplierCode}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.supplierCode ? fieldErrors.supplierCode : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.supplierCode}
                  />
                </div>
                {/* <div className="col-md-3 mb-3">
                  <TextField
                    id="gstState"
                    label='GST State'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="gstState"
                    value={formData.gstState}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.gstState ? fieldErrors.gstState : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.gstState}
                  />
                </div>*/}
                <div className="col-md-3 mb-3"> 
                  <TextField
                    id="gstNo"
                    disabled
                    label='GST No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="gstNo"
                    value={formData.gstNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.gstNo ? fieldErrors.gstNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.gstNo}
                  />
                </div><div className="col-md-3 mb-3">
                  <TextField
                    id="isReverseCharge"
                    // disabled
                    label='Is Reverse Charge'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="isReverseCharge"
                    value={formData.isReverseCharge}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.isReverseCharge ? fieldErrors.isReverseCharge : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.isReverseCharge}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="address"
                    disabled
                    label='Address'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.address ? fieldErrors.address : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.address}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="currency"
                    disabled
                    label='Currency'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.currency ? fieldErrors.currency : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.currency}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="exchangeRate"
                    disabled
                    label='Exchange Rate'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="exchangeRate"
                    value={formData.exchangeRate}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.exchangeRate ? fieldErrors.exchangeRate : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.exchangeRate}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="grnClearTime"
                    disabled
                    label='GRN Clear Time'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="grnClearTime"
                    value={formData.grnClearTime}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.grnClearTime ? fieldErrors.grnClearTime : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.grnClearTime}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="dcNo"
                    disabled
                    label='DC No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="dcNo"
                    value={formData.dcNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.dcNo ? fieldErrors.dcNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.dcNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="DC Date"
                        disabled
                        value={formData.dcDate ? dayjs(formData.dcDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('dcDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.dcDate}
                        helperText={fieldErrors.dcDate ? fieldErrors.dcDate : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="gstType"
                    disabled
                    label='GST Type'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="gstType"
                    value={formData.gstType}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.gstType ? fieldErrors.gstType : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.gstType}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="customerName"
                    disabled
                    label='Customer Name'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerName ? fieldErrors.customerName : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.customerName}
                  />
                </div>
              </div>
              <div className="row mt-2">
                <Box sx={{ width: '100%' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value={0} label="Item" />
                    <Tab value={1} label="Purchase Invoice Summary" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowItem} />
                        </div>
                        {listView ? (
                          <div className="mt-4">
                            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getMachineMasterById} />
                          </div>
                        ) : (
                          <div className="row mt-2">
                            <div className="col-lg-12">
                              <div className="table-responsive">
                                <table className="table table-bordered ">
                                  <thead>
                                    <tr style={{ backgroundColor: '#673AB7' }}>
                                      <th className="table-header px-2 py-2 text-white text-center" style={{ width: '10px' }}>Action</th>
                                      <th className="table-header px-2 py-2 text-white text-center" style={{ width: '50px' }}>S.No</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Item Code</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Item Name</th>
                                      <th className="table-header px-2 py-2 text-white text-center">HSN/SAC Code</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Tax Type</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Primary Unit</th>
                                      <th className="table-header px-2 py-2 text-white text-center">PO Rate</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Received Qty</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Accept Qty</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Unit Price</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Amount</th>
                                      <th className="table-header px-2 py-2 text-white text-center">SGST %</th>
                                      <th className="table-header px-2 py-2 text-white text-center">CGST %</th>
                                      <th className="table-header px-2 py-2 text-white text-center">IGST %</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Tax Value</th>
                                      <th className="table-header px-2 py-2 text-white text-center">Landed Value</th>
                                      <th className="table-header px-2 py-2 text-white text-center">PO Detail ID</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {itemDetailsTable.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="col-md-1 border px-2 py-2 text-center">
                                          <ActionButton
                                            className=" mb-2"
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                itemDetailsTable,
                                                setItemDetailsTable,
                                                itemTableErrors,
                                                setItemTableErrors
                                              )
                                            }
                                          />
                                        </td>
                                        <td className="text-center">
                                          <div className="pt-2">{index + 1}</div>
                                        </td>
                                        <td className="border px-2 py-2">
                                          <Autocomplete
                                            disablePortal
                                            options={allItemCode}
                                            getOptionLabel={(option) => option.itemCode || ""}
                                            sx={{ width: "100%" }}
                                            size="small"
                                            value={allItemCode.find((it) => it.itemCode === row.item) || null}
                                            onChange={(event, newValue) => {
                                              if (newValue) {
                                                setItemDetailsTable((prev) =>
                                                  prev.map((r) =>
                                                    r.id === row.id
                                                      ? {
                                                        ...r,
                                                        itemCode: newValue.itemCode || "",
                                                        itemName: newValue.itemName || "",
                                                        receivedQuantity: newValue.receivedQty || "",
                                                        sacCode: newValue.hsnScaCode || "",
                                                        acceptQuantity: newValue.acceptQty || "",
                                                        primaryUnit: newValue.primaryUnit || "",
                                                        taxType: newValue.taxType || "",
                                                        poRate: newValue.poRate || "",
                                                      }
                                                      : r
                                                  )
                                                );
                                              } else {
                                                setItemDetailsTable((prev) =>
                                                  prev.map((r) =>
                                                    r.id === row.id
                                                      ? { ...r, itemCode: "", itemDesc: "", unit: ""}
                                                      : r
                                                  )
                                                );
                                              }
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Item Code"
                                                name="itemCode"
                                                error={!!itemTableErrors[index]?.itemCode}
                                                helperText={itemTableErrors[index]?.itemCode}
                                                InputProps={{
                                                  ...params.InputProps,
                                                  style: { height: 40, width: 170 },
                                                }}
                                              />
                                            )}
                                          />
                                        </td>
                                        {/* <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.itemCode}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, itemCode: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  itemCode: !value ? 'Item Code is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.itemCode ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.itemCode && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].itemCode}
                                            </div>
                                          )}
                                        </td> */}
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            disabled
                                            value={row.itemName}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, itemName: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  itemName: !value ? 'Item Name is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.itemName ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.itemName && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].itemName}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            disabled
                                            value={row.sacCode}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sacCode: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sacCode: !value ? 'sacCode is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.sacCode ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.sacCode && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].sacCode}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            disabled
                                            value={row.taxType}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, taxType: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  taxType: !value ? 'Tax Type is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.taxType ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.taxType && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].taxType}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            disabled
                                            value={row.primaryUnit}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, primaryUnit: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  primaryUnit: !value ? 'primaryUnit is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.primaryUnit ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.primaryUnit && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].primaryUnit}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            disabled
                                            value={row.poRate}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, poRate: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  poRate: !value ? 'poRate is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.poRate ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.poRate && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].poRate}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            disabled
                                            value={row.receivedQuantity}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, receivedQuantity: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  receivedQuantity: !value ? 'receivedQuantity is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.receivedQuantity ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.receivedQuantity && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].receivedQuantity}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            disabled
                                            value={row.acceptQuantity}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, acceptQuantity: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  acceptQuantity: !value ? 'acceptQuantity is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.acceptQuantity ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.acceptQuantity && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].acceptQuantity}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.unitPrice}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, unitPrice: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  unitPrice: !value ? 'unitPrice is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.unitPrice ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.unitPrice && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].unitPrice}
                                            </div>
                                          )}
                                        </td>

                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.amount}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  amount: !value ? 'amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.amount && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].amount}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.sgst}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, sgst: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  sgst: !value ? 'sgst is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.sgst ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.sgst && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].sgst}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.cgst}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, cgst: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  cgst: !value ? 'cgst is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.cgst ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.cgst && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].cgst}
                                            </div>
                                          )}
                                        </td><td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.igst}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, igst: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  igst: !value ? 'igst is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.igst ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.igst && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].igst}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.taxValue}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, taxValue: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  taxValue: !value ? 'taxValue is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.taxValue ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.taxValue && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].taxValue}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.landedValue}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, landedValue: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  landedValue: !value ? 'landedValue is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.landedValue ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.landedValue && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].landedValue}
                                            </div>
                                          )}
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            style={{ width: '150px' }}
                                            value={row.poDetailId}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setItemDetailsTable((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, poDetailId: value } : r))
                                              );
                                              setItemTableErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  poDetailId: !value ? 'poDetailId is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }}
                                            className={itemTableErrors[index]?.poDetailId ? 'error form-control' : 'form-control'}
                                          />
                                          {itemTableErrors[index]?.poDetailId && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {itemTableErrors[index].poDetailId}
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
                        )}
                      </div>
                    </>
                  )}
                  {value === 1 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="row mt-2">
                          <>
                            <div className="row">
                              <div className="col-md-3 mb-3">
                                <TextField
                                  label="Gross Amount"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="grossAmount"
                                  value={formData.grossAmount}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.grossAmount}
                                  helperText={fieldErrors.grossAmount}
                                />
                              </div>
                              <div className="col-md-3 mb-3">
                                <TextField
                                  label="Net Amount"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="netAmount"
                                  value={formData.netAmount}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.netAmount}
                                  helperText={fieldErrors.netAmount}
                                />
                              </div>
                              <div className="col-md-3 mb-3">
                                <TextField
                                  label="Total Amount Tax"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="totalAmountTax"
                                  value={formData.totalAmountTax}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.totalAmountTax}
                                  helperText={fieldErrors.totalAmountTax}
                                />
                              </div>
                              <div className="col-md-3 mb-3">
                                <TextField
                                  label="remarks"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="remarks"
                                  value={formData.remarks}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.remarks}
                                  helperText={fieldErrors.remarks}
                                />
                              </div>
                              <div className="col-md-3 mb-3">
                                <TextField
                                  label="CNT"
                                  variant="outlined"
                                  size="small"
                                  fullWidth
                                  name="cnt"
                                  value={formData.cnt}
                                  onChange={handleInputChange}
                                  error={!!fieldErrors.cnt}
                                  helperText={fieldErrors.cnt}
                                />
                              </div>
                            </div>
                          </>
                        </div>
                      </div>
                    </>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllPurchaseInvoiceById} />
          )}
        </div>
        
      </div>
    </>

  )
};

export default PurchaseInvoice;
