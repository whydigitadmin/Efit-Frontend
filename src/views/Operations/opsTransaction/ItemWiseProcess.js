import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, Autocomplete, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
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
  const [itemAndDesc, setItemAndDesc] = useState([]);
  const [allOperationName, setOperationName] = useState([]);
  const [docId, setDocId] = useState('');
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
      processName:''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
       processName:''
    }
  ]);

  useEffect(() => {
    getOperationName();
    getDocId();
    getItemAndDesc();
    getAllItemWiseProcesByOrgId();
  }, []);

  const getAllItemWiseProcessMasterById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/efitmaster/getItemWiseProcessMasterById?id=${row.original.id}`);

      if (result) {
        const iwpmVO = result.paramObjectsMap.ItemWiseProcessMasterVO[0];
        setEditId(row.original.id);
        setDocId(iwpmVO.docId);
        setFormData({
          processType: iwpmVO.processType,
          item: iwpmVO.item,
          itemDescription: iwpmVO.itemDesc,
          orgId: iwpmVO.orgId
        });
        setDetailsTableData(
          iwpmVO.itemWiseProcessDetailsVO.map((row) => ({
            id: row.id,
            processName: row.processName
          }))
        );
        console.log('DataToEdit', iwpmVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllItemWiseProcesByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/efitmaster/getItemWiseProcessMasterByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.ItemWiseProcessMasterVO || []);
      // showForm(true);
      console.log('ItemWiseProcessMasterVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getItemAndDesc = async () => {
    try {
      const response = await apiCalls('get', `/efitmaster/getItemAndItemDescforItemWiseProcess?orgId=${orgId}`);
      console.log('getItemandDesc:', response);
      setItemAndDesc(response.paramObjectsMap.itemWiseProcessVO)
      
    } catch (error) {
      console.error('Error fetching ItemWise Process Master data:', error);
    }
  };
  const getDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/efitmaster/getItemWiseProcessMasterDocId?orgId=${orgId}`
      );
      setDocId(response.paramObjectsMap.itemWiseProcessMasterDocId);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };
  const getOperationName = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/efitmaster/getProcessNameFromItemWiseProcess?orgId=${orgId}`
      );
      setOperationName(response.paramObjectsMap.ItemVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
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
      { id: 1,   processName:'' }
    ]);
    setDetailsTableErrors('');
    setEditId('');
    getDocId();
  };

  const handleInputChange = (e) => {
    const { name, value, selectionStart, selectionEnd, type } = e.target;
    let errorMessage = '';
    let updatedFormData = { ...formData, [name]: value };
  
    if (name === 'item') {
      const selectedItem = itemAndDesc.find((item) => item.itemName === value);
      updatedFormData = {
        ...updatedFormData,
        itemDescription: selectedItem ? selectedItem.itemDesc : '',
      };
    }
  
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: errorMessage,
    }));
    setFormData(updatedFormData);
  
    // Preserve cursor position for text inputs
    if ((type === 'text' || type === 'textarea') && !errorMessage) {
      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement && inputElement.setSelectionRange) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
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
      processName:''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([
      ...detailsTableErrors,
      {   processName:'' }
    ]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return (
        !lastRow.processName 
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
            processName: !table[table.length - 1].processName ? 'Operation Name is required' : ''
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

  const handleSave = async () => {
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
      if (!row.processName) {
        rowErrors.processName = 'Operation Name is required';
        detailTableDataValid = false;
      }
      return rowErrors;
    });
    setFieldErrors(errors);
    setDetailsTableErrors(newTableErrors);
    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const ItemWiseProcessVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        processName: row.processName
  }));
  const saveFormData = {
    ...(editId && { id: editId }),
    branch: branch,
          branchCode: branchCode,
          createdBy: loginUserName,
          finYear: finYear,
          orgId: orgId,
          itemWiseProcessDetailsDTO: ItemWiseProcessVO,
          item: formData.item,
          itemDesc: formData.itemDescription,
          processType: formData.processType
  };
  console.log('DATA TO SAVE IS:', saveFormData);
  try {
          const response = await apiCalls('put', `/efitmaster/updateCreateItemWiseProcessMaster`, saveFormData);
          if (response.status === true) {
            console.log('Response:', response);
            showToast('success', editId ? 'Item Wise Process Master Updated Successfully' : 'Item Wise Process Master Created successfully');
            getAllItemWiseProcesByOrgId();
            handleClear();
          } else {
            showToast('error', response.paramObjectsMap.message || 'Item Wise Process Master creation failed');
          }
        } catch (error) {
          console.error('Error:', error);
          showToast('error', 'Item Wise Process Master creation failed');
        }
    } else {
      setFieldErrors(errors);
    }
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
                <FormControl fullWidth size="small" error={!!fieldErrors.item}>
                  <InputLabel id="demo-simple-select-label">
                    {
                      <span>
                        Item <span className="asterisk">*</span>
                      </span>
                    }
                  </InputLabel>
                  <Select
                    labelId="item"
                    id="item"
                    label="Item"
                    required
                    value={formData.item}
                    name="item"
                    onChange={handleInputChange}
                  >
                    {itemAndDesc.map((item) => (
                      <MenuItem key={item.id} value={item.itemName}>
                        {item.itemName}
                      </MenuItem>
                    ))}
                  </Select>
                  {fieldErrors.item && (
                    <p className="error-text" style={{ color: 'red', fontSize: '12px', paddingLeft: '15px', paddingTop: '4px' }}>
                      {fieldErrors.item}
                    </p>
                  )}
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
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.itemDescription}
                    helperText={fieldErrors.itemDescription}
                    disabled
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
                        </div>
                        
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
                                          getOptionLabel={(option) => option.processName || ''}
                                          groupBy={(option) => (option.processName ? option.processName[0].toUpperCase() : '')}
                                          value={row.processName ? allOperationName.find((a) => a.processName === row.processName) : null}
                                          onChange={(event, newValue) => {
                                            const value = newValue ? newValue.processName : '';
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, processName: value } : r))
                                            );
                                            setDetailsTableErrors((prevErrors) =>
                                              prevErrors.map((err, idx) => (idx === index ? { ...err, processName: '' } : err))
                                            );    
                                          }}
                                          size="small"
                                          renderInput={(params) => (
                                            <TextField
                                              {...params}
                                              label="Operation Name"
                                              variant="outlined"
                                              error={!!detailsTableErrors[index]?.processName}
                                              helperText={detailsTableErrors[index]?.processName}
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
