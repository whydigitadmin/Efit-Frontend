import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, Autocomplete, MenuItem, Select } from '@mui/material';
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
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CommonBulkUpload from 'utils/CommonBulkUpload';
import sampleFile from '../../../assets/sample-files/sample_data_buyerorder.xls';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

function ItemWiseProcess() {

  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [allOperationName, setAllOperationName] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [docId, setDocId] = useState('');
  const [file, setFile] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [formData, setFormData] = useState({
    processType:'',
    item: '',
    itemDescription: '',
  });

  const [fieldErrors, setFieldErrors] = useState({
    processType:'',
    item: '',
    itemDescription: '',
  });

  const listViewColumns = [
    { accessorKey: 'docId', header: 'Document No', size: 140 },
    { accessorKey: 'processType', header: 'Process Type', size: 140 },
    { accessorKey: 'item', header: 'Item', size: 140 }
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      operationName:''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
       operationName:''
    }
  ]);

  useEffect(() => {
    
    // getAdjustmentJournalDocId();
    // getAllAdjustmentJournalByOrgId();
    // getAllOperationName();
  }, []);
  const getAllItemWiseProcessMasterById = async () => {}
  const getAllOperationName = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getOperationNameFromGroup?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setAllOperationName(response.paramObjectsMap.generalJournalVO);
        console.log('Account Name', response.paramObjectsMap.generalJournalVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleClear = () => {
    setFormData({
      processType:'',
      item: '',
      itemDescription: '',
    });
    setFieldErrors({
      processType:'',
      item: '',
      itemDescription: '',
    });
    setDetailsTableData([
      { id: 1,   operationName:'' }
    ]);
    setDetailsTableErrors('');
    setEditId('');
    // getAdjustmentJournalDocId();
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';

    switch (name) {
      case 'exRate':
        if (isNaN(value)) errorMessage = 'Invalid format';
        break;

      case 'refNo':
      case 'suppRefNo':
        if (!/^[A-Za-z0-9\s]*$/.test(value)) {
          errorMessage = 'Invalid format';
        }
        break;
      case 'totalCreditAmount':
      case 'totalDebitAmount':
        if (isNaN(value)) {
          errorMessage = 'Invalid format';
        }
        break;

      default:
        break;
    }

    // Update field errors
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage
    }));

    // If no error, update the form data
    if (!errorMessage) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: type === 'text' || type === 'textarea' ? value.toUpperCase() : value
      }));

      // Preserve cursor position for text inputs
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      operationName:''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([
      ...detailsTableErrors,
      {   operationName:'' }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return (
        !lastRow.operationName 
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
            operationName: !table[table.length - 1].operationName ? '  Operation Name is required' : ''
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

  

  const handleSave = ()=> {
    const errors = {};
    if (!formData.item) {
      errors.item = 'Item is required';
    }
    if (!formData.itemDescription) {
      errors.itemDescription = 'Item Description is required';
    }
    if (!formData.processType) {
      errors.processType = 'Process Type is required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.operationName) {
        rowErrors.operationName = 'Operation Name is required';
        detailTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);
    setDetailsTableErrors(newTableErrors);
  }
  return(
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
                    id="docId"
                    label="Document No"
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.processType}>
                    <InputLabel id="processType">Process Type</InputLabel>
                    <Select
                      labelId="processType"
                      label="Process Type"
                      value={formData.processType}
                      onChange={handleInputChange}
                      name="processType"
                    >
                      <MenuItem value="PRODUCTION">PRODUCTION</MenuItem>
                      <MenuItem value="SUB-CONTRACT">SUB-CONTRACT</MenuItem>
                    </Select>
                    {fieldErrors.processType && <FormHelperText>{fieldErrors.processType}</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.item}>
                    <InputLabel id="item">
                      {
                        <span>
                          Item <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="item"
                      id="item"
                      label="item"
                      onChange={handleInputChange}
                      name="item"
                      value={formData.item}
                    >
                      {currencies.map((item) => (
                        <MenuItem key={item.id} value={item.item}>
                          {item.item}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.item && <FormHelperText style={{ color: 'red' }}>Item is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="itemDescription"
                    label= 'Item Description'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="itemDescription"
                    value={formData.itemDescription}
                    onChange={handleInputChange}
                    // helperText={<span style={{ color: 'red' }}>{fieldErrors.itemDescription ? fieldErrors.itemDescription : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.itemDescription}
                    helperText={fieldErrors.itemDescription}
                    // disabled
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
                    <Tab value={0} label="Process Details" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow} />
                          <ActionButton title="Upload" icon={CloudUploadIcon} onClick={handleBulkUploadOpen} />
                        </div>
                        {uploadOpen && (
          <CommonBulkUpload
            open={uploadOpen}
            handleClose={handleBulkUploadClose}
            title="Upload Files"
            uploadText="Upload file"
            downloadText="Sample File"
            onSubmit={handleSubmit}
            sampleFileDownload={sampleFile}
            handleFileUpload={handleFileUpload}
            // apiUrl={`buyerOrder/ExcelUploadForBuyerOrder?branch=${loginBranch}&branchCode=${loginBranchCode}&client=${loginClient}&createdBy=${loginUserName}&customer=${loginCustomer}&finYear=${loginFinYear}&orgId=${orgId}&type=DOC&warehouse=${loginWarehouse}`}
            screen="Item Wise Process Master"
          ></CommonBulkUpload>
        )}
        {listView ? (
          <div className="mt-4">
            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getAllItemWiseProcessMasterById} />
          </div>
          ) : (
                        <div className="row mt-2">
                          <div className="col-lg-6">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Operation Name</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detailsTableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="col-md-1 border px-2 py-2 text-center">
                                        <ActionButton
                                        className=" mb-2"
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
                                      <td className="text-center col-md-1 mb-3">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="col-md-4 mb-3">
                                        <Autocomplete
                                          options={allOperationName}
                                          getOptionLabel={(option) => option.OperationName || ''}
                                          groupBy={(option) => (option.OperationName ? option.OperationName[0].toUpperCase() : '')}
                                          value={row.operationName ? allOperationName.find((a) => a.OperationName === row.operationName) : null}
                                          onChange={(event, newValue) => {
                                            const value = newValue ? newValue.OperationName : '';
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, OperationName: value } : r))
                                            );
                                            setDetailsTableErrors((prevErrors) =>
                                              prevErrors.map((err, idx) => (idx === index ? { ...err, OperationName: '' } : err))
                                            );
                                          }}
                                          size="small"
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Operation Name"
                                              variant="outlined"
                                              error={!!detailsTableErrors[index]?.operationName}
                                              helperText={detailsTableErrors[index]?.operationName}
                                            />
                                          )}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
          )}
                      </div>
                    </>
                  )}
                </Box>
              </div>
            </>
          ) : (   <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllItemWiseProcessMasterById} />
          )}
        </div>
      </div>
    </>
    );
}

export default ItemWiseProcess;
