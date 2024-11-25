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
import CommonBulkUpload from 'utils/CommonBulkUpload';

const DrawingMaster = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    drawingId: '',
    drawingDate: null,
    fgPartNo: '',
    fgPartName: '',
    drawingNo: '',
    drawingRevNo: '',
    effectiveDate: null,
    partNo: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    drawingId: '',
    drawingDate: null,
    fgPartNo: '',
    fgPartName: '',
    drawingNo: '',
    drawingRevNo: '',
    effectiveDate: null,
    partNo: ''
  });
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

  const handleBulkUploadOpen = () => {
    setUploadOpen(true); // Open dialog
  };

  const handleBulkUploadClose = () => {
    setUploadOpen(false); // Close dialog
  };

  const handleFileUpload = (event) => {
    console.log(event.target.files[0]);
  };

  const handleSubmit = () => {
    console.log('Submit clicked');
    handleBulkUploadClose();
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

  const handleClear = () => {
    setFormData({
      drawingId: '',
      drawingDate: null,
      fgPartNo: '',
      fgPartName: '',
      drawingNo: '',
      drawingRevNo: '',
      effectiveDate: null,
      partNo: ''
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
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.drawingId) errors.drawingId = 'Drawing Id is required';
    if (!formData.drawingDate) errors.drawingDate = 'Drawing Date is required';
    if (!formData.fgPartNo) errors.fgPartNo = 'Fg Part No is required';
    if (!formData.fgPartName) errors.fgPartName = 'Fg Part Name is required';
    if (!formData.drawingNo) errors.drawingNo = 'Drawing No is required';
    if (!formData.drawingRevNo) errors.drawingRevNo = 'Drawing Rev No is required';
    if (!formData.effectiveDate) errors.effectiveDate = 'Effective Date is required';
    if (!formData.partNo) errors.partNo = 'Part No is required';

    let drawingDocumentsDataValid = true;
    if (!drawingDocumentsData || !Array.isArray(drawingDocumentsData) || drawingDocumentsData.length === 0) {
      drawingDocumentsDataValid = false;
      setDrawingDocumentsErrors([{ general: 'Drawing Documents Data is required' }]);
    } else {
      const newTableErrors = drawingDocumentsData.map((row, index) => {
        const rowErrors = {};
        if (!row.fileName) {
          rowErrors.fileName = 'File Name is required';
          drawingDocumentsDataValid = false;
        }
        if (!row.attachments) {
          rowErrors.attachments = 'Attachments is required';
          drawingDocumentsDataValid = false;
        }

        return rowErrors;
      });
      setDrawingDocumentsErrors(newTableErrors);
    }
    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && drawingDocumentsDataValid) {
      setIsLoading(true);

      const detailsVo = drawingDocumentsData.map((row) => ({
        ...(editId && { id: row.id }),
        fileName: row.fileName,
        attachments: row.attachments
      }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        listCode: formData.listCode,
        listDescription: formData.listDescription,
        listOfValues1DTO: detailsVo,
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
  //       setDrawingDocumentsData(
  //         listValueVO.listOfValues1VO.map((cl) => ({
  //           id: cl.id,
  //           fileName: cl.fileName,
  //           attachments: cl.valueDescription,
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
        {uploadOpen && (
          <CommonBulkUpload
            open={uploadOpen}
            handleClose={handleBulkUploadClose}
            title="Upload Files"
            uploadText="Upload file"
            downloadText="Sample File"
            onSubmit={handleSubmit}
            // sampleFileDownload={BrsOpeningExcel}
            handleFileUpload={handleFileUpload}
            // apiUrl={`transaction/excelUploadForBrs?branch=${branch}&branchCode=${branchCode}&createdBy=${loginUserName}&orgId=${orgId}`}
            screen="PutAway"
          />
        )}
        {showForm ? (
          <>
            <div className="row d-flex">
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="drawingId"
                    label={
                      <span>
                        Drawing Id <span className="asterisk">*</span>
                      </span>
                    }
                    name="drawingId"
                    size="small"
                    value={formData.drawingId}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.drawingId}
                    helperText={fieldErrors.drawingId}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={formData.drawingDate ? dayjs(formData.drawingDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('drawingDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.drawingDate}
                      helperText={fieldErrors.drawingDate ? fieldErrors.drawingDate : ''}
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
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
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
                    value={formData.fgPartName}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
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
                      value={formData.effectiveDate ? dayjs(formData.effectiveDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('effectiveDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.effectiveDate}
                      helperText={fieldErrors.effectiveDate ? fieldErrors.effectiveDate : ''}
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
              {/* <div className="col-md-3 mb-3">
                <FormControlLabel
                  control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" color="primary" />}
                  label="Active"
                  sx={{ '& .MuiSvgIcon-root': { color: '#5e35b1' } }}
                />
              </div> */}
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
                                    <td className="border px-2 py-2" onClick={handleBulkUploadOpen}>
                                      <input
                                        type="text"
                                        value={row.attachments}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDrawingDocumentsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, attachments: value } : r))
                                          );
                                          setDrawingDocumentsErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              attachments: !value ? 'Value Desc is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={drawingDocumentsErrors[index]?.attachments ? 'error form-control' : 'form-control'}
                                      />
                                      {drawingDocumentsErrors[index]?.attachments && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {drawingDocumentsErrors[index].attachments}
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

export default DrawingMaster;
