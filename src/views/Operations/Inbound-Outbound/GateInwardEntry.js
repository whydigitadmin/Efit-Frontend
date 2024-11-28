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

const GateInwardEntry = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();

  const [formData, setFormData] = useState({
    docId: '',
    docDate: null,
    supplierName: '',
    poNumber: '',
    invoiceNo: '',
    invoiceDate: null,
    vehicleNo: '',
    courierNo: '',
    courierName: '',
    narration: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    docId: '',
    docDate: null,
    supplierName: '',
    poNumber: '',
    invoiceNo: '',
    invoiceDate: null,
    vehicleNo: '',
    courierNo: '',
    courierName: '',
    narration: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [itemDetailsData, setItemDetailsData] = useState([
    {
      id: 1,
      itemName: '',
      itemDescription: '',
      uom: '',
      poQuantity: '',
      invoiceQty: '',
      inwardQty: '',
      balanceQty: '',
      excessQuantity: ''
    }
  ]);
  const [itemDetailErrors, setItemDetailErrors] = useState([
    {
      itemName: '',
      itemDescription: '',
      uom: '',
      poQuantity: '',
      invoiceQty: '',
      inwardQty: '',
      balanceQty: '',
      excessQuantity: ''
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
    if (isLastRowEmpty(itemDetailsData)) {
      displayRowError(itemDetailsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      itemName: '',
      itemDescription: '',
      uom: '',
      poQuantity: '',
      invoiceQty: '',
      inwardQty: '',
      balanceQty: '',
      excessQuantity: ''
    };
    setItemDetailsData([...itemDetailsData, newRow]);
    setItemDetailErrors([
      ...itemDetailErrors,
      {
        itemName: '',
        itemDescription: '',
        uom: '',
        poQuantity: '',
        invoiceQty: '',
        inwardQty: '',
        balanceQty: '',
        excessQuantity: ''
      }
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === itemDetailsData) {
      return (
        !lastRow.itemName ||
        !lastRow.itemDescription ||
        !lastRow.uom ||
        !lastRow.poQuantity ||
        !lastRow.invoiceQty ||
        !lastRow.inwardQty ||
        !lastRow.balanceQty ||
        !lastRow.excessQuantity
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === itemDetailsData) {
      setItemDetailErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          itemName: !table[table.length - 1].itemName ? 'Item Name is required' : '',
          itemDescription: !table[table.length - 1].itemDescription ? 'Item Description is required' : '',
          uom: !table[table.length - 1].uom ? 'Uom is required' : '',
          poQuantity: !table[table.length - 1].poQuantity ? 'Po Quantity is required' : '',
          invoiceQty: !table[table.length - 1].invoiceQty ? 'Invoice Qty is required' : '',
          inwardQty: !table[table.length - 1].inwardQty ? 'Inward Qty is required' : '',
          balanceQty: !table[table.length - 1].balanceQty ? 'Balance Qty is required' : '',
          excessQuantity: !table[table.length - 1].excessQuantity ? 'Excess Quantity is required' : ''
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
      docId: '',
      docDate: null,
      supplierName: '',
      poNumber: '',
      invoiceNo: '',
      invoiceDate: null,
      vehicleNo: '',
      courierNo: '',
      courierName: '',
      narration: ''
    });
    setFieldErrors({});
    setItemDetailsData([
      {
        id: 1,
        itemName: '',
        itemDescription: '',
        uom: '',
        poQuantity: '',
        invoiceQty: '',
        inwardQty: '',
        balanceQty: '',
        excessQuantity: ''
      }
    ]);
    setItemDetailErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.docId) errors.docId = 'Doc Id is required';
    if (!formData.docDate) errors.docDate = 'Doc Date is required';
    if (!formData.supplierName) errors.supplierName = 'Supplier Name is required';
    if (!formData.poNumber) errors.poNumber = 'Po Number is required';
    if (!formData.invoiceNo) errors.invoiceNo = 'Invoice No is required';
    if (!formData.invoiceDate) errors.invoiceDate = 'Invoice Date is required';
    if (!formData.vehicleNo) errors.vehicleNo = 'Vehicle No is required';
    if (!formData.courierNo) errors.courierNo = 'Courier No is required';
    if (!formData.courierName) errors.courierName = 'Courier Name is required';

    let itemDetailsDataValid = true;
    if (!itemDetailsData || !Array.isArray(itemDetailsData) || itemDetailsData.length === 0) {
      itemDetailsDataValid = false;
      setItemDetailErrors([{ general: 'Purchase Order Details Data is required' }]);
    } else {
      const newTableErrors = itemDetailsData.map((row, index) => {
        const rowErrors = {};
        if (!row.itemName) {
          rowErrors.itemName = 'Item Name is required';
          itemDetailsDataValid = false;
        }
        if (!row.itemDescription) {
          rowErrors.itemDescription = 'Item Description is required';
          itemDetailsDataValid = false;
        }
        if (!row.uom) {
          rowErrors.uom = 'Uom is required';
          itemDetailsDataValid = false;
        }
        if (!row.poQuantity) {
          rowErrors.poQuantity = 'Po Quantity is required';
          itemDetailsDataValid = false;
        }
        if (!row.invoiceQty) {
          rowErrors.invoiceQty = 'Invoice Qty is required';
          itemDetailsDataValid = false;
        }
        if (!row.inwardQty) {
          rowErrors.inwardQty = 'Inward Qty is required';
          itemDetailsDataValid = false;
        }
        if (!row.balanceQty) {
          rowErrors.balanceQty = 'Balance Qty is required';
          itemDetailsDataValid = false;
        }
        if (!row.excessQuantity) {
          rowErrors.excessQuantity = 'Excess Quantity is required';
          itemDetailsDataValid = false;
        }
        return rowErrors;
      });
      setItemDetailErrors(newTableErrors);
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && itemDetailsDataValid) {
      setIsLoading(true);

      // const detailsVo = partCodeData.map((row) => ({
      //   ...(editId && { id: row.id }),
      //   valueCode: row.valueCode,
      //   valueDescription: row.valueDesc,
      //   active: row.active === 'true' || row.active === true // Convert string 'true' to boolean true if necessary
      // }));

      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        listCode: formData.listCode,
        listDescription: formData.listDescription,
        // listOfValues1DTO: detailsVo,
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
  //       setItemDetailsData(
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
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="docId"
                    label="Doc Id"
                    name="docId"
                    size="small"
                    value={formData.docId}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.docId}
                    helperText={fieldErrors.docId}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Doc Date"
                      value={formData.docDate ? dayjs(formData.docDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('docDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.docDate}
                      helperText={fieldErrors.docDate ? fieldErrors.docDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

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

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.poNumber}>
                  <InputLabel id="poNumber">PO Number</InputLabel>
                  <Select
                    labelId="poNumber"
                    id="poNumber"
                    label="PO Number"
                    onChange={handleInputChange}
                    name="poNumber"
                    value={formData.poNumber}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.poNumber && <FormHelperText>{fieldErrors.poNumber}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="invoiceNo"
                    label="Invoice No / DC No"
                    name="invoiceNo"
                    size="small"
                    value={formData.invoiceNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.invoiceNo}
                    helperText={fieldErrors.invoiceNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Invoice Date"
                      value={formData.invoiceDate ? dayjs(formData.invoiceDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('invoiceDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.invoiceDate}
                      helperText={fieldErrors.invoiceDate ? fieldErrors.invoiceDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="vehicleNo"
                    label="Vehicle No"
                    name="vehicleNo"
                    size="small"
                    value={formData.vehicleNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.vehicleNo}
                    helperText={fieldErrors.vehicleNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="courierNo"
                    label="Courier No"
                    name="courierNo"
                    size="small"
                    value={formData.courierNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.courierNo}
                    helperText={fieldErrors.courierNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="courierName"
                    label="Courier / Logistics Name"
                    name="courierName"
                    size="small"
                    value={formData.courierName}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.courierName}
                    helperText={fieldErrors.courierName}
                  />
                </FormControl>
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
                  <Tab value={0} label="Item Details" />
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
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                    Item Name
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Item Description
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    UOM
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    PO Quantity
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Invoice Qty
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Inward Qty
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Balance Qty
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Excess Quantity
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {itemDetailsData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            itemDetailsData,
                                            setItemDetailsData,
                                            itemDetailErrors,
                                            setItemDetailErrors
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>

                                    {/* <td className="border px-2 py-2">
                                      <Autocomplete
                                        options={allAccountName}
                                        getOptionLabel={(option) => option.accountName || ''}
                                        groupBy={(option) => (option.accountName ? option.accountName[0].toUpperCase() : '')}
                                        value={row.accountName ? allAccountName.find((a) => a.accountName === row.accountName) : null}
                                        onChange={(event, newValue) => {
                                          const value = newValue ? newValue.accountName : '';
                                          setDetailsTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, accountName: value } : r))
                                          );
                                          setDetailsTableErrors((prevErrors) =>
                                            prevErrors.map((err, idx) => (idx === index ? { ...err, accountName: '' } : err))
                                          );
                                        }}
                                        size="small"
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Account Name"
                                            variant="outlined"
                                            error={!!detailsTableErrors[index]?.accountName}
                                            helperText={detailsTableErrors[index]?.accountName}
                                          />
                                        )}
                                        sx={{ width: 250 }}
                                      />
                                    </td> */}

                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.itemName}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setItemDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, itemName: value } : r)));
                                          setItemDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemName: !value ? 'Item Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemDetailErrors[index]?.itemName ? 'error form-control' : 'form-control'}
                                      />
                                      {itemDetailErrors[index]?.itemName && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemDetailErrors[index].itemName}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.itemDescription}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setItemDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, itemDescription: value } : r))
                                          );
                                          setItemDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemDescription: !value ? 'Item Description is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemDetailErrors[index]?.itemDescription ? 'error form-control' : 'form-control'}
                                      />
                                      {itemDetailErrors[index]?.itemDescription && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemDetailErrors[index].itemDescription}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.uom}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setItemDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, uom: value } : r)));
                                          setItemDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              uom: !value ? 'UOM is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemDetailErrors[index]?.uom ? 'error form-control' : 'form-control'}
                                      />
                                      {itemDetailErrors[index]?.uom && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemDetailErrors[index].uom}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.poQuantity}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setItemDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, poQuantity: value } : r)));
                                          setItemDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              poQuantity: !value ? 'PO Quantity is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemDetailErrors[index]?.poQuantity ? 'error form-control' : 'form-control'}
                                      />
                                      {itemDetailErrors[index]?.poQuantity && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemDetailErrors[index].poQuantity}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.invoiceQty}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setItemDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, invoiceQty: value } : r)));
                                          setItemDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              invoiceQty: !value ? 'Invoice Qty is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemDetailErrors[index]?.invoiceQty ? 'error form-control' : 'form-control'}
                                      />
                                      {itemDetailErrors[index]?.invoiceQty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemDetailErrors[index].invoiceQty}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.inwardQty}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setItemDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, inwardQty: value } : r)));
                                          setItemDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              inwardQty: !value ? 'Inward Qty is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemDetailErrors[index]?.inwardQty ? 'error form-control' : 'form-control'}
                                      />
                                      {itemDetailErrors[index]?.inwardQty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemDetailErrors[index].inwardQty}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.balanceQty}
                                        onChange={(e) => {
                                          const date = e.target.value;

                                          setItemDetailsData((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id ? { ...r, balanceQty: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                            )
                                          );

                                          setItemDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              balanceQty: !date ? 'Balance Qty is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemDetailErrors[index]?.balanceQty ? 'error form-control' : 'form-control'}
                                        // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
                                      />
                                      {itemDetailErrors[index]?.balanceQty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemDetailErrors[index].balanceQty}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.excessQuantity}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setItemDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, excessQuantity: value } : r)));
                                          setItemDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              excessQuantity: !value ? 'Excess Quantity is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemDetailErrors[index]?.excessQuantity ? 'error form-control' : 'form-control'}
                                      />
                                      {itemDetailErrors[index]?.excessQuantity && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemDetailErrors[index].excessQuantity}
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
                    <div className="row d-flex">
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="narration"
                            label="Narration"
                            name="narration"
                            size="small"
                            value={formData.narration}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.narration}
                            helperText={fieldErrors.narration}
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

export default GateInwardEntry;
