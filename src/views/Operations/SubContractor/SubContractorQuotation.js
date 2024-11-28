import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import DeleteIcon from '@mui/icons-material/Delete';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import apiCalls from 'apicall';
import dayjs from 'dayjs';
import { useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
// import { getAllActiveBranches, getAllActiveRoles } from 'utils/CommonFunctions';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';
import { encryptPassword } from 'views/utilities/passwordEnc';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { toast } from 'react-toastify';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const SubContractorQuotation = () => {
  const [listViewData, setListViewData] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [partyList, setPartyList] = useState([]);
  const [listView, setListView] = useState(false);
  const [lstView, setLstView] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    scQuotationDate: '',
    enquiryNo: '',
    enquiryDate: '',
    subContractorId: '',
    subContractorName: '',
    validTill: '',
    taxCode: '',
    routeCardNo: '',
    contactPerson: '',
    contactNo: '',
    scIssueNo: '',
    orgId: orgId
  });

  const [fieldErrors, setFieldErrors] = useState({
    scQuotationDate: '',
    enquiryNo: '',
    enquiryDate: '',
    subContractorId: '',
    subContractorName: '',
    validTill: '',
    taxCode: '',
    routeCardNo: '',
    contactPerson: '',
    contactNo: '',
    scIssueNo: '',
    orgId: orgId
  });

  const listViewColumns = [
    { accessorKey: 'scQuotationDate', header: 'SC Quotation Date', size: 140 },
    { accessorKey: 'enquiryNo', header: 'Enquiry No', size: 140 },
    { accessorKey: 'enquiryDate', header: 'Enquiry Date', size: 140 },
    { accessorKey: 'subContractorId', header: 'Sub Contractor Id', size: 140 },
    { accessorKey: 'subContractorName', header: 'Sub Contractor Name', size: 140 },
    { accessorKey: 'validTill', header: 'Valid Till', size: 140 },
    { accessorKey: 'taxCode', header: 'Tax Code', size: 140 },
    { accessorKey: 'routeCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'contactPerson', header: 'Contact Person', size: 140 },
    { accessorKey: 'contactNo', header: 'Contact No', size: 140 },
    { accessorKey: 'scIssueNo', header: 'SC Issue No', size: 140 },
  ];

  const [scQuotationData, setScQuotationData] = useState([
    {
      id: 1,
      part: '',
      partDescription: '',
      process: '',
      qty: '',
      rate: '',
      amount: '',
      discount: '',
      discountAmount: '',
      tax: '',
      quotationAmount: '',
      deliveryDate: '',
    }
  ]);
  const [scQuotationErrors, setScQuotationErrors] = useState([
    {
      part: '',
      partDescription: '',
      process: '',
      qty: '',
      rate: '',
      amount: '',
      discount: '',
      discountAmount: '',
      tax: '',
      quotationAmount: '',
      deliveryDate: '',
    }
  ]);

  const [quotationTaxData, setQuotationTaxData] = useState([
    {
      id: 1,
      grossAmount: '',
      netAmount: '',
      amountInWords: '',
      narration: ''
    }
  ]);
  const [quotationTaxErrors, setQuotationTaxErrors] = useState([
    {
      grossAmount: '',
      netAmount: '',
      amountInWords: '',
      narration: ''
    }
  ]);

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    if (name === 'indentNo' || name === 'customerPONo') {
      if (!/^\d*$/.test(value)) {
        return;
      }
      setFormData({ ...formData, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value.toUpperCase() });
    }

    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
    }

    setFieldErrors({ ...fieldErrors, [name]: '' });

    if (type === 'text' || type === 'textarea') {
      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement && inputElement.setSelectionRange) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
    const inputValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: inputValue });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };


  // const getAllRoles = async () => {
  //   try {
  //     const branchData = await getAllActiveRoles(orgId);
  //     setRoleList(branchData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };
  // const getAllBranches = async () => {
  //   try {
  //     const branchData = await getAllActiveBranches(orgId);
  //     setBranchList(branchData);
  //   } catch (error) {
  //     console.error('Error fetching country data:', error);
  //   }
  // };

  // const getAllUsers = async () => {
  //   try {
  //     const response = await apiCalls('get', `/master/getAllEmployeeByOrgId?orgId=${orgId}`);
  //     console.log('API Response:', response);

  //     if (response.status === true) {
  //       setEmpList(response.paramObjectsMap.employeeVO);
  //     } else {
  //       console.error('API Error:', response);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  // const getAllUserCreation = async () => {
  //   try {
  //     const response = await apiCalls('get', `/auth/allUsersByOrgId?orgId=${orgId}`);
  //     console.log('API Response:', response);

  //     if (response.status === true) {
  //       setListViewData(response.paramObjectsMap.userVO);
  //     } else {
  //       console.error('API Error:', response);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };


  const handleSave = async () => {
    const errors = {};

    if (!formData.scQuotationDate) {
      errors.scQuotationDate = 'SC Quotation Date is required';
    }
    if (!formData.enquiryNo) {
      errors.enquiryNo = 'Enquiry No is required';
    }
    if (!formData.enquiryDate) {
      errors.enquiryDate = 'Enquiry Date is required';
    }
    if (!formData.subContractorId) {
      errors.subContractorId = 'Sub Contractor Id is required';
    }
    if (!formData.subContractorName) {
      errors.subContractorName = 'Sub Contractor Name is required';
    }
    if (!formData.validTill) {
      errors.validTill = 'validTill is required';
    }
    if (!formData.taxCode) {
      errors.taxCode = 'Tax Code is required';
    }
    if (!formData.routeCardNo) {
      errors.routeCardNo = 'Route Card No is required';
    }
    if (!formData.contactPerson) {
      errors.contactPerson = 'Contact Person is required';
    }
    if (!formData.contactNo) {
      errors.contactNo = 'Contact No is required';
    }
    if (!formData.scIssueNo) {
      errors.scIssueNo = 'SC Issue No is required';
    }

    setFieldErrors(errors);

    let scQuotationDataValid = true;
    let quotationTaxDataValid = true;
    if (!scQuotationData || !Array.isArray(scQuotationData) || scQuotationData.length === 0) {
      scQuotationDataValid = false;
      setScQuotationErrors([{ general: 'PurchaseIndent is required' }]);
    } else {
      const newTableErrors = scQuotationData.map((row, index) => {
        const rowErrors = {};
        if (!row.part) {
          rowErrors.part = 'Part is required';
          scQuotationDataValid = false;
        }
        if (!row.partDescription) {
          rowErrors.partDescription = 'Part Description is required';
          scQuotationDataValid = false;
        }
        if (!row.process) {
          rowErrors.process = 'Process is required';
          scQuotationDataValid = false;
        }
        if (!row.qty) {
          rowErrors.qty = 'QTY is required';
          scQuotationDataValid = false;
        }
        if (!row.rate) {
          rowErrors.rate = 'Rate is required';
          scQuotationDataValid = false;
        }
        if (!row.amount) {
          rowErrors.amount = 'Amount is required';
          scQuotationDataValid = false;
        }
        if (!row.discount) {
          rowErrors.discount = 'Discount is required';
          scQuotationDataValid = false;
        }
        if (!row.discountAmount) {
          rowErrors.discountAmount = 'Discount Amount is required';
          scQuotationDataValid = false;
        }
        if (!row.tax) {
          rowErrors.tax = 'Tax is required';
          scQuotationDataValid = false;
        }
        if (!row.quotationAmount) {
          rowErrors.quotationAmount = 'Quotation Amount is required';
          scQuotationDataValid = false;
        }
        if (!row.deliveryDate) {
          rowErrors.deliveryDate = 'Delivery Date is required';
          scQuotationDataValid = false;
        }
        if (!row.grossAmount) {
          rowErrors.grossAmount = 'Gross Amount is required';
          quotationTaxDataValid = false;
        }
        if (!row.netAmount) {
          rowErrors.netAmount = 'Net Amount is required';
          quotationTaxDataValid = false;
        }
        if (!row.amountInWords) {
          rowErrors.amountInWords = 'Ammount in Words is required';
          quotationTaxDataValid = false;
        }
        if (!row.narration) {
          rowErrors.narration = 'Narration is required';
          quotationTaxDataValid = false;
        }

        return rowErrors;
      });
      setScQuotationErrors(newTableErrors);
    }
    setFieldErrors(errors);


    if (Object.keys(errors).length === 0 && scQuotationDataValid) {
      setIsLoading(true);

      const encryptedPassword = encryptPassword('Wds@2022');
      const branchVo = scQuotationData.map((row) => ({
        branchCode: row.branchCode,
        branch: row.branch
      }));

      const saveFormData = {
        ...(editId && { id: formData.docId }),
        userName: formData.userName,
        ...(!editId && { password: encryptedPassword }),
        scQuotationDate: formData.scQuotationDate,
        enquiryNo: formData.enquiryNo,
        enquiryDate: formData.enquiryDate,
        subContractorId: formData.subContractorId,
        subContractorName: formData.subContractorName,
        validTill: formData.validTill,
        taxCode: formData.taxCode,
        routeCardNo: formData.routeCardNo,
        contactPerson: formData.contactPerson,
        contactNo: formData.contactNo,
        scIssueNo: formData.scIssueNo,
        orgId: orgId,
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `auth/signup`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'User Updated Successfully' : 'User created successfully');
          handleClear();
          // getAllUsers();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'User creation failed');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'User creation failed');
        setIsLoading(false);
      }
    } else {
      setFieldErrors(errors);
    }
  };

  const handleClear = () => {
    setFormData({
      scQuotationDate: '',
      enquiryNo: '',
      enquiryDate: '',
      subContractorId: '',
      subContractorName: '',
      validTill: "",
      taxCode: "",
      routeCardNo: "",
      contactPerson: '',
      contactNo: '',
      scIssueNo: '',
      orgId: orgId
    });
    setFieldErrors({
      scQuotationDate: false,
      enquiryNo: false,
      enquiryDate: false,
      subContractorId: false,
      subContractorName: false,
      validTill: false,
      taxCode: false,
      routeCardNo: false,
      contactPerson: false,
      contactNo: false,
      scIssueNo: false,
    });
    setScQuotationData([{ id: 1, part: '', partDescription: '', process: '', qty: '', rate: '', amount: '', discount: '', discountAmount: '', tax: '', quotationAmount: '', deliveryDate: '' }]);
    setQuotationTaxData([{ grossAmount: '', netAmount: '', amountInWords: '', narration: '' }])
    setScQuotationErrors('');
    setQuotationTaxErrors('');
    setEditId('');
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(scQuotationData)) {
      displayRowError(scQuotationData);
      return;
    }
    const newRow = {
      id: Date.now(),
      part: '',
      partDescription: '',
      process: '',
      qty: '',
      rate: '',
      amount: '',
      discount: '',
      discountAmount: '',
      tax: '',
      quotationAmount: '',
      deliveryDate: '',
    };
    setScQuotationData([...scQuotationData, newRow]);
    setScQuotationErrors([...scQuotationErrors, { part: '', partDescription: '', process: '', qty: '', rate: '', amount: '', discount: '', discountAmount: '', tax: '', quotationAmount: '', deliveryDate: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === scQuotationData) {
      return !lastRow.part || !lastRow.partDescription || !lastRow.process || !lastRow.qty || !lastRow.rate || !lastRow.amount || !lastRow.discount || !lastRow.discountAmount || !lastRow.tax || !lastRow.quotationAmount || !lastRow.tax || !lastRow.deliveryDate;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === scQuotationData) {
      setScQuotationErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          part: !table[table.length - 1].part ? 'Part is required' : '',
          partDescription: !table[table.length - 1].partDescription ? 'Part Description is required' : '',
          process: !table[table.length - 1].process ? 'Process is required' : '',
          qty: !table[table.length - 1].qty ? 'QTY is required' : '',
          rate: !table[table.length - 1].rate ? 'Rate is required' : '',
          amount: !table[table.length - 1].amount ? 'Amount is required' : '',
          discount: !table[table.length - 1].discount ? 'Discount is required' : '',
          discountAmount: !table[table.length - 1].discountAmount ? 'Discount Amount is required' : '',
          tax: !table[table.length - 1].tax ? 'Tax is required' : '',
          quotationAmount: !table[table.length - 1].quotationAmount ? 'Quotation Amount is required' : '',
          deliveryDate: !table[table.length - 1].deliveryDate ? 'Delivery Date is required' : '',
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id, table, setTable, errorTable = [], setErrorTable) => {
    // Ensure `table` and `errorTable` are arrays
    if (!Array.isArray(table) || !Array.isArray(errorTable)) {
      console.error("Invalid table or errorTable format. Both must be arrays.");
      return;
    }

    const rowIndex = table.findIndex((row) => row.id === id);

    if (rowIndex !== -1) {
      const updatedData = table.filter((row) => row.id !== id);
      const updatedErrors = errorTable.filter((_, index) => index !== rowIndex);
      setTable(updatedData);
      setErrorTable(updatedErrors);
    }
  };


  const handleIndentChange = (row, index, event) => {
    const value = event.target.value;
    const selectedRole = roleList.find((role) => role.role === value);
    setScQuotationData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setQuotationTaxData((prev) => prev.map((r) => (r.id === row.id ? { ...r, role: value, roleId: selectedRole.id } : r)));
    setScQuotationErrors((prev) => {
      const newErrors = [...prev];
      newErrors[index] = {
        ...newErrors[index],
        role: !value ? 'Role is required' : ''
      };
      return newErrors;
    });
  };

  const handleView = () => {
    setListView(!listView);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
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
    // getAllData();
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
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

          {!listView ? (
            <>
              <div className="row d-flex ml">

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth required>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="S.C Quotation Date"
                        disabled
                        value={formData.scQuotationDate ? dayjs(formData.scQuotationDate, 'YYYY-MM-DD') : dayjs()} // Default to current date
                        onChange={(date) => handleDateChange('scQuotationDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.scQuotationDate}
                        helperText={<span style={{ color: 'red' }}>{fieldErrors.scQuotationDate ? 'Date is required' : ''}</span>}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.enquiryNo ? partyList.find((c) => c.partyname === formData.enquiryNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'enquiryNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Enquiry No"
                        name="enquiryNo"
                        error={!!fieldErrors.enquiryNo}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.enquiryNo} // Displays the error message
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
                  <TextField
                    id="outlined-textarea-zip"
                    label="Sub Contractor Id"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="subContractorId"
                    value={formData.subContractorId}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.subContractorId ? 'Sub Contractor Id is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Sub Contractor Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="subContractorName"
                    value={formData.subContractorName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.subContractorName ? 'Sub Contractor Name is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <FormControl fullWidth>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Valid Till"
                        value={formData.validTill ? dayjs(formData.validTill, 'YYYY-MM-DD') : null}
                        onChange={(date) => handleDateChange('validTill', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                        error={!!fieldErrors.validTill}
                        helperText={fieldErrors.validTill ? fieldErrors.validTill : ''}
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Tax Code"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="taxCode"
                    value={formData.taxCode}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.taxCode ? 'Tax Code is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Route Card No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="routeCardNo"
                    value={formData.routeCardNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.routeCardNo ? 'Route Card No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.contactPerson ? partyList.find((c) => c.partyname === formData.contactPerson) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'contactPerson',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Contact Person"
                        name="contactPerson"
                        error={!!fieldErrors.contactPerson}  // Shows error if supplierName has a value in fieldErrors
                        helperText={fieldErrors.contactPerson} // Displays the error message
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
                    label="Contact No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.contactNo ? 'Contact No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>

                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="SC Issue-No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="scIssueNo"
                    value={formData.scIssueNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.scIssueNo ? 'Work Order No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
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
                    <Tab value={0} label="Quotation details" />
                    <Tab value={1} label="Quotation Tax" />
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
                              // sampleFileDownload={FirstData}
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
                                    <th className="table-header">Part</th>
                                    <th className="table-header">Part Description</th>
                                    <th className="table-header">Process</th>
                                    <th className="table-header">QTY</th>
                                    <th className="table-header">Rate</th>
                                    <th className="table-header">Amount</th>
                                    <th className="table-header">Discount %</th>
                                    <th className="table-header">Discount Amount</th>
                                    <th className="table-header">Tax %</th>
                                    <th className="table-header">Quotation Amount</th>
                                    <th className="table-header">Delivery Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {scQuotationData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="col-md-1 border px-2 py-2 text-center">
                                        <ActionButton
                                          className=" mb-2"
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              scQuotationData,
                                              setScQuotationData,
                                              scQuotationErrors,
                                              setScQuotationErrors
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>

                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.part}
                                          style={{ width: '150px' }}
                                          onChange={(e) => handleIndentChange(row, index, e)}
                                          className={scQuotationErrors[index]?.role ? 'error form-control' : 'form-control'}
                                        >
                                          <option value="">Select Option</option>
                                          {/* {getAvailableRoles(row.id).map((role) => (
                                            <option key={role.id} value={role.role}>
                                              {role.role}
                                            </option>
                                          ))} */}
                                        </select>
                                        {scQuotationErrors[index]?.part && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {scQuotationErrors[index].part}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.partDescription}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setScQuotationData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, partDescription: value } : r))
                                            );
                                            setScQuotationErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partDescription: !value ? 'Part Description is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={scQuotationErrors[index]?.partDescription ? 'error form-control' : 'form-control'}
                                        />
                                        {scQuotationErrors[index]?.partDescription && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {scQuotationErrors[index].partDescription}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          disabled
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.process}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setScQuotationData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, process: value } : r))
                                            );
                                            setScQuotationErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                process: !value ? 'Process is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={scQuotationErrors[index]?.process ? 'error form-control' : 'form-control'}
                                        />
                                        {scQuotationErrors[index]?.process && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {scQuotationErrors[index].process}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          disabled
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.qty}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setScQuotationData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r))
                                            );
                                            setScQuotationErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qty: !value ? 'QTY is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={scQuotationErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                        />
                                        {scQuotationErrors[index]?.qty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {scQuotationErrors[index].qty}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.rate}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            // Allow only numbers or an empty string for validation
                                            if (/^\d*$/.test(value)) {
                                              setScQuotationData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, rate: value } : r))
                                              );
                                              setScQuotationErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  rate: !value ? 'Rate is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={scQuotationErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                        />
                                        {scQuotationErrors[index]?.rate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {scQuotationErrors[index].rate}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.amount}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            // Allow only numeric values or an empty string
                                            if (/^\d*$/.test(value)) {
                                              setScQuotationData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, amount: value } : r))
                                              );
                                              setScQuotationErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  amount: !value ? 'Putaway Qty is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={scQuotationErrors[index]?.amount ? 'error form-control' : 'form-control'}
                                        />
                                        {scQuotationErrors[index]?.amount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {scQuotationErrors[index].amount}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.discount}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setScQuotationData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, discount: value } : r))
                                              );
                                              setScQuotationErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  discount: !value ? 'Discount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={scQuotationErrors[index]?.discount ? 'error form-control' : 'form-control'}
                                        />
                                        {scQuotationErrors[index]?.discount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {scQuotationErrors[index].discount}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.discountAmount}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setScQuotationData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, discountAmount: value } : r))
                                              );
                                              setScQuotationErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  discountAmount: !value ? 'Discount Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={scQuotationErrors[index]?.remainingQty ? 'error form-control' : 'form-control'}
                                        />
                                        {scQuotationErrors[index]?.discountAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {scQuotationErrors[index].discountAmount}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.tax}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setScQuotationData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, tax: value } : r))
                                              );
                                              setScQuotationErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  tax: !value ? 'Tax is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={scQuotationErrors[index]?.tax ? 'error form-control' : 'form-control'}
                                        />
                                        {scQuotationErrors[index]?.tax && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {scQuotationErrors[index].tax}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          style={{ width: '150px' }}
                                          value={row.quotationAmount}
                                          onChange={(e) => {
                                            const value = e.target.value;

                                            if (/^\d*$/.test(value)) {
                                              setScQuotationData((prev) =>
                                                prev.map((r) => (r.id === row.id ? { ...r, quotationAmount: value } : r))
                                              );
                                              setScQuotationErrors((prev) => {
                                                const newErrors = [...prev];
                                                newErrors[index] = {
                                                  ...newErrors[index],
                                                  quotationAmount: !value ? 'Quotation Amount is required' : ''
                                                };
                                                return newErrors;
                                              });
                                            }
                                          }}
                                          className={scQuotationErrors[index]?.quotationAmount ? 'error form-control' : 'form-control'}
                                        />
                                        {scQuotationErrors[index]?.quotationAmount && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {scQuotationErrors[index].quotationAmount}
                                          </div>
                                        )}
                                      </td>

                                      <td className="border px-2 py-2">
                                        <input
                                          type="date"
                                          value={row.deliveryDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setScQuotationData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, deliveryDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setScQuotationErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                deliveryDate: !date ? 'Delivery Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={setScQuotationErrors[index]?.deliveryDate ? 'error form-control' : 'form-control'}
                                        // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
                                        />
                                        {setScQuotationErrors[index]?.deliveryDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {setScQuotationErrors[index].deliveryDate}
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
                      {quotationTaxData.map((row, index) => (
                        <div className="row d-flex">

                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="grossAmount"
                                label={
                                  <span>
                                    Gross Amount <span className="asterisk"></span>
                                  </span>
                                }
                                name="grossAmount"
                                size="small"
                                value={formData.grossAmount || ''} // Ensure value is a string to prevent uncontrolled component issues
                                onChange={(e) => {
                                  const value = e.target.value;

                                  // Update formData directly
                                  setFormData((prev) => ({
                                    ...prev,
                                    grossAmount: value,
                                  }));

                                  // Update documents data if necessary
                                  setQuotationTaxData((prev) =>
                                    prev.map((r) =>
                                      r.id === formData.id ? { ...r, row: value } : r
                                    )
                                  );

                                  // Update field errors
                                  setQuotationTaxErrors((prev) => {
                                    const newErrors = [...prev];
                                    newErrors[index] = {
                                      ...newErrors[index],
                                      row: !value ? 'Gross Amount is required' : '',
                                    };
                                    return newErrors;
                                  });
                                }}
                                inputProps={{ maxLength: 30 }}
                                error={!!fieldErrors.grossAmount}
                                helperText={fieldErrors.grossAmount}
                              />
                            </FormControl>
                          </div>

                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="netAmount"
                                label={
                                  <span>
                                    Net Amount <span className="asterisk"></span>
                                  </span>
                                }
                                name="netAmount"
                                size="small"
                                value={formData.netAmount || ''} // Ensure value is a string to prevent uncontrolled component issues
                                onChange={(e) => {
                                  const value = e.target.value;

                                  // Update formData directly
                                  setFormData((prev) => ({
                                    ...prev,
                                    netAmount: value,
                                  }));

                                  // Update documents data if necessary
                                  setQuotationTaxData((prev) =>
                                    prev.map((r) =>
                                      r.id === formData.id ? { ...r, row: value } : r
                                    )
                                  );

                                  // Update field errors
                                  setQuotationTaxErrors((prev) => {
                                    const newErrors = [...prev];
                                    newErrors[index] = {
                                      ...newErrors[index],
                                      row: !value ? 'netAmount is required' : '',
                                    };
                                    return newErrors;
                                  });
                                }}
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
                                label={
                                  <span>
                                    Amount In Words <span className="asterisk"></span>
                                  </span>
                                }
                                name="amountInWords"
                                size="small"
                                value={formData.amountInWords || ''} // Ensure value is a string to prevent uncontrolled component issues
                                onChange={(e) => {
                                  const value = e.target.value;

                                  // Update formData directly
                                  setFormData((prev) => ({
                                    ...prev,
                                    amountInWords: value,
                                  }));

                                  // Update documents data if necessary
                                  setQuotationTaxData((prev) =>
                                    prev.map((r) =>
                                      r.id === formData.id ? { ...r, row: value } : r
                                    )
                                  );

                                  // Update field errors
                                  setQuotationTaxErrors((prev) => {
                                    const newErrors = [...prev];
                                    newErrors[index] = {
                                      ...newErrors[index],
                                      row: !value ? 'amountInWords is required' : '',
                                    };
                                    return newErrors;
                                  });
                                }}
                                inputProps={{ maxLength: 30 }}
                                error={!!fieldErrors.amountInWords}
                                helperText={fieldErrors.amountInWords}
                              />
                            </FormControl>
                          </div>

                          <div className="col-md-3 mb-3">
                            <FormControl fullWidth variant="filled">
                              <TextField
                                id="narration"
                                label={
                                  <span>
                                    Narration <span className="asterisk"></span>
                                  </span>
                                }
                                name="narration"
                                size="small"
                                value={formData.narration || ''} // Ensure value is a string to prevent uncontrolled component issues
                                onChange={(e) => {
                                  const value = e.target.value;

                                  // Update formData directly
                                  setFormData((prev) => ({
                                    ...prev,
                                    narration: value,
                                  }));

                                  // Update documents data if necessary
                                  setQuotationTaxData((prev) =>
                                    prev.map((r) =>
                                      r.id === formData.id ? { ...r, row: value } : r
                                    )
                                  );

                                  // Update field errors
                                  setQuotationTaxErrors((prev) => {
                                    const newErrors = [...prev];
                                    newErrors[index] = {
                                      ...newErrors[index],
                                      row: !value ? 'narration is required' : '',
                                    };
                                    return newErrors;
                                  });
                                }}
                                inputProps={{ maxLength: 30 }}
                                error={!!fieldErrors.narration}
                                helperText={fieldErrors.narration}
                              />
                            </FormControl>
                          </div>

                        </div>
                      ))}
                    </>
                  )}
                </Box>
              </div>

            </>
          ) : (
            <CommonListViewTable
              data={listViewData}
              columns={listViewColumns}
              blockEdit={true}
            // toEdit={getUserById} 
            />
          )}
        </div>
      </div>
    </>
  );
};
export default SubContractorQuotation;
