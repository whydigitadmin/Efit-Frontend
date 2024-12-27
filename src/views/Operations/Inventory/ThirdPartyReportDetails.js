import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Autocomplete, Button, TextField } from '@mui/material';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';
import { FaCloudUploadAlt } from 'react-icons/fa';
const VisuallyHiddenInput = ({ ...props }) => <input type="file" style={{ display: 'none' }} {...props} />;

const ThirdPartyReportDetails = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [grnWorkPoCNSn, setGrnWorkPoCNSn] = useState([]);
  const [ThirdPartyDetailsAndAddress, setThirdPartyDetailsAndAddress] = useState([]);
  const [thirdPartyInspectionItemId, setThirdPartyInspectionItemId] = useState([]);
  const [docId, setDocId] = useState('');
  const [formData, setFormData] = useState({
    docDate: dayjs(),
    grnno: '',
    workOrderNo: '',
    poNo: '',
    customerName: '',
    supplierName: '',
    thirdPartyDetails: '',
    thirdPartyAddress: '',
    inwardNo: ''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: new Date(),
    grnno: '',
    workOrderNo: '',
    poNo: '',
    customerName: '',
    supplierName: '',
    thirdPartyDetails: '',
    thirdPartyAddress: ''
  });

  const listViewColumns = [
    { accessorKey: 'JobOrderNo', header: 'Job Order No', size: 140 },
    { accessorKey: 'RouteCardNo', header: 'Route Card No', size: 140 },
    { accessorKey: 'SubContractorCode', header: 'Sub Contractor Code', size: 140 },
    { accessorKey: 'Delivery Note Date', header: 'Delivery Note Date', size: 140 }
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      itemId: '',
      itemParticular: '',
      inspectionType: '',
      certificateNo: '',
      status: '',
      remarks: ''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      itemId: '',
      itemParticular: '',
      inspectionType: '',
      certificateNo: '',
      status: '',
      remarks: ''
    }
  ]);

  const [attachmentTable, setAttachmentTable] = useState([
    {
      id: 1,
      itemId: ''
      // description: ''
    }
  ]);
  const [attachmentTableErrors, setAttachmentTableErrors] = useState([
    {
      itemId: ''
      // description: ''
    }
  ]);
  const handleClear = () => {
    setFormData({
      docDate: dayjs(),
      grnno: '',
      workOrderNo: '',
      poNo: '',
      customerName: '',
      supplierName: '',
      thirdPartyDetails: '',
      thirdPartyAddress: ''
    });
    // getAllActiveCurrency(orgId);
    setFieldErrors({
      docDate: dayjs(),
      grnno: '',
      workOrderNo: '',
      poNo: '',
      customerName: '',
      supplierName: '',
      thirdPartyDetails: '',
      thirdPartyAddress: ''
    });
    setDetailsTableData([{ id: 1, itemId: '', itemParticular: '', inspectionType: '', certificateNo: '', status: '', remarks: '' }]);
    setDetailsTableErrors([{ id: 1, itemId: '', itemParticular: '', inspectionType: '', certificateNo: '', status: '', remarks: '' }]);
    setAttachmentTable([
      {
        itemId: ''
        // description: ''
      }
    ]);
    setDetailsTableErrors('');
    setAttachmentTableErrors('');
    setEditId('');
    getThirdPartyDocId();
  };

  useEffect(() => {
    getThirdPartyDocId();
    getAllThirdPartyByOrgId();
    getGrnWorkPoCNSn();
    getThirdPartyDetailsAndAddress();
    // getItemId();
  }, []);

  const getThirdPartyDocId = async () => {
    try {
      const response = await apiCalls('get', `/grn/getThirdPartyInspectionDocId?orgId=${orgId}`);
      setDocId(response.paramObjectsMap.thirdPartyInspectionDocId);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllThirdPartyByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/grn/getThirdPartyInspectionByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.thirdPartyInspectionVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getGeneralJournalById = async (row) => {
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/grn/getThirdPartyInspectionById?id=${row.original.id}`);

      if (result) {
        const tpiVO = result.paramObjectsMap.thirdPartyInspectionVO[0];
        setEditId(row.original.id);
        setDocId(tpiVO.docId);
        setFormData({
          grnno: tpiVO.grnno,
          id: tpiVO.id,
          docDate: tpiVO.docDate ? dayjs(tpiVO.docDate, 'YYYY-MM-DD') : dayjs(),
          customerName: tpiVO.customerName,
          supplierName: tpiVO.supplierName,
          workOrderNo: tpiVO.workOrderNo,
          poNo: tpiVO.poNo,
          thirdPartyDetails: tpiVO.thirdPartyDetails,
          thirdPartyAddress: tpiVO.thirdPartyAddress,
          orgId: tpiVO.orgId
        });
        setDetailsTableData(
          tpiVO.particularsJournalVO.map((row) => ({
            id: row.id,
            itemId: row.itemId,
            itemParticular: row.itemParticular,
            inspectionType: row.inspectionType,
            certificateNo: row.certificateNo,
            status: row.status,
            remarks: row.remarks
          }))
        );

        console.log('DataToEdit', tpiVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getThirdPartyDetailsAndAddress = async () => {
    try {
      const response = await apiCalls('get', `/grn/getThirdPartyDetailsForThirdPartyInsp?orgId=${orgId}`);
      console.log('getThirdPartyDetailsAndAddress:', response);
      setThirdPartyDetailsAndAddress(response.paramObjectsMap.chCode);
    } catch (error) {
      console.error('Error fetching ItemWise Process Master data:', error);
    }
  };
  const getGrnWorkPoCNSn = async () => {
    try {
      const response = await apiCalls('get', `/grn/getGRNForThirdPartyInsp?orgId=${orgId}`);
      console.log('getGrnWorkPoCNSn:', response);
      setGrnWorkPoCNSn(response.paramObjectsMap.chCode);
    } catch (error) {
      console.error('Error fetching ItemWise Process Master data:', error);
    }
  };
  // const getItemId = async (inwardNo) => {
  //   try {
  //     const response = await apiCalls('get', `/grn/getItemForGRN?inwardNo=${inwardNo}&orgId=${orgId}`);
  //     console.log('getGrnWorkPoCNSn:', response);
  //     setThirdPartyInspectionItemId(response.paramObjectsMap.chCode);
  //   } catch (error) {
  //     console.error('Error fetching ItemWise Process Master data:', error);
  //   }
  // };
  const getItemId = async (inwardNo) => {
    try {
      const response = await apiCalls('get', `/grn/getItemForGRN?inwardNo=${inwardNo}&orgId=${orgId}`);
      console.log('getItemId response:', response);

      // Update additional data from the API response
      setThirdPartyInspectionItemId(response.paramObjectsMap.chCode || []);
    } catch (error) {
      console.error('Error fetching Item details:', error);
    }
  };

  // const handleInputChange = (e) => {
  //   const { name, value, selectionStart, selectionEnd, type } = e.target;
  //   let errorMessage = '';
  //   let updatedFormData = { ...formData, [name]: value };

  //   if (name === 'thirdPartyDetails') {
  //     const thirdParty = ThirdPartyDetailsAndAddress.find((item) => item.partyName === value);
  //     updatedFormData = {
  //       ...updatedFormData,
  //       thirdPartyAddress: thirdParty ? thirdParty.address : '',
  //     };
  //   }
  //   if (name === 'grnno') {
  //     const grn = grnWorkPoCNSn.find((item) => item.grnno === value);
  //     updatedFormData = {
  //       ...updatedFormData,
  //       // workOrderNo: grn ? grn.workOrderNo : '',
  //       poNo: grn ? grn.pono : '',
  //       customerName: grn ? grn.customer : '',
  //       supplierName: grn ? grn.suppliername : '',
  //       inwardNo: grn ? grn.inwardno : '',
  //     };
  //   }

  //   if (name === 'itemId') {
  //     const thirdPartyTable = thirdPartyInspectionItemId.find((item) => item.thirdPartyDetails === value);
  //     updatedFormData = {
  //       ...updatedFormData,
  //       itemParticular: thirdPartyTable ? thirdPartyTable.itemParticular : '',
  //     };
  //   }

  //   setFieldErrors((prevErrors) => ({
  //     ...prevErrors,
  //     [name]: errorMessage,
  //   }));
  //   setFormData(updatedFormData);

  //   // Preserve cursor position for text inputs
  //   if ((type === 'text' || type === 'textarea') && !errorMessage) {
  //     setTimeout(() => {
  //       const inputElement = document.getElementsByName(name)[0];
  //       if (inputElement && inputElement.setSelectionRange) {
  //         inputElement.setSelectionRange(selectionStart, selectionEnd);
  //       }
  //     }, 0);
  //   }
  // };
  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const inputValue = type === 'checkbox' ? checked : value;
  //   setFormData({ ...formData, [name]: inputValue });
  //   setFieldErrors({ ...fieldErrors, [name]: false });
  // };
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    // Update the form data for the current field
    setFormData((prevFormData) => ({ ...prevFormData, [name]: inputValue }));
    setFieldErrors((prevFieldErrors) => ({ ...prevFieldErrors, [name]: false }));

    // Additional logic for `grnno`
    if (name === 'grnno') {
      // Find the selected GRN data
      const selectedGRN = grnWorkPoCNSn.find((grn) => grn.grnno === value);

      if (selectedGRN) {
        // Map the related fields
        setFormData((prevFormData) => ({
          ...prevFormData,
          poNo: selectedGRN.pono || '',
          customerName: selectedGRN.customer || '',
          supplierName: selectedGRN.suppliername || ''
        }));

        // Fetch additional data using a separate function
        if (selectedGRN.inwardno) {
          getItemId(selectedGRN.inwardno);
        }
      } else {
        // Clear the dependent fields if no GRN is selected
        setFormData((prevFormData) => ({
          ...prevFormData,
          poNo: '',
          customerName: '',
          supplierName: ''
        }));
      }
    }
  };

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    // const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };
  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      itemId: '',
      itemParticular: '',
      inspectionType: '',
      certificateNo: '',
      status: '',
      remarks: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([
      ...detailsTableErrors,
      {
        itemId: '',
        itemParticular: '',
        inspectionType: '',
        certificateNo: '',
        status: '',
        remarks: ''
      }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return (
        !lastRow.itemId ||
        !lastRow.itemParticular ||
        !lastRow.inspectionType ||
        !lastRow.certificateNo ||
        !lastRow.status ||
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
          itemId: !table[table.length - 1].itemId ? 'Item Id is required' : '',
          inspectionType: !table[table.length - 1].InspectionType ? 'Inspection Type is required' : '',
          itemParticular: !table[table.length - 1].ItemParticular ? 'Item Particular is required' : '',
          certificateNo: !table[table.length - 1].CertificateNo ? 'Certificate No is required' : '',
          status: !table[table.length - 1].status ? 'Status is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleTermAddRow = () => {
    if (isTermsLastRowEmpty(attachmentTable)) {
      displayTermsRowError(attachmentTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      itemId: '',
      attachment: ''
    };
    setAttachmentTable([...attachmentTable, newRow]);
    setAttachmentTableErrors([...attachmentTableErrors, { itemId: '', attachment: '' }]);
  };

  const isTermsLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === attachmentTable) {
      return !lastRow.itemId || !lastRow.attachment;
    }
    return false;
  };

  const displayTermsRowError = (table) => {
    if (table === attachmentTable) {
      setAttachmentTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          itemId: !table[table.length - 1].itemId ? 'Item Id is required' : '',
          attachment: !table[table.length - 1].attachment ? 'Attachment is required' : ''
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

    if (!formData.grnno) {
      errors.grnno = 'GRN No is  required';
    }
    if (!formData.workOrderNo) {
      errors.workOrderNo = 'Work Order No is  required';
    }
    if (!formData.poNo) {
      errors.poNo = 'PO No is  required';
    }
    if (!formData.customerName) {
      errors.customerName = 'Customer Name is  required';
    }
    if (!formData.supplierName) {
      errors.supplierName = 'Supplier Name is  required';
    }
    if (!formData.thirdPartyDetails) {
      errors.thirdPartyDetails = 'Third Party Details is  required';
    }
    if (!formData.thirdPartyAddress) {
      errors.thirdPartyAddress = 'Third Party Address is  required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.itemId) {
        rowErrors.itemId = 'Item Id is required';
        detailTableDataValid = false;
      }
      if (!row.itemParticular) {
        rowErrors.itemParticular = 'Item Particular is required';
        detailTableDataValid = false;
      }
      if (!row.inspectionType) {
        rowErrors.inspectionType = 'Inspection Type is required';
        detailTableDataValid = false;
      }
      if (!row.certificateNo) {
        rowErrors.certificateNo = 'Certificate No is required';
        detailTableDataValid = false;
      }
      if (!row.status) {
        rowErrors.status = 'Status is required';
        detailTableDataValid = false;
      }
      if (!row.remarks) {
        rowErrors.remarks = 'Remarks is required';
        detailTableDataValid = false;
      }
      return rowErrors;
    });

    setDetailsTableErrors(newTableErrors);
    let attachmentTableDataValid = true;
    const attachmentTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.itemId) {
        rowErrors.itemId = 'Item Id is required';
        attachmentTableDataValid = false;
      }
      if (!row.attachment) {
        rowErrors.attachment = 'Attachment is required';
        attachmentTableDataValid = false;
      }
      return rowErrors;
    });

    setAttachmentTableErrors(attachmentTableErrors);
    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && detailTableDataValid && attachmentTableDataValid) {
      const ThirdPartyDetailsVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        itemId: row.itemId,
        itemParticular: row.itemParticular,
        inspectionType: row.inspectionType,
        status: row.status,
        remarks: row.remarks,
        certificateNo: row.certificateNo
      }));
      const attachmentVO = attachmentTable.map((row) => ({
        ...(editId && { id: row.id }),
        itemId: row.itemId,
        attachment: row.attachment
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        grnno: formData.grnno,
        workOrderNo: formData.workOrderNo,
        poNo: formData.poNo,
        customerName: formData.customerName,
        finYear: finYear,
        orgId: orgId,
        thirdPartyInspectionDetailsDTO: ThirdPartyDetailsVO,
        thirdPartyAttachmentDTO: attachmentVO,
        supplierName: formData.supplierName,
        thirdPartyDetails: formData.thirdPartyDetails,
        thirdPartyAddress: formData.thirdPartyAddress
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/grn/updateCreateThirdPartyInsp`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Third Party Inspection Updated Successfully' : 'Third Party Inspection Created successfully');
          getAllThirdPartyByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'Third Party Inspection creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Third Party Inspection creation failed');
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
                    label="Inspection No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    value={docId}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Inspection Date"
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
                    options={grnWorkPoCNSn.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.grnno || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.grnno ? grnWorkPoCNSn.find((c) => c.grnno === formData.grnno) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'grnno',
                          value: newValue ? newValue.grnno : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField {...params} label="GRN No" name="grnno" error={!!fieldErrors.grnno} helperText={fieldErrors.grnno} />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Work Order No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="workOrderNo"
                    type="text"
                    value={formData.workOrderNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.workOrderNo ? 'Work Order No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="PO No"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="poNo"
                    type="text"
                    value={formData.poNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.poNo ? 'PO No is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Customer Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="customerName"
                    type="text"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.customerName ? 'Customer Name is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Supplier Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="supplierName"
                    type="text"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.supplierName ? 'Supplier Name is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={thirdPartyInspectionItemId.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyName || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={
                      formData.thirdPartyDetails
                        ? thirdPartyInspectionItemId.find((c) => c.partyName === formData.thirdPartyDetails)
                        : null
                    }
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'thirdPartyDetails',
                          value: newValue ? newValue.partyName : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Third Party Details"
                        name="thirdPartyDetails"
                        error={!!fieldErrors.thirdPartyDetails}
                        helperText={fieldErrors.thirdPartyDetails}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Third Party Address"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="thirdPartyAddress"
                    type="text"
                    value={formData.thirdPartyAddress}
                    onChange={handleInputChange}
                    helperText={
                      <span style={{ color: 'red' }}>{fieldErrors.thirdPartyAddress ? 'Third Party Address is required' : ''}</span>
                    }
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
                    <Tab value={0} label="Third party Inspections Details" />
                    <Tab value={1} label="Third party Inspections Attach" />
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
                                    <th className="table-header">Item Id</th>
                                    <th className="table-header">Item Particular</th>
                                    <th className="table-header">Inspection Type</th>
                                    <th className="table-header">Certificate No</th>
                                    <th className="table-header">Status</th>
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
                                        <Autocomplete
                                          disablePortal
                                          options={thirdPartyInspectionItemId.map((option, index) => ({ ...option, key: index }))}
                                          getOptionLabel={(option) => option.partNo || ''}
                                          sx={{ width: '100%' }}
                                          size="small"
                                          value={thirdPartyInspectionItemId.find((c) => c.partNo === row.itemId) || null}
                                          onChange={(event, newValue) => {
                                            const selectedItemId = newValue ? newValue.itemId : '';
                                            setDetailsTableData((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      itemId: selectedItemId
                                                    }
                                                  : r
                                              )
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemId: !selectedItemId ? 'Item Id is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Item Id"
                                              name="itemId"
                                              error={!!attachmentTableErrors[index]?.itemId}
                                              helperText={attachmentTableErrors[index]?.itemId}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 40, width: 150 }
                                              }}
                                            />
                                          )}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.itemParticular}
                                          style={{ width: '150px' }}
                                          disabled
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, itemParticular: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemParticular: !value ? 'Item Particular is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.itemParticular ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.itemParticular && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].itemParticular}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.inspectionType}
                                          style={{ width: '150px' }}
                                          className={detailsTableErrors[index]?.inspectionType ? 'error form-control' : 'form-control'}
                                          onChange={(e) =>
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, inspectionType: e.target.value } : r))
                                            )
                                          }
                                        >
                                          <option value="">-- Select --</option>
                                          <option value="Material Composition Inspection">Material Composition Inspection</option>
                                        </select>
                                        {detailsTableErrors[index]?.inspectionType && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].inspectionType}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.certificateNo}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, certificateNo: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                certificateNo: !value ? 'Certificate No is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.certificateNo ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.certificateNo && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].certificateNo}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.status}
                                          style={{ width: '150px' }}
                                          className={detailsTableErrors[index]?.status ? 'error form-control' : 'form-control'}
                                          onChange={(e) =>
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, status: e.target.value } : r))
                                            )
                                          }
                                        >
                                          <option value="">-- Select --</option>
                                          <option value="REJECTED">REJECTED</option>
                                          <option value="PENDING">PENDING</option>
                                          <option value="COMPLETED">COMPLETED</option>
                                        </select>
                                        {detailsTableErrors[index]?.status && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].status}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.remarks}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                remarks: !value ? 'Remarks is required' : ''
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
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleTermAddRow} />
                        </div>
                        <div className="row mt-2">
                          <div className="col-lg-6">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Item Id</th>
                                    <th className="table-header">Attachment</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {attachmentTable.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              attachmentTable,
                                              setAttachmentTable,
                                              attachmentTableErrors,
                                              setAttachmentTableErrors
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
                                          options={thirdPartyInspectionItemId.map((option, index) => ({ ...option, key: index }))}
                                          getOptionLabel={(option) => option.partNo || ''}
                                          sx={{ width: '100%' }}
                                          size="small"
                                          value={thirdPartyInspectionItemId.find((c) => c.partNo === row.itemId) || null}
                                          onChange={(event, newValue) => {
                                            const selectedItemId = newValue ? newValue.partNo : '';
                                            setAttachmentTable((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id
                                                  ? {
                                                      ...r,
                                                      itemId: selectedItemId
                                                    }
                                                  : r
                                              )
                                            );
                                            setAttachmentTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemId: !selectedItemId ? 'Item Id is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Item Id"
                                              name="itemId"
                                              error={!!attachmentTableErrors[index]?.itemId}
                                              helperText={attachmentTableErrors[index]?.itemId}
                                              InputProps={{
                                                ...params.InputProps,
                                                style: { height: 40, width: 150 }
                                              }}
                                            />
                                          )}
                                        />
                                      </td>
                                      <td className="border px-2 py-2">
                                        <div className="d-flex justify-content-center mb-2">
                                          <Button
                                            component="label"
                                            variant="contained"
                                            color="secondary"
                                            startIcon={<FaCloudUploadAlt />}
                                            style={{ textTransform: 'none', padding: '6px 12px' }}
                                          >
                                            Upload File
                                            <VisuallyHiddenInput />
                                          </Button>
                                          {/* <input
                                          type="text"
                                          value={row.description}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setAttachmentTable((prev) => prev.map((r) => (r.id === row.id ? { ...r, description: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                description: !value ? 'Description is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={attachmentTableErrors[index]?.description ? 'error form-control' : 'form-control'}
                                        /> 
                                          {attachmentTableErrors[index]?.description && (
                                            <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                              {attachmentTableErrors[index].description}
                                            </div>
                                          )}*/}
                                        </div>
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
export default ThirdPartyReportDetails;
