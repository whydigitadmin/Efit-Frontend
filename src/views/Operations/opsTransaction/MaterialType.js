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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import dayjs from 'dayjs';
import CommonBulkUpload from 'utils/CommonBulkUpload';

const MaterialType = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();
  const [uploadOpen, setUploadOpen] = useState(false);

  const [formData, setFormData] = useState({
    materialType: '',

    itemGroup: '',

  });
  const [fieldErrors, setFieldErrors] = useState({
    materialType: '',

    itemGroup: '',





  });
  const [isLoading, setIsLoading] = useState(false);
  const [drawingDocumentsData, setDrawingDocumentsData] = useState([
    {
      id: 1,
      itemSubGroup: '',

    }
  ]);
  const [drawingDocumentsErrors, setDrawingDocumentsErrors] = useState([
    {
      itemSubGroup: '',

    }
  ]);
  const columns = [
    { accessorKey: 'listCode', header: 'List Code', size: 140 },
    { accessorKey: 'listDescription', header: 'Description', size: 140 },
    // { accessorKey: 'active', header: 'Active', size: 140 }
  ];
 
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
    toast.success("File uploded sucessfully")
    console.log('Submit clicked');
    handleBulkUploadClose();
    // getAllData();
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
      itemSubGroup: '',  
    };
  
    
    setDrawingDocumentsData((prevData) => [...prevData, newRow]);
  
    
    setDrawingDocumentsErrors((prevErrors) => [
      ...prevErrors,
      { itemSubGroup: '', attachments: '' }  
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];  
    if (!lastRow) return false;   
    
    return !lastRow.itemSubGroup; 
  };

  const displayRowError = (table) => {
    // Check if the table is drawingDocumentsData
    if (table === drawingDocumentsData) {
      setDrawingDocumentsErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          itemSubGroup: !table[table.length - 1].itemSubGroup ? 'Item Sub Group is Required' : '',
          attachments: !table[table.length - 1].attachments ? 'Attachments are Required' : '',
        };
        return newErrors;
      });
    }
  };

  const handleDeleteRow = (id) => {
    const updatedData = drawingDocumentsData.filter(row => row.id !== id);
    const updatedErrors = drawingDocumentsErrors.filter((_, index) => index !== updatedData.findIndex(row => row.id === id));
    
    setDrawingDocumentsData(updatedData);
    setDrawingDocumentsErrors(updatedErrors);
  };
  

  const handleClear = () => {
    setFormData({
      materialType: '',

      itemGroup: '',





    });
    setFieldErrors({});
    setDrawingDocumentsData([
      {
        id: 1,
        itemSubGroup: '',

      }
    ]);
    setDrawingDocumentsErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.materialType) errors.materialType = 'Material Type is Required';
    if (!formData.itemGroup) errors.itemGroup = 'Item Group is Required';

    let drawingDocumentsDataValid = true;
    if (!drawingDocumentsData || !Array.isArray(drawingDocumentsData) || drawingDocumentsData.length === 0) {
      drawingDocumentsDataValid = false;
      setDrawingDocumentsErrors([{ general: 'Drawing Documents Data is Required' }]);
    } else {
      const newTableErrors = drawingDocumentsData.map((row, index) => {
        const rowErrors = {};
        if (!row.itemSubGroup) {
          rowErrors.itemSubGroup = 'File Name is Required';
          drawingDocumentsDataValid = false;
        }
        if (!row.attachments) {
          rowErrors.attachments = 'Attachments is Required';
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
        itemSubGroup: row.itemSubGroup,
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
                    id="materialType"
                    label={
                      <span>
                        Material Type <span className="asterisk">*</span>
                      </span>
                    }
                    name="materialType"
                    size="small"
                    value={formData.materialType}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.materialType}
                    helperText={fieldErrors.materialType}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="fgPartName"
                    label={
                      <span>
                        Item Group <span className="asterisk">*</span>
                      </span>
                    }
                    size="small"
                    name="itemGroup"
                    value={formData.itemGroup}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.itemGroup}
                    helperText={fieldErrors.itemGroup}
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
                  <Tab value={0} label="Material Detail" />
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
                                    item Sub Group
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
                                        onClick={() => handleDeleteRow(row.id)} // Call delete on click
                                      />
                                    </td>
                                    <td className="text-center">{index + 1}</td>
                                    <td className="border px-2 py-2">
                                      <input
                                        type="text"
                                        value={row.itemSubGroup}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDrawingDocumentsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, itemSubGroup: value } : r)));
                                          setDrawingDocumentsErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemSubGroup: !value ? 'Item Sub Group is Required' : '',
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={drawingDocumentsErrors[index]?.itemSubGroup ? 'error form-control' : 'form-control'}
                                      />
                                      {drawingDocumentsErrors[index]?.itemSubGroup && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {drawingDocumentsErrors[index].itemSubGroup}
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

export default MaterialType;
