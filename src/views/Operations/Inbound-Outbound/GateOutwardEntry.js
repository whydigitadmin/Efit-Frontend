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

const GateOutwardEntry = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();

  const [formData, setFormData] = useState({
    goeNo: '',
    goeDate: null,
    customerName: '',
    customerNo: '',
    type: '',
    deliveryChallanNo: '',
    deliveryChallanDate: null,
    invoiceNo: '',
    invoiceDate: null,
    modeOfShipment: '',
    vehicleNumber: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    goeNo: '',
    goeDate: null,
    customerName: '',
    customerNo: '',
    type: '',
    deliveryChallanNo: '',
    deliveryChallanDate: null,
    invoiceNo: '',
    invoiceDate: null,
    modeOfShipment: '',
    vehicleNumber: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [itemDetailsData, setItemDetailsData] = useState([
    {
      id: 1,
      item: '',
      itemDescription: '',
      uom: '',
      qty: ''
    }
  ]);
  const [itemDetailErrors, setItemDetailErrors] = useState([
    {
        item: '',
        itemDescription: '',
        uom: '',
        qty: ''
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
      item: '',
      itemDescription: '',
      uom: '',
      qty: ''
    };
    setItemDetailsData([...itemDetailsData, newRow]);
    setItemDetailErrors([
      ...itemDetailErrors,
      {
        item: '',
        itemDescription: '',
        uom: '',
        qty: '',
      }
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === itemDetailsData) {
      return (
        !lastRow.item ||
        !lastRow.itemDescription ||
        !lastRow.uom ||
        !lastRow.qty
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
          item: !table[table.length - 1].item ? 'Item is required' : '',
          itemDescription: !table[table.length - 1].itemDescription ? 'Item Description is required' : '',
          uom: !table[table.length - 1].uom ? 'Uom is required' : '',
          qty: !table[table.length - 1].qty ? 'Qty is required' : ''
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
        goeNo: '',
        goeDate: null,
        customerName: '',
        customerNo: '',
        type: '',
        deliveryChallanNo: '',
        deliveryChallanDate: null,
        invoiceNo: '',
        invoiceDate: null,
        modeOfShipment: '',
        vehicleNumber: ''
    });
    setFieldErrors({});
    setItemDetailsData([
      {
        id: 1,
        item: '',
        itemDescription: '',
        uom: '',
        qty: ''
      }
    ]);
    setItemDetailErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.goeNo) errors.goeNo = 'Goe No is required';
    if (!formData.goeDate) errors.goeDate = 'Goe Date is required';
    if (!formData.customerName) errors.customerName = 'Customer Name is required';
    if (!formData.customerNo) errors.customerNo = 'Customer No is required';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.deliveryChallanNo) errors.deliveryChallanNo = 'Delivery Challan No is required';
    if (!formData.deliveryChallanDate) errors.deliveryChallanDate = 'Delivery Challan Date is required';
    if (!formData.invoiceNo) errors.invoiceNo = 'Invoice No is required';
    if (!formData.invoiceDate) errors.invoiceDate = 'Invoice Date is required';
    if (!formData.modeOfShipment) errors.modeOfShipment = 'Mode Of Shipment is required';
    if (!formData.vehicleNumber) errors.vehicleNumber = 'Vehicle Number is required';
    if (!formData.narration) errors.narration = 'Narration is required';

    let itemDetailsDataValid = true;
    if (!itemDetailsData || !Array.isArray(itemDetailsData) || itemDetailsData.length === 0) {
      itemDetailsDataValid = false;
      setItemDetailErrors([{ general: 'Purchase Order Details Data is required' }]);
    } else {
      const newTableErrors = itemDetailsData.map((row, index) => {
        const rowErrors = {};
        if (!row.item) {
          rowErrors.item = 'Item is required';
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
        if (!row.qty) {
          rowErrors.qty = 'Qty is required';
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
                    id="goeNo"
                    label="GOE No"
                    name="goeNo"
                    size="small"
                    value={formData.goeNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.goeNo}
                    helperText={fieldErrors.goeNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="GOE Date"
                      value={formData.goeDate ? dayjs(formData.goeDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('goeDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.goeDate}
                      helperText={fieldErrors.goeDate ? fieldErrors.goeDate : ''}
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.type}>
                  <InputLabel id="type">Type</InputLabel>
                  <Select
                    labelId="type"
                    id="type"
                    label="Type"
                    onChange={handleInputChange}
                    name="type"
                    value={formData.type}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.type && <FormHelperText>{fieldErrors.type}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.deliveryChallanNo}>
                  <InputLabel id="deliveryChallanNo">Delivery Challan No</InputLabel>
                  <Select
                    labelId="deliveryChallanNo"
                    id="deliveryChallanNo"
                    label="Delivery Challan No"
                    onChange={handleInputChange}
                    name="deliveryChallanNo"
                    value={formData.deliveryChallanNo}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.deliveryChallanNo && <FormHelperText>{fieldErrors.deliveryChallanNo}</FormHelperText>}
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.invoiceNo}>
                  <InputLabel id="invoiceNo">Invoice No</InputLabel>
                  <Select
                    labelId="invoiceNo"
                    id="invoiceNo"
                    label="Invoice No"
                    onChange={handleInputChange}
                    name="invoiceNo"
                    value={formData.invoiceNo}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.invoiceNo && <FormHelperText>{fieldErrors.invoiceNo}</FormHelperText>}
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.modeOfShipment}>
                  <InputLabel id="modeOfShipment">Mode of Shipment</InputLabel>
                  <Select
                    labelId="modeOfShipment"
                    id="modeOfShipment"
                    label="Mode of Shipment"
                    onChange={handleInputChange}
                    name="modeOfShipment"
                    value={formData.modeOfShipment}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.modeOfShipment && <FormHelperText>{fieldErrors.modeOfShipment}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="vehicleNumber"
                    label="Vehicle Number"
                    name="vehicleNumber"
                    size="small"
                    value={formData.vehicleNumber}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.vehicleNumber}
                    helperText={fieldErrors.vehicleNumber}
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
                                    Item
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Item Description
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    UOM
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Qty
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
                                        value={row.item}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setItemDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, item: value } : r)));
                                          setItemDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              item: !value ? 'Item is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemDetailErrors[index]?.item ? 'error form-control' : 'form-control'}
                                      />
                                      {itemDetailErrors[index]?.item && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemDetailErrors[index].item}
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
                                        value={row.qty}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setItemDetailsData((prev) => prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r)));
                                          setItemDetailErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              qty: !value ? 'Qty is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={itemDetailErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                      />
                                      {itemDetailErrors[index]?.qty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {itemDetailErrors[index].qty}
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

export default GateOutwardEntry;
