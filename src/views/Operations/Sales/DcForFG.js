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

const DcForFG = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();

  const [formData, setFormData] = useState({
    deliveryChallanNo: '',
    deliveryChallanDate: null,
    customerName: '',
    customerAddress: '',
    soNo: '',
    soDate: null,
    dueDate: null,
    vehicleType: '',
    vehicleNo: '',
    status: '',
    narration: '',
  });
  const [fieldErrors, setFieldErrors] = useState({
    deliveryChallanNo: '',
    deliveryChallanDate: null,
    customerName: '',
    customerAddress: '',
    soNo: '',
    soDate: null,
    dueDate: null,
    vehicleType: '',
    vehicleNo: '',
    status: '',
    narration: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryChallanDetailsData, setDeliveryChallanDetailsData] = useState([
    {
      id: 1,
      item: '',
      itemDescription: '',
      quantity: '',
      unit: '',
      weight: '',
      remarks: '',
    }
  ]);
  const [deliveryChallanDetailErrors, setDeliveryChallanDetailErrors] = useState([
    {
      item: '',
      itemDescription: '',
      quantity: '',
      unit: '',
      weight: '',
      remarks: '',
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
    if (isLastRowEmpty(deliveryChallanDetailsData)) {
      displayRowError(deliveryChallanDetailsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      item: '',
      itemDescription: '',
      quantity: '',
      unit: '',
      weight: '',
      remarks: '',
    };
    setDeliveryChallanDetailsData([...deliveryChallanDetailsData, newRow]);
    setDeliveryChallanDetailErrors([
      ...deliveryChallanDetailErrors,
      {
        item: '',
        itemDescription: '',
        quantity: '',
        unit: '',
        weight: '',
        remarks: '',
      }
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === deliveryChallanDetailsData) {
      return (
        !lastRow.item ||
        !lastRow.itemDescription ||
        !lastRow.quantity ||
        !lastRow.unit ||
        !lastRow.weight ||
        !lastRow.remarks
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === deliveryChallanDetailsData) {
      setDeliveryChallanDetailErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !table[table.length - 1].item ? 'Item is required' : '',
          itemDescription: !table[table.length - 1].itemDescription ? 'Item Description is required' : '',
          quantity: !table[table.length - 1].quantity ? 'Quantity is required' : '',
          unit: !table[table.length - 1].unit ? 'Unit is required' : '',
          weight: !table[table.length - 1].weight ? 'Weight is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : '',
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
      deliveryChallanNo: '',
      deliveryChallanDate: null,
      customerName: '',
      customerAddress: '',
      soNo: '',
      soDate: null,
      dueDate: null,
      vehicleType: '',
      vehicleNo: '',
      status: '',
      narration: '',
    });
    setFieldErrors({});
    setDeliveryChallanDetailsData([
      {
        id: 1,
        item: '',
        itemDescription: '',
        quantity: '',
        unit: '',
        weight: '',
        remarks: '',
      }
    ]);
    setDeliveryChallanDetailErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.deliveryChallanNo) errors.deliveryChallanNo = 'Delivery Challan No is required';
    if (!formData.deliveryChallanDate) errors.deliveryChallanDate = 'Delivery Challan Date is required';
    if (!formData.customerName) errors.customerName = 'Customer Name is required';
    if (!formData.customerAddress) errors.customerAddress = 'Customer Address is required';
    if (!formData.soNo) errors.soNo = 'So No is required';
    if (!formData.soDate) errors.soDate = 'So Date is required';
    if (!formData.dueDate) errors.dueDate = 'Due Date is required';
    if (!formData.vehicleType) errors.vehicleType = 'Vehicle Type is required';
    if (!formData.vehicleNo) errors.vehicleNo = 'Vehicle No is required';
    if (!formData.status) errors.status = 'Status is required';
    if (!formData.narration) errors.narration = 'Narration is required';

    let deliveryChallanDetailsDataValid = true;
    if (!deliveryChallanDetailsData || !Array.isArray(deliveryChallanDetailsData) || deliveryChallanDetailsData.length === 0) {
      deliveryChallanDetailsDataValid = false;
      setDeliveryChallanDetailErrors([{ general: 'Purchase Order Details Data is required' }]);
    } else {
      const newTableErrors = deliveryChallanDetailsData.map((row, index) => {
        const rowErrors = {};
        if (!row.item) {
          rowErrors.item = 'Item is required';
          deliveryChallanDetailsDataValid = false;
        }
        if (!row.itemDescription) {
          rowErrors.itemDescription = 'Item Description is required';
          deliveryChallanDetailsDataValid = false;
        }
        if (!row.quantity) {
          rowErrors.quantity = 'Quantity is required';
          deliveryChallanDetailsDataValid = false;
        }
        if (!row.unit) {
          rowErrors.unit = 'Unit is required';
          deliveryChallanDetailsDataValid = false;
        }
        if (!row.weight) {
          rowErrors.weight = 'Weight is required';
          deliveryChallanDetailsDataValid = false;
        }
        if (!row.remarks) {
          rowErrors.remarks = 'Remarks is required';
          deliveryChallanDetailsDataValid = false;
        }
        return rowErrors;
      });
      setDeliveryChallanDetailErrors(newTableErrors);
    }

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && deliveryChallanDetailsDataValid) {
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
  //       setDeliveryChallanDetailsData(
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
                    id="deliveryChallanNo"
                    label="Delivery Challan No"
                    name="deliveryChallanNo"
                    size="small"
                    value={formData.deliveryChallanNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.deliveryChallanNo}
                    helperText={fieldErrors.deliveryChallanNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Delivery Challan Date"
                      value={formData.deliveryChallanDate ? dayjs(formData.deliveryChallanDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('deliveryChallanDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.deliveryChallanDate}
                      helperText={fieldErrors.deliveryChallanDate ? fieldErrors.deliveryChallanDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.customerName}>
                  <InputLabel id="customerName">Customer Name</InputLabel>
                  <Select
                    labelId="customerName"
                    id="customerName"
                    label="Customer Name"
                    onChange={handleInputChange}
                    name="customerName"
                    value={formData.customerName}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.customerName && <FormHelperText>{fieldErrors.customerName}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="customerAddress"
                    label="Customer Address"
                    name="customerAddress"
                    size="small"
                    value={formData.customerAddress}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.customerAddress}
                    helperText={fieldErrors.customerAddress}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.soNo}>
                  <InputLabel id="soNo">SO NO</InputLabel>
                  <Select
                    labelId="soNo"
                    id="soNo"
                    label="SO NO"
                    onChange={handleInputChange}
                    name="soNo"
                    value={formData.soNo}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.soNo && <FormHelperText>{fieldErrors.soNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="SO Date"
                      value={formData.soDate ? dayjs(formData.soDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('soDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.soDate}
                      helperText={fieldErrors.soDate ? fieldErrors.soDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Due Date"
                      value={formData.dueDate ? dayjs(formData.dueDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('dueDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.dueDate}
                      helperText={fieldErrors.dueDate ? fieldErrors.dueDate : ''}
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="vehicleType"
                    label="Vehicle Type"
                    name="vehicleType"
                    size="small"
                    value={formData.vehicleType}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.vehicleType}
                    helperText={fieldErrors.vehicleType}
                  />
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
                    id="status"
                    label="Status"
                    name="status"
                    size="small"
                    value={formData.status}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.status}
                    helperText={fieldErrors.status}
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
                  <Tab value={0} label="Delivery Challan Details" />
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
                                    Item
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Item Description
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Quantity
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Unit
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Weight
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Remarks
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {deliveryChallanDetailsData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            deliveryChallanDetailsData,
                                            setDeliveryChallanDetailsData,
                                            deliveryChallanDetailErrors,
                                            setDeliveryChallanDetailErrors
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
                                        value={row.item}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDeliveryChallanDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, item: value } : r)));
                                          setDeliveryChallanDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              item: !value ? 'Item Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={deliveryChallanDetailErrors[index]?.item ? 'error form-control' : 'form-control'}
                                      />
                                      {deliveryChallanDetailErrors[index]?.item && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {deliveryChallanDetailErrors[index].item}
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
                                          setDeliveryChallanDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, itemDescription: value } : r))
                                          );
                                          setDeliveryChallanDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemDescription: !value ? 'Item Description is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={deliveryChallanDetailErrors[index]?.itemDescription ? 'error form-control' : 'form-control'}
                                      />
                                      {deliveryChallanDetailErrors[index]?.itemDescription && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {deliveryChallanDetailErrors[index].itemDescription}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.quantity}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDeliveryChallanDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, quantity: value } : r)));
                                          setDeliveryChallanDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              quantity: !value ? 'PO Quantity is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={deliveryChallanDetailErrors[index]?.quantity ? 'error form-control' : 'form-control'}
                                      />
                                      {deliveryChallanDetailErrors[index]?.quantity && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {deliveryChallanDetailErrors[index].quantity}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.unit}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDeliveryChallanDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r)));
                                          setDeliveryChallanDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              unit: !value ? 'Invoice Qty is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={deliveryChallanDetailErrors[index]?.unit ? 'error form-control' : 'form-control'}
                                      />
                                      {deliveryChallanDetailErrors[index]?.unit && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {deliveryChallanDetailErrors[index].unit}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.weight}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDeliveryChallanDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, weight: value } : r)));
                                          setDeliveryChallanDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              weight: !value ? 'Inward Qty is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={deliveryChallanDetailErrors[index]?.weight ? 'error form-control' : 'form-control'}
                                      />
                                      {deliveryChallanDetailErrors[index]?.weight && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {deliveryChallanDetailErrors[index].weight}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.remarks}
                                        onChange={(e) => {
                                          const date = e.target.value;

                                          setDeliveryChallanDetailsData((prev) =>
                                            prev.map((r) =>
                                              r.id === row.id ? { ...r, remarks: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                            )
                                          );

                                          setDeliveryChallanDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              remarks: !date ? 'Balance Qty is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={deliveryChallanDetailErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                        // onKeyDown={(e) => handleKeyDown(e, row, tdsTableData)}
                                      />
                                      {deliveryChallanDetailErrors[index]?.remarks && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {deliveryChallanDetailErrors[index].remarks}
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

export default DcForFG;
