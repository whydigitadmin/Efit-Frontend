import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, Checkbox, FormControl, FormControlLabel, FormGroup, TextField } from '@mui/material';
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

const Enquiry = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [companyList, setCustomerList] = useState([]);
  const [contactNameList, setContactNameList] = useState([]);
  const [partCodeList, setPartCodeList] = useState([]);

  const [formData, setFormData] = useState({
    active: true,
    customerEnquiryNo: '',
    enquiryDate: dayjs(),
    enquiryType: '',
    customer: '',
    customerCode: '',
    enquiryDueDate: null,
    contactName: '',
    contactNo: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    enquiryType: '',
    customer: '',
    customerCode: '',
    enquiryDueDate: null,
    contactName: '',
    contactNo: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [enquiryDetailsData, setEnquiryDetailsData] = useState([
    {
      id: 1,
      partCode: '',
      partDescription: '',
      drawingNo: '',
      drawingNoList: [],
      revisionNo: '',
      unit: '',
      requireQty: '',
      deliveryDate: null,
      remarks: ''
    }
  ]);
  const [enquiryDetailsErrors, setEnquiryDetailsErrors] = useState([
    {
      partCode: '',
      partDescription: '',
      drawingNo: '',
      revisionNo: '',
      unit: '',
      requireQty: '',
      deliveryDate: null,
      remarks: ''
    }
  ]);

  const [enquirySummaryDTO, setEnquirySummaryDTO] = useState([
    {
      additionalManPower: '',
      anyAdditionalInverstment: '',
      conclusion: '',
      detailReview: '',
      expectedTimeForDeliverySample: null,
      initialReviewComments: '',
      regularProduction: '',
      remarks: '',
      timeFrame: ''
    }
  ]);

  const [enquirySummaryErrors, setEnquirySummaryErrors] = useState([
    {
      additionalManPower: '',
      anyAdditionalInverstment: '',
      conclusion: '',
      detailReview: '',
      expectedTimeForDeliverySample: null,
      initialReviewComments: '',
      regularProduction: '',
      remarks: '',
      timeFrame: ''
    }
  ]);

  const columns = [
    { accessorKey: 'enquiryType', header: 'Enquiry Type', size: 140 },
    { accessorKey: 'customer', header: 'Customer', size: 140 },
    { accessorKey: 'customerCode', header: 'Customer Code', size: 140 },
    { accessorKey: 'contactName', header: 'Contact Name', size: 140 }
  ];

  useEffect(() => {
    getCustomerNameAndCode();
    getPartNoAndDescription();
    getEnquiryDocId();
    getAllEnquiryByOrgId();
  }, []);

  const getEnquiryDocId = async () => {
    try {
      const response = await apiCalls('get', `/customerenquiry/getEnquiryDocId?orgId=${orgId}`);
      setFormData((prevData) => ({
        ...prevData,
        customerEnquiryNo: response.paramObjectsMap.enquiryDocId,
        enquiryDate: dayjs()
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getCustomerNameAndCode = async () => {
    try {
      const response = await apiCalls('get', `/customerenquiry/getCustomerNameAndCode?orgId=${orgId}`);

      if (response.status === true) {
        setCustomerList(response.paramObjectsMap.partymasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getPartNoAndDescription = async () => {
    try {
      const response = await apiCalls('get', `/customerenquiry/getPartNoAndDescription?orgId=${orgId}`);

      if (response.status === true) {
        setPartCodeList(response.paramObjectsMap.itemVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getDrawingNoAndRevisionNo = async (partNo, rowId) => {
    try {
      const response = await apiCalls('get', `/customerenquiry/getDrawingNoAndRevisionNo?orgId=${orgId}&partNo=${partNo}`);

      if (response.status === true) {
        setEnquiryDetailsData((prevData) =>
          prevData.map((row) =>
            row.id === rowId
              ? {
                  ...row,
                  drawingNoList: response.paramObjectsMap.drawingMasterVO
                }
              : row
          )
        );
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllEnquiryByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/customerenquiry/getAllEnquiryByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.enquiryVO || []);
      showForm(true);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getEnquiryById = async (row) => {
    setShowForm(true);
    setFieldErrors({});
    setEnquiryDetailsErrors('');
    try {
      const result = await apiCalls('get', `/customerenquiry/getEnquiryById?id=${row.original.id}`);

      if (result) {
        const listValueVO = result.paramObjectsMap.enquiryVO[0];
        setEditId(row.original.id);
        setFormData({
          customerEnquiryNo: listValueVO.docId || '',
          enquiryDate: listValueVO.docDate ? dayjs(listValueVO.docDate, 'YYYY-MM-DD') : dayjs() || '',
          enquiryType: listValueVO.enquiryType || '',
          customer: listValueVO.customer || '',
          customerCode: listValueVO.customerCode || '',
          enquiryDueDate: listValueVO.enquiryDueDate ? dayjs(listValueVO.enquiryDueDate, 'YYYY-MM-DD') : dayjs() || '',
          contactName: listValueVO.contactName || '',
          contactNo: listValueVO.contactNo || '',
          active: listValueVO.active === 'Active' ? true : false,
          id: listValueVO.id || ''
        });

        const updatedEnquiryDetails = listValueVO.enquiryDetailsVO.map((cl) => ({
          id: cl.id,
          partCode: cl.partCode,
          partDescription: cl.partDescription,
          drawingNo: cl.drawingNo,
          revisionNo: cl.revisionNo,
          unit: cl.unit,
          requireQty: cl.requireQty,
          deliveryDate: cl.deliveryDate,
          remarks: cl.remarks,
          active: cl.active,
          drawingNoList: []
        }));

        setEnquiryDetailsData(updatedEnquiryDetails);

        updatedEnquiryDetails.forEach((item) => {
          getDrawingNoAndRevisionNo(item.partCode, item.id);
        });

        setEnquirySummaryDTO(
          listValueVO.enquirySummaryVO.map((cl) => ({
            id: cl.id,
            additionalManPower: cl.additionalManPower,
            anyAdditionalInverstment: cl.anyAdditionalInverstment,
            conclusion: cl.conclusion,
            detailReview: cl.detailReview,
            expectedTimeForDeliverySample: cl.expectedTimeForDeliverySample,
            initialReviewComments: cl.initialReviewComments,
            regularProduction: cl.regularProduction,
            remarks: cl.remarks,
            timeFrame: cl.timeFrame
          }))
        );
        getContactNameAndNo(listValueVO.customerCode);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
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
    } else {
      if (name === 'customer') {
        const selectedCustomer = companyList.find((scr) => scr.customer === value);

        if (selectedCustomer) {
          setFormData((prevData) => ({
            ...prevData,
            customerCode: selectedCustomer.customerCode,
            customer: selectedCustomer.customer,
            contactName: '',
            contactNo: ''
          }));
          getContactNameAndNo(selectedCustomer.customerCode);
        }
      }
      if (name === 'contactName') {
        const selectedContact = contactNameList.find((scr) => scr.contactName === value);

        if (selectedContact) {
          setFormData((prevData) => ({
            ...prevData,
            contactName: selectedContact.contactName,
            contactNo: selectedContact.contactNo
          }));
        }
      } else if (fieldType === 'enquirySummaryDTO') {
        setEnquirySummaryDTO((prevData) => prevData.map((item, i) => (i === index ? { ...item, [name]: value } : item)));
      }
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
  };

  const getContactNameAndNo = async (row) => {
    try {
      const result = await apiCalls('get', `/customerenquiry/getContactNameAndNo?orgId=${orgId}&partyCode=${row}`);

      if (result) {
        setContactNameList(result.paramObjectsMap.partymasterVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // const handleDateChange = (name, date) => {
  //   setFormData({ ...formData, [name]: date });
  //   setFieldErrors({ ...fieldErrors, [name]: false });
  // };
  const handleDateChange = (name, date, index) => {
    setFormData({
      ...formData,
      [name]: date
    });

    setEnquirySummaryDTO((prev) =>
      prev.map((row, idx) =>
        idx === index
          ? {
              ...row,
              [name]: date ? date.format('YYYY-MM-DD') : null
            }
          : row
      )
    );

    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false
    }));
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
    if (isLastRowEmpty(enquiryDetailsData)) {
      displayRowError(enquiryDetailsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      partCode: '',
      partDescription: '',
      drawingNo: '',
      revisionNo: '',
      unit: '',
      requireQty: '',
      deliveryDate: null,
      remarks: ''
    };
    setEnquiryDetailsData([...enquiryDetailsData, newRow]);
    setEnquiryDetailsErrors([
      ...enquiryDetailsErrors,
      { partCode: '', partDescription: '', drawingNo: '', requireQty: '', deliveryDate: null }
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === enquiryDetailsData) {
      return (
        !lastRow.partCode ||
        !lastRow.partDescription ||
        // !lastRow.drawingNo ||
        !lastRow.requireQty ||
        !lastRow.deliveryDate
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === enquiryDetailsData) {
      setEnquiryDetailsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          partCode: !table[table.length - 1].partCode ? 'Part Code is required' : '',
          partDescription: !table[table.length - 1].partDescription ? 'Part Description is required' : '',
          // drawingNo: !table[table.length - 1].drawingNo ? 'Drawing No is required' : '',
          requireQty: !table[table.length - 1].requireQty ? 'Require Qty is required' : '',
          deliveryDate: !table[table.length - 1].deliveryDate ? 'Delivery Date is required' : ''
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

  const handleList = () => {
    setShowForm(!showForm);
  };
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClear = () => {
    setFormData({
      enquiryDate: dayjs(),
      enquiryType: '',
      customer: '',
      customerCode: '',
      enquiryDueDate: null,
      contactName: '',
      contactNo: ''
    });
    setFieldErrors({});
    setEnquiryDetailsData([
      {
        id: 1,
        partCode: '',
        partDescription: '',
        drawingNo: '',
        revisionNo: '',
        unit: '',
        requireQty: '',
        deliveryDate: null,
        remarks: ''
      }
    ]);
    setEnquirySummaryDTO([
      {
        id: 1,
        additionalManPower: '',
        anyAdditionalInverstment: '',
        conclusion: '',
        detailReview: '',
        expectedTimeForDeliverySample: null,
        initialReviewComments: '',
        regularProduction: '',
        remarks: '',
        timeFrame: ''
      }
    ]);
    setEnquiryDetailsErrors('');
    setEnquirySummaryErrors('');
    setEditId('');
    getEnquiryDocId();
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.enquiryType) errors.enquiryType = 'Enquiry Type is required';
    if (!formData.customer) errors.customer = 'Customer is required';
    if (!formData.customerCode) errors.customerCode = 'Customer Code is required';
    if (!formData.enquiryDueDate) errors.enquiryDueDate = 'Enquiry Due Date is required';
    if (!formData.contactName) errors.contactName = 'Contact Name is required';

    let enquiryDetailsDataValid = true;
    const newTableErrors = enquiryDetailsData.map((row, index) => {
      const rowErrors = {};
      if (!row.partCode) {
        rowErrors.partCode = 'Part Code is required';
        enquiryDetailsDataValid = false;
      }
      if (!row.partDescription) {
        rowErrors.partDescription = 'Part Description is required';
        enquiryDetailsDataValid = false;
      }
      if (!row.drawingNo) {
        rowErrors.drawingNo = 'Drawing No is required';
        enquiryDetailsDataValid = false;
      }
      if (!row.requireQty) {
        rowErrors.requireQty = 'Require Qty is required';
        enquiryDetailsDataValid = false;
      }
      // if (!row.deliveryDate) {
      //   rowErrors.deliveryDate = 'Delivery Date is required';
      //   enquiryDetailsDataValid = false;
      // }

      return rowErrors;
    });
    setEnquiryDetailsErrors(newTableErrors);

    setFieldErrors(errors);
    // let summaryValid = true;
    // const summaryTableErrors = enquirySummaryDTO.map((row) => {
    //   const rowErrors = {};
    //   if (!row.additionalManPower) {
    //     rowErrors.additionalManPower = 'Additional Man Power is required';
    //     summaryValid = false;
    //   }

    //   return rowErrors;
    // });
    // setFieldErrors(errors);

    // setEnquirySummaryErrors(summaryTableErrors);

    if (Object.keys(errors).length === 0 && enquiryDetailsDataValid) {
      setIsLoading(true);

      const enquiryVO = enquiryDetailsData.map((row) => ({
        ...(editId && { id: row.id }),
        deliveryDate: row.deliveryDate,
        drawingNo: row.drawingNo,
        partCode: row.partCode,
        partDescription: row.partDescription,
        remarks: row.remarks,
        requireQty: row.requireQty,
        revisionNo: row.revisionNo,
        unit: row.unit
      }));
      const enquirySummaryVO = enquirySummaryDTO.map((row) => ({
        ...(editId && { id: row.id }),
        additionalManPower: row.additionalManPower,
        anyAdditionalInverstment: row.anyAdditionalInverstment,
        conclusion: row.conclusion,
        detailReview: row.detailReview,
        expectedTimeForDeliverySample: dayjs(row.expectedTimeForDeliverySample).format('YYYY-MM-DD'),
        initialReviewComments: row.initialReviewComments,
        regularProduction: row.regularProduction,
        remarks: row.remarks,
        timeFrame: row.timeFrame
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        contactName: formData.contactName,
        contactNo: formData.contactNo,
        createdBy: loginUserName,
        customer: formData.customer,
        customerCode: formData.customerCode,
        enquiryDetailsDTO: enquiryVO,
        enquiryDueDate: dayjs(formData.enquiryDueDate).format('YYYY-MM-DD'),
        enquirySummaryDTO: enquirySummaryVO,
        enquiryType: formData.enquiryType,
        orgId: orgId
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', '/customerenquiry/createUpdateEnquiry', saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Customer Enquiry updated successfully' : 'Customer Enquiry created successfully');
          getAllEnquiryByOrgId();
          handleClear();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Customer Enquiry creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Customer Enquiry creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
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
                    id="customerEnquiryNo"
                    label="Customer Enquiry No"
                    name="customerEnquiryNo"
                    size="small"
                    disabled
                    value={formData.customerEnquiryNo}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.customerEnquiryNo}
                    helperText={fieldErrors.customerEnquiryNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Enquiry Date"
                      disabled
                      value={formData.enquiryDate ? dayjs(formData.enquiryDate, 'YYYY-MM-DD') : null}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.enquiryType}>
                  <InputLabel id="enquiryType">Enquiry Type</InputLabel>
                  <Select
                    labelId="enquiryType"
                    id="enquiryType"
                    label="Enquiry Type"
                    onChange={handleInputChange}
                    name="enquiryType"
                    value={formData.enquiryType}
                  >
                    <MenuItem value="CALL">CALL</MenuItem>
                    <MenuItem value="MEETING">MEETING</MenuItem>
                    <MenuItem value="E-MAIL">E-MAIL</MenuItem>
                  </Select>
                  {fieldErrors.enquiryType && <FormHelperText>{fieldErrors.enquiryType}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={companyList.map((option, index) => ({ ...option, key: index }))}
                  getOptionLabel={(option) => option.customer || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.customer ? companyList.find((c) => c.customer === formData.customer) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'customer',
                        value: newValue ? newValue.customer : ''
                      }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer"
                      name="customer"
                      error={!!fieldErrors.customer}
                      helperText={fieldErrors.customer}
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="customerCode"
                    label="Customer Code"
                    name="customerCode"
                    size="small"
                    disabled
                    value={formData.customerCode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.customerCode}
                    helperText={fieldErrors.customerCode}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Enquiry Due Date"
                      value={formData.enquiryDueDate ? dayjs(formData.enquiryDueDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('enquiryDueDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.enquiryDueDate}
                      helperText={fieldErrors.enquiryDueDate ? fieldErrors.enquiryDueDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={contactNameList.map((option, index) => ({ ...option, key: index }))}
                  getOptionLabel={(option) => option.contactName || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.contactName ? contactNameList.find((c) => c.contactName === formData.contactName) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'contactName',
                        value: newValue ? newValue.contactName : ''
                      }
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Contact Name"
                      name="contactName"
                      error={!!fieldErrors.contactName}
                      helperText={fieldErrors.contactName}
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 }
                      }}
                    />
                  )}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="contactNo"
                    label="Contact No"
                    name="contactNo"
                    size="small"
                    disabled
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.contactNo}
                    helperText={fieldErrors.contactNo}
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
                  <Tab value={0} label="Enquiry Details" />
                  <Tab value={1} label="Enquiry Summary" />
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
                                    Part Code
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Part Description
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Drawing No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Revision No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Unit
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Require Qty
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Delivery Date
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Remarks
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {enquiryDetailsData.map((row, index) => {
                                  const availablePartCodes = partCodeList.filter(
                                    (option) => !enquiryDetailsData.some((data) => data.partCode === option.partNo && data.id !== row.id)
                                  );
                                  return (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              enquiryDetailsData,
                                              setEnquiryDetailsData,
                                              enquiryDetailsErrors,
                                              setEnquiryDetailsErrors
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
                                          options={availablePartCodes.map((option, index) => ({ ...option, key: index }))}
                                          getOptionLabel={(option) => option.partNo || ''}
                                          sx={{ width: '100%' }}
                                          size="small"
                                          value={partCodeList.find((c) => c.partNo === row.partCode) || null}
                                          onChange={(event, newValue) => {
                                            const selectedPartCode = newValue ? newValue.partNo : '';
                                            const selectedPartDescription = newValue ? newValue.partDescription : '';
                                            const selectedPartUnit = newValue ? newValue.unit : '';
                                            setEnquiryDetailsData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      partCode: selectedPartCode,
                                                      partDescription: selectedPartDescription,
                                                      unit: selectedPartUnit
                                                    }
                                                  : r
                                              )
                                            );
                                            getDrawingNoAndRevisionNo(selectedPartCode, row.id);
                                            setEnquiryDetailsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partCode: !selectedPartCode ? 'Part Code is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Part Code"
                                              name="partCode"
                                              error={!!enquiryDetailsErrors[index]?.partCode}
                                              helperText={enquiryDetailsErrors[index]?.partCode}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 40, width: 200 }
                                              }}
                                            />
                                          )}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.partDescription}
                                          readOnly
                                          className="form-control"
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <Autocomplete
                                          disablePortal
                                          options={(row.drawingNoList || []).map((option, index) => ({ ...option, key: index }))}
                                          getOptionLabel={(option) => option.drawingNo || ''}
                                          sx={{ width: '100%' }}
                                          size="small"
                                          value={(row.drawingNoList || []).find((c) => c.drawingNo === row.drawingNo) || null}
                                          onChange={(event, newValue) => {
                                            const selectedDrawingNo = newValue ? newValue.drawingNo : '';
                                            const selectedRevisionNo = newValue ? newValue.revisionNo : '';

                                            setEnquiryDetailsData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      drawingNo: selectedDrawingNo,
                                                      revisionNo: selectedRevisionNo
                                                    }
                                                  : r
                                              )
                                            );

                                            setEnquiryDetailsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                drawingNo: !selectedDrawingNo ? 'Drawing No is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Drawing No"
                                              name="drawingNo"
                                              error={!!enquiryDetailsErrors[index]?.drawingNo}
                                              helperText={enquiryDetailsErrors[index]?.drawingNo}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 40, width: 200 }
                                              }}
                                            />
                                          )}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.revisionNo}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setEnquiryDetailsData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, revisionNo: value } : r))
                                            );
                                            setEnquiryDetailsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                revisionNo: !value ? 'Revision No is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={enquiryDetailsErrors[index]?.revisionNo ? 'error form-control' : 'form-control'}
                                        />
                                        {enquiryDetailsErrors[index]?.revisionNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {enquiryDetailsErrors[index].revisionNo}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.unit}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setEnquiryDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r)));
                                            setEnquiryDetailsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unit: !value ? 'Unit is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={enquiryDetailsErrors[index]?.unit ? 'error form-control' : 'form-control'}
                                        />
                                        {enquiryDetailsErrors[index]?.unit && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {enquiryDetailsErrors[index].unit}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="number"
                                          value={row.requireQty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setEnquiryDetailsData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, requireQty: value } : r))
                                            );
                                            setEnquiryDetailsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                requireQty: !value ? 'Require Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={enquiryDetailsErrors[index]?.requireQty ? 'error form-control' : 'form-control'}
                                        />
                                        {enquiryDetailsErrors[index]?.requireQty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {enquiryDetailsErrors[index].requireQty}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="date"
                                          value={row.deliveryDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setEnquiryDetailsData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? { ...r, deliveryDate: date, endDate: date > r.endDate ? '' : r.endDate }
                                                  : r
                                              )
                                            );

                                            setEnquiryDetailsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                deliveryDate: !date ? 'Delivery Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={enquiryDetailsErrors[index]?.deliveryDate ? 'error form-control' : 'form-control'}
                                        />
                                        {enquiryDetailsErrors[index]?.deliveryDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {enquiryDetailsErrors[index].deliveryDate}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.remarks}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setEnquiryDetailsData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                            );
                                            setEnquiryDetailsErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                remarks: !value ? 'Remarks is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={enquiryDetailsErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                        />
                                        {enquiryDetailsErrors[index]?.remarks && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {enquiryDetailsErrors[index].remarks}
                                          </div>
                                        )}
                                      </td>
                                    </tr>
                                  );
                                })}
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
                    {enquirySummaryDTO.map((row, index) => (
                      <div key={row.id}>
                        <div className="row d-flex">
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="anyAdditionalInverstment"
                                label="Any Additional Investment"
                                name="anyAdditionalInverstment"
                                size="small"
                                type="number"
                                inputProps={{ maxLength: 30 }}
                                value={enquirySummaryDTO[index]?.anyAdditionalInverstment || ''}
                                onChange={(e) => handleInputChange(e, 'enquirySummaryDTO', index)}
                                error={!!enquirySummaryErrors[index]?.anyAdditionalInverstment}
                                helperText={enquirySummaryErrors[index]?.anyAdditionalInverstment || ''}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="additionalManPower"
                                label="Additional Man Power"
                                name="additionalManPower"
                                size="small"
                                inputProps={{ maxLength: 30 }}
                                value={enquirySummaryDTO[index]?.additionalManPower || ''}
                                onChange={(e) => handleInputChange(e, 'enquirySummaryDTO', index)}
                                error={!!enquirySummaryErrors[index]?.additionalManPower}
                                helperText={enquirySummaryErrors[index]?.additionalManPower || ''}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="timeFrame"
                                label="Time Frame"
                                name="timeFrame"
                                size="small"
                                inputProps={{ maxLength: 30 }}
                                value={enquirySummaryDTO[index]?.timeFrame || ''}
                                onChange={(e) => handleInputChange(e, 'enquirySummaryDTO', index)}
                                error={!!enquirySummaryErrors[index]?.timeFrame}
                                helperText={enquirySummaryErrors[index]?.timeFrame || ''}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  label="Expected Time For Delivery Sample"
                                  value={
                                    enquirySummaryDTO[index]?.expectedTimeForDeliverySample
                                      ? dayjs(enquirySummaryDTO[index]?.expectedTimeForDeliverySample, 'YYYY-MM-DD')
                                      : null
                                  }
                                  onChange={(date) => handleDateChange('expectedTimeForDeliverySample', date, index)}
                                  slotProps={{
                                    textField: { size: 'small', clearable: true }
                                  }}
                                  format="DD-MM-YYYY"
                                  error={!!fieldErrors.expectedTimeForDeliverySample}
                                  helperText={fieldErrors.expectedTimeForDeliverySample ? fieldErrors.expectedTimeForDeliverySample : ''}
                                />
                              </LocalizationProvider>
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="regularProduction"
                                label="Regular Production"
                                name="regularProduction"
                                size="small"
                                inputProps={{ maxLength: 30 }}
                                value={enquirySummaryDTO[index]?.regularProduction || ''}
                                onChange={(e) => handleInputChange(e, 'enquirySummaryDTO', index)}
                                error={!!enquirySummaryErrors[index]?.regularProduction}
                                helperText={enquirySummaryErrors[index]?.regularProduction || ''}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="initialReviewComments"
                                label="Initial Review Comments (Director Operator)"
                                name="initialReviewComments"
                                size="small"
                                inputProps={{ maxLength: 30 }}
                                value={enquirySummaryDTO[index]?.initialReviewComments || ''}
                                onChange={(e) => handleInputChange(e, 'enquirySummaryDTO', index)}
                                error={!!enquirySummaryErrors[index]?.initialReviewComments}
                                helperText={enquirySummaryErrors[index]?.initialReviewComments || ''}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="detailReview"
                                label="Detail Review (Director Technical)"
                                name="detailReview"
                                size="small"
                                inputProps={{ maxLength: 30 }}
                                value={enquirySummaryDTO[index]?.detailReview || ''}
                                onChange={(e) => handleInputChange(e, 'enquirySummaryDTO', index)}
                                error={!!enquirySummaryErrors[index]?.detailReview}
                                helperText={enquirySummaryErrors[index]?.detailReview || ''}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="conclusion"
                                label="Conclusion"
                                name="conclusion"
                                size="small"
                                inputProps={{ maxLength: 30 }}
                                value={enquirySummaryDTO[index]?.conclusion || ''}
                                onChange={(e) => handleInputChange(e, 'enquirySummaryDTO', index)}
                                error={!!enquirySummaryErrors[index]?.conclusion}
                                helperText={enquirySummaryErrors[index]?.conclusion || ''}
                              />
                            </FormControl>
                          </div>
                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="remarks"
                                label="Remarks"
                                name="remarks"
                                size="small"
                                inputProps={{ maxLength: 30 }}
                                value={enquirySummaryDTO[index]?.remarks || ''}
                                onChange={(e) => handleInputChange(e, 'enquirySummaryDTO', index)}
                                error={!!enquirySummaryErrors[index]?.remarks}
                                helperText={enquirySummaryErrors[index]?.remarks || ''}
                              />
                            </FormControl>
                          </div>
                        </div>
                      </div>
                    ))}
                  </>
                )}
              </Box>
            </div>
          </>
        ) : (
          <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getEnquiryById} />
        )}
      </div>
    </div>
  );
};

export default Enquiry;
