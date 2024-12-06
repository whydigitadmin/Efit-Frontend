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
import CommonListViewTable from 'views/basicMaster/CommonListViewTable';

const ItemMaster = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId')));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();
  const [unitList, setUnitList] = useState([]);
  const [materialTypeList, setMaterialTypeList] = useState([]);
  const [materialGroupList, setMaterialGroupList] = useState([]);
  const [materialSubGroupList, setMaterialSubGroupList] = useState([]);
  const [stockLocationList, setStockLocationList] = useState([]);

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
    active: true
  });

  const [itemInventoryData, setItemInventoryData] = useState({
    importLocal: '',
    minimumOrderQuantity: '',
    stockLocation: '',
    reorderLevel: ''
  });
  const [itemInventoryErrors, setIemInventoryErrors] = useState({
    importLocal: '',
    minimumOrderQuantity: '',
    stockLocation: '',
    reorderLevel: ''
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
    { accessorKey: 'itemName', header: 'Item Name', size: 140 },
    { accessorKey: 'itemType', header: 'Item Type', size: 140 },
    { accessorKey: 'materialType', header: 'Material Type', size: 140 },
    { accessorKey: 'inspection', header: 'Inspection', size: 140 },
    { accessorKey: 'primaryUnit', header: 'Primary Unit', size: 140 },
    { accessorKey: 'active', header: 'Active', size: 140 }
  ];

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const inputValue = type === 'checkbox' ? checked : value;

    // Regular expression to allow only numbers, alphabets, spaces, and '-'
    const validInputRegex = /^[a-zA-Z0-9\s\-]*$/;

    // Fields that require specific validation
    const restrictedFields = ['itemName', 'itemDescription', 'instrumentSeqCode', 'hsnCode']; // Add any additional fields here
    if (restrictedFields.includes(name) && !validInputRegex.test(inputValue)) {
      setFieldErrors((prevErrors) => ({
        ...prevErrors,
        [name]: 'Only alphabets and numbers are allowed.'
      }));
      return; // Exit without updating form data if validation fails
    }

    // Regular expression for valid decimal values (e.g., 0.00)
    const validDecimalRegex = /^\d*(\.\d{0,2})?$/;

    // Specific fields that require decimal validation
    const decimalFields = ['minimumOrderQuantity', 'reorderLevel'];

    // Validate decimal fields
    if (decimalFields.includes(name)) {
      if (!validDecimalRegex.test(inputValue)) {
        setIemInventoryErrors((prevErrors) => ({
          ...prevErrors,
          [name]: 'Only decimal values are allowed (e.g., 0.00).'
        }));
        return; // Exit without updating form data if validation fails
      } else {
        // Clear errors for valid decimal input
        setIemInventoryErrors((prevErrors) => ({
          ...prevErrors,
          [name]: ''
        }));
      }
    }

    // Clear field errors for the updated field
    setFieldErrors((prevErrors) => ({
      ...prevErrors,
      [name]: false
    }));

    // Update form data
    const updatedFormData = { ...formData, [name]: inputValue };
    setFormData(updatedFormData);

    // Additional logic for materialType and materialGroup
    if (name === 'materialType') {
      if (inputValue) {
        getAllMaterialGroup(inputValue); // Fetch material groups for the selected materialType
        setMaterialSubGroupList([]); // Clear material sub-groups
      } else {
        setMaterialGroupList([]); // Clear material groups
        setMaterialSubGroupList([]); // Clear material sub-groups
      }
    }

    if (name === 'materialGroup' || name === 'materialType') {
      const materialType = updatedFormData.materialType;
      const materialGroup = name === 'materialGroup' ? inputValue : updatedFormData.materialGroup;

      if (materialType && materialGroup) {
        getAllMaterialSubGroup(materialType, materialGroup);
      } else {
        setMaterialSubGroupList([]); // Clear material sub-groups if inputs are missing
      }
    }

    // Update inventory data
    const updatedInventoryData = { ...itemInventoryData, [name]: inputValue };
    setItemInventoryData(updatedInventoryData);

    // Clear inventory errors for the specific field
    setIemInventoryErrors((prevErrors) => ({
      ...prevErrors,
      [name]: ''
    }));
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
    if (table === priceSlabData) {
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
      active: true
    });
    setFieldErrors({});
    setItemInventoryData({
      importLocal: '',
      minimumOrderQuantity: '',
      stockLocation: '',
      reorderLevel: ''
    });
    setIemInventoryErrors({});
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

  useEffect(() => {
    getAllUnit();
    getAllMaterialType();
    getAllStockLocationList();
    getAllItemMasterByOrgId();
  }, []);

  const getAllUnit = async () => {
    try {
      const response = await apiCalls('get', `efitmaster/getUomByOrgId?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setUnitList(response.paramObjectsMap.uomVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllMaterialType = async () => {
    try {
      const response = await apiCalls('get', `efitmaster/getMaterialTypeForItemMaster?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setMaterialTypeList(response.paramObjectsMap.ItemVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllMaterialGroup = async (materialType) => {
    try {
      const response = await apiCalls('get', `efitmaster/getMaterialGroupFromMaterialType?materialType=${materialType}&orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setMaterialGroupList(response.paramObjectsMap.ItemVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllMaterialSubGroup = async (materialType, materialGroup) => {
    try {
      const response = await apiCalls(
        'get',
        `efitmaster/getMaterialSubGroupFromMaterialType?materialGroup=${materialGroup}&materialType=${materialType}&orgId=${orgId}`
      );
      console.log('API Response:', response);

      if (response.status === true) {
        setMaterialSubGroupList(response.paramObjectsMap.ItemVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllStockLocationList = async (materialType, materialGroup) => {
    try {
      const response = await apiCalls('get', `efitmaster/getStockLocationForItemMaster?orgId=${orgId}`);
      console.log('API Response:', response);

      if (response.status === true) {
        setStockLocationList(response.paramObjectsMap.ItemVO);
      } else {
        console.error('API Error:', response);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAllItemMasterByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/efitmaster/getItemByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.itemVO || []);
      showForm(true);
      console.log('Test', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getItemMasterById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/efitmaster/getItemById?id=${row.original.id}`);

      if (result) {
        const itemValueVO = result.paramObjectsMap.itemVO[0];
        setEditId(row.original.id);

        // Pre-fetch dependent data
        if (itemValueVO.materialType) {
          await getAllMaterialGroup(itemValueVO.materialType);
        }
        if (itemValueVO.materialType && itemValueVO.materialGroup) {
          await getAllMaterialSubGroup(itemValueVO.materialType, itemValueVO.materialGroup);
        }

        setFormData({
          itemType: itemValueVO.itemType || '',
          itemName: itemValueVO.itemName || '',
          itemDescription: itemValueVO.itemDesc || '',
          needQcApproval: itemValueVO.needqcapproval || '',
          materialType: itemValueVO.materialType || '',
          materialGroup: itemValueVO.materialGroup || '',
          materialSubGroup: itemValueVO.materialSubGroup || '',
          inspection: itemValueVO.inspection || '',
          instrumentSeqCode: itemValueVO.instrumentSeqCode || '',
          primaryUnit: itemValueVO.primaryUnit || '',
          hsnCode: itemValueVO.hsnCode || '',
          active: itemValueVO.active === 'Active' ? true : false
          // id: itemValueVO.id || 0
        });
        if (itemValueVO.itemInventoryVO && itemValueVO.itemInventoryVO.length > 0) {
          const inventoryData = itemValueVO.itemInventoryVO[0]; // Assuming one record for now
          setItemInventoryData({
            id: inventoryData.id || '',
            importLocal: inventoryData.importLocal || '',
            minimumOrderQuantity: inventoryData.minOrderQuantity || '',
            stockLocation: inventoryData.stockLocation || '',
            reorderLevel: inventoryData.reOrderLevel || ''
          });
        } else {
          setItemInventoryData({
            importLocal: '',
            minimumOrderQuantity: '',
            stockLocation: '',
            reorderLevel: ''
          });
        }
        setTaxSlabData(
          itemValueVO.itemTaxSlabVO.map((tax) => ({
            id: tax.id,
            taxSlab: tax.taxSlab,
            taxEffectiveFrom: tax.taxEffectiveFrom
          }))
        );
        setPriceSlabData(
          itemValueVO.itemPriceSlabVO.map((price) => ({
            id: price.id,
            price: price.price,
            priceEffectiveFrom: price.priceEffectiveFrom
          }))
        );

        console.log('DataToEdit', itemValueVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};

    // Validate required fields in formData
    if (!formData.itemType) errors.itemType = 'Item Type is required';
    if (!formData.itemName) errors.itemName = 'Item Name is required';
    if (!formData.itemDescription) errors.itemDescription = 'Item Description is required';
    if (!formData.needQcApproval) errors.needQcApproval = 'Need Qc Approval is required';
    if (!formData.materialType) errors.materialType = 'Material Type is required';
    if (!formData.materialGroup) errors.materialGroup = 'Material Group is required';
    if (!formData.materialSubGroup) errors.materialSubGroup = 'Material Sub Group is required';
    if (!formData.inspection) errors.inspection = 'Inspection is required';
    if (!formData.instrumentSeqCode) errors.instrumentSeqCode = 'Instrument Seq Code is required';
    if (!formData.primaryUnit) errors.primaryUnit = 'Primary Unit is required';
    if (!formData.hsnCode) errors.hsnCode = 'HSN Code is required';

    let itemInventoryDataValid = true;
    const newErrors = { ...itemInventoryErrors };

    if (!itemInventoryData.importLocal) {
      newErrors.importLocal = 'Import Local is required';
      itemInventoryDataValid = false;
    }
    if (!itemInventoryData.minimumOrderQuantity) {
      newErrors.minimumOrderQuantity = 'Minimum Order Quantity is required';
      itemInventoryDataValid = false;
    }
    if (!itemInventoryData.reorderLevel) {
      newErrors.reorderLevel = 'Reorder Level is required';
      itemInventoryDataValid = false;
    }
    if (!itemInventoryData.stockLocation) {
      newErrors.stockLocation = 'Stock Location is required';
      itemInventoryDataValid = false;
    }

    setIemInventoryErrors(newErrors);

    // Validate `itemTaxSlabDTO`
    let taxSlabDataValid = true;
    if (!taxSlabData || !Array.isArray(taxSlabData) || taxSlabData.length === 0) {
      taxSlabDataValid = false;
      setTaxSlabErrors([{ general: 'Tax Slab Data is required' }]);
    } else {
      const newTableErrors = taxSlabData.map((row) => {
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

    // Validate `itemPriceSlabDTO`
    let priceSlabDataValid = true;
    if (!priceSlabData || !Array.isArray(priceSlabData) || priceSlabData.length === 0) {
      priceSlabDataValid = false;
      setPriceSlabErrors([{ general: 'Price Slab Data is required' }]);
    } else {
      const newTableErrors = priceSlabData.map((row) => {
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

    // Proceed if no errors
    if (Object.keys(errors).length === 0 && itemInventoryDataValid && taxSlabDataValid && priceSlabDataValid) {
      setIsLoading(true);

      const itemInventoryDTO = [
        {
          ...(editId && { id: editId }),
          importLocal: itemInventoryData.importLocal,
          minOrderQuantity: itemInventoryData.minimumOrderQuantity,
          reOrderLevel: itemInventoryData.reorderLevel,
          stockLocation: itemInventoryData.stockLocation
        }
      ];
      const priceSlabDTO = priceSlabData.map((row) => ({
        ...(editId && { id: row.id }),
        price: row.price,
        priceEffectiveFrom: row.priceEffectiveFrom
      }));
      const taxSlabDTO = taxSlabData.map((row) => ({
        ...(editId && { id: row.id }),
        taxEffectiveFrom: row.taxEffectiveFrom,
        taxSlab: row.taxSlab
      }));

      // Prepare save data structure
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        // active: formData.active === true ? true : false,
        createdBy: loginUserName,
        hsnCode: formData.hsnCode,
        inspection: formData.inspection,
        instrumentSeqCode: formData.instrumentSeqCode,
        itemDesc: formData.itemDescription,
        itemInventoryDTO: itemInventoryDTO,
        itemName: formData.itemName,
        itemPriceSlabDTO: priceSlabDTO,
        itemTaxSlabDTO: taxSlabDTO,
        itemType: formData.itemType,
        materialGroup: formData.materialGroup,
        materialSubGroup: formData.materialSubGroup,
        materialType: formData.materialType,
        needQcApproval: formData.needQcApproval,
        orgId: orgId,
        primaryUnit: formData.primaryUnit
      };

      console.log('DATA TO SAVE IS:', saveFormData);

      try {
        const response = await apiCalls('put', '/efitmaster/updateCreateItemMaster', saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'Item Master updated successfully' : 'Item Master created successfully');
          handleClear();
          getAllItemMasterByOrgId();
          setIsLoading(false);
        } else {
          showToast('error', response.paramObjectsMap?.errorMessage || 'Failed to save item');
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'Failed to save item');
        setIsLoading(false);
      }
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
                    <MenuItem value="Instrument">Instrument</MenuItem>
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
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
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
                    {materialTypeList.map((material) => (
                      <MenuItem key={material.id} value={material.materialType}>
                        {material.materialType}
                      </MenuItem>
                    ))}
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
                    {materialGroupList.map((group) => (
                      <MenuItem key={group.id} value={group.materialGroup}>
                        {group.materialGroup}
                      </MenuItem>
                    ))}
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
                    {materialSubGroupList.map((subGroup) => (
                      <MenuItem key={subGroup.id} value={subGroup.materialSubGroup}>
                        {subGroup.materialSubGroup}
                      </MenuItem>
                    ))}
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
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
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
                    {unitList.map((unit) => (
                      <MenuItem key={unit.id} value={unit.uomCode}>
                        {unit.uomCode}
                      </MenuItem>
                    ))}
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
                        <FormControl size="small" variant="outlined" fullWidth error={!!itemInventoryErrors.importLocal}>
                          <InputLabel id="importLocal">Import Local</InputLabel>
                          <Select
                            labelId="importLocal"
                            id="importLocal"
                            label="Import Local"
                            onChange={handleInputChange}
                            name="importLocal"
                            value={itemInventoryData.importLocal}
                          >
                            <MenuItem value="Yes">Yes</MenuItem>
                            <MenuItem value="No">No</MenuItem>
                          </Select>
                          {itemInventoryErrors.importLocal && <FormHelperText>{itemInventoryErrors.importLocal}</FormHelperText>}
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
                            value={itemInventoryData.minimumOrderQuantity}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!itemInventoryErrors.minimumOrderQuantity}
                            helperText={itemInventoryErrors.minimumOrderQuantity}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!itemInventoryErrors.stockLocation}>
                          <InputLabel id="stockLocation">Stock Location</InputLabel>
                          <Select
                            labelId="stockLocation"
                            id="stockLocation"
                            label="Primary Unit"
                            onChange={handleInputChange}
                            name="stockLocation"
                            value={itemInventoryData.stockLocation}
                          >
                            {stockLocationList.map((stock) => (
                              <MenuItem key={stock.id} value={stock.stockLocation}>
                                {stock.stockLocation}
                              </MenuItem>
                            ))}
                          </Select>
                          {itemInventoryErrors.stockLocation && <FormHelperText>{itemInventoryErrors.stockLocation}</FormHelperText>}
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
                            value={itemInventoryData.reorderLevel}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!itemInventoryErrors.reorderLevel}
                            helperText={itemInventoryErrors.reorderLevel}
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
                                        type="text"
                                        value={row.taxSlab}
                                        onChange={(e) => {
                                          const value = e.target.value;

                                          // Regular expression to allow only alphabets, numbers, space, hyphen, and percentage symbol
                                          const validInputRegex = /^[a-zA-Z0-9\s\-%-]*$/;

                                          // Check if the value matches the valid input pattern
                                          if (!validInputRegex.test(value)) {
                                            setTaxSlabErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                taxSlab: 'Invalid characters are allowed.'
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setTaxSlabErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                taxSlab: '' // Clear the error message if the input is valid
                                              };
                                              return newErrors;
                                            });
                                          }

                                          // Update the taxSlab data only if valid
                                          if (validInputRegex.test(value)) {
                                            setTaxSlabData((prev) => prev.map((r) => (r.id === row.id ? { ...r, taxSlab: value } : r)));
                                          }
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
                                        type="date"
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
                                        type="text"
                                        value={row.price}
                                        onChange={(e) => {
                                          const value = e.target.value;

                                          // Regular expression to allow only decimal values like 0.00
                                          const validDecimalRegex = /^\d*(\.\d{0,2})?$/;

                                          // Validate the input
                                          if (!validDecimalRegex.test(value)) {
                                            setPriceSlabErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                price: 'Only decimal values are allowed (e.g., 0.00).'
                                              };
                                              return newErrors;
                                            });
                                          } else {
                                            setPriceSlabErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                price: '' // Clear error if valid decimal
                                              };
                                              return newErrors;
                                            });

                                            // Update the price value if valid
                                            setPriceSlabData((prev) => prev.map((r) => (r.id === row.id ? { ...r, price: value } : r)));
                                          }
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
                                        type="date"
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
          <CommonListViewTable data={data && data} columns={columns} blockEdit={true} toEdit={getItemMasterById} />
        )}
      </div>
    </div>
  );
};

export default ItemMaster;
