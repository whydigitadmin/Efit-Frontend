import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { Button, Checkbox, FormControl, FormControlLabel, FormGroup, TextField, Modal, Typography } from '@mui/material';
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
import CommonBulkUpload from 'utils/CommonBulkUpload';
import { FaCloudUploadAlt, FaEye } from 'react-icons/fa';

// const VisuallyHiddenInput = ({ ...props }) => {
//   <input type="file" style={{ display: 'none' }} {...props} />;
//   // <input type="file" id="file-input"  style={{ display: 'none' }} multiple {...props} />;
// };

const VisuallyHiddenInput = ({ ...props }) => {
  return <input type="file" style={{ display: 'none' }} {...props} />;
};

const dummyImageURL = 'https://t3.ftcdn.net/jpg/04/62/93/66/240_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';

const DrawingMaster = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [uploadSubFileOpen, setUploadSubFileOpen] = useState(false);
  const [selectedPartImgFiles, setSelectedPartImgFiles] = useState([]);
  const [partImgUploadedFiles, setPartImgUploadedFiles] = useState([]);
  const [selectedSubAttachFiles, setSelectedSubAttachFiles] = useState([]);
  const [subAttachUploadedFiles, setSubAttachUploadedFiles] = useState([]);
  const [docId, setDocId] = useState('');
  const [partImagePreview, setPartImagePreview] = useState(null);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fgPartNameList, setFgPartNameList] = useState([]);

  const [formData, setFormData] = useState({
    // drawingId: '',
    docDate: null,
    fgPartNo: '',
    fgPartName: '',
    drawingNo: '',
    drawingRevNo: '',
    effDate: null,
    partNo: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({
    // drawingId: '',
    docDate: null,
    fgPartNo: '',
    fgPartName: '',
    drawingNo: '',
    drawingRevNo: '',
    effDate: null,
    partNo: '',
    active: true
  });
  // const [file, setFile] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [drawingDocumentsData, setDrawingDocumentsData] = useState([
    {
      id: 1,
      fileName: '',
      attachments: ''
    }
  ]);
  const [drawingDocumentsErrors, setDrawingDocumentsErrors] = useState([
    {
      fileName: '',
      attachments: ''
    }
  ]);
  const [subFileDocumentsData, setSubFileDocumentsData] = useState([
    {
      id: 1,
      subFileName: '',
      subAttachments: ''
    }
  ]);
  const [subFileDocumentsErrors, setSubFileDocumentsErrors] = useState([
    {
      subFileName: '',
      subAttachments: ''
    }
  ]);

  const columns = [
    { accessorKey: 'docNo', header: 'Drawing Id', size: 140 },
    { accessorKey: 'fgPartNo', header: 'Fg Part No', size: 140 },
    { accessorKey: 'fgPartName', header: 'Fg Part Name', size: 140 },
    { accessorKey: 'drawingNo', header: 'Drawing No', size: 140 },
    { accessorKey: 'effDate', header: 'Effective Date', size: 140 },
    { accessorKey: 'partNo', header: 'Part No', size: 140 }
  ];

  useEffect(() => {
    getAllDrawingMasterByOrgId();
    getDrawingMasterDocId();
    getAllFgPartNameByOrgId();
  }, []);

  // const handleInputChange = (e) => {
  //   const { name, value, type, checked } = e.target;
  //   const inputValue = type === 'checkbox' ? checked : value;
  //   setFormData({ ...formData, [name]: inputValue });
  //   setFieldErrors({ ...fieldErrors, [name]: false });
  // };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;
  
    // Update the form data for the selected field
    setFormData({ ...formData, [name]: inputValue });
  
    // If the 'fgPartNo' field changes, update the 'fgPartName' based on selected item
    if (name === 'fgPartNo') {
      const selectedFgPart = fgPartNameList.find(fg => fg.itemName === inputValue);
      if (selectedFgPart) {
        setFormData({
          ...formData,
          fgPartName: selectedFgPart.itemDesc // Set the itemDesc value
        });
      }
    }
  
    // Reset any field errors for the updated field
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleDateChange = (name, date) => {
    setFormData({ ...formData, [name]: date });
    setFieldErrors({ ...fieldErrors, [name]: false });
  };

  const handleBulkUploadOpen = () => {
    setUploadOpen(true); // Open dialog
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false); // Close dialog
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
  };

  const handleSubFileBulkUploadOpen = () => {
    setUploadSubFileOpen(true); // Open dialog
  };

  const handleSubFileBulkUploadClose = () => {
    setUploadSubFileOpen(false); // Close dialog
  };

  const handleSubFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubFileSubmit = () => {
    console.log('Submit clicked');
    handleSubFileBulkUploadClose();
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
    if (isLastRowEmpty(drawingDocumentsData)) {
      displayRowError(drawingDocumentsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      fileName: '',
      attachments: ''
    };
    setDrawingDocumentsData([...drawingDocumentsData, newRow]);
    setDrawingDocumentsErrors([...drawingDocumentsErrors, { fileName: '', attachments: '' }]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === drawingDocumentsData) {
      return !lastRow.fileName || !lastRow.attachments;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === drawingDocumentsData) {
      setDrawingDocumentsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          fileName: !table[table.length - 1].fileName ? 'File Name is required' : '',
          attachments: !table[table.length - 1].attachments ? 'Attachments is required' : ''
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

  const handleSubFileAddRow = () => {
    if (isLastRowEmptySubFile(subFileDocumentsData)) {
      displaySubFileRowError(subFileDocumentsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      subFileName: '',
      subAttachments: ''
    };
    setSubFileDocumentsData([...subFileDocumentsData, newRow]);
    setSubFileDocumentsErrors([...subFileDocumentsErrors, { subFileName: '', subAttachments: '' }]);
  };
  const isLastRowEmptySubFile = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === subFileDocumentsData) {
      return !lastRow.subFileName || !lastRow.subAttachments;
    }
    return false;
  };

  const displaySubFileRowError = (table) => {
    if (table === subFileDocumentsData) {
      setSubFileDocumentsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          subFileName: !table[table.length - 1].subFileName ? 'Sub File Name is required' : '',
          subAttachments: !table[table.length - 1].subAttachments ? 'Attachments is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleSubFileDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
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
      // drawingId: '',
      docDate: null,
      fgPartNo: '',
      fgPartName: '',
      drawingNo: '',
      drawingRevNo: '',
      effDate: null,
      partNo: '',
      active: true
    });
    setFieldErrors({});
    setDrawingDocumentsData([
      {
        id: 1,
        fileName: '',
        attachments: ''
      }
    ]);
    setDrawingDocumentsErrors('');
    setSubFileDocumentsData([
      {
        id: 1,
        subFileName: '',
        subAttachments: ''
      }
    ]);
    setSelectedPartImgFiles([]);
    setSubFileDocumentsErrors('');
    getDrawingMasterDocId();
    setEditId('');
  };

  const handleFileUpload = async (generatedId) => {
    if (!generatedId) {
      console.warn('Generated ID is missing');
      showToast('error', 'Generated ID is required');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    for (let i = 0; i < partImgUploadedFiles.length; i++) {
      formData.append('file', partImgUploadedFiles[i]);
    }

    try {
      // Make the API call using the apiCalls helper function
      const response = await apiCalls(
        'post',
        `/machinemaster/uploadAttachementsInBloob?id=${generatedId}`,
        formData,
        {}, // No query parameters needed
        { 'Content-Type': 'multipart/form-data' } // Optional; the browser sets this when using FormData
      );

      console.log('File Upload Response:', response);

      if (response.status === true) {
        showToast('success', response.message || 'File uploaded successfully!');
      } else {
        console.warn('File upload failed:', response);
        showToast('error', 'File upload failed');
      }
    } catch (error) {
      console.error('File Upload Error:', error);
      showToast('error', 'Failed to upload file');
    }
  };

  const handleSubAttachFileUpload = async (generatedId) => {
    if (!generatedId) {
      console.warn('Generated ID is missing');
      showToast('error', 'Generated ID is required');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    for (let i = 0; i < subAttachUploadedFiles.length; i++) {
      formData.append('file', subAttachUploadedFiles[i]);
    }

    try {
      // Make the API call using the apiCalls helper function
      const response = await apiCalls(
        'post',
        `/machinemaster/uploadAttachementsInBloob1?id=${generatedId}`,
        formData,
        {}, // No query parameters needed
        { 'Content-Type': 'multipart/form-data' } // Optional; the browser sets this when using FormData
      );

      console.log('Sub Attachment File Upload Response:', response);

      if (response.status === true) {
        showToast('success', response.message || 'Sub Attachment File uploaded successfully!');
      } else {
        console.warn('Sub Attachment File upload failed:', response);
        showToast('error', 'Sub Attachment File upload failed');
      }
    } catch (error) {
      console.error('Sub Attachment File Upload Error:', error);
      showToast('error', 'Sub Attachment Failed to upload file');
    }
  };

  const handlePartImgFileUpload = (files) => {
    console.log('Test');
    setPartImgUploadedFiles(files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
    }
    const fileNames = Array.from(files).map((file) => file.name);
    setSelectedPartImgFiles(fileNames);
  };

  const handlePreview = (file) => {
    setSelectedFile(file);
    setOpenPreviewModal(true);
  };

  const handleCloseModal = () => {
    setOpenPreviewModal(false);
    setSelectedFile(null);
  };

  // const handlePartImgFileUpload = (files) => {
  //   console.log('Test');
  //   setPartImgUploadedFiles(files);

  //   // Extract file names from the files object and update the state
  //   const fileNames = Array.from(files).map((file) => file.name);
  //   setUploadedFileNames(fileNames);

  //   // For logging each file (optional)
  //   for (let i = 0; i < files.length; i++) {
  //     const file = files[i];
  //     console.log(file.name); // You can remove this line if not needed
  //   }
  // };

  const handleSubAttachImgFileUpload = (files) => {
    console.log('Test');
    setSubAttachUploadedFiles(files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
    }
    const fileNames = Array.from(files).map((file) => file.name);
    setSelectedSubAttachFiles(fileNames);
  };

  const handleSave = async () => {
    const errors = {};

    // Validate required fields
    if (!formData.fgPartNo) errors.fgPartNo = 'Fg Part No is required';
    if (!formData.fgPartName) errors.fgPartName = 'Fg Part Name is required';
    if (!formData.drawingNo) errors.drawingNo = 'Drawing No is required';
    if (!formData.drawingRevNo) errors.drawingRevNo = 'Drawing Rev No is required';
    if (!formData.effDate) errors.effDate = 'Effective Date is required';
    if (!formData.partNo) errors.partNo = 'Part No is required';

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0) {
      setIsLoading(true);

      const detailsVo = drawingDocumentsData.map((row) => ({
        ...(editId && { id: row.id }),
        fileName: row.fileName
      }));

      const detailsSubFileVo = subFileDocumentsData.map((row) => ({
        ...(editId && { id: row.id }),
        fileName: row.subFileName
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        // docDate: formData.docDate,
        fgPartNo: formData.fgPartNo,
        fgPartName: formData.fgPartName,
        drawingNo: formData.drawingNo,
        drawingRevNo: formData.drawingRevNo,
        effDate: formData.effDate.format('YYYY-MM-DD'),
        partNo: formData.partNo,
        drawingMaster1DTO: detailsVo,
        drawingMaster2DTO: detailsSubFileVo,
        cancelRemarks: 'null',
        createdBy: loginUserName,
        orgId: orgId
      };

      console.log('Saving Form Data:', saveFormData);

      try {
        // Save data to the server
        const saveResponse = await apiCalls('put', '/machinemaster/updateDrawingMaster', saveFormData);

        if (saveResponse.status === true) {
          console.log('Save Response:', saveResponse);
          showToast('success', editId ? 'Drawing Master updated successfully' : 'Drawing Master created successfully');

          // Extract the generated ID
          const generatedId = saveResponse?.paramObjectsMap.drawingMasterVO.id;

          if (generatedId && selectedPartImgFiles.length > 0) {
            console.log('Generated ID:', generatedId);

            // Wait for the file upload to complete
            await handleFileUpload(generatedId);
          } else {
            console.log('handleFileUpload failed');
          }

          if (generatedId && selectedSubAttachFiles.length > 0) {
            console.log('Generated ID:', generatedId);

            // Wait for the file upload to complete
            await handleSubAttachFileUpload(generatedId);
          } else {
            console.log('handleFileUpload failed');
          }

          // Refresh data and reset form
          getAllDrawingMasterByOrgId();
          handleClear();
        } else {
          showToast('error', saveResponse.paramObjectsMap?.errorMessage || 'Drawing Master creation failed');
        }
      } catch (error) {
        console.error('Error during save:', error);
        showToast('error', 'Drawing Master creation failed');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getAllFgPartNameByOrgId = async () => {
    try {
      const response = await apiCalls('get', `/machinemaster/getFGSFGPartDetailsForDrawingMaster?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setFgPartNameList(response.paramObjectsMap.drawingMasterVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getDrawingMasterDocId = async () => {
    try {
      const response = await apiCalls('get', `/machinemaster/getDrawingMasterDocId?orgId=${orgId}`);
      setDocId(response.paramObjectsMap.drawingMasterDocId);
    } catch (error) {
      console.error('Error fetching departmentDocId:', error);
    }
  };

  const getAllDrawingMasterByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/machinemaster/getAllDrawingMasterByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.drawingMasterVO || []);
      showForm(true);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getDrawingMasterById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/machinemaster/getAllDrawingMasterById?id=${row.original.id}`);

      if (result) {
        const drawingValueVO = result.paramObjectsMap.drawingMasterVO;
        setEditId(row.original.id);
        setDocId(drawingValueVO.docId);
        setFormData({
          id: drawingValueVO.id || '',
          docDate: drawingValueVO.docDate || '',
          fgPartNo: drawingValueVO.fgPartNo || '',
          fgPartName: drawingValueVO.fgPartName || '',
          drawingNo: drawingValueVO.drawingNo || '',
          drawingRevNo: drawingValueVO.drawingRevNo || '',
          // effDate: drawingValueVO.effDate || '',
          effDate: drawingValueVO.effDate ? dayjs(drawingValueVO.effDate, 'YYYY-MM-DD') : dayjs(),
          partNo: drawingValueVO.partNo || '',
          active: drawingValueVO.active || false
        });
        setDrawingDocumentsData(
          drawingValueVO.drawingMaster1VO.map((cl) => ({
            id: cl.id,
            fileName: cl.fileName,
            attachments: cl.attachements
          }))
        );
        setSubFileDocumentsData(
          drawingValueVO.drawingMaster2VO.map((cl) => ({
            id: cl.id,
            subFileName: cl.fileName,
            subAttachments: cl.attachements
          }))
        );

        console.log('DataToEdit', drawingValueVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

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
                  <TextField id="drawingId" label="Drawing Id" name="drawingId" fullWidth size="small" value={docId} disabled />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : dayjs()}
                      onChange={(date) => handleDateChange('docDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      disabled
                      error={!!fieldErrors.docDate}
                      helperText={fieldErrors.docDate ? fieldErrors.docDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.fgPartNo}>
                  <InputLabel id="fgPartNo">Fg Part No</InputLabel>
                  <Select
                    labelId="fgPartNo"
                    id="fgPartNo"
                    label="Fg Part No"
                    onChange={handleInputChange}
                    name="fgPartNo"
                    value={formData.fgPartNo}
                  >
                    {fgPartNameList.map((fg) => (
                      <MenuItem key={fg.id} value={fg.itemName}>
                        {fg.itemName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.fgPartNo && <FormHelperText>{fieldErrors.fgPartNo}</FormHelperText>}
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="fgPartName"
                    label={
                      <span>
                        FG Part Name <span className="asterisk">*</span>
                      </span>
                    }
                    size="small"
                    name="fgPartName"
                    disabled
                    value={formData.fgPartName}
                    error={!!fieldErrors.fgPartName}
                    helperText={fieldErrors.fgPartName}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="drawingNo"
                    label={
                      <span>
                        Drawing No <span className="asterisk">*</span>
                      </span>
                    }
                    size="small"
                    name="drawingNo"
                    value={formData.drawingNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.drawingNo}
                    helperText={fieldErrors.drawingNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="drawingRevNo"
                    label={
                      <span>
                        Drawing Rev No <span className="asterisk">*</span>
                      </span>
                    }
                    size="small"
                    name="drawingRevNo"
                    value={formData.drawingRevNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.drawingRevNo}
                    helperText={fieldErrors.drawingRevNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Effective Date"
                      value={formData.effDate ? dayjs(formData.effDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('effDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.effDate}
                      helperText={fieldErrors.effDate ? fieldErrors.effDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="partNo"
                    label={
                      <span>
                        Part No <span className="asterisk">*</span>
                      </span>
                    }
                    size="small"
                    name="partNo"
                    value={formData.partNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.partNo}
                    helperText={fieldErrors.partNo}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" color="primary" />}
                  label="Active"
                  sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                />
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
                  <Tab value={0} label="Drawing Documents" />
                  <Tab value={1} label="Sub Attachments" />
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
                        <div className="col-lg-7">
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
                                    FileName
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Attachments
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {drawingDocumentsData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            drawingDocumentsData,
                                            setDrawingDocumentsData,
                                            drawingDocumentsErrors,
                                            setDrawingDocumentsErrors
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.fileName}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDrawingDocumentsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, fileName: value } : r))
                                          );
                                          setDrawingDocumentsErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              fileName: !value ? 'File Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={drawingDocumentsErrors[index]?.fileName ? 'error form-control' : 'form-control'}
                                      />
                                      {drawingDocumentsErrors[index]?.fileName && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {drawingDocumentsErrors[index].fileName}
                                        </div>
                                      )}
                                    </td>
                                    {/* <td className="border px-2 py-2">
                                      {row.attachments ? (
                                        <img
                                          src={`data:image/jpeg;base64,${row.attachments}`}
                                          alt="Product"
                                          className="my-2 w-50 h-50"
                                          onError={(e) => {
                                            e.target.src = dummyImageURL;
                                          }}
                                        />
                                      ) : (
                                        <>
                                          <div className="d-flex justify-content-center mb-2">
                                            <Button
                                              component="label"
                                              variant="contained"
                                              color="secondary"
                                              startIcon={<FaCloudUploadAlt />}
                                              style={{ textTransform: 'none', padding: '6px 12px' }}
                                            >
                                              Upload File
                                              <VisuallyHiddenInput onChange={(e) => handlePartImgFileUpload(e.target.files)} />
                                            </Button>
                                          </div>
                                          {selectedPartImgFiles.length > 0 && (
                                            <div className="d-flex justify-content-center uploaded-files mt-2">
                                              {selectedPartImgFiles.map((fileName, index) => (
                                                <div key={index}>{fileName}</div>
                                              ))}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </td> */}
                                    {/* <td className="border px-2 py-2">
                                      {row.attachments ? (
                                        <img
                                          src={`data:image/jpeg;base64,${row.attachments}`}
                                          alt="Product"
                                          className="my-2 w-50 h-50"
                                          onError={(e) => {
                                            e.target.src = dummyImageURL;
                                          }}
                                        />
                                      ) : (
                                        <>
                                          <div className="d-flex justify-content-center mb-2">
                                            <Button
                                              component="label"
                                              variant="contained"
                                              color="secondary"
                                              startIcon={<FaCloudUploadAlt />}
                                              style={{ textTransform: 'none', padding: '6px 12px' }}
                                            >
                                              Upload File
                                              <input
                                                type="file"
                                                style={{ display: 'none' }}
                                                onChange={(e) => handlePartImgFileUpload(e.target.files)}
                                              />
                                            </Button>
                                          </div>
                                          {selectedPartImgFiles.length > 0 && (
                                            <div className="d-flex justify-content-center uploaded-files mt-2">
                                              {selectedPartImgFiles.map((fileName, index) => (
                                                <div key={index} className="d-flex justify-content-between mb-1">
                                                  <div>{fileName}</div>
                                                </div>
                                              ))}
                                            </div>
                                          )}
                                        </>
                                      )}

                                      <Modal open={openPreviewModal} onClose={handleCloseModal}>
                                        <Box
                                          sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '80%',
                                            bgcolor: 'background.paper',
                                            boxShadow: 24,
                                            p: 4,
                                            overflow: 'auto'
                                          }}
                                        >
                                          {selectedFile && selectedFile.endsWith('.pdf') ? (
                                            <iframe
                                              src={URL.createObjectURL(new Blob([selectedFile], { type: 'application/pdf' }))}
                                              width="100%"
                                              height="600px"
                                              title="File Preview"
                                            />
                                          ) : (
                                            <img
                                              src={URL.createObjectURL(new Blob([selectedFile], { type: 'image/jpeg' }))}
                                              alt="Preview"
                                              style={{ width: '100%', height: 'auto' }}
                                            />
                                          )}
                                          <Button onClick={handleCloseModal} style={{ marginTop: '20px' }}>
                                            Close
                                          </Button>
                                        </Box>
                                      </Modal>
                                    </td> */}
                                    <td className="border px-2 py-2">
                                      {row.attachments ? (
                                        <>
                                          <div className="d-flex justify-content-center mb-2">
                                            <Button
                                              variant="contained"
                                              color="secondary"
                                              startIcon={<FaEye />}
                                              onClick={() => handlePreview(row.attachments)}
                                              style={{ textTransform: 'none' }}
                                            >
                                              Preview
                                            </Button>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="d-flex justify-content-center mb-2">
                                            <Button
                                              component="label"
                                              variant="contained"
                                              color="secondary"
                                              startIcon={<FaCloudUploadAlt />}
                                              style={{ textTransform: 'none', padding: '6px 12px' }}
                                            >
                                              Upload File
                                              <VisuallyHiddenInput onChange={(e) => handlePartImgFileUpload(e.target.files)} />
                                            </Button>
                                          </div>
                                          {selectedPartImgFiles.length > 0 && (
                                            <div className="d-flex justify-content-center uploaded-files mt-2">
                                              <Typography variant="body2">Uploaded Files:</Typography>
                                              {selectedPartImgFiles.map((fileName, index) => (
                                                <div key={index}>{fileName}</div>
                                              ))}
                                            </div>
                                          )}
                                        </>
                                      )}

                                      {/* Modal for file preview */}
                                      <Modal open={openPreviewModal} onClose={handleCloseModal}>
                                        <Box
                                          sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '50%',
                                            bgcolor: 'background.paper',
                                            boxShadow: 24,
                                            p: 4,
                                            overflow: 'auto'
                                          }}
                                        >
                                          {selectedFile ? (
                                            <img
                                              src={`data:image/jpeg;base64,${selectedFile}`}
                                              alt="Preview"
                                              style={{ width: '100%', height: 'auto' }}
                                            />
                                          ) : (
                                            <Typography>No preview available</Typography>
                                          )}
                                          <Button
                                            className="secondary"
                                            onClick={handleCloseModal}
                                            style={{ marginTop: '20px' }}
                                            variant="outlined"
                                          >
                                            Close
                                          </Button>
                                        </Box>
                                      </Modal>
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
                        <ActionButton title="Add" icon={AddIcon} onClick={handleSubFileAddRow} />
                      </div>
                      <div className="row mt-2">
                        <div className="col-lg-7">
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
                                    Sub File Name
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Attachments
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {subFileDocumentsData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleSubFileDeleteRow(
                                            row.id,
                                            subFileDocumentsData,
                                            setSubFileDocumentsData,
                                            subFileDocumentsErrors,
                                            setSubFileDocumentsErrors
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.subFileName}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setSubFileDocumentsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, subFileName: value } : r))
                                          );
                                          setSubFileDocumentsErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              subFileName: !value ? 'Sub File Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={subFileDocumentsErrors[index]?.subFileName ? 'error form-control' : 'form-control'}
                                      />
                                      {subFileDocumentsErrors[index]?.subFileName && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {subFileDocumentsErrors[index].subFileName}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      {row.subAttachments ? (
                                        <img
                                          src={`data:image/jpeg;base64,${row.subAttachments}`}
                                          alt="Product"
                                          className="my-2 w-25 h-25"
                                          onError={(e) => {
                                            e.target.src = dummyImageURL;
                                          }}
                                        />
                                      ) : (
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
                                        // <input
                                        //   type="file"
                                        //   id="file-input"
                                        //   multiple
                                        //   onChange={(e) => handleSubAttachImgFileUpload(e.target.files)}
                                        // />
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
              </Box>
            </div>
          </>
        ) : (
          <CommonTable data={data && data} columns={columns} blockEdit={true} toEdit={getDrawingMasterById} />
        )}
      </div>
    </div>
  );
};

export default DrawingMaster;
