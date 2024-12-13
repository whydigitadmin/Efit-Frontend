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

const IssueToSubContractor = () => {
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
  const [departmentList, setDepartmentList] = useState([]);

  const [partyList, setPartyList] = useState([
    {    partyname:"one2121"  }
  ]);
  const [currencies, setCurrencies] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    docDate: dayjs(),
    docId: '',
    routeCardNo: 'Route Card No',
    customerName: 'Customer Name',
    department: 'Department',
    status: '',
    orgId: orgId,
    narration: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    active: true,
    docDate: new Date(),
    docId: '',
    routeCardNo: '',
    customerName: '',
    department: '',
    status: '',
    orgId: orgId,
    narration: "",
  });
  const [listViewData, setListViewData] = useState([]);
  const listViewColumns = [
    { accessorKey: 'docId', header: 'SC Issue No', size: 140 },
    { accessorKey: 'docDate', header: 'Doc Date', size: 140 },
    { accessorKey: 'routeCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'customerName', header: 'Customer Name', size: 140 },
    { accessorKey: 'department', header: 'Department', size: 140 },
    { accessorKey: 'status', header: 'Status', size: 140 },
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      item: '	Item',
      itemDescription: 'itemDescription',
      process: 'Process',
      quantity: '',
      remarks: '',
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      id: 1,
      item: '',
      itemDescription: '',
      process: '',
      quantity: '',
      remarks: '',
    }
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const CurrencyData = await getAllActiveCurrency(orgId);
        setCurrencies(CurrencyData);
        console.log('Currency', CurrencyData);
      } catch (error) {
        console.error('Error fetching country data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const totalDebit = detailsTableData.reduce((sum, row) => sum + Number(row.quantity || 0), 0);
    const totalCredit = detailsTableData.reduce((sum, row) => sum + Number(row.unit || 0), 0);

    setFormData((prev) => ({
      ...prev,
      // narration: totalCredit
    }));
  }, [detailsTableData]);

  // Department
  useEffect(() => {
    getDepartmentNames();
  }, []);
  const getDepartmentNames = async () => {
    try {
      const response = await apiCalls('get', `/issuetosubcontractor/getDepartmentName?orgId=${orgId}`);
      if (response.status === true && response.paramObjectsMap.routeCardVO) {
        const departmentData = response.paramObjectsMap.routeCardVO.map(({ departmentName }) => ({
          departmentName,
        }));
        setDepartmentList(departmentData);
        return departmentData;
      } else {
        console.error('API Error:', response);
        return [];
      }
    } catch (error) {
      console.error('Error fetching department names:', error);
      return [];
    }
  };

  const getIssueToSubContractorById = async (row) => {
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/issuetosubcontractor/getIssueToSubContractorById?id=${row.original.id}`);
  
      if (result) {
        const IssToSubContra = result.paramObjectsMap.issueToSubContractorVO[0];
        setEditId(row.original.id);
  
        setFormData({
          id: IssToSubContra.id,
          docId: IssToSubContra.docId,  
          docDate: IssToSubContra.docDate ? dayjs(IssToSubContra.docDate, 'YYYY-MM-DD') : dayjs(),
          routeCardNo: IssToSubContra.routeCardNo,
          customerName: IssToSubContra.customerName,
          department: IssToSubContra.department,
          status: IssToSubContra.status,
          narration: IssToSubContra.narration,
          orgId: orgId,
          createdBy: loginUserName,
        });
  
        // Update details table data
        setDetailsTableData(
          IssToSubContra.issueItemDetailsVO.map((row) => ({
            id: row.id,
            item: row.item,
            itemDescription: row.itemDescription,
            process: row.process,
            quantity: row.quantity,
            remarks: row.remarks,
          }))
        );
  
        console.log('DataToEdit', IssToSubContra);
      } else { 
        console.error('No data received for the given ID');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  const handleDebitChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, quantity: value, unit: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          quantity: !value ? 'Quantity is Required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleCreditChange = (e, row, index) => {
    const value = e.target.value;

    if (/^\d{0,20}$/.test(value)) {
      setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, unit: value, quantity: value ? '0' : '' } : r)));

      setDetailsTableErrors((prev) => {
        const newErrors = [...prev];
        newErrors[index] = {
          ...newErrors[index],
          unit: !value ? 'Credit Amount is Required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    let errorMessage = '';

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      setFormData({ ...formData, [name]: value.toUpperCase() });

      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Preserve the cursor position for text-based inputs
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
    // const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      docId: '',
      routeCardNo: '',
      customerName: '',
      department: '',
      status: '',
      orgId: orgId,
      narration: "",
    });
    getIssueToSubContractorDocId()
    getAllActiveCurrency(orgId);
    setFieldErrors({
      docDate: dayjs(),
      docId: '',
      routeCardNo: '',
      customerName: '',
      department: '',
      status: '',
      orgId: orgId,
      narration: "",
    });
    setDetailsTableData([
      { id: 1, item: '', unit: '', process: '', itemDescription: '', quantity: '', remarks: '', }
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
      item: '',
      unit: '',
      process: '',
      itemDescription: '',
      quantity: '',
      remarks: '',
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { item: '', unit: '', quantity: '', remarks: '', }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;
    if (!lastRow) return false;
    if (table === detailsTableData) {
      return (
        !lastRow.item ||
        !lastRow.unit ||
        !lastRow.remarks ||
        // !lastRow.process ||
        !lastRow.itemDescription ||
        !lastRow.quantity ||
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

        // Add error messages for Required fields
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !lastRow.item ? 'Part Number is Required' : '',
          unit: !lastRow.unit ? 'Unit is Required' : '',
          remarks: !lastRow.remarks ? 'Unit Price is Required' : '',
          process: !lastRow.process ? 'process  is Required' : '',
          // itemDescription: !lastRow.itemDescription ? 'Part Description is Required' : '',
          // quantity: !lastRow.quantity ? 'Revision Number is Required' : '',
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

      // Update both table data and error state
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
    getIssueToSubContractorDocId();
  }, []);

  useEffect(() => {
    getAllIssueToSubContractorByOrgId();
  }, []);
  const getAllIssueToSubContractorByOrgId = async () => {
    try {
      const response = await apiCalls('get', `/issuetosubcontractor/getAllIssueToSubContractorByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setListViewData(response.paramObjectsMap.issueToSubContractorVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getIssueToSubContractorDocId = async () => {
    try {
      const response = await apiCalls('get', `/issuetosubcontractor/getIssueToSubContractorDocId?orgId=${orgId}`);
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.issueToSubContractorDocId,
      }));
    } catch (error) {
      console.error('Error fetching departmentDocId:', error);
    }
  };
  const handleSave = async () => {
    const errors = {};
    let isValid = true;
    if (!formData.routeCardNo) errors.routeCardNo = 'Route Card No is Required';
    if (!formData.department) errors.department = 'Department is Required';
    if (!formData.status) errors.status = 'Status is Required';
    if (!formData.narration) errors.narration = 'Narration is Required';



    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};

      if (!formData.process) {
        errors.process = 'Process is Required';
        isValid = false;
      }
      if (!row.quantity) {
        rowErrors.quantity = 'Quantity  is Required';
        detailTableDataValid = false;
      }
      if (!row.remarks) {
        rowErrors.remarks = 'Remarks is Required';
        detailTableDataValid = false;
      }


      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const IssueSubContractVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        item: row.item,
        itemDescription: row.itemDescription,
        process: row.process,
        quantity: row.quantity,
        remarks: row.remarks,
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        orgId: orgId,
        createdBy: loginUserName,
        issueItemDetailsDTO: IssueSubContractVO,
        routeCardNo: formData.routeCardNo,
        customerName: formData.customerName,
        department: formData.department,
        status: formData.status,
        narration: formData.narration,
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/issuetosubcontractor/createUpdateIssueToSubContractor`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Issue To Sub Contractor Updated Successfully' : 'Issue To Sub Contractor Created successfully');

          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Issue To Sub Contractor creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Issue To Sub Contractor creation failed');
      }
    } else {
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
                    id="outlined-textarea-zip"
                    label="SC Issue No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    value={formData.docId}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="SC Issue Date"
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
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.routeCardNo ? partyList.find((c) => c.partyname === formData.routeCardNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'routeCardNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Route Card No"
                        name="routeCardNo"
                        error={!!fieldErrors.routeCardNo}
                        helperText={fieldErrors.routeCardNo}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Customer Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={departmentList}
                    getOptionLabel={(option) => option.departmentName}
                    sx={{ width: '100%' }}
                    size="small"
                    value={
                      formData.department
                        ? departmentList.find((c) => c.departmentName === formData.department)
                        : null
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'department',
                          value: newValue ? newValue.departmentName : '',
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Department"
                        name="department"
                        error={!!fieldErrors.department}
                        helperText={fieldErrors.department}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Status"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.status}
                    helperText={fieldErrors.status}
                  />
                </div>
              </div>
              {/* <div className='row'>
              <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Status"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 10 }}
                    error={!!fieldErrors.status}
                    helperText={fieldErrors.status}
                  />
                </div>
              </div> */}
              <div className="row mt-2">
                <Box sx={{ width: '100%' }}>
                  <Tabs
                    value={value}
                    onChange={handleChange}
                    textColor="secondary"
                    indicatorColor="secondary"
                    aria-label="secondary tabs example"
                  >
                    <Tab value={0} label="Issue Item Details" />
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
                                    <th className="table-header">Item</th>
                                    <th className="table-header">Item Description</th>
                                    <th className="table-header">Process</th>
                                    <th className="table-header">Quantity</th>
                                    <th className="table-header">Remarks</th>
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
                                      <td>
                                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.item}>
                                          <InputLabel id="item">Item</InputLabel>
                                          <Select
                                            labelId="item"
                                            id="item"
                                            label="Item"
                                            onChange={handleInputChange}
                                            name="item"
                                            value={formData.item}
                                            style={{ width: '200px' }}
                                          // disabled
                                          >
                                            <MenuItem value="FG">FG</MenuItem>
                                            <MenuItem value="SFG">SFG</MenuItem>
                                            <MenuItem value="Raw Material">Raw Material</MenuItem>
                                          </Select>
                                          {fieldErrors.item && <FormHelperText>{fieldErrors.item}</FormHelperText>}
                                        </FormControl>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.itemDescription}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, itemDescription: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemDescription: !value ? 'Sub Ledger Name is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.itemDescription ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                          disabled
                                        />
                                        {detailsTableErrors[index]?.itemDescription && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].itemDescription}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <Autocomplete
                                          disablePortal
                                          options={partyList.map((option, index) => ({ ...option, key: index }))}
                                          getOptionLabel={(option) => option.partyname}
                                          sx={{ width: '100%' }}
                                          size="small"
                                          value={formData.process ? partyList.find((c) => c.partyname === formData.process) : null}
                                          onChange={(event, newValue) => {
                                            handleInputChange({
                                              target: {
                                                name: 'process',
                                                value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                                              },
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Process"
                                              name="process"
                                              error={!!fieldErrors.process}  // Shows red border if there's an error
                                              helperText={fieldErrors.process}  // Shows the error message
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 40, width: 200 },
                                              }}
                                            />
                                          )}
                                        />
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.quantity}
                                          onChange={(e) => handleDebitChange(e, row, index)}
                                          maxLength="20"
                                          className={detailsTableErrors[index]?.quantity ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {detailsTableErrors[index]?.quantity && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].quantity}
                                          </div>
                                        )}
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
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                remarks: !value ? 'remarks is Required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                          style={{ width: '150px' }}
                                        />
                                        {detailsTableErrors[index]?.remarks && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].remarks}
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
                        <div className="col-md-8 mb-3">
                          <TextField
                            id="outlined-textarea-zip"
                            label="Narration"
                            variant="outlined"
                            size="small"
                            fullWidth
                            name="narration"
                            value={formData.narration}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 10 }}
                            error={!!fieldErrors.narration}
                            helperText={fieldErrors.narration}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getIssueToSubContractorById} />
          )}
        </div>
      </div>
    </>
  );
};
export default IssueToSubContractor;
