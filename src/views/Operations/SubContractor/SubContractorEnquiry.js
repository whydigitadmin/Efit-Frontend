import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Autocomplete, FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
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
// import { getAllActivesubContractorRefNo } from 'utils/CommonFunctions';

const SubContractorEnquiry = () => {
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
  const [partyList, setPartyList] = useState([
    { partyname: "Party One", id: 1 },
    { partyname: "Party Two", id: 2 },
    { partyname: "Party Three", id: 3 },
    { partyname: "Party Four", id: 4 },
    { partyname: "Party Five", id: 5 },
    { partyname: "Party Six", id: 6 },
  ]);
  const [currencies, setCurrencies] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    scEnquiryNo: '',
    enquiryDate: dayjs(),
    enquiryType: '',
    subContractorName: '',
    subContractorRefNo: '',
    routeCardNo: '',
    contactName: '',
    contactNo: '',
    scIssueNo: '',
    orgId: orgId,
    enquiryDueDate: dayjs(),

  });

  const [fieldErrors, setFieldErrors] = useState({
    scEnquiryNo: '',
    enquiryDate: new Date(),
    enquiryType: '',
    subContractorName: '',
    subContractorRefNo: '',
    routeCardNo: '',
    contactName: '',
    contactNo: '',
    scIssueNo: '',
    orgId: orgId,
    enquiryDueDate: dayjs(),
  });

  const listViewColumns = [
    { accessorKey: 'scEnquiryNo', header: 'S.C Enquiry No *', size: 140 },
    { accessorKey: 'enquiryDate', header: 'enquiryDate', size: 140 },
    { accessorKey: 'enquiryType', header: 'Enquiry Type', size: 140 },
    { accessorKey: 'subContractorName', header: 'Sub Contractor Name', size: 140 },
    { accessorKey: 'subContractorRefNo', header: 'Sub Contractor Ref No', size: 140 },
    { accessorKey: 'subContractorRefNo', header: 'Sub Contractor Ref Date', size: 140 },
    { accessorKey: 'routeCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'contactName', header: 'contact Name', size: 140 },
    { accessorKey: 'contactNo', header: 'Contact No', size: 140 },
    { accessorKey: 'scIssueNo', header: 'SC-Issue No', size: 140 },


  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      part: '',
      partDescription: '',
      qTY: '',
      deliveryDate: '',
      process: '',
      remarks: ''

    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      part: '',
      partDescription: '',
      qTY: '',
      deliveryDate: '',
      process: '',
      remarks: ''
    }
  ]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const subContractorRefNoData = await getAllActivesubContractorRefNo(orgId);
  //       setCurrencies(subContractorRefNoData);
  //       console.log('subContractorRefNo', subContractorRefNoData);
  //     } catch (error) {
  //       console.error('Error fetching country data:', error);
  //     }
  //   };

  //   fetchData();
  //   getGeneralJournalDocId();
  //   getAllGeneralJournalByOrgId();
  //   getAccountNameFromGroup();
  // }, []);



  const getGeneralJournalDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getGeneralJournalDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.generalJournalDocId,
        enquiryDate: dayjs()
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllGeneralJournalByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllGeneralJournalByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.generalJournalVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getGeneralJournalById = async (row) => {
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getGeneralJournalById?id=${row.original.id}`);

      if (result) {
        const glVO = result.paramObjectsMap.generalJournalVO[0];
        setEditId(row.original.id);

        setFormData({
          scEnquiryNo: glVO.scEnquiryNo || '',
          id: glVO.id || '',
          enquiryDate: glVO.enquiryDate ? dayjs(glVO.enquiryDate, 'YYYY-MM-DD') : dayjs(),
          docId: glVO.docId || '',
          enquiryType: glVO.enquiryType || '',
          subContractorName: glVO.subContractorName || '',
          subContractorRefNo: glVO.subContractorRefNo || '',
          routeCardNo: glVO.routeCardNo || '',
          contactName: glVO.contactName || '',
          contactNo: glVO.contactNo || '',
          scIssueNo: glVO.scIssueNo || '',
          enquiryDueDate: glVO.enquiryDueDate ? dayjs(glVO.enquiryDueDate, 'YYYY-MM-DD') : dayjs(),
          remarks: glVO.remarks || '',
          orgId: glVO.orgId || '',
          totalDebitAmount: glVO.totalDebitAmount || '',
          totalCreditAmount: glVO.totalCreditAmount || ''
          // active: glVO.active || false,
        });
        setDetailsTableData(
          glVO.particularsJournalVO.map((row) => ({
            id: row.id,
            accountsName: row.accountsName,
            creditAmount: row.creditAmount,
            debitAmount: row.debitAmount,
            narration: row.narration,
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
          }))
        );

        console.log('DataToEdit', glVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAccountNameFromGroup = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getAccountNameFromGroup?orgId=${orgId}`);
      setAccountNames(response.paramObjectsMap.generalJournalVO);
      console.log('generalJournalVO', response.paramObjectsMap.generalJournalVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };



  // const handleInputChange = (e) => {
  //   const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

  //   let errorMessage = '';

  //   if (errorMessage) {
  //     setFieldErrors({ ...fieldErrors, [name]: errorMessage });
  //   } else {
  //     setFormData({ ...formData, [name]: value.toUpperCase() });

  //     setFieldErrors({ ...fieldErrors, [name]: '' });

  //     // Preserve the cursor position for text-based inputs
  //     if (type === 'text' || type === 'textarea') {
  //       setTimeout(() => {
  //         const inputElement = document.getElementsByName(name)[0];
  //         if (inputElement && inputElement.setSelectionRange) {
  //           inputElement.setSelectionRange(selectionStart, selectionEnd);
  //         }
  //       }, 0);
  //     }
  //   }
  // };

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
      enquiryDate: dayjs(),
      exRate: '',
      enquiryType: '',
      subContractorName: '',
      subContractorRefNo: '',
      routeCardNo: '',
      contactName: '',
      contactNo: '',
      scIssueNo: '',
      orgId: orgId,
      enquiryDueDate: null,
    });
    // getAllActivesubContractorRefNo(orgId);
    setFieldErrors({
      scEnquiryNo: '',
      enquiryDate: null,
      exRate: '',
      enquiryType: '',
      subContractorName: '',
      subContractorRefNo: '',
      routeCardNo: '',
      contactName: '',
      contactNo: '',
      scIssueNo: '',
      orgId: orgId,
      enquiryDueDate: '',
      refNo: '',
      remarks: '',
      voucherSubType: ''
    });
    setDetailsTableData([
      { id: 1, accountsName: '', subLedgerCode: '', debitAmount: '', creditAmount: '', narration: '', subledgerName: '' }
    ]);
    setDetailsTableErrors('');
    setEditId('');
    getGeneralJournalDocId();
  };



  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      accountsName: '',
      subLedgerCode: '',
      debitAmount: '',
      creditAmount: '',
      narration: '',
      subledgerName: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { part: '', partDescription: '', qTY: '', deliveryDate: '', process: '', remarks: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return (
        !lastRow.part ||
        !lastRow.partDescription ||
        !lastRow.qTY ||
        !lastRow.deliveryDate ||
        !lastRow.process ||
        !lastRow.remarks
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          part: !table[table.length - 1].part ? 'Part is required' : '',
          partDescription: !table[table.length - 1].partDescription ? 'Part Description is required' : '',
          qTY: !table[table.length - 1].qTY ? 'QTY is required' : '',
          deliveryDate: !table[table.length - 1].deliveryDate ? 'Delivery Date is required' : '',
          process: !table[table.length - 1].process ? 'process No is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : '',
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

  const handleSave = async () => {
    const errors = {};

    if (!formData.enquiryType) {
      errors.enquiryType = 'Enquiry Type is  required';
    }
    if (!formData.subContractorName) {
      errors.subContractorName = 'Sub Contractor Name is  required';
    }
    if (!formData.routeCardNo) {
      errors.routeCardNo = ' Route Card No is  required';
    }
    if (!formData.contactName) {
      errors.contactName = ' Contact Name is  required';
    }


    // if (!formData.contactNo) {
    //   errors.contactNo = ' Contact No is  required';
    // }

    if (!formData.scIssueNo) {
      errors.scIssueNo = 'SC-Issue No is  required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.part) {
        rowErrors.part = 'Part is required';
        detailTableDataValid = false;
      }
      if (!row.partDescription) {
        rowErrors.partDescription = 'Part Description is required';
        detailTableDataValid = false;
      }
      if (!row.qTY) {
        rowErrors.qTY = 'QTY is required';
        detailTableDataValid = false;
      }
      if (!row.deliveryDate) {
        rowErrors.deliveryDate = 'deliveryDate is required';
        detailTableDataValid = false;
      }
      if (!row.process) {
        rowErrors.process = 'process is required';
        detailTableDataValid = false;
      }
      if (!row.remarks) {
        rowErrors.remarks = 'Remarks is required';
        detailTableDataValid = false;
      }

      return rowErrors;
    });
    setFieldErrors(errors);

    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        accountsName: row.accountsName,
        creditAmount: row.creditAmount,
        debitAmount: row.debitAmount,
        narration: row.narration,
        subLedgerCode: row.subLedgerCode,
        subledgerName: row.subledgerName
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        subContractorRefNo: formData.subContractorRefNo,
        exRate: formData.exRate,
        finYear: finYear,
        orgId: orgId,
        particularsJournalDTO: GeneralJournalVO,
        enquiryDueDate: dayjs(formData.enquiryDueDate).format('YYYY-MM-DD'),
        refNo: formData.refNo,
        remarks: formData.remarks,
        totalCreditAmount: formData.totalCreditAmount,
        totalDebitAmount: formData.totalDebitAmount,
        voucherSubType: formData.voucherSubType
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/transaction/updateCreateGeneralJournal`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'General Journal Updated Successfully' : 'General Journal Created successfully');
          getAllGeneralJournalByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'General Journal creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'General Journal creation failed');
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
                {/* S.C Enquiry No *. */}
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="S.C Enquiry No *"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="scEnquiryNo"
                    value={formData.scEnquiryNo}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                {/* Enquiry Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Enquiry Date"
                        value={formData.enquiryDate}
                        onChange={(date) => handleDateChange('enquiryDate', date)}
                        disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                {/* Enquiry Type */}
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


                {/* Sub Contractor Name */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.subContractorName ? partyList.find((c) => c.partyname === formData.subContractorName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'subContractorName',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Sub Contractor Name"
                        name="subContractorName"
                        error={!!fieldErrors.subContractorName}
                        helperText={fieldErrors.subContractorName}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
                  />
                </div>


                {/* Sub Contractor Ref No */}
                <div className="col-md-3 mb-3">
                  <TextField
                    label="Sub Contractor Ref No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="subContractorRefNo"
                    value={formData.subContractorRefNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.subContractorRefNo}
                    helperText={fieldErrors.subContractorRefNo}
                  // inputRef={processDescriptionRef}
                  />
                </div>

                {/* Sub Contractor Ref Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Sub Contractor Ref Date"
                        value={formData.subContractorenquiryDueDate}
                        onChange={(date) => handleDateChange('subContractorenquiryDueDate', date)}
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                    {fieldErrors.subContractorenquiryDueDate && <p className="dateErrMsg"> is required</p>}
                  </FormControl>
                </div>

                {/* Enquiry Due Date */}
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Enquiry Due Date"
                        value={formData.enquiryDueDate}
                        onChange={(date) => handleDateChange('enquiryDueDate', date)}
                        // disabled
                        slotProps={{
                          textField: { size: 'small', clearable: true }
                        }}
                        format="DD-MM-YYYY"
                      />
                    </LocalizationProvider>
                  </FormControl>
                </div>

                {/* Route Card No */}
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

                {/* Contact Name */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.contactName ? partyList.find((c) => c.partyname === formData.contactName) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'contactName',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
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
                    disabled
                    size="small"
                    fullWidth
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleInputChange}
                    error={!!fieldErrors.contactNo}
                    helperText={fieldErrors.contactNo}
                  // inputRef={processDescriptionRef}
                  />
                </div>

                {/* SC-Issue No */}
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={partyList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.scIssueNo ? partyList.find((c) => c.partyname === formData.scIssueNo) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'scIssueNo',
                          value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                        },
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="SC-Issue No"
                        name="scIssueNo"
                        error={!!fieldErrors.scIssueNo}
                        helperText={fieldErrors.scIssueNo}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 },
                        }}
                      />
                    )}
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
                    <Tab value={0} label="Item Particulars" />
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
                                    <th className="table-header">Part</th>
                                    <th className="table-header">Part Description</th>
                                    <th className="table-header">QTY</th>
                                    <th className="table-header">Delivery Date</th>
                                    <th className="table-header">process</th>
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
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.part}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, part: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                part: !value ? 'Part is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.part ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.part && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].part}
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
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, partDescription: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                partDescription: !value ? 'Part Description is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.partDescription ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.partDescription && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].partDescription}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.qTY}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, qTY: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qTY: !value ? 'QTY is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.qTY ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.qTY && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].qTY}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.deliveryDate}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, deliveryDate: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                deliveryDate: !value ? 'Delivery Date is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.deliveryDate ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.deliveryDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].deliveryDate}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          style={{ width: '150px' }}
                                          type="text"
                                          value={row.process}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, process: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                process: !value ? 'process is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.process ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.process && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].process}
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
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                remarks: !value ? 'remarks is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.remarks ? 'error form-control' : 'form-control'}
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
                      <div className="row d-flex mt-2">
                        <div className="col-md-8">
                          <FormControl fullWidth variant="filled">
                            <TextField
                              id="Narration"
                              label="Narration"
                              size="small"
                              name="narration"
                              value={formData.remarks}
                              multiline
                              minRows={2}
                              inputProps={{ maxLength: 30 }}
                              onChange={handleInputChange}
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
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getGeneralJournalById} />
          )}
        </div>
      </div>
    </>
  );
};
export default SubContractorEnquiry;
