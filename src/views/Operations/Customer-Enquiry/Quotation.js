import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
// import TextField from '@mui/material/TextField';
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
import { Autocomplete, TextField } from '@mui/material';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import { getAllActiveCurrency } from 'utils/CommonFunctions';
import numberToWords from "number-to-words";

import axios from 'axios';
const Quotation = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [accountNames, setAccountNames] = useState([]);
  const [partyList, setPartyList] = useState([]);
  const [enquiryList, setEnquiryList] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [prodManList, setProdManList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [partNoList, setPartNoList] = useState([]);
  const [docId, setDocId] = useState('');
  const [listViewData, setListViewData] = useState([]);
  const [enquiryData, setEnquiryData] = useState([]);
  // const isFieldDisabled = formData.customerName === '';
  const [formData, setFormData] = useState({
    active: true,
    docDate: dayjs(),
    quoteNo: '',
    customerName: '',
    customerId: '',
    enquiryNo: '',
    enquiryDate: dayjs(),
    orgId: orgId,
    validTill: null,
    kindAttention: '',
    contactNo: '',
    taxCode: '',
    productionManager: '',
    currency: '',
    grossAmount: "",
    amountInWords: "",
    netAmount: '',
  });

  const [fieldErrors, setFieldErrors] = useState({

    active: true,
    docDate: dayjs(),
    quoteNo: '',
    customerName: '',
    customerId: '',
    enquiryNo: '',
    enquiryDate: dayjs(),
    orgId: orgId,
    validTill: null,
    kindAttention: '',
    contactNo: '',
    taxCode: '',
    productionManager: '',
    currency: '',
    grossAmount: '',
    amountInWords: '',
  });

  const listViewColumns = [
    { accessorKey: 'docId', header: 'Document ID', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'customerId', header: 'Customer Id', size: 140 },
    { accessorKey: 'kindAttention', header: 'kindAttention', size: 140 }
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      partNo: '',
      partDescription: '',
      drawingNo: '',
      revisionNo: '',
      unit: '',
      unitPrice: '',
      qtyOffered: '',
      basicPrice: '',
      discount: '',
      discountAmount: '',
      quoteAmount: '',
      deliveryDate: '',
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      partNo: '',
      partDescription: '',
      drawingNo: '',
      revisionNo: '',
      unit: '',
      unitPrice: '',
      qtyOffered: '',
      basicPrice: '',
      discount: '',
      discountAmount: '',
      quoteAmount: '',
      deliveryDate: '',
    }
  ]);


  useEffect(() => {
    const totalGrossAmount = detailsTableData.reduce((sum, row) => sum + Number(row.basicPrice || 0), 0);
    const totalNetAmount = detailsTableData.reduce((sum, row) => sum + Number(row.quoteAmount || 0), 0);

    setFormData((prev) => ({
      ...prev,
      grossAmount: totalGrossAmount,
      netAmount: totalNetAmount,
      amountInWords: numberToWords.toWords(Number(totalNetAmount)).toUpperCase()
    }));

  }, [detailsTableData]);

  const getAvailablePartNos = (currentRowId) => {

    const selectedPartNos = detailsTableData
      .filter((row) => row.id !== currentRowId)
      .map((row) => row.partNo);

    return partNoList.filter((part) => !selectedPartNos.includes(part.partNo));
  };

  const getQuotationById = async (row) => {
    console.log('Row selected:', row);
    setShowForm(true);
    try {
      const result = await apiCalls(
        'get',
        `/customerenquiry/getQuotationById?id=${row.original.id}`
      );

      if (result && result.status && result.paramObjectsMap?.quotationVO?.length) {
        const Quot = result.paramObjectsMap.quotationVO[0];

        console.log('DataToEdit', Quot);

        setEditId(Quot.id);
        setDocId(Quot.docId);
        getCustomerNameAndCode(Quot.customer);
        getEnquiryNoAndDate(Quot.customerId);
        getProductionManager(Quot.productionManager);
        getPartNoAndPartDesBasedOnEnquiryNo(Quot.customerId, Quot.enquiryNo);
        setFormData({
          active: Quot.active === "Active",
          taxCode: Quot.taxCode,
          customerName: Quot.customerName,
          customerId: Quot.customerId,
          enquiryNo: Quot.enquiryNo,
          enquiryDate: Quot.enquiryDate,
          kindAttention: Quot.kindAttention,
          contactNo: Quot.contactNo,
          currency: Quot.currency,
          productionManager: Quot.productionManager,
          validTill: Quot.vaidTill ? dayjs(Quot.vaidTill, 'YYYY-MM-DD') : dayjs(),
          docDate: Quot.docDate ? dayjs(Quot.docDate, 'YYYY-MM-DD') : dayjs(),
          grossAmount: Quot.grossAmount,
          netAmount: Quot.netAmount,
          amountInWords: Quot.amountInWords,
          orgId: Quot.orgId,
          createdBy: Quot.createdBy,
          updatedBy: Quot.updatedBy,
        });


        setDetailsTableData(
          Quot.quotationDetailsVO?.map((row) => ({
            id: row.id,
            partNo: row.partCode,
            partDescription: row.partDescription,
            drawingNo: parseInt(row.drawingNo, 10) || 0,
            revisionNo: row.revisionNo,
            unit: row.unit,
            unitPrice: row.unitPrice,
            qtyOffered: row.qtyOffered,
            basicPrice: row.basicPrice,
            discount: row.discount,
            discountAmount: row.discountAmount,
            quoteAmount: row.quoteAmount,
            deliveryDate: row.deliveryDate,
          })) || []
        );
      } else {
        console.error('No data found for the selected ID');
        showToast('error', 'No data found for the selected ID');
      }
    }
    catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    getCustomerNameAndCode();
    getEnquiryNoAndDate();
    getProductionManager();
  }, []);


  const getCustomerNameAndCode = async () => {
    try {
      const result = await apiCalls('get', `/customerenquiry/getCustomerNameAndCode?orgId=${orgId}`);
      setPartyList(result.paramObjectsMap.partymasterVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getEnquiryNoAndDate = async (customer) => {
    try {
      const result = await apiCalls('get', `/customerenquiry/getEnquiryNoAndDate?customerCode=${customer}&orgId=${orgId}`);
      setEnquiryList(result.paramObjectsMap.enquiryVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };
  
  const getPartNoAndPartDesBasedOnEnquiryNo = async (customerId, enquiryNo) => {
    try {
      const result = await apiCalls('get', `/customerenquiry/getPartNoAndPartDesBasedOnEnquiryNo?customerCode=${customerId}&docId=${enquiryNo}&orgId=${orgId}`);
      setPartNoList(result.paramObjectsMap.enquiryVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };
  const getProductionManager = async (customer) => {
    try {
      const result = await apiCalls('get', `/customerenquiry/getProductionManager?orgId=${orgId}`);
      setProdManList(result.paramObjectsMap.employeeVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  useEffect(() => {
    getDepartmentDocId();
  }, [])

  const getDepartmentDocId = async () => {
    try {
      const response = await apiCalls('get', `/customerenquiry/getQuotationDocId?orgId=${orgId}`);
      setDocId(response.paramObjectsMap.quotationDocId)
    } catch (error) {
      console.error('Error fetching departmentDocId:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    let errorMessage = '';

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      setFormData({ ...formData, [name]: value });
      setFieldErrors({ ...fieldErrors, [name]: '' });
    }
  };


  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleClear = () => {
    setFormData({
      customerId: '',
      orgId: orgId,
      validTill: null,
      docDate: dayjs(),
      validTill: null,
      netAmount: '',
      taxCode: '',
      kindAttention: '',
      currency: '',
      contactNo: '',
      grossAmount: '',
      amountInWords: '',
    });
    getDepartmentDocId();
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
      { id: 1, partNo: '', unit: '', drawingNo: '', partDescription: '', revisionNo: '', unitPrice: '', }
    ]);
    setDetailsTableErrors('');
    setEditId('');
  };


  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      partNo: '',
      unit: '',
      drawingNo: '',
      partDescription: '',
      revisionNo: '',
      unitPrice: '',
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { partNo: '', unit: '', revisionNo: '', unitPrice: '', }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;
    if (!lastRow) return false;
    if (table === detailsTableData) {
      return (
        !lastRow.partNo ||
        !lastRow.unit ||
        !lastRow.unitPrice ||
        !lastRow.drawingNo ||
        !lastRow.partDescription ||
        !lastRow.revisionNo ||
        !lastRow.qtyOffered ||
        !lastRow.basicPrice ||
        !lastRow.discount ||
        !lastRow.discountAmount ||
        !lastRow.quoteAmount ||
        !lastRow.deliveryDate
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        const lastRow = table[table.length - 1];

        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partNo: !lastRow.partNo ? 'Part Number is Required' : '',
          unit: !lastRow.unit ? 'Unit is Required' : '',
          unitPrice: !lastRow.unitPrice ? 'Unit Price is Required' : '',
          qtyOffered: !lastRow.qtyOffered ? 'Quantity Offered is Required' : '',
          basicPrice: !lastRow.basicPrice ? 'Basic Price is Required' : '',
          discount: !lastRow.discount ? 'Discount is Required' : '',
          discountAmount: !lastRow.discountAmount ? 'Discount Amount is Required' : '',
          quoteAmount: !lastRow.quoteAmount ? 'Quote Amount Amount is Required' : '',
          deliveryDate: !lastRow.deliveryDate ? 'Delivery Date is Required' : ''
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



  useEffect(() => {
    getAllQuotationByOrgId();
  }, []);
  const getAllQuotationByOrgId = async () => {
    try {
      const response = await apiCalls('get', `/customerenquiry/getAllQuotationByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.quotationVO);
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
    if (!formData.enquiryNo) errors.enquiryNo = 'Enquiry Number is Required';
    if (!formData.validTill) errors.validTill = 'Reference Date is Required';
    if (!formData.kindAttention) errors.kindAttention = 'Kind Attention is Required';
    if (!formData.productionManager) errors.productionManager = 'Production Manager is Required';
    if (!formData.currency) errors.currency = 'Currency is Required';
    if (!formData.grossAmount) errors.grossAmount = 'Gross Amount is Required';
    if (!formData.amountInWords) errors.amountInWords = 'Amount in Words is Required';
    if (!formData.netAmount) errors.netAmount = 'Net Amount is Required';

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.partNo) {
        rowErrors.partNo = 'Part No is Required';
        detailTableDataValid = false;
      }
      if (!row.unit) {
        rowErrors.unit = ' Unit is Required';
        detailTableDataValid = false;
      }
      if (!row.unitPrice) {
        rowErrors.unitPrice = 'Unit Price  is Required';
        detailTableDataValid = false;
      }
      if (!row.qtyOffered) {
        rowErrors.qtyOffered = 'Qty Offered is Required';
        detailTableDataValid = false;
      }
      if (!row.basicPrice) {
        rowErrors.basicPrice = 'Basic Price is Required';
        detailTableDataValid = false;
      }
      if (!row.discount) {
        rowErrors.discount = 'Discount is Required';
        detailTableDataValid = false;
      }
      if (!row.discountAmount) {
        rowErrors.discountAmount = 'DiscountAmount is Required';
        detailTableDataValid = false;
      }
      if (!row.quoteAmount) {
        rowErrors.quoteAmount = 'Quote Amount is Required';
        detailTableDataValid = false;
      }
      if (!row.deliveryDate) {
        rowErrors.deliveryDate = 'Delivery Date is Required';
        detailTableDataValid = false;
      }


      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      setIsLoading(true);

      const quotedetailsVo = detailsTableData.map((row) => ({
        ...(editId && { id: parseInt(row.id, 10) || undefined }),
        itemSubGroup: row.itemSubGroup,
        deliveryDate: row.deliveryDate,
        discount: parseInt(row.discount, 10),
        partCode: row.partNo,
        partDescription: row.partDescription,
        drawingNo: row.drawingNo,
        qtyOffered: parseInt(row.qtyOffered, 10),
        revisionNo: parseInt(row.revisionNo, 10),
        unit: row.unit,
        unitPrice: parseFloat(row.unitPrice),
      }));

      const saveFormData = {
        ...(editId && { id: parseInt(editId, 10) || undefined }),
        active: true,
        contactNo: parseInt(formData.contactNo, 10) || 0,
        createdBy: loginUserName,
        currency: formData.currency,
        customerId: formData.customerId,
        customerName: formData.customerName,
        enquiryDate: formData.enquiryDate,
        enquiryNo: formData.enquiryNo,
        drawingNo: formData.drawingNo,
        kindAttention: formData.kindAttention,
        orgId: parseInt(orgId, 10),
        productionManager: formData.productionManager,
        quotationDetailsDTO: quotedetailsVo,
        taxCode: formData.taxCode,
        vaidTill: dayjs(formData.validTill).format('YYYY-MM-DD'),
      };

      console.log("DATA TO SAVE IS:", saveFormData);

      try {
        const response = await apiCalls("put", "/customerenquiry/createUpdateQuotation", saveFormData);
        if (response.status === true) {
          console.log("Response:", response);
          showToast(
            "success",
            editId
              ? "Quotation updated successfully"
              : "Quotation values created successfully"
          );
          getAllQuotationByOrgId();
          handleClear();
          setIsLoading(false);
        } else {
          showToast("error", response.paramObjectsMap.errorMessage || "Quotation value creation failed");
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error:", error);
        showToast("error", "Quotation value creation failed");
        setIsLoading(false);
      }
    }
    else {
      setFieldErrors(errors);
    }
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
                    id="quoteNo"
                    label="Quote No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="quoteNo"
                    value={docId}
                    disabled
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
                  <Autocomplete
                    disablePortal
                    options={partyList}
                    getOptionLabel={(option) => option.customer || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={partyList.find((c) => c.customer === formData.customerName) || null}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormData({
                          ...formData,
                          customerName: newValue.customer,
                          customerId: newValue.customerCode,
                          taxCode: newValue.taxCode,
                          currency: newValue.currency,
                        });
                        getEnquiryNoAndDate(newValue.customerCode)
                      } else {
                        setFormData({
                          ...formData,
                          customerName: '',
                          customerId: '',
                          taxCode: '',
                          currency: '',
                        });
                      }
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
                        // disabled={isFieldDisabled}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Customer ID"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={enquiryList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.enquiryDocNo || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={enquiryList.find((eNo) => eNo.enquiryDocNo === formData.enquiryNo) || null}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setFormData({
                          ...formData,
                          enquiryNo: newValue.enquiryDocNo,
                          kindAttention: newValue.kindAttention,
                          enquiryDate: newValue.enquiryDocDate,
                          contactNo: newValue.contactNo,
                        });
                        getPartNoAndPartDesBasedOnEnquiryNo(formData.customerId, newValue.enquiryDocNo)
                      } else {
                        setFormData({
                          ...formData,
                          enquiryNo: '',
                          kindAttention: '',
                          enquiryDate: '',
                          contactNo: '',
                        });
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Enquiry No"
                        name="enquiryNo"
                        error={!!fieldErrors.enquiryNo}
                        helperText={fieldErrors.enquiryNo}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Enquiry Date"
                        value={formData.enquiryDate ? dayjs(formData.enquiryDate, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('enquiryDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.enquiryDate}
                        helperText={fieldErrors.enquiryDate ? fieldErrors.enquiryDate : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Valid Till"
                        value={formData.validTill}
                        onChange={(date) => handleDateChange('validTill', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {/* {fieldErrors.validTill && <p className="dateErrMsg">Ref Date is Required</p>} */}
                    {fieldErrors.validTill && (
                      <p className="dateErrMsg">Ref Date is Required</p>
                    )}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="kindAttention"
                      label="Kind Attention"
                      name="kindAttention"
                      size="small"
                      value={formData.kindAttention}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.kindAttention}
                      helperText={fieldErrors.kindAttention}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Contact No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="taxCode"
                      label="Tax Code"
                      size="small"
                      name="taxCode"
                      value={formData.taxCode}
                      onChange={handleInputChange}
                      disabled
                      inputProps={{ maxLength: 10 }}
                    />
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={prodManList}
                    getOptionLabel={(option) => option.productionManager}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.productionManager ? prodManList.find((c) => c.productionManager === formData.productionManager) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'productionManager',
                          value: newValue ? newValue.productionManager : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Production Manager"
                        name="productionManager"
                        error={!!fieldErrors.productionManager}
                        helperText={fieldErrors.productionManager}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="currency"
                      label="Currency"
                      name="currency"
                      size="small"
                      value={formData.currency}
                      onChange={handleInputChange}
                      inputProps={{ maxLength: 30 }}
                      error={!!fieldErrors.currency}
                      helperText={fieldErrors.currency}
                      disabled
                    />
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
                    <Tab value={0} label="Quote details" />
                    <Tab value={1} label="Summary" />
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
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Part No</th>
                                    <th className="table-header">Part Description</th>
                                    <th className="table-header">Drawing No</th>
                                    <th className="table-header">Revision No</th>
                                    <th className="table-header">Unit</th>
                                    <th className="table-header">Unit Price</th>
                                    <th className="table-header">Qty Offered</th>
                                    <th className="table-header">Basic Price</th>
                                    <th className="table-header">Discount %</th>
                                    <th className="table-header">Discount Amount</th>
                                    <th className="table-header">Quote Amount</th>
                                    <th className="table-header">Delivery Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detailsTableData.map((row, index) => (
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
                                        <select
                                          value={row.partNo || ""}
                                          style={{ width: "150px" }}
                                          className={
                                            detailsTableErrors[index]?.partNo ? "error form-control" : "form-control"
                                          }
                                          onChange={(e) => {
                                            const selectedPartNo = e.target.value;

                                            // Find details for the selected part
                                            const selectedPartDetails = partNoList.find(
                                              (item) => item.partNo === selectedPartNo
                                            );

                                            // Update partNo and related fields
                                            setDetailsTableData((prev) =>
                                              prev.map((r, i) =>
                                                i === index
                                                  ? {
                                                    ...r,
                                                    partNo: selectedPartDetails?.partNo || "",
                                                    partDescription: selectedPartDetails?.partDescription || "",
                                                    unit: selectedPartDetails?.unit || "",
                                                    revisionNo: selectedPartDetails?.revisionNo || "",
                                                    drawingNo: selectedPartDetails?.drawingNo || "",
                                                  }
                                                  : r
                                              )
                                            );

                                            // Update validation errors
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partNo: !selectedPartNo ? "Part No is required" : "",
                                              };
                                              return newErrors;
                                            });
                                          }}
                                        >
                                          <option value="">-- Select --</option>
                                          {getAvailablePartNos(row.id).map((item) => (
                                            <option key={item.id} value={item.partNo}>
                                              {item.partNo}
                                            </option>
                                          ))}
                                        </select>
                                        {detailsTableErrors[index]?.partNo && (
                                          <div className="mt-2" style={{ color: "red", fontSize: "12px" }}>
                                            {detailsTableErrors[index].partNo}
                                          </div>
                                        )}
                                      </td>

                                      
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.partDescription}
                                          className="form-control"
                                          style={{ width: "150px" }}
                                          disabled
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.drawingNo}
                                          className="form-control"
                                          style={{ width: "150px" }}
                                          disabled
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.revisionNo}
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
                                          value={row.unitPrice}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? { ...r, unitPrice: value, basicPrice: value * (r.qtyOffered || 0) }
                                                  : r
                                              )
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unitPrice: !value ? 'unitPrice is Required' : '',
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.unitPrice ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {detailsTableErrors[index]?.unitPrice && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].unitPrice}
                                          </div>
                                        )}
                                      </td>

                                      {/*  */}

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.qtyOffered}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? { ...r, qtyOffered: value, basicPrice: (r.unitPrice || 0) * value }
                                                  : r
                                              )
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qtyOffered: !value ? 'qtyOffered is Required' : '',
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.qtyOffered ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {detailsTableErrors[index]?.qtyOffered && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].qtyOffered}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.basicPrice}
                                          readOnly
                                          className="form-control"
                                          style={{ width: '150px' }}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.discount}
                                          onChange={(e) => {
                                            const value = parseFloat(e.target.value) || 0;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                    ...r,
                                                    discount: value,
                                                    discountAmount: (r.basicPrice || 0) * (value / 100),
                                                    quoteAmount: (r.basicPrice || 0) - (r.basicPrice || 0) * (value / 100),
                                                  }
                                                  : r
                                              )
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                discount: value <= 0 ? 'Discount is Required' : '',
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.discount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {detailsTableErrors[index]?.discount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].discount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.discountAmount}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, discountAmount: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                discountAmount: !value ? 'discountAmount is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.discountAmount ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {detailsTableErrors[index]?.discountAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].discountAmount}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.quoteAmount}
                                          readOnly
                                          className="form-control"
                                          style={{ width: '150px' }}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="date"
                                          value={row.deliveryDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, deliveryDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                deliveryDate: !date ? 'Delivery Date is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.deliveryDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
                                          style={{ width: '150px' }}
                                        />
                                        {detailsTableErrors[index]?.deliveryDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].deliveryDate}
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
                      <div className="row mt-2">
                        <div className="col-md-3 mb-3">
                          <TextField
                            id="outlined-textarea-zip"
                            label="Gross Amount"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="grossAmount"
                            value={formData.grossAmount}
                            onChange={handleInputChange}
                            helperText={
                              <span style={{ color: 'red' }}>{fieldErrors.grossAmount ? 'Total Credit Amount is Required' : ''}</span>
                            }
                            inputProps={{ maxLength: 40 }}
                            disabled
                          />
                        </div>
                        <div className="col-md-3">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="netAmount"
                              label="Net Amount"
                              size="small"
                              name="netAmount"
                              value={formData.netAmount}
                              multiline
                              // minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.netAmount}
                              helperText={fieldErrors.netAmount}
                              disabled
                            />
                          </FormControl>
                        </div>
                        <div className="col-md-6">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="Amount In Words"
                              label="Amount In Words"
                              size="small"
                              name="amountInWords"
                              value={formData.amountInWords}
                              multiline
                              // minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
                              error={!!fieldErrors.amountInWords}
                              helperText={fieldErrors.amountInWords}
                              disabled
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
            <CommonTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getQuotationById} />
          )}
        </div>
      </div>
    </>
  );
};
export default Quotation;
