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

const Enquiry = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();

  const [formData, setFormData] = useState({
    customerEnquiryNo: '',
    enquiryDate: null,
    enquiryType: '',
    customer: '',
    customerCode: '',
    enquiryDueDate: null,
    contactName: '',
    contactNo: '',
    anyAdditionalInv: '',
    additionalManPower: '',
    timeFrame: '',
    expectTimeForDelSample: '',
    regularProduction: '',
    initialReviewComments: '',
    detailReview: '',
    conclusion: '',
    enquiryRemarks: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    customerEnquiryNo: '',
    enquiryDate: null,
    enquiryType: '',
    customer: '',
    customerCode: '',
    enquiryDueDate: null,
    contactName: '',
    contactNo: '',
    anyAdditionalInv: '',
    additionalManPower: '',
    timeFrame: '',
    expectTimeForDelSample: '',
    regularProduction: '',
    initialReviewComments: '',
    detailReview: '',
    conclusion: '',
    enquiryRemarks: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [enquiryDetailsData, setEnquiryDetailsData] = useState([
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
      { partCode: '', partDescription: '', drawingNo: '', revisionNo: '', unit: '', requireQty: '', deliveryDate: null, remarks: '' }
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === enquiryDetailsData) {
      return (
        !lastRow.partCode ||
        !lastRow.partDescription ||
        !lastRow.drawingNo ||
        !lastRow.revisionNo ||
        !lastRow.unit ||
        !lastRow.requireQty ||
        !lastRow.deliveryDate ||
        !lastRow.remarks
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
          drawingNo: !table[table.length - 1].drawingNo ? 'Drawing No is required' : '',
          revisionNo: !table[table.length - 1].revisionNo ? 'Revision No is required' : '',
          unit: !table[table.length - 1].unit ? 'Unit is required' : '',
          requireQty: !table[table.length - 1].requireQty ? 'Require Qty is required' : '',
          deliveryDate: !table[table.length - 1].deliveryDate ? 'Delivery Date is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : ''
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
      customerEnquiryNo: '',
      enquiryDate: null,
      enquiryType: '',
      customer: '',
      customerCode: '',
      enquiryDueDate: null,
      contactName: '',
      contactNo: '',
      anyAdditionalInv: '',
      additionalManPower: '',
      timeFrame: '',
      expectTimeForDelSample: '',
      regularProduction: '',
      initialReviewComments: '',
      detailReview: '',
      conclusion: '',
      enquiryRemarks: ''
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
    setEnquiryDetailsErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.customerEnquiryNo) errors.customerEnquiryNo = 'Customer Enquiry No is required';
    if (!formData.enquiryDate) errors.enquiryDate = 'Enquiry Date is required';
    if (!formData.enquiryType) errors.enquiryType = 'Enquiry Type is required';
    if (!formData.customer) errors.customer = 'Customer is required';
    if (!formData.customerCode) errors.customerCode = 'Customer Code is required';
    if (!formData.enquiryDueDate) errors.enquiryDueDate = 'Enquiry Due Date is required';
    if (!formData.contactName) errors.contactName = 'Contact Name is required';
    if (!formData.contactNo) errors.contactNo = 'Contact No is required';
    if (!formData.anyAdditionalInv) errors.anyAdditionalInv = 'Any Additional Inv is required';
    if (!formData.additionalManPower) errors.additionalManPower = 'Additional Man Power is required';
    if (!formData.timeFrame) errors.timeFrame = 'Time Frame is required';
    if (!formData.expectTimeForDelSample) errors.expectTimeForDelSample = 'Expected Time For Del Sample is required';
    if (!formData.regularProduction) errors.regularProduction = 'Regular Production is required';
    if (!formData.initialReviewComments) errors.initialReviewComments = 'Initial Review Comments is required';
    if (!formData.detailReview) errors.detailReview = 'Detail Review is required';
    if (!formData.conclusion) errors.conclusion = 'Conclusion is required';
    if (!formData.enquiryRemarks) errors.enquiryRemarks = 'Remarks is required';

    let enquiryDetailsDataValid = true;
    if (!enquiryDetailsData || !Array.isArray(enquiryDetailsData) || enquiryDetailsData.length === 0) {
      enquiryDetailsDataValid = false;
      setEnquiryDetailsErrors([{ general: 'Enquiry Details Data is required' }]);
    } else {
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
        if (!row.revisionNo) {
          rowErrors.revisionNo = 'Revision No is required';
          enquiryDetailsDataValid = false;
        }
        if (!row.unit) {
          rowErrors.unit = 'Unit is required';
          enquiryDetailsDataValid = false;
        }
        if (!row.requireQty) {
          rowErrors.requireQty = 'Require Qty is required';
          enquiryDetailsDataValid = false;
        }
        if (!row.deliveryDate) {
          rowErrors.deliveryDate = 'Delivery Date is required';
          enquiryDetailsDataValid = false;
        }
        if (!row.remarks) {
          rowErrors.remarks = 'Remarks is required';
          enquiryDetailsDataValid = false;
        }

        return rowErrors;
      });
      setEnquiryDetailsErrors(newTableErrors);
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && enquiryDetailsDataValid) {
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
  //       setEnquiryDetailsData(
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
                    id="customerEnquiryNo"
                    label="Customer Enquiry No"
                    name="customerEnquiryNo"
                    size="small"
                    value={formData.customerEnquiryNo}
                    onChange={handleInputChange}
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
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.enquiryType && <FormHelperText>{fieldErrors.enquiryType}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customer}>
                  <InputLabel id="customer">Customer</InputLabel>
                  <Select
                    labelId="customer"
                    id="customer"
                    label="Customer"
                    onChange={handleInputChange}
                    name="customer"
                    value={formData.customer}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.customer && <FormHelperText>{fieldErrors.customer}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="customerCode"
                    label="Customer Code"
                    name="customerCode"
                    size="small"
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.contactName}>
                  <InputLabel id="contactName">Contact Name</InputLabel>
                  <Select
                    labelId="contactName"
                    id="contactName"
                    label="Contact Name"
                    onChange={handleInputChange}
                    name="contactName"
                    value={formData.contactName}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.contactName && <FormHelperText>{fieldErrors.contactName}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="contactNo"
                    label="Contact No"
                    name="contactNo"
                    size="small"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.contactNo}
                    helperText={fieldErrors.contactNo}
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
                                {enquiryDetailsData.map((row, index) => (
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
                                        value={row.partCode}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setEnquiryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, partCode: value } : r))
                                          );
                                          setEnquiryDetailsErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              partCode: !value ? 'Part Code is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={enquiryDetailsErrors[index]?.partCode ? 'error form-control' : 'form-control'}
                                      />
                                      {enquiryDetailsErrors[index]?.partCode && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {enquiryDetailsErrors[index].partCode}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.partDescription}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setEnquiryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, partDescription: value } : r))
                                          );
                                          setEnquiryDetailsErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              partDescription: !value ? 'Part Description is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={enquiryDetailsErrors[index]?.partDescription ? 'error form-control' : 'form-control'}
                                      />
                                      {enquiryDetailsErrors[index]?.partDescription && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {enquiryDetailsErrors[index].partDescription}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.drawingNo}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setEnquiryDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, drawingNo: value } : r))
                                          );
                                          setEnquiryDetailsErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              drawingNo: !value ? 'Drawing No is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={enquiryDetailsErrors[index]?.drawingNo ? 'error form-control' : 'form-control'}
                                      />
                                      {enquiryDetailsErrors[index]?.drawingNo && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {enquiryDetailsErrors[index].drawingNo}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.revisionNo}
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
                                        type="text"
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
                                              r.id === row.id ? { ...r, deliveryDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
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
                                        // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
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
                            id="anyAdditionalInv"
                            label="Any Additional Investment"
                            name="anyAdditionalInv"
                            size="small"
                            value={formData.anyAdditionalInv}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.anyAdditionalInv}
                            helperText={fieldErrors.anyAdditionalInv}
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
                            value={formData.additionalManPower}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.additionalManPower}
                            helperText={fieldErrors.additionalManPower}
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
                            value={formData.timeFrame}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.timeFrame}
                            helperText={fieldErrors.timeFrame}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Expected Time For Delivery Sample"
                              value={formData.expectTimeForDelSample ? dayjs(formData.expectTimeForDelSample, 'YYYY-MM-DD') : null}
                              onChange={(date) => handleDateChange('expectTimeForDelSample', date)}
                              slotProps={{
                                textField: { size: 'small', clearable: true }
                              }}
                              format="DD-MM-YYYY"
                              error={!!fieldErrors.expectTimeForDelSample}
                              helperText={fieldErrors.expectTimeForDelSample ? fieldErrors.expectTimeForDelSample : ''}
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
                            value={formData.regularProduction}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.regularProduction}
                            helperText={fieldErrors.regularProduction}
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
                            value={formData.initialReviewComments}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.initialReviewComments}
                            helperText={fieldErrors.initialReviewComments}
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
                            value={formData.detailReview}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.detailReview}
                            helperText={fieldErrors.detailReview}
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
                            value={formData.conclusion}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.conclusion}
                            helperText={fieldErrors.conclusion}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="enquiryRemarks"
                            label="Remarks"
                            name="enquiryRemarks"
                            size="small"
                            value={formData.enquiryRemarks}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.enquiryRemarks}
                            helperText={fieldErrors.enquiryRemarks}
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

export default Enquiry;
