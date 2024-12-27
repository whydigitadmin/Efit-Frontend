import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { toast } from 'react-toastify';
import { Autocomplete } from '@mui/material';

const PurchaseEnquiry = () => {
  const [showForm, setShowForm] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [accountNames, setAccountNames] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [partyList, setPartyList] = useState([]);
  const [workOrdNoList, setWorkOrdNoList] = useState([]);
  const [pINoList, setPINoList] = useState([]);
  const [supNameList, setSupNameList] = useState([]);
  const [contactPersonList, setContactPersonList] = useState([]);
  const [itemList, setItemList] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [docId, setDocId] = useState('');
  const [listViewData, setListViewData] = useState([]);


  const [formData, setFormData] = useState({
    active: true,
    docDate: dayjs(),
    customerName: '',
    workOrderNo: '',
    pINo: '',
    customerPONo: '',
    fgItem: '',
    supplierName: '',
    contactPerson: '',
    contactNo: '',
    enquiryType: '',
    expectedDeliveryDate: dayjs(),
    expectDelDate: dayjs(),
    narration: '',
    supplierCode: "",
    customerCode: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    docDate: dayjs(),
    customerName: '',
    workOrderNo: '',
    pINo: '',
    customerPONo: '',
    fgItem: '',
    supplierName: '',
    contactPerson: '',
    contactNo: '',
    enquiryType: '',
    expectedDeliveryDate: dayjs(),
    expectDelDate: dayjs(),
    narration: '',
  });
  const listViewColumns = [
    { accessorKey: 'docId', header: 'docId', size: 180 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'contactPerson', header: 'Contact Person', size: 140 },
    { accessorKey: 'contactNo', header: 'Contact No', size: 140 },
    { accessorKey: 'fgPartName', header: 'fgPartName', size: 140 },
  ];
  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      item: '',
      itemDesc: '',
      unit: '',
      qtyRequired: '',
      remarks: '',
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      id: 1,
      item: '',
      itemDesc: '',
      unit: '',
      qtyRequired: '',
      remarks: '',
    }
  ]);

  useEffect(() => {
  }, []);

  useEffect(() => {
    const totalDebit = detailsTableData.reduce((sum, row) => sum + Number(row.debitAmount || 0), 0);
    const totalCredit = detailsTableData.reduce((sum, row) => sum + Number(row.creditAmount || 0), 0);

    setFormData((prev) => ({
      ...prev,
      totalDebitAmount: totalDebit,
      totalCreditAmount: totalCredit
    }));
  }, [detailsTableData]);

  const getAllPurchaseEnquiryById = async (row) => {
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/purchase/getAllPurchaseEnquiryById?id=${row.original.id}`);

      if (result && result.paramObjectsMap && result.paramObjectsMap.purchaseEnquiryVO) {
        const purchEnq = result.paramObjectsMap.purchaseEnquiryVO;

        setEditId(row.original.id);
        setDocId(purchEnq.docId);
        setFormData({
          active: purchEnq.active || true,
          docDate: purchEnq.docDate ? dayjs(purchEnq.docDate, 'YYYY-MM-DD') : dayjs(),
          customerName: purchEnq.customerName || '',
          customerName: purchEnq.customerName || '',
          workOrderNo: purchEnq.workOrderNo || '',
          pINo: purchEnq.purchaseIndentNo || '',
          customerPONo: purchEnq.customerPoNo || '',
          fgItem: purchEnq.fgPartName || '',
          supplierName: purchEnq.supplierName || '',
          contactPerson: purchEnq.contactPerson || '',
          contactNo: purchEnq.contactNo || '',
          enquiryType: purchEnq.enquiryType || '',
          expectedDeliveryDate: purchEnq.expectedDeliveryDate
            ? dayjs(purchEnq.expectedDeliveryDate, 'YYYY-MM-DD') : dayjs(),
          expectDelDate: purchEnq.expectedDeliveryDate ? dayjs(purchEnq.expectedDeliveryDate, 'YYYY-MM-DD') : dayjs(),
          narration: purchEnq.summary || '',
        });

        // Update table data with response
        setDetailsTableData(
          purchEnq.purchaseEnquiryDetailsVO.map((row) => ({
            id: row.id || '',
            item: row.item || '',
            itemDesc: row.itemDesc || '',
            unit: row.unit || '',
            qtyRequired: row.qtyRequired || 0,
            remarks: row.remarks || '',
          }))
        );

        console.log('DataToEdit:', purchEnq);
      } else {
        console.warn('No data received or invalid structure');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleDebitChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, debitAmount: value, creditAmount: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          debitAmount: !value ? 'Debit Amount is required' : ''
        };
        return newErrors;
      });
    }
  };



  const handleInputChange = (e, fieldType, index) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
    let errorMessage = '';
    const alphaNumericRegex = /^[A-Za-z0-9]*$/;

    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    }
    else {
      if (name === 'customerName') {
        const selectedCustomer = partyList.find((scr) => scr.customerName === value);

        if (selectedCustomer) {
          setFormData((prevData) => ({
            ...prevData,
            customerCode: selectedCustomer.customerCode,
            customerName: selectedCustomer.customerName,
          }));
          getWorkOrderNoForPurchaseEnquiry(selectedCustomer.customerCode);
        }
      }

      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
      // setWorkOrdNoList([]);
    }
    setWorkOrdNoList([]);
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleClear = () => {
    setFormData({
      active: true,
      purchaseEnquiryNo: '',
      docDate: dayjs(),
      customerName: '',
      workOrderNo: '',
      pINo: '',
      customerPONo: '',
      fgItem: '',
      supplierName: '',
      contactPerson: '',
      contactNo: '',
      enquiryType: '',
      expectedDeliveryDate: dayjs(),
      expectDelDate: dayjs(),
      narration: '',
    });
    getWorkOrderDocId();
    getAllActiveCurrency(orgId);
    setFieldErrors({
      date: dayjs(),
      customerId: '',
      orgId: orgId,
      validTill: null,
      netAmount: '',
      taxCode: '',
      grossAmount: '',
      amountInWords: '',
    });
    setDetailsTableData([
      {
        id: 1,
        item: '',
        itemDesc: '',
        unit: '',
        qtyRequired: '',
        remarks: '',
      }
    ]);
    setDetailsTableErrors('');
    setEditId('');
  };
  const handleAddRow = () => {
    // Validate the last row before adding a new one
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData); // Set error for the last row if empty
      return; // Prevent adding a new row
    }

    // Add a new row if the validation passes
    const newRow = {
      id: Date.now(),
      item: '',
      itemDesc: '',
      unit: '',
      qtyRequired: '',
      remarks: ''
    };

    // Add new row to table data and initialize empty error state for it
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([
      ...detailsTableErrors,
      { item: '', itemDesc: '', qtyRequired: '', remarks: '' }
    ]);
  };

  // Helper function to check if the last row is empty
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    return (
      !lastRow.item ||
      !lastRow.itemDesc ||
      !lastRow.unit ||
      !lastRow.qtyRequired ||
      !lastRow.remarks
    );
  };

  // Function to display errors for the last row if any field is empty
  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        const lastRowIndex = table.length - 1;
        newErrors[lastRowIndex] = {
          item: !table[lastRowIndex].item ? 'Item is required' : '',
          // itemDesc: !table[lastRowIndex].itemDesc ? 'Item Desc is required' : '',
          // unit: !table[lastRowIndex].unit ? 'Unit is required' : '',
          // qtyRequired: !table[lastRowIndex].qtyRequired ? 'Qty Required is required' : '',
          remarks: !table[lastRowIndex].remarks ? 'Remarks is required' : '',
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
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // DocId
  const getWorkOrderDocId = async () => {
    try {
      const response = await apiCalls('get', `/customerenquiry/getWorkOrderDocId?orgId=${orgId}`);
      setDocId(response.paramObjectsMap.workOrderDocId)
    } catch (error) {
      console.error('Error fetching departmentDocId:', error);
    }
  };

  useEffect(() => {
    getWorkOrderDocId();
    getCustomerNameAndCode();
  }, [])

  const getCustomerNameAndCode = async () => {
    try {
      const result = await apiCalls('get', `/purchase/getCustomerNameForPurchaseIndent?orgId=${orgId}`);
      setPartyList(result.paramObjectsMap.customerNameList || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getWorkOrderNoForPurchaseEnquiry = async (customerName) => {
    try {
      const result = await apiCalls('get', `/purchase/getWorkOrderNoForPurchaseEnquiry?customerCode=${customerName}&orgId=${orgId}`);
      setWorkOrdNoList(result.paramObjectsMap.workOrderNo || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getPurchaseIndentNoForPurchaseEnquiry = async (customerName, workOrderNo) => {
    try {
      const result = await apiCalls('get', `/purchase/getPurchaseIndentNoForPurchaseEnquiry?customerCode=${customerName}&workOrderNo=${workOrderNo}&orgId=${orgId}`);
      setPINoList(result.paramObjectsMap.purchaseIndentNo || []);
    } catch (err) {
      console.log('error', err);
    }
  };
  // // Table
  const getItemDetailsForPurchaseEnquiry = async (fgItem, purchaseIndentNo) => {
    try {
      const result = await apiCalls('get', `/purchase/getItemDetailsForPurchaseEnquiry?fgItem=${fgItem}&orgId=${orgId}&purchaseIndentNo=${purchaseIndentNo}`);
      setItemList(result.paramObjectsMap.itemDetails || []);
    } catch (err) {
      console.log('error', err);
    }
  };
  useEffect(() => {
    getSupplierNames();
  }, [])
  // getSupplierNames
  const getSupplierNames = async () => {
    try {
      const result = await apiCalls('get', `/purchase/getSupplierNameForPurchaseEnquiry?orgId=${orgId}`);
      setSupNameList(result.paramObjectsMap.SupplierNameList || []);
    } catch (err) {
      console.error("Error fetching Supplier Names:", err);
    }
  };

  const getContactPersonDetails = async (supplierCode) => {
    try {
      const response = await apiCalls("get", `/purchase/getContactPersonDetailsForPurchaseEnquiry?orgId=${orgId}&supplierCode=${supplierCode}`);
      const contactList = response.paramObjectsMap?.purchaseEnquiryVO || [];
      setContactPersonList(contactList);
    } catch (error) {
      console.error("Error fetching contact person details:", error);
    }
  };

  useEffect(() => {
    if (formData.supplierCode) {
      getContactPersonDetails(formData.supplierCode);
    }
  }, [formData.supplierCode]);

  // List
  useEffect(() => {
    getAllPurchaseEnquiryByOrgId();
  }, []);
  const getAllPurchaseEnquiryByOrgId = async () => {
    try {
      const response = await apiCalls('get', `/purchase/getAllPurchaseEnquiryByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.purchaseEnquiryVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    const errors = {};
    let isValid = true;
    if (!formData.customerName) errors.customerName = 'Customer Name is Required';

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.remarks) {
        rowErrors.remarks = 'Part No is Required';
        detailTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      setIsLoading(true);

      const purchaseEnquiryVo = detailsTableData.map((row) => ({
        ...(editId && { id: parseInt(row.id, 10) || undefined }),
        item: row.item,
        itemDesc: row.itemDesc,
        qtyRequired: parseInt(row.qtyRequired, 10) || 0,
        remarks: row.remarks,
        unit: row.unit,
      }));

      const saveFormData = {
        ...(editId && { id: parseInt(editId, 10) || undefined }),
        active: true,
        contactNo: formData.contactNo || '',
        contactPerson: formData.contactPerson || '',
        createdBy: loginUserName,
        customerName: formData.customerName || '',
        customerPoNo: formData.customerPONo || '',
        enquiryDueDate: dayjs(formData.expectDelDate) || dayjs(),
        enquiryType: formData.enquiryType || '',
        expectedDeliveryDate: dayjs(formData.expectedDeliveryDate) || dayjs(),
        fgPartName: formData.fgItem || '',
        orgId: parseInt(orgId, 10),
        purchaseIndentNo: formData.pINo || '',
        supplierName: formData.supplierName || '',
        workOrderNo: formData.workOrderNo || '',
        summary: formData.narration,
        purchaseEnquiryDetailsDTO: purchaseEnquiryVo,


        customerCode: formData.customerCode || '',
        supplierCode: formData.supplierCode || '',

      };

      console.log("DATA TO SAVE IS:", saveFormData);

      try {
        const response = await apiCalls("put", "/purchase/updateCreatePurchaseEnquiry", saveFormData);
        if (response.status === true) {
          console.log("Response:", response);
          showToast(
            "success",
            editId
              ? "Purchase Enquiry updated successfully"
              : "Purchase Enquiry values created successfully"
          );
          getAllPurchaseEnquiryByOrgId();
          handleClear();
          setIsLoading(false);
        } else {
          showToast("error", response.paramObjectsMap.errorMessage || "Purchase Enquiry value creation failed");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        showToast("error", "Purchase Enquiry value creation failed");
        setIsLoading(false);
      }
    }
    else {
      setFieldErrors(errors);
    }
  };

  const handleCustomerChange = (event, value) => {
    setFormData((prev) => ({
      ...prev,
      customerName: value?.name || '',
      customerCode: value?.code || '', // Assuming `value` has a `code` field
    }));
  };

  const handleSupplierChange = (event, value) => {
    setFormData((prev) => ({
      ...prev,
      supplierName: value?.name || '',
      supplierCode: value?.code || '', // Assuming `value` has a `code` field
    }));
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
    toast.success("File uploded sucessfully")
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
                {/* Purchase Enquiry No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="woNo"
                    label="Purchase Enquiry No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="purchaseEnquiryNo"
                    value={docId}
                    disabled
                  />
                </div>
                {/* Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Date"
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
                {/* Customer Name */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.customerName || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.customerName ? partyList.find((c) => c.customerName === formData.customerName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'customerName',
                          value: newValue ? newValue.customerName : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Customer Name"
                        name="customerName"
                        error={!!fieldErrors.customerName}
                        helperText={fieldErrors.customerName}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                {/* Work Order No */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={workOrdNoList.map((option, index) => ({
                      ...option,
                      key: index,
                    }))}
                    getOptionLabel={(option) => option.workOrderNo || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={workOrdNoList.find((qu) => qu.workOrderNo === formData.workOrderNo) || null} 
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormData(prevData => ({
                          ...prevData,
                          workOrderNo: newValue.workOrderNo,
                          customerPONo: newValue.customerPoNo,
                          fgItem: newValue.fgPart,
                        }));
                    
                        if (formData.customerCode) {
                          getPurchaseIndentNoForPurchaseEnquiry(formData.customerCode, newValue.workOrderNo);
                        }
                      } else {
                        setFormData(prevData => ({
                          ...prevData,
                          workOrderNo: '',
                        }));
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Work Order No"
                        name="workOrderNo"
                        error={!!fieldErrors.workOrderNo}
                        helperText={fieldErrors.workOrderNo}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>

                {/* P.I No */}

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={pINoList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.purchaseIndentNo || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={
                      formData.pINo
                        ? pINoList.find((item) => item.purchaseIndentNo === formData.pINo) || null
                        : null
                    }
                    onChange={(event, newValue) => {
                      const selectedPINO = newValue ? newValue.purchaseIndentNo : '';
                      setFormData({
                        ...formData,
                        pINo: selectedPINO,
                      });

                      if (selectedPINO) {
                        getItemDetailsForPurchaseEnquiry(formData.fgItem, newValue.purchaseIndentNo);
                        console.log('Selected P.I No:', selectedPINO);

                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="P.I No"
                        name="pINo"
                        error={!!fieldErrors.pINo}
                        helperText={fieldErrors.pINo}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>

                {/* Customer PO No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Customer PO No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerPONo"
                    value={formData.customerPONo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.customerPONo}
                    helperText={fieldErrors.customerPONo}
                  />
                </div>
                {/* FG Item */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="FG Item"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="fgItem"
                    value={formData.fgItem}
                    onChange={handleInputChange}
                    error={!!fieldErrors.fgItem}
                    helperText={fieldErrors.fgItem}
                  />
                </div>
                {/* Supplier Name */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={supNameList}
                    getOptionLabel={(option) => option.supplierName || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={supNameList.find((c) => c.supplierName === formData.supplierName) || null}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormData({
                          ...formData,
                          supplierName: newValue.supplierName,
                        });
                        getContactPersonDetails(newValue.supplierCode);
                      } else {
                        setFormData({
                          ...formData,
                          supplierName: '',
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Supplier Name"
                        name="supplierName"
                        error={!!fieldErrors.supplierName}
                        helperText={fieldErrors.supplierName}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>

                {/* Contact Person */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={contactPersonList}
                    getOptionLabel={(option) => option.contactPerson || ""}
                    sx={{ width: "100%" }}
                    size="small"
                    value={
                      contactPersonList.find(
                        (cp) => cp.contactPerson === formData.contactPerson
                      ) || null
                    }
                    onChange={(event, newValue) => {
                      console.log("Selected Contact Person:", newValue);

                      if (newValue) {
                        setFormData({
                          ...formData,
                          contactPerson: newValue.contactPerson,
                          contactNo: newValue.contactNo,
                          taxType: newValue.taxType,
                        });
                      } else {
                        setFormData({
                          ...formData,
                          contactPerson: "",
                          contactNo: "",
                          taxType: "",
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Contact Person"
                        name="contactPerson"
                        error={!!fieldErrors.contactPerson}
                        helperText={fieldErrors.contactPerson}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                {/* Contact No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Contact No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.contactNo}
                    helperText={fieldErrors.contactNo}
                  />
                </div>
                {/* Enquiry Type */}
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.enquiryType}>
                    <InputLabel id="enquiryType">Enquiry Type</InputLabel>
                    <Select
                      labelId="enquiryType"
                      id="enquiryType"
                      label="Branch/Location"
                      onChange={(e) => {
                        setFormData((prevData) => ({
                          ...prevData,
                          enquiryType: e.target.value,
                        }));
                      }}
                      name="enquiryType"
                      value={formData.enquiryType}
                    >
                      <MenuItem value="Head Office">-- Select --</MenuItem>
                      <MenuItem value="Branch">Mail</MenuItem>
                    </Select>
                    {fieldErrors.enquiryType && <FormHelperText>{fieldErrors.enquiryType}</FormHelperText>}
                  </FormControl>
                </div>
                {/* Enquiry Due Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Enquiry Due Date"
                        value={formData.expectedDeliveryDate}
                        onChange={(date) => handleDateChange('expectedDeliveryDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                {/* Expected Delivery Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Expected Delivery Date"
                        value={formData.expectDelDate}
                        onChange={(date) => handleDateChange('expectDelDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
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
                    <Tab value={0} label="Enquiry Details" />
                    <Tab value={1} label="Summary" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                          <ActionButton icon={CloudUploadIcon} title='Upload' onClick={handleBulkUploadOpen} />
                          {uploadOpen && (
                            <CommonBulkUpload
                              open={uploadOpen}
                              handleClose={handleBulkUploadClose}
                              title="Upload Files"
                              uploadText="Upload file"
                              downloadText="Sample File"
                              onSubmit={handleSubmit}
                              handleFileUpload={handleFileUpload}
                              apiUrl={`excelfileupload/excelUploadForSample`}
                              screen="PutAway"
                            />
                          )}
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Item</th>
                                    <th className="table-header">Item Desc</th>
                                    <th className="table-header">Unit</th>
                                    <th className="table-header">Qty Required</th>
                                    <th className="table-header">Remarks</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Array.isArray(detailsTableData) &&
                                    detailsTableData.map((row, index) => (
                                      <tr key={row.id}>
                                        <td className="border px-2 py-2 text-center">
                                          <ActionButton
                                            title="Delete"
                                            icon={DeleteIcon}
                                            onClick={() =>
                                              handleDeleteRow(
                                                row.id,
                                                detailsTableData,
                                                setDetailsTableData,
                                                detailsTableErrors,
                                                setDetailsTableErrors
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
                                            options={itemList}
                                            getOptionLabel={(option) => option.item || ""}
                                            sx={{ width: "100%" }}
                                            size="small"
                                            value={itemList.find((it) => it.item === row.item) || null}
                                            onChange={(event, newValue) => {
                                              if (newValue) {
                                                setDetailsTableData((prev) =>
                                                  prev.map((r) =>
                                                    r.id === row.id
                                                      ? {
                                                        ...r,
                                                        item: newValue.item,
                                                        itemDesc: newValue.itemDesc || "",
                                                        unit: newValue.uom || "",
                                                        qtyRequired: newValue.qtyRequired || "",
                                                      }
                                                      : r
                                                  )
                                                );
                                              } else {
                                                setDetailsTableData((prev) =>
                                                  prev.map((r) =>
                                                    r.id === row.id
                                                      ? { ...r, item: "", itemDesc: "", unit: "", qtyRequired: "" }
                                                      : r
                                                  )
                                                );
                                              }
                                            }}
                                            renderInput={(params) => (
                                              <TextField
                                                {...params}
                                                label="Item"
                                                name="item"
                                                error={!!detailsTableErrors[index]?.item}
                                                helperText={detailsTableErrors[index]?.item}
                                                InputProps={{
                                                  ...params.InputProps,
                                                  style: { height: 40, width: 170 },
                                                }}
                                              />
                                            )}
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.itemDesc}
                                            className="form-control"
                                            style={{ width: "150px" }}
                                            disabled
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.unit}
                                            className="form-control"
                                            style={{ width: "150px" }}
                                            disabled
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.qtyRequired}
                                            className="form-control"
                                            style={{ width: "150px" }}
                                            disabled
                                          />
                                        </td>
                                        <td className="border px-2 py-2">
                                          <input
                                            type="text"
                                            value={row.remarks}
                                            onChange={(e) => {
                                              const value = e.target.value;
                                              setDetailsTableData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                              );
                                            }}
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
                      <div className="row d-flex mt-2">
                        <div className="col-md-8">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="Narration"
                              label="Narration"
                              size="small"
                              name="narration"
                              value={formData.narration}
                              multiline
                              minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={(e) => {
                                const { name, value } = e.target;
                                setFormData((prevData) => ({
                                  ...prevData,
                                  [name]: value,
                                }));
                              }}
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
            <CommonTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getAllPurchaseEnquiryById} />
          )}
        </div>
      </div>
    </>
  );
};
export default PurchaseEnquiry;
