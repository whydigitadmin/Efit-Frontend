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
import { FormHelperText } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';

const ItemMaster = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();

  const [formData, setFormData] = useState({
    itemName: '',
    needQcApproval: '',
    itemType: '',
    inspection: '',
    materialType: '',
    materialGroup: '',
    materialSubGroup: '',
    itemDescription: '',
    instrumentSeqCode: '',
    primaryUnit: '',
    hsnCode: '',
    importLocal: '',
    minimumOrderQuantity: '',
    stockLocation: '',
    reorderLevel: '',
    active: true
  });
  const [fieldErrors, setFieldErrors] = useState({
    itemName: '',
    needQcApproval: '',
    itemType: '',
    inspection: '',
    materialType: '',
    materialGroup: '',
    materialSubGroup: '',
    itemDescription: '',
    instrumentSeqCode: '',
    primaryUnit: '',
    hsnCode: '',
    importLocal: '',
    minimumOrderQuantity: '',
    stockLocation: '',
    reorderLevel: '',
    active: true
  });
  const [isLoading, setIsLoading] = useState(false);
  const [taxSlabData, setTaxSlabData] = useState([
    {
      id: 1,
      taxSlab: '',
      taxEffectiveFrom: ''
    }
  ]);
  const [taxSlabErrors, setTaxSlabErrors] = useState([
    {
      taxSlab: '',
      taxEffectiveFrom: ''
    }
  ]);
  const [priceSlabData, setPriceSlabData] = useState([
    {
      id: 1,
      price: '',
      priceEffectiveFrom: ''
    }
  ]);
  const [priceSlabErrors, setPriceSlabErrors] = useState([
    {
      price: '',
      priceEffectiveFrom: ''
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
    if (isLastRowEmpty(taxSlabData)) {
      displayRowError(taxSlabData);
      return;
    }
    const newRow = {
      id: Date.now(),
      taxSlab: '',
      taxEffectiveFrom: ''
    };
    setTaxSlabData([...taxSlabData, newRow]);
    setTaxSlabErrors([...taxSlabErrors, { taxSlab: '', taxEffectiveFrom: '' }]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === taxSlabData) {
      return !lastRow.taxSlab || !lastRow.taxEffectiveFrom;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === taxSlabData) {
      setTaxSlabErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          taxSlab: !table[table.length - 1].taxSlab ? 'Tax Slab is required' : '',
          taxEffectiveFrom: !table[table.length - 1].taxEffectiveFrom ? 'Tax Effective From is required' : ''
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

  const handlePriceKeyDown = (e, row, table) => {
    if (e.key === 'Tab' && row.id === table[table.length - 1].id) {
      e.preventDefault();
      if (isLastRowEmptyPrice(table)) {
        displayPriceRowError(table);
      } else {
        handlePriceAddRow();
      }
    }
  };

  const handlePriceAddRow = () => {
    if (isLastRowEmptyPrice(priceSlabData)) {
      displayPriceRowError(priceSlabData);
      return;
    }
    const newRow = {
      id: Date.now(),
      price: '',
      priceEffectiveFrom: ''
    };
    setPriceSlabData([...priceSlabData, newRow]);
    setPriceSlabErrors([...priceSlabErrors, { price: '', priceEffectiveFrom: '' }]);
  };
  const isLastRowEmptyPrice = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === priceSlabData) {
      return !lastRow.price || !lastRow.priceEffectiveFrom;
    }
    return false;
  };

  const displayPriceRowError = (table) => {
    if (table === taxSlabData) {
      setPriceSlabErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          price: !table[table.length - 1].price ? 'Price is required' : '',
          priceEffectiveFrom: !table[table.length - 1].priceEffectiveFrom ? 'Price Effective From is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handlePriceDeleteRow = (id, table, setTable, errorTable, setErrorTable) => {
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
      itemName: '',
      needQcApproval: '',
      itemType: '',
      inspection: '',
      materialType: '',
      materialGroup: '',
      materialSubGroup: '',
      itemDescription: '',
      instrumentSeqCode: '',
      primaryUnit: '',
      hsnCode: '',
      importLocal: '',
      minimumOrderQuantity: '',
      stockLocation: '',
      reorderLevel: '',
      active: true
    });
    setFieldErrors({});
    setTaxSlabData([
      {
        id: 1,
        taxSlab: '',
        taxEffectiveFrom: ''
      }
    ]);
    setTaxSlabErrors('');
    setPriceSlabData([
      {
        id: 1,
        price: '',
        priceEffectiveFrom: ''
      }
    ]);
    setPriceSlabErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.itemName) errors.itemName = 'Item Name is required';
    if (!formData.needQcApproval) errors.needQcApproval = 'Need Qc Approval is required';
    if (!formData.itemType) errors.itemType = 'Item Type is required';
    if (!formData.inspection) errors.inspection = 'Inspection is required';
    if (!formData.materialType) errors.materialType = 'Material Type is required';
    if (!formData.materialGroup) errors.materialGroup = 'Material Group is required';
    if (!formData.materialSubGroup) errors.materialSubGroup = 'Material Sub Group is required';
    if (!formData.itemDescription) errors.itemDescription = 'Item Description is required';
    if (!formData.instrumentSeqCode) errors.instrumentSeqCode = 'Instrument Seq Code is required';
    if (!formData.primaryUnit) errors.primaryUnit = 'Primary Unit is required';
    if (!formData.hsnCode) errors.hsnCode = 'Hsn Code is required';
    if (!formData.importLocal) errors.importLocal = 'Import Local is required';
    if (!formData.minimumOrderQuantity) errors.minimumOrderQuantity = 'Minimum Order Quantity is required';
    if (!formData.stockLocation) errors.stockLocation = 'Stock Location is required';
    if (!formData.reorderLevel) errors.reorderLevel = 'Reorder Level is required';

    let taxSlabDataValid = true;
    if (!taxSlabData || !Array.isArray(taxSlabData) || taxSlabData.length === 0) {
      taxSlabDataValid = false;
      setTaxSlabErrors([{ general: 'Tax Slab Data is required' }]);
    } else {
      const newTableErrors = taxSlabData.map((row, index) => {
        const rowErrors = {};
        if (!row.taxSlab) {
          rowErrors.taxSlab = 'Tax Slab is required';
          taxSlabDataValid = false;
        }
        if (!row.taxEffectiveFrom) {
          rowErrors.taxEffectiveFrom = 'Tax Effective From is required';
          taxSlabDataValid = false;
        }

        return rowErrors;
      });
      setTaxSlabErrors(newTableErrors);
    }

    let priceSlabDataValid = true;
    if (!priceSlabData || !Array.isArray(priceSlabData) || priceSlabData.length === 0) {
      priceSlabDataValid = false;
      setPriceSlabErrors([{ general: 'Tax Slab Data is required' }]);
    } else {
      const newTableErrors = priceSlabData.map((row, index) => {
        const rowErrors = {};
        if (!row.price) {
          rowErrors.price = 'Price is required';
          priceSlabDataValid = false;
        }
        if (!row.priceEffectiveFrom) {
          rowErrors.priceEffectiveFrom = 'Price Effective From is required';
          priceSlabDataValid = false;
        }

        return rowErrors;
      });
      setPriceSlabErrors(newTableErrors);
    }
    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && taxSlabDataValid && priceSlabDataValid) {
      setIsLoading(true);

      const detailsVo = taxSlabData.map((row) => ({
        ...(editId && { id: row.id }),
        valueCode: row.valueCode,
        valueDescription: row.valueDesc,
        active: row.active === 'true' || row.active === true // Convert string 'true' to boolean true if necessary
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
  //       setTaxSlabData(
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.itemType}>
                  <InputLabel id="itemType">Item Type</InputLabel>
                  <Select
                    labelId="itemType"
                    id="itemType"
                    label="Item Type"
                    onChange={handleInputChange}
                    name="itemType"
                    value={formData.itemType}
                  >
                    <MenuItem value="FG">FG</MenuItem>
                    <MenuItem value="SFG">SFG</MenuItem>
                    <MenuItem value="Raw Material">Raw Material</MenuItem>
                  </Select>
                  {fieldErrors.itemType && <FormHelperText>{fieldErrors.itemType}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="itemName"
                    label={
                      <span>
                        Item Name <span className="asterisk">*</span>
                      </span>
                    }
                    name="itemName"
                    size="small"
                    value={formData.itemName}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.itemName}
                    helperText={fieldErrors.itemName}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="itemDescription"
                    label={
                      <span>
                        Item Description <span className="asterisk">*</span>
                      </span>
                    }
                    name="itemDescription"
                    size="small"
                    value={formData.itemDescription}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.itemDescription}
                    helperText={fieldErrors.itemDescription}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.needQcApproval}>
                  <InputLabel id="needQcApproval">Need QC Approval</InputLabel>
                  <Select
                    labelId="needQcApproval"
                    id="needQcApproval"
                    label="Need QC Approval"
                    onChange={handleInputChange}
                    name="needQcApproval"
                    value={formData.needQcApproval}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.needQcApproval && <FormHelperText>{fieldErrors.needQcApproval}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.materialType}>
                  <InputLabel id="materialType">Material Type</InputLabel>
                  <Select
                    labelId="materialType"
                    id="materialType"
                    label="Material Type"
                    onChange={handleInputChange}
                    name="materialType"
                    value={formData.materialType}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.materialType && <FormHelperText>{fieldErrors.materialType}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.materialGroup}>
                  <InputLabel id="materialGroup">Material Group</InputLabel>
                  <Select
                    labelId="materialGroup"
                    id="materialGroup"
                    label="Material Group"
                    onChange={handleInputChange}
                    name="materialGroup"
                    value={formData.materialGroup}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.materialGroup && <FormHelperText>{fieldErrors.materialGroup}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.materialSubGroup}>
                  <InputLabel id="materialSubGroup">Material Sub Group</InputLabel>
                  <Select
                    labelId="materialSubGroup"
                    id="materialSubGroup"
                    label="Material Sub Group"
                    onChange={handleInputChange}
                    name="materialSubGroup"
                    value={formData.materialSubGroup}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.materialSubGroup && <FormHelperText>{fieldErrors.materialSubGroup}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.inspection}>
                  <InputLabel id="inspection">Inspection</InputLabel>
                  <Select
                    labelId="inspection"
                    id="inspection"
                    label="Inspection"
                    onChange={handleInputChange}
                    name="inspection"
                    value={formData.inspection}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.inspection && <FormHelperText>{fieldErrors.inspection}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="instrumentSeqCode"
                    label={
                      <span>
                        Instrument Seq-Code <span className="asterisk">*</span>
                      </span>
                    }
                    size="small"
                    name="instrumentSeqCode"
                    value={formData.instrumentSeqCode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.instrumentSeqCode}
                    helperText={fieldErrors.instrumentSeqCode}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.primaryUnit}>
                  <InputLabel id="primaryUnit">Primary Unit</InputLabel>
                  <Select
                    labelId="primaryUnit"
                    id="primaryUnit"
                    label="Primary Unit"
                    onChange={handleInputChange}
                    name="primaryUnit"
                    value={formData.primaryUnit}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.primaryUnit && <FormHelperText>{fieldErrors.primaryUnit}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="hsnCode"
                    label={
                      <span>
                        HSN Code <span className="asterisk">*</span>
                      </span>
                    }
                    size="small"
                    name="hsnCode"
                    value={formData.hsnCode}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.hsnCode}
                    helperText={fieldErrors.hsnCode}
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
                  <Tab value={0} label="Item Inventory" />
                  <Tab value={1} label="Tax Slab" />
                  <Tab value={2} label="Price Slab" />
                </Tabs>
              </Box>
              <Box sx={{ padding: 2 }}>
                {value === 0 && (
                  <>
                    <div className="row d-flex">
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.importLocal}>
                          <InputLabel id="importLocal">Import Local</InputLabel>
                          <Select
                            labelId="importLocal"
                            id="importLocal"
                            label="Import Local"
                            onChange={handleInputChange}
                            name="importLocal"
                            value={formData.importLocal}
                          >
                            <MenuItem value="Head Office">Head Office</MenuItem>
                            <MenuItem value="Branch">Branch</MenuItem>
                          </Select>
                          {fieldErrors.importLocal && <FormHelperText>{fieldErrors.importLocal}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="minimumOrderQuantity"
                            label={
                              <span>
                                Minimum Order Quantity<span className="asterisk">*</span>
                              </span>
                            }
                            name="minimumOrderQuantity"
                            size="small"
                            value={formData.minimumOrderQuantity}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.minimumOrderQuantity}
                            helperText={fieldErrors.minimumOrderQuantity}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.stockLocation}>
                          <InputLabel id="stockLocation">Stock Location</InputLabel>
                          <Select
                            labelId="stockLocation"
                            id="stockLocation"
                            label="Primary Unit"
                            onChange={handleInputChange}
                            name="stockLocation"
                            value={formData.stockLocation}
                          >
                            <MenuItem value="Head Office">Head Office</MenuItem>
                            <MenuItem value="Branch">Branch</MenuItem>
                          </Select>
                          {fieldErrors.stockLocation && <FormHelperText>{fieldErrors.stockLocation}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="reorderLevel"
                            label={
                              <span>
                                Reorder Level <span className="asterisk">*</span>
                              </span>
                            }
                            name="reorderLevel"
                            size="small"
                            value={formData.reorderLevel}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.reorderLevel}
                            helperText={fieldErrors.reorderLevel}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </>
                )}
                {value === 1 && (
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
                                    Tax Slab
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Effective From
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {taxSlabData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(row.id, taxSlabData, setTaxSlabData, taxSlabErrors, setTaxSlabErrors)
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
                                        value={row.taxSlab}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTaxSlabData((prev) => prev.map((r) => (r.id === row.id ? { ...r, taxSlab: value } : r)));
                                          setTaxSlabErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              taxSlab: !value ? 'Tax Slab is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={taxSlabErrors[index]?.taxSlab ? 'error form-control' : 'form-control'}
                                      />
                                      {taxSlabErrors[index]?.taxSlab && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {taxSlabErrors[index].taxSlab}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.taxEffectiveFrom}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTaxSlabData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, taxEffectiveFrom: value } : r))
                                          );
                                          setTaxSlabErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              taxEffectiveFrom: !value ? 'Tax Effective From is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={taxSlabErrors[index]?.taxEffectiveFrom ? 'error form-control' : 'form-control'}
                                      />
                                      {taxSlabErrors[index]?.taxEffectiveFrom && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {taxSlabErrors[index].taxEffectiveFrom}
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
                {value === 2 && (
                  <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handlePriceAddRow} />
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
                                    Price
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Effective From
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {priceSlabData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handlePriceDeleteRow(row.id, priceSlabData, setPriceSlabData, priceSlabErrors, setPriceSlabErrors)
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
                                        value={row.price}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPriceSlabData((prev) => prev.map((r) => (r.id === row.id ? { ...r, price: value } : r)));
                                          setPriceSlabErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              price: !value ? 'Price is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={priceSlabErrors[index]?.price ? 'error form-control' : 'form-control'}
                                      />
                                      {priceSlabErrors[index]?.price && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {priceSlabErrors[index].price}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.priceEffectiveFrom}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setPriceSlabData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, priceEffectiveFrom: value } : r))
                                          );
                                          setPriceSlabErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              priceEffectiveFrom: !value ? 'Price Effective From is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={priceSlabErrors[index]?.priceEffectiveFrom ? 'error form-control' : 'form-control'}
                                      />
                                      {priceSlabErrors[index]?.priceEffectiveFrom && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {priceSlabErrors[index].priceEffectiveFrom}
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

export default ItemMaster;
