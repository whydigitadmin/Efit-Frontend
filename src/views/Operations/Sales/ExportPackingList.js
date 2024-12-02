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

function ExportPackingList () {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [allAccountName, setAllAccountName] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [docNo, setDocNo] = useState('');
  const [allPartNo, setAllPartNo] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    docDate: dayjs(),
    customerName:'',
    customerAddress:'',
    saleOrderNo:'',
    deliveryPlace:'',
    countryOfOriginGoods:'',
    noOfPakage:'',
    typeOfPakage:'',
    designationCountry:'',
    status:'',
    lutNo:'',
    // 2nd table
    preCarriage:'',
    placeOfRecieptByPreCarriage:'',
    flightNo:'',
    portOfLoading:'',
    portOfUnLoading:'',
    placeOfDelivery:'',
    containerNo:'',
    noOfPakage:''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: dayjs(),
    customerName:'',
    customerAddress:'',
    saleOrderNo:'',
    deliveryPlace:'',
    countryOfOriginGoods:'',
    noOfPakage:'',
    typeOfPakage:'',
    designationCountry:'',
    status:'',
    lutNo:'',
    // 2nd table
    preCarriage:'',
    placeOfRecieptByPreCarriage:'',
    flightNo:'',
    portOfLoading:'',
    portOfUnLoading:'',
    placeOfDelivery:'',
    containerNo:'',
    noOfPakage:''
  });

  const listViewColumns = [
    { accessorKey: 'routeCardNo', header: 'Route Card Number', size: 140 },
    { accessorKey: 'docDate', header: 'Document Date', size: 140 },
    { accessorKey: 'docNo', header: 'Document No', size: 140 }
  ];

  const [packingListDetailsTable, setPackingListDetailsTable] = useState([
    {
      id: 1,
      partNo:'',
      partDesc:'',
      custPO:'',
      customerPOItem:'',
      hsnCode:'',
      poNumber:'',
      quantity:'',
      unit:'',
      weightKG:'',
      price:'',
      sono:'',
      wono1:''
    }
  ]);
  const [packingListDetailsErrors, setPackingListDetailsErrors] = useState([
    {
      id: 1,
      partNo:'',
      partDesc:'',
      custPO:'',
      customerPOItem:'',
      hsnCode:'',
      poNumber:'',
      quantity:'',
      unit:'',
      weightKG:'',
      price:'',
      sono:'',
      wono1:''
    }
  ]);
  const [summaryDetailsTable, setSummaryDetailsTable] = useState([
    {
      id: 1,
      totalQuantity:'',
      totalGrossWeight:'',
      boxType:'',
      boxDimension:'',
      boxQuantity:'',
      narration:''
    }
  ]);
  const [summaryDetailsErrors, setSummaryDetailsErrors] = useState([
    {
      id: 1,
      totalQuantity:'',
      totalGrossWeight:'',
      boxType:'',
      boxDimension:'',
      boxQuantity:'',
      narration:''
    }
  ]);
  const [termsDetailsTable, setTermsDetailsTable] = useState([
    {
      id: 1,
      term:'',
      description:''
    }
  ]);
  const [termsDetailsErrors, setTermsDetailsErrors] = useState([
    {
      id: 1,
      term:'',
      description:''
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

  const handleSaveSelectedRows = async () => {}
  const handleSelectAll = () => {}
  const getMachineMasterById = () => {}
  useEffect(() => {
    
    // getAdjustmentJournaldocNO();
    // getAllAdjustmentJournalByOrgId();
    // getAllAccountName();
  }, []);

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      customerName:'',
      customerAddress:'',
      saleOrderNo:'',
      deliveryPlace:'',
      countryOfOriginGoods:'',
      noOfPakage:'',
      typeOfPakage:'',
      designationCountry:'',
      status:'',
      lutNo:'',
    // 2nd table
      preCarriage:'',
      placeOfRecieptByPreCarriage:'',
      flightNo:'',
      portOfLoading:'',
      portOfUnLoading:'',
      placeOfDelivery:'',
      containerNo:'',
      noOfPakage:''
   });
    setFieldErrors({
      docDate: dayjs(),
      customerName:'',
      customerAddress:'',
      saleOrderNo:'',
      deliveryPlace:'',
      countryOfOriginGoods:'',
      noOfPakage:'',
      typeOfPakage:'',
      designationCountry:'',
      status:'',
      lutNo:'',
      //2nd Table
      preCarriage:'',
      placeOfRecieptByPreCarriage:'',
      flightNo:'',
      portOfLoading:'',
      portOfUnLoading:'',
      placeOfDelivery:'',
      containerNo:'',
      noOfPakage:''
    });
    setPackingListDetailsTable([
      { id: 1,
        partNo:'',
        partDesc:'',
        custPO:'',
        customerPOItem:'',
        hsnCode:'',
        poNumber:'',
        quantity:'',
        unit:'',
        weightKG:'',
        price:'',
        sono:'',
        wono1:''
      }
    ]);
    setPackingListDetailsErrors('');
    setSummaryDetailsTable([{
      id:1,
      totalQuantity:'',
      totalGrossWeight:'',
      boxType:'',
      boxDimension:'',
      boxQuantity:'',
      narration:''
    }])
    setSummaryDetailsErrors('')
    setTermsDetailsTable([{
      id: 1,
      term:'',
      description:''
    }])
    setTermsDetailsErrors('')
    setEditId('');
    getAdjustmentJournaldocNO();
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';

    
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

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

  const handleAddRowPacking = () => {
    if (isLastRowEmptyPacking(packingListDetailsTable)) {
      displayRowErrorPacking(packingListDetailsTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      partNo:'',
      partDesc:'',
      custPO:'',
      customerPOItem:'',
      hsnCode:'',
      poNumber:'',
      quantity:'',
      unit:'',
      weightKG:'',
      price:'',
      sono:'',
      wono1:''
    };
    setPackingListDetailsTable([...packingListDetailsTable, newRow]);
    setPackingListDetailsErrors([
      ...packingListDetailsErrors,
      { 
        partNo:'',
        partDesc:'',
        custPO:'',
        customerPOItem:'',
        hsnCode:'',
        poNumber:'',
        quantity:'',
        unit:'',
        weightKG:'',
        price:'',
        sono:'',
        wono1:''
    }
    ]);
  };

  const isLastRowEmptyPacking = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === packingListDetailsTable) {
      return (
        !lastRow.partNo ||
        !lastRow.partDesc ||
        !lastRow.custPO ||
        !lastRow.customerPOItem ||
        !lastRow.hsnCode ||
        !lastRow.poNumber ||
        !lastRow.quantity ||
        !lastRow.unit ||
        !lastRow.weightKG ||
        !lastRow.price ||
        !lastRow.wono1 ||
        !lastRow.sono 
      );
    }
    return false;
  };

  const displayRowErrorPacking = (table) => {
    if (table === packingListDetailsTable) {
      setPackingListDetailsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !table[table.length - 1].partNo ? 'Part No is required' : '',
          partDesc: !table[table.length - 1].partDesc ? 'Part Desc is required' : '', 
          custPO: !table[table.length - 1].custPO ? 'Cust PO is required' : '',
          customerPOItem: !table[table.length - 1].customerPOItem ? 'Customer PO Item is required' : '',
          hsnCode: !table[table.length - 1].hsnCode ? 'HSN Code is required' : '',
          poNumber: !table[table.length - 1].poNumber ? 'PO Number is required' : '', 
          quantity: !table[table.length - 1].quantity ? 'Quantity is required' : '',
          unit: !table[table.length - 1].unit ? 'Unit is required' : '',
          weightKG: !table[table.length - 1].weightKG ? 'Weight KG is required' : '',
          price: !table[table.length - 1].price ? 'Price is required' : '', 
          sono: !table[table.length - 1].sono ? 'Sono is required' : '',
          wono1: !table[table.length - 1].wono1 ? 'Wono1 is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleAddRowSummary = () => {
    if (isLastRowEmptySummary(summaryDetailsTable)) {
      displayRowErrorSummary(summaryDetailsTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      totalQuantity:'',
      totalGrossWeight:'',
      boxType:'',
      boxDimension:'',
      boxQuantity:'',
      narration:''
    };
    setSummaryDetailsTable([...summaryDetailsTable, newRow]);
    setSummaryDetailsErrors([
      ...summaryDetailsErrors,
      { 
        totalQuantity:'',
        totalGrossWeight:'',
        boxType:'',
        boxDimension:'',
        boxQuantity:'',
        narration:''
    }
    ]);
  };

  const isLastRowEmptySummary = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === summaryDetailsTable) {
      return (
        !lastRow.totalQuantity ||
        !lastRow.totalGrossWeight ||
        !lastRow.boxType ||
        !lastRow.boxDimension ||
        !lastRow.boxQuantity ||
        !lastRow.narration
      );
    }
    return false;
  };

  const displayRowErrorSummary = (table) => {
    if (table === summaryDetailsTable) {
      setSummaryDetailsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          totalQuantity: !table[table.length - 1].totalQuantity ? 'Total Quantity is required' : '',
          totalGrossWeight: !table[table.length - 1].totalGrossWeight ? 'Total Gross Weight is required' : '', 
          boxType: !table[table.length - 1].boxType ? 'Box Type is required' : '',
          boxDimension: !table[table.length - 1].boxDimension ? 'Box Dimension Item is required' : '',
          boxQuantity: !table[table.length - 1].boxQuantity ? 'Box Quantity is required' : '',
          narration: !table[table.length - 1].narration ? 'Narration is required' : ''
        };
        return newErrors;
      });
    }
  };
  const handleAddRowTerm = () => {
    if (isLastRowEmptyTerm(termsDetailsTable)) {
      displayRowErrorTerm(termsDetailsTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      term:'',
      description:''
    };
    setTermsDetailsTable([...termsDetailsTable, newRow]);
    setTermsDetailsErrors([
      ...termsDetailsErrors,
      {
        term:'',
        description:''
    }
    ]);
  };

  const isLastRowEmptyTerm = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === termsDetailsTable) {
      return (
        !lastRow.term ||
        !lastRow.description 
      );
    }
    return false;
  };

  const displayRowErrorTerm = (table) => {
    if (table === termsDetailsTable) {
      setTermsDetailsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          term: !table[table.length - 1].term ? 'Term is required' : '',
          description: !table[table.length - 1].description ? 'Description is required' : ''
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

  const handleSave = async () => {
    const errors = {};
    if (!formData.customerName) {
      errors.customerName = 'Customer Name No is required';
    }
    if (!formData.customerAddress) {
      errors.customerAddress = 'Customer Address is required';
    }
    if (!formData.saleOrderNo) {
      errors.saleOrderNo = 'Sale Order No is required';
    }
    if (!formData.deliveryPlace) {
      errors.deliveryPlace = 'Delivery Place is required';
    }
    if (!formData.countryOfOriginGoods ) {
      errors.countryOfOriginGoods = 'Country Of Origin Goods is required';
    }
    if (!formData.noOfPakage) {
      errors.noOfPakage = 'No Of Pakage is required';
    }
    if (!formData.typeOfPakage) {
      errors.typeOfPakage = 'Type Of Pakage is required';
    }
    if (!formData.designationCountry) {
      errors.designationCountry = 'Designation Country is required';
    }
    if (!formData.status) {
      errors.status = 'Status is required';
    }
    if (!formData.lutNo) {
      errors.lutNo = 'LUT No is required';
    }
    if (!formData.preCarriage) {
      errors.preCarriage = 'Pre Carriage is required';
    }
    if (!formData.placeOfRecieptByPreCarriage) {
      errors.placeOfRecieptByPreCarriage = 'Place Of Reciept By Pre Carriage is required';
    }
    if (!formData.flightNo) {
      errors.flightNo = 'Flight No is required';
    }
    if (!formData.portOfLoading) {
      errors.portOfLoading = 'Port Of Loading is required';
    }
    if (!formData.portOfUnLoading) {
      errors.portOfUnLoading = 'Port Of UnLoading is required';
    }
    if (!formData.placeOfDelivery) {
      errors.placeOfDelivery = 'Place Of Delivery is required';
    }
    if (!formData.containerNo) {
      errors.containerNo = 'Container No is required';
    }
    if (!formData.noOfPakage) {
      errors.noOfPakage = 'No Of Pakage is required';
    }

    let packingDetails = true;
    const newPackingDetailsErrors = packingListDetailsTable.map((row) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'Part No  is required';
        packingDetails = false;
      }
      if (!row.partDesc) {
        rowErrors.partDesc = 'part Desc is required';
        packingDetails = false;
      }
      if (!row.custPO) {
        rowErrors.custPO = 'Cust PO is required';
        packingDetails = false;
      }
      if (!row.customerPOItem) {
        rowErrors.customerPOItem = 'Customer PO Item is required';
        packingDetails = false;
      }
      if (!row.hsnCode) {
        rowErrors.hsnCode = 'HSN Code is required';
        packingDetails = false;
      }
      if (!row.poNumber) {
        rowErrors.poNumber = 'PO Number is required';
        packingDetails = false;
      }
      if (!row.quantity) {
        rowErrors.quantity = 'Quantity is required';
        packingDetails = false;
      }
      if (!row.unit) {
        rowErrors.unit = 'Unit is required';
        packingDetails = false;
      }
      if (!row.weightKG) {
        rowErrors.weightKG = 'Weight KG is required';
        packingDetails = false;
      }
      if (!row.price) {
        rowErrors.price = 'Price is required';
        packingDetails = false;
      }
      if (!row.sono) {
        rowErrors.sono = 'Sono is required';
        packingDetails = false;
      }
      if (!row.wono1) {
        rowErrors.wono1 = 'Wono1 is required';
        packingDetails = false;
      }
      
      return rowErrors;
    });
    let summary = true;
    const newSummaryDetailsError = packingListDetailsTable.map((row) => {
      const rowErrors = {};
      if (!row.totalQuantity) {
        rowErrors.totalQuantity = 'Total Quantity  is required';
        summary = false;
      }
      if (!row.totalGrossWeight) {
        rowErrors.totalGrossWeight = 'Total Gross Weight is required';
        summary = false;
      }
      if (!row.boxType) {
        rowErrors.boxType = 'Box Type is required';
        summary = false;
      }
      if (!row.boxDimension) {
        rowErrors.boxDimension = 'Box Dimension is required';
        summary = false;
      }
      if (!row.boxQuantity) {
        rowErrors.boxQuantity = 'Box Quantity is required';
        summary = false;
      }
      if (!row.narration) {
        rowErrors.narration = 'Narration is required';
        summary = false;
      }
      
      return rowErrors;
    });
    let terms = true;
    const newTermsDetailsError = packingListDetailsTable.map((row) => {
      const rowErrors = {};
      if (!row.term) {
        rowErrors.term = 'Term is required';
        terms = false;
      }
      if (!row.description) {
        rowErrors.description = 'Description is required';
        terms = false;
      }
      
      return rowErrors;
    });
    setFieldErrors(errors);
    setPackingListDetailsErrors(newPackingDetailsErrors);
    setSummaryDetailsErrors(newSummaryDetailsError);
    setTermsDetailsErrors(newTermsDetailsError);

    if (Object.keys(errors).length === 0 && (packingDetails && summary) ) {
          const AdjustmentVO = packingListDetailsTable.map((row) => ({
            ...(editId && { id: row.id }),
            accountsName: row.accountName,
            creditAmount: parseInt(row.creditAmount),
            debitAmount: parseInt(row.debitAmount),
            debitBase: parseInt(row.debitBase),
            creditBase: parseInt(row.creditBase),
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
      }));
      
      const saveFormData = {
        ...(editId && { id: editId }),
        // branch: branch,
        //       branchCode: branchCode,
        //       createdBy: loginUserName,
        //       finYear: finYear,
        //       orgId: orgId,
        //       accountParticularsDTO: AdjustmentJournalVO,
        //       adjustmentType: formData.adjustmentType,
        //       currency: formData.currency,
        //       exRate: parseInt(formData.exRate),
        //       refDate: dayjs(formData.refDate).format('YYYY-MM-DD'),
        //       refNo: formData.refNo,
        //       suppRefDate: dayjs(formData.suppRefDate).format('YYYY-MM-DD'),
        //       suppRefNo: formData.suppRefNo,
        //       remarks: formData.remarks
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
              const response = await apiCalls('put', `transaction/updateCreateAdjustmentJournal`, saveFormData);
              if (response.status === true) {
                console.log('Response:', response);
                showToast('success', editId ? 'Adjustment Journal Updated Successfully' : 'Adjustment Journal Created successfully');
                getAllAdjustmentJournalByOrgId();
                handleClear();
              } else {
                showToast('error', response.paramObjectsMap.message || 'Adjustment Journal creation failed');
              }
            } catch (error) {
              console.error('Error:', error);
              showToast('error', 'Adjustment Journal creation failed');
            }
    } else {
      setFieldErrors(errors);
    }
  };
  const getAllItem = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getOperationNameFromGroup?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllPartNo(response.paramObjectsMap.generalJournalVO);
        console.log('Account Name', response.paramObjectsMap.generalJournalVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  const getAdjustmentJournaldocNO = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getAdjustmentJournaldocNO?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setDocNo(response.paramObjectsMap.adjustmentJournaldocNO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllAdjustmentJournalByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllAdjustmentJournalByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.adjustmentJournalVO || []);
      // showForm(true);
      console.log('adjustmentJournalVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllAdjustmentJournalById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getAdjustmentJournalById?id=${row.original.id}`);

      if (result) {
        const adVO = result.paramObjectsMap.adjustmentJournalVO[0];
        setEditId(row.original.id);
        setDocNo(adVO.docNO);
        setFormData({
          // docDate: adVO.docDate ? dayjs(adVO.docDate, 'YYYY-MM-DD') : dayjs(),
          // adjustmentType: adVO.adjustmentType,
          // currency: adVO.currency,
          // exRate: adVO.exRate,
          // refNo: adVO.refNo,
          // refDate: adVO.refDate ? dayjs(adVO.refDate, 'YYYY-MM-DD') : dayjs(),
          // suppRefNo: adVO.suppRefNo,
          // suppRefDate: adVO.suppRefDate ? dayjs(adVO.refDate, 'YYYY-MM-DD') : dayjs(),
          // remarks: adVO.remarks,
          // orgId: adVO.orgId,
          // totalDebitAmount: adVO.totalDebitAmount,
          // totalCreditAmount: adVO.totalCreditAmount
        });
        setPackingListDetailsTable(
          adVO.accountParticularsVO.map((row) => ({
            id: row.id,
            accountName: row.accountsName,
            creditAmount: row.creditAmount,
            debitAmount: row.debitAmount,
            debitBase: row.debitBase,
            creditBase: row.creditBase,
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
          }))
        );

        console.log('DataToEdit', adVO);
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
                    id="docNo"
                    label="Document No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docNo"
                    value={docNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Document Date"
                        value={formData.docDate}
                        onChange={(date) => handleDateChange('docDate', date)}
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
                    <InputLabel id="customerName">
                      {
                        <span>
                          Customer Name <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="customerName"
                      id="customerName"
                      label="customerName"
                      onChange={handleInputChange}
                      name="customerName"
                      value={formData.customerName}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.customerName}>
                          {item.customerName}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.customerName && <FormHelperText style={{ color: 'red' }}>Customer Name is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="customerAddress"
                    label= 'Customer Address'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerAddress"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerAddress ? fieldErrors.customerAddress : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.customerAddress}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.saleOrderNo}>
                    <InputLabel id="saleOrderNo">
                      {
                        <span>
                          Sale Order No <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="saleOrderNo"
                      id="saleOrderNo"
                      label="saleOrderNo"
                      onChange={handleInputChange}
                      name="saleOrderNo"
                      value={formData.saleOrderNo}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.saleOrderNo}>
                          {item.saleOrderNo}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.saleOrderNo && <FormHelperText style={{ color: 'red' }}>Sale Order No is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="deliveryPlace"
                    label= 'Delivery Place'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="deliveryPlace"
                    value={formData.deliveryPlace}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.deliveryPlace ? fieldErrors.deliveryPlace : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.deliveryPlace}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.countryOfOriginGoods}>
                    <InputLabel id="countryOfOriginGoods">
                      {
                        <span>
                          Country Of Origin Goods <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="countryOfOriginGoods"
                      id="countryOfOriginGoods"
                      label="countryOfOriginGoods"
                      onChange={handleInputChange}
                      name="countryOfOriginGoods"
                      value={formData.countryOfOriginGoods}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.countryOfOriginGoods}>
                          {item.countryOfOriginGoods}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.countryOfOriginGoods && <FormHelperText style={{ color: 'red' }}>Country Of Origin Goods is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="noOfPakage"
                    label= 'No Of Pakage'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="noOfPakage"
                    value={formData.noOfPakage}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.noOfPakage ? fieldErrors.noOfPakage : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.noOfPakage}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.typeOfPakage}>
                    <InputLabel id="typeOfPakage">
                      {
                        <span>
                          Type Of Pakage <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="typeOfPakage"
                      id="typeOfPakage"
                      label="typeOfPakage"
                      onChange={handleInputChange}
                      name="typeOfPakage"
                      value={formData.typeOfPakage}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.typeOfPakage}>
                          {item.typeOfPakage}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.typeOfPakage && <FormHelperText style={{ color: 'red' }}>Type Of Pakage is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.designationCountry}>
                    <InputLabel id="designationCountry">
                      {
                        <span>
                          Designation Country <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="designationCountry"
                      id="designationCountry"
                      label="designationCountry"
                      onChange={handleInputChange}
                      name="designationCountry"
                      value={formData.designationCountry}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.designationCountry}>
                          {item.designationCountry}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.designationCountry && <FormHelperText style={{ color: 'red' }}>Designation Country is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.status}>
                    <InputLabel id="status">
                      {
                        <span>
                          Status <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="status"
                      id="status"
                      label="status"
                      onChange={handleInputChange}
                      name="status"
                      value={formData.status}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.status}>
                          {item.status}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.status && <FormHelperText style={{ color: 'red' }}>Status is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="lutNo"
                    label= 'LUT No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="lutNo"
                    value={formData.lutNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.lutNo ? fieldErrors.lutNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.lutNo}
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
                    <Tab value={0} label="Packing List Details" />
                    <Tab value={1} label="Summary" />
                    <Tab value={2} label="Shipping Details" />
                    <Tab value={3} label="Terms" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowPacking} />
                          <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
                        </div>
                        {uploadOpen && (
                          <CommonBulkUpload
                            open={uploadOpen}
                            handleClose={handleBulkUploadClose}
                            title="Upload Files"
                            uploadText="Upload file"
                            downloadText="Sample File"
                            onSubmit={handleSubmit}
                            sampleFileDownload={sampleFile}
                            handleFileUpload={handleFileUpload}
                            // apiUrl={`buyerOrder/ExcelUploadForBuyerOrder?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
                            screen="Machine Master"
                          ></CommonBulkUpload>
                        )}
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
                                      {/* <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th> */}
                                        <th className="table-header px-2 py-2 text-white text-center"style={{ width: '10px' }}>Action</th>
                                        <th className="table-header px-2 py-2 text-white text-center"style={{ width: '50px' }}>S.No</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Part No</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Part Description</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Cust PO</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Customer PO-Item</th>
                                        <th className="table-header px-2 py-2 text-white text-center">HSN Code</th>
                                        <th className="table-header px-2 py-2 text-white text-center">PO Number</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Quantity</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Unit</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Weight KG</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Price</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Sono</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Wono1</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {packingListDetailsTable.map((row, index) => (
                                        <tr key={row.id}>
                                          <td className="col-md-1 border px-2 py-2 text-center">
                                            <ActionButton
                                            className=" mb-2"
                                              title="Delete"
                                              icon={DeleteIcon}
                                              onClick={() =>
                                                handleDeleteRow(
                                                  row.id,
                                                  packingListDetailsTable,
                                                  setPackingListDetailsTable,
                                                  packingListDetailsErrors,
                                                  setPackingListDetailsErrors
                                                )
                                              }
                                            />
                                          </td>
                                          <td className="text-center">
                                            <div className="pt-2">{index + 1}</div>
                                          </td>
                                          <td className="border px-2 py-2">
                                            <Autocomplete
                                            style={{ width: '150px' }}
                                              options={allPartNo}
                                              getOptionLabel={(option) => option.partName || ''}
                                              groupBy={(option) => (option.partName ? option.partName[0].toUpperCase() : '')}
                                              value={row.partName ? allPartNo.find((a) => a.partName === row.partName) : null}
                                              onChange={(event, newValue) => {
                                                const value = newValue ? newValue.partName : '';
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, partName: value } : r))
                                                );
                                                setPackingListDetailsErrors((prevErrors) =>
                                                  prevErrors.map((err, idx) => (idx === index ? { ...err, partName: '' } : err))
                                                );
                                              }}
                                              size="small"
                                              renderInput={(params) => (
                                                <TextField
                                                  {...params}
                                                  label="Part No"
                                                  variant="outlined"
                                                  error={!!packingListDetailsErrors[index]?.partName}
                                                  helperText={packingListDetailsErrors[index]?.partName}
                                                />
                                              )}
                                            />
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.partDesc}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, partDesc: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    partDesc: !value ? 'Part Desc is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.partDesc ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.partDesc && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].partDesc}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.custPO}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, custPO: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    custPO: !value ? 'Part Desc is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.custPO ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.custPO && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].custPO}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.customerPOItem}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, customerPOItem: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    customerPOItem: !value ? 'Customer PO Item is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.customerPOItem ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.customerPOItem && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].customerPOItem}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.hsnCode}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, hsnCode: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    hsnCode: !value ? 'HSN Code is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.hsnCode ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.hsnCode && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].hsnCode}
                                              </div>
                                            )}
                                          </td><td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.poNumber}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, poNumber: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    poNumber: !value ? 'PO Number is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.poNumber ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.poNumber && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].poNumber}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.quantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, quantity: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    quantity: !value ? 'Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.quantity ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.quantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].quantity}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.unit}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    unit: !value ? 'Unit is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.unit ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.unit && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].unit}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.weightKG}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, weightKG: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    weightKG: !value ? 'Weight KG is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.weightKG ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.weightKG && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].weightKG}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.price}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, price: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    price: !value ? 'Price is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.price ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.price && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].price}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.sono}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, sono: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    sono: !value ? 'Sono is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.sono ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.sono && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].sono}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.wono1}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setPackingListDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, wono1: value } : r))
                                                );
                                                setPackingListDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    wono1: !value ? 'Wono1 is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={packingListDetailsErrors[index]?.wono1 ? 'error form-control' : 'form-control'}
                                            />
                                            {packingListDetailsErrors[index]?.wono1 && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {packingListDetailsErrors[index].wono1}
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
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowSummary} />
                          <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
                        </div>
                        {uploadOpen && (
                          <CommonBulkUpload
                            open={uploadOpen}
                            handleClose={handleBulkUploadClose}
                            title="Upload Files"
                            uploadText="Upload file"
                            downloadText="Sample File"
                            onSubmit={handleSubmit}
                            sampleFileDownload={sampleFile}
                            handleFileUpload={handleFileUpload}
                            // apiUrl={`buyerOrder/ExcelUploadForBuyerOrder?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
                            screen="Export Packing List"
                          ></CommonBulkUpload>
                        )}
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
                                      {/* <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th> */}
                                        <th className="table-header px-2 py-2 text-white text-center"style={{ width: '10px' }}>Action</th>
                                        <th className="table-header px-2 py-2 text-white text-center"style={{ width: '50px' }}>S.No</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Total Quantity</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Total Gross Weight</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Box Type</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Box Dimension</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Box Quantity</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Narration</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {summaryDetailsTable.map((row, index) => (
                                        <tr key={row.id}>
                                          <td className="col-md-1 border px-2 py-2 text-center">
                                            <ActionButton
                                            className=" mb-2"
                                              title="Delete"
                                              icon={DeleteIcon}
                                              onClick={() =>
                                                handleDeleteRow(
                                                  row.id,
                                                  summaryDetailsTable,
                                                  setSummaryDetailsTable,
                                                  summaryDetailsErrors,
                                                  setSummaryDetailsErrors
                                                )
                                              }
                                            />
                                          </td>
                                          <td className="text-center">
                                            <div className="pt-2">{index + 1}</div>
                                          </td>
                                         
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.totalQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setSummaryDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, totalQuantity: value } : r))
                                                );
                                                setSummaryDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    totalQuantity: !value ? 'Total Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={summaryDetailsErrors[index]?.totalQuantity ? 'error form-control' : 'form-control'}
                                            />
                                            {summaryDetailsErrors[index]?.totalQuantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {summaryDetailsErrors[index].totalQuantity}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.totalGrossWeight}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setSummaryDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, totalGrossWeight: value } : r))
                                                );
                                                setSummaryDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    totalGrossWeight: !value ? 'Total Gross Weight Item is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={summaryDetailsErrors[index]?.totalGrossWeight ? 'error form-control' : 'form-control'}
                                            />
                                            {summaryDetailsErrors[index]?.totalGrossWeight && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {summaryDetailsErrors[index].totalGrossWeight}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.boxType}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setSummaryDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, boxType: value } : r))
                                                );
                                                setSummaryDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    boxType: !value ? 'Box Type is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={summaryDetailsErrors[index]?.boxType ? 'error form-control' : 'form-control'}
                                            />
                                            {summaryDetailsErrors[index]?.boxType && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {summaryDetailsErrors[index].boxType}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.boxDimension}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setSummaryDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, boxDimension: value } : r))
                                                );
                                                setSummaryDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    boxDimension: !value ? 'Box Dimension is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={summaryDetailsErrors[index]?.boxDimension ? 'error form-control' : 'form-control'}
                                            />
                                            {summaryDetailsErrors[index]?.boxDimension && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {summaryDetailsErrors[index].boxDimension}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.boxQuantity}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setSummaryDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, boxQuantity: value } : r))
                                                );
                                                setSummaryDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    boxQuantity: !value ? 'Box Quantity is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={summaryDetailsErrors[index]?.boxQuantity ? 'error form-control' : 'form-control'}
                                            />
                                            {summaryDetailsErrors[index]?.boxQuantity && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {summaryDetailsErrors[index].boxQuantity}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                            style={{ width: '150px' }}
                                              value={row.narration}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setSummaryDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, narration: value } : r))
                                                );
                                                setSummaryDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    narration: !value ? 'Narration is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={summaryDetailsErrors[index]?.narration ? 'error form-control' : 'form-control'}
                                            />
                                            {summaryDetailsErrors[index]?.narration && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {summaryDetailsErrors[index].narration}
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
                  {value === 2 && (
                  <>
                  <div className="row d-flex ml">
                        <div className="row mt-2">
                        <>
                          <div className="row">
                          <div className="col-md-3 mb-3">
                              <TextField
                                label="Pre-Carriage"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="preCarriage"
                                value={formData.preCarriage}
                                onChange={handleInputChange}
                                error={!!fieldErrors.preCarriage}
                                helperText={fieldErrors.preCarriage}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Place Of Reciept By Pre-Carriage"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="placeOfRecieptByPreCarriage"
                                value={formData.placeOfRecieptByPreCarriage}
                                onChange={handleInputChange}
                                error={!!fieldErrors.placeOfRecieptByPreCarriage}
                                helperText={fieldErrors.placeOfRecieptByPreCarriage}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Vessel/Flight No"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="flightNo"
                                value={formData.flightNo}
                                onChange={handleInputChange}
                                error={!!fieldErrors.flightNo}
                                helperText={fieldErrors.flightNo}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Port Of Loading"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="portOfLoading"
                                value={formData.portOfLoading}
                                onChange={handleInputChange}
                                error={!!fieldErrors.portOfLoading}
                                helperText={fieldErrors.portOfLoading}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Port Of UnLoading"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="portOfUnLoading"
                                value={formData.portOfUnLoading}
                                onChange={handleInputChange}
                                error={!!fieldErrors.portOfUnLoading}
                                helperText={fieldErrors.portOfUnLoading}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Place Of Delivery"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="placeOfDelivery"
                                value={formData.placeOfDelivery}
                                onChange={handleInputChange}
                                error={!!fieldErrors.placeOfDelivery}
                                helperText={fieldErrors.placeOfDelivery}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Marks&Nos/Containers No"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="containerNo"
                                value={formData.containerNo}
                                onChange={handleInputChange}
                                error={!!fieldErrors.containerNo}
                                helperText={fieldErrors.containerNo}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="No Of Pakage"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="noOfPakage"
                                value={formData.noOfPakage}
                                onChange={handleInputChange}
                                error={!!fieldErrors.noOfPakage}
                                helperText={fieldErrors.noOfPakage}
                              />
                            </div>
                          </div>
                        </>
                        </div>
                      </div>
                  </>
                  )}
                   {value === 3 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRowTerm} />
                          <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
                        </div>
                        {uploadOpen && (
                          <CommonBulkUpload
                            open={uploadOpen}
                            handleClose={handleBulkUploadClose}
                            title="Upload Files"
                            uploadText="Upload file"
                            downloadText="Sample File"
                            onSubmit={handleSubmit}
                            sampleFileDownload={sampleFile}
                            handleFileUpload={handleFileUpload}
                            // apiUrl={`buyerOrder/ExcelUploadForBuyerOrder?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
                            screen="Export Packing List"
                          ></CommonBulkUpload>
                        )}
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
                                      {/* <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th> */}
                                        <th className="table-header px-2 py-2 text-white text-center"style={{ width: '10px' }}>Action</th>
                                        <th className="table-header px-2 py-2 text-white text-center"style={{ width: '50px' }}>S.No</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Term</th>
                                        <th className="table-header px-2 py-2 text-white text-center">Description</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {termsDetailsTable.map((row, index) => (
                                        <tr key={row.id}>
                                          <td className="col-md-1 border px-2 py-2 text-center">
                                            <ActionButton
                                            className=" mb-2"
                                              title="Delete"
                                              icon={DeleteIcon}
                                              onClick={() =>
                                                handleDeleteRow(
                                                  row.id,
                                                  termsDetailsTable,
                                                  setTermsDetailsTable,
                                                  termsDetailsErrors,
                                                  setTermsDetailsErrors
                                                )
                                              }
                                            />
                                          </td>
                                          <td className="text-center">
                                            <div className="pt-2">{index + 1}</div>
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              value={row.term}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setTermsDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, term: value } : r))
                                                );
                                                setTermsDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    term: !value ? 'Term is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={termsDetailsErrors[index]?.term ? 'error form-control' : 'form-control'}
                                            />
                                            {termsDetailsErrors[index]?.term && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {termsDetailsErrors[index].term}
                                              </div>
                                            )}
                                          </td>
                                          <td className="border px-2 py-2">
                                            <input
                                              value={row.description}
                                              onChange={(e) => {
                                                const value = e.target.value;
                                                setTermsDetailsTable((prev) =>
                                                  prev.map((r) => (r.id === row.id ? { ...r, description: value } : r))
                                                );
                                                setTermsDetailsErrors((prev) => {
                                                  const newErrors = [...prev];
                                                  newErrors[index] = {
                                                    ...newErrors[index],
                                                    description: !value ? 'Description is required' : ''
                                                  };
                                                  return newErrors;
                                                });
                                              }}
                                              className={termsDetailsErrors[index]?.description ? 'error form-control' : 'form-control'}
                                            />
                                            {termsDetailsErrors[index]?.description && (
                                              <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                                {termsDetailsErrors[index].description}
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
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllAdjustmentJournalById} />
          )}
        </div>
        <Dialog
                open={modalOpen}
                maxWidth={'md'}
                fullWidth={true}
                onClose={handleCloseModal}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
              >
                <DialogTitle textAlign="center" style={{ cursor: 'move' }} id="draggable-dialog-title">
                  <h6>Grid Details</h6>
                </DialogTitle>
                <DialogContent className="pb-0">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="table-responsive">
                        <table className="table table-bordered">
                          <thead>
                            <tr style={{ backgroundColor: '#673AB7' }}>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                <Checkbox checked={selectAll} onChange={handleSelectAll}  sx={{
                                  color: 'white', // Unchecked color
                                  '&.Mui-checked': {
                                    color: 'white' // Checked color
                                  }}} />
                              </th>
                              <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                S.No
                              </th>
                              <th className="px-2 py-2 text-white text-center">Part No *</th>
                              <th className="px-2 py-2 text-white text-center">Part Desc</th>
                              <th className="px-2 py-2 text-white text-center">SKU</th>
                              <th className="px-2 py-2 text-white text-center">Batch No</th>
                              {/* <th className="px-2 py-2 text-white text-center">Qty *</th> */}
                              <th className="px-2 py-2 text-white text-center">Avl. Qty</th>
                            </tr>
                          </thead>
                          <tbody>
                            {termsDetailsTable.map((row, index) => (
                              <tr key={index}>
                                <td className="border p-0 text-center">
                                  <Checkbox
                                    checked={selectedRows.includes(index)}
                                    onChange={(e) => {
                                      const isChecked = e.target.checked;
                                      setSelectedRows((prev) => (isChecked ? [...prev, index] : prev.filter((i) => i !== index)));
                                      
                                    }}
                                  />
                                </td>
                                <td className="text-center p-0">
                                  <div style={{ paddingTop: 12 }}>{index + 1}</div>
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.partNo}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.partDesc}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.sku}
                                </td>
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.batchNo}
                                </td>
                                {/* <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.qty}
                                </td> */}
                                <td className="border text-center pb-0 ps-0 pe-0" style={{ paddingTop: 12 }}>
                                  {row.availQty}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </DialogContent>
                <DialogActions sx={{ p: '1.25rem' }} className="pt-0">
                  <Button onClick={handleCloseModal}>Cancel</Button>
                  <Button color="secondary" onClick={handleSaveSelectedRows} variant="contained">
                    Proceed
                  </Button>
                </DialogActions>
              </Dialog>
      </div>
    </>
  
)};

export default ExportPackingList;
