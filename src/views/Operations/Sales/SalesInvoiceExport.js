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
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Autocomplete } from '@mui/material';
import dayjs from 'dayjs';

const SalesInvoiceExport = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();
  const [partyList, setPartyList] = useState([]);


  const [formData, setFormData] = useState({
    salesInvoiceExportNo: '',
    salesInvoiceDate: dayjs(),
    customerName: '',
    salesOrderNo: '',
    exportPackingNo: '',
    currency: '',
    exchangeRate: '',
    location: '',
    billingAddress: '',
    shippingAddress: '',
    totalQuantity: '',
    totalAmount: '',
    totalAmountInWords: '',
    remarks: '',
    active: true,

  });
  const [fieldErrors, setFieldErrors] = useState({
    salesInvoiceExportNo: '',
    salesInvoiceDate: dayjs(),
    customerName: '',
    salesOrderNo: '',
    exportPackingNo: '',
    currency: '',
    exchangeRate: '',
    location: '',
    billingAddress: '',
    shippingAddress: '',
    totalQuantity: '',
    totalAmount: '',
    totalAmountInWords: '',
    remarks: '',
    active: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [localDetailTableData, setLocalDetailTableData] = useState([
    {
      id: 1,
      item: '',
      itemDesc: '',
      units: '',
      qty: '',
      rate: '',
      grossAmount: '',
      discount: '',
      discountAmount: '',
      netamount: '',
    }
  ]);
  const [localDetailTableErrors, setLocalDetailTableErrors] = useState([
    {
      id: 1,
      item: '',
      itemDesc: '',
      units: '',
      qty: '',
      rate: '',
      grossAmount: '',
      discount: '',
      discountAmount: '',
      netamount: '',
    }
  ]);
  const [termsandConditionsTable, setTermsandConditionsTable] = useState([
    {
      id: 1,
      terms: '',
      description: ''
    }
  ]);
  const [termsandConditionsTableErrors, setTermsandConditionsTableErrors] = useState([
    {
      terms: '',
      description: ''
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
    if (isLastRowEmpty(localDetailTableData)) {
      displayRowError(localDetailTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      item: '',
      itemDesc: ''
    };
    setLocalDetailTableData([...localDetailTableData, newRow]);
    setLocalDetailTableErrors([...localDetailTableErrors, { item: '', itemDesc: '' }]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === localDetailTableData) {
      return !lastRow.item || !lastRow.itemDesc;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === localDetailTableData) {
      setLocalDetailTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1], 
          item: !table[table.length - 1].item ? 'Item is required' : '',
          itemDesc: !table[table.length - 1].itemDesc ? 'ItemDesc is required' : '',
          units: !table[table.length - 1].units ? 'Units is required' : '',
          qty: !table[table.length - 1].qty ? 'Qty is required' : '',
          rate: !table[table.length - 1].rate ? 'Rate is required' : '',
          grossAmount: !table[table.length - 1].grossAmount ? 'Gross Amount is required' : '',
          discount: !table[table.length - 1].discount ? 'Discount is required' : '',
          discountAmount: !table[table.length - 1].discountAmount ? 'Discount Amount is required' : '',
          netamount: !table[table.length - 1].netamount ? 'Netamount is required' : '',
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
    if (isLastRowEmptyPrice(termsandConditionsTable)) {
      displayPriceRowError(termsandConditionsTable);
      return;
    }
    const newRow = {
      id: Date.now(),
      terms: '',
      description: ''
    };
    setTermsandConditionsTable([...termsandConditionsTable, newRow]);
    setTermsandConditionsTableErrors([...termsandConditionsTableErrors, { terms: '', description: '' }]);
  };
  const isLastRowEmptyPrice = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === termsandConditionsTable) {
      return !lastRow.terms || !lastRow.description;
    }
    return false;
  };

  const displayPriceRowError = (table) => {
    if (table === localDetailTableData) {
      setTermsandConditionsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          terms: !table[table.length - 1].terms ? 'Terms is required' : '',
          description: !table[table.length - 1].description ? 'description From is required' : ''
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
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    // const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleClear = () => {
    setFormData({
      salesInvoiceExportNo: '',
      salesInvoiceDate: dayjs(),
      customerName: '',
      salesOrderNo: '',
      exportPackingNo: '',
      currency: '',
      exchangeRate: '',
      location: '',
      billingAddress: '',
      shippingAddress: '',
      totalQuantity: '',
      totalAmount: '',
      totalAmountInWords: '',
      remarks: '',
      active: true,
    });
    setFieldErrors({});
    setLocalDetailTableData([
      {
        id: 1,
        item: '',
        itemDesc: ''
      }
    ]);
    setLocalDetailTableErrors('');
    setTermsandConditionsTable([
      {
        id: 1,
        terms: '',
        description: ''
      }
    ]);
    setTermsandConditionsTableErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.customerName) errors.customerName = 'Customer Name is required';
    if (!formData.salesOrderNo) errors.salesOrderNo = 'Sales Order No is required';
    if (!formData.exportPackingNo) errors.exportPackingNo = 'Export Packing No is required';   
    if (!formData.billingAddress) errors.billingAddress = 'Billing Address is required';
    if (!formData.shippingAddress) errors.shippingAddress = 'Shipping Address is required';
    if (!formData.totalQuantity) errors.totalQuantity = 'Total Quantity is required';
    if (!formData.totalAmount) errors.totalAmount = 'Total Amount is required';
    if (!formData.totalAmountInWords) errors.totalAmountInWords = 'Total Amount In Words is required';
    if (!formData.remarks) errors.remarks = 'Remarks are required';

    let localDetailTableDataValid = true;
    if (!localDetailTableData || !Array.isArray(localDetailTableData) || localDetailTableData.length === 0) {
      localDetailTableDataValid = false;
      setLocalDetailTableErrors([{ general: 'Tax Slab Data is required' }]);
    } else {
      const newTableErrors = localDetailTableData.map((row, index) => {
        const rowErrors = {};
        if (!row.item) {
          rowErrors.item = 'Tax Slab is required';
          localDetailTableDataValid = false;
        }
        if (!row.itemDesc) { 
          rowErrors.item = 'Item  is required';   
          rowErrors.itemDesc = 'Item Desc  is required';   
          rowErrors.units = 'Units  is required';   
          rowErrors.qty = 'Qty  is required';   
          rowErrors.rate = 'Rate  is required';   
          rowErrors.grossAmount = 'Gross Amount  is required';   
          rowErrors.discount = 'Discount  is required';   
          rowErrors.discountAmount = 'DiscountAmount  is required';   
          rowErrors.netamount = 'Netamount  is required';   
          localDetailTableDataValid = false;
        }

        return rowErrors;
      });
      setLocalDetailTableErrors(newTableErrors);
    }

    let termsandConditionsTableValid = true;
    if (!termsandConditionsTable || !Array.isArray(termsandConditionsTable) || termsandConditionsTable.length === 0) {
      termsandConditionsTableValid = false;
      setTermsandConditionsTableErrors([{ general: 'Tax Slab Data is required' }]);
    } else {
      const newTableErrors = termsandConditionsTable.map((row, index) => {
        const rowErrors = {};
        if (!row.terms) {
          rowErrors.terms = 'Terms is required';
          termsandConditionsTableValid = false;
        }
        if (!row.description) {
          rowErrors.description = 'Description is required';
          termsandConditionsTableValid = false;
        }

        return rowErrors;
      });
      setTermsandConditionsTableErrors(newTableErrors);
    }
    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && localDetailTableDataValid && termsandConditionsTableValid) {
      setIsLoading(true);

      const detailsVo = localDetailTableData.map((row) => ({
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
            <div className="row d-flex ml">
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Sales Invoice Export No"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="salesInvoiceExportNo"
                  value={formData.salesInvoiceExportNo}
                  onChange={handleInputChange}
                  disabled
                  inputProps={{ maxLength: 10 }}
                />
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled" size="small">
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Sales Invoice Date"
                      value={formData.salesInvoiceDate}
                      onChange={(date) => handleDateChange('salesInvoiceDate', date)}
                      disabled
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                    />
                  </LocalizationProvider>
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={partyList.map((option, index) => ({ ...option, key: index }))}
                  getOptionLabel={(option) => option.partyname || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.customerName ? partyList.find((c) => c.partyname === formData.customerName) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'customerName',
                        value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Customer Name"
                      name="customerName"
                      error={!!fieldErrors.customerName}  // Shows error if customerName has a value in fieldErrors
                      helperText={fieldErrors.customerName} // Displays the error message
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 },
                      }}
                    />
                  )}
                />
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="salesOrderNo"
                    label="Sales Order No"
                    // label={
                    //   <span>
                    //     Drawing Id <span className="asterisk">*</span>
                    //   </span>
                    // }
                    name="salesOrderNo"
                    size="small"
                    value={formData.salesOrderNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.salesOrderNo}
                    helperText={fieldErrors.salesOrderNo}
                  />
                </FormControl>
              </div>



              <div className="col-md-3 mb-3">
                <Autocomplete
                  disablePortal
                  options={partyList.map((option, index) => ({ ...option, key: index }))}
                  getOptionLabel={(option) => option.partyname || ''}
                  sx={{ width: '100%' }}
                  size="small"
                  value={formData.exportPackingNo ? partyList.find((c) => c.partyname === formData.exportPackingNo) : null}
                  onChange={(event, newValue) => {
                    handleInputChange({
                      target: {
                        name: 'exportPackingNo',
                        value: newValue ? newValue.partyname : '', // Adjusted to 'partyname'
                      },
                    });
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Export Packing No"
                      name="exportPackingNo"
                      error={!!fieldErrors.exportPackingNo}
                      helperText={fieldErrors.exportPackingNo}
                      InputProps={{
                        ...params.InputProps,
                        style: { height: 40 },
                      }}
                    />
                  )}
                />
              </div>


              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Currency"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="currency"
                  value={formData.currency}
                  onChange={handleInputChange}
                  disabled
                  inputProps={{ maxLength: 10 }}
                  error={!!fieldErrors.currency}
                  helperText={fieldErrors.currency}
                />
              </div>


              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Exchange Rate"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="exchangeRate"
                  value={formData.exchangeRate}
                  onChange={handleInputChange}
                  disabled
                  inputProps={{ maxLength: 10 }}
                  error={!!fieldErrors.exchangeRate}
                  helperText={fieldErrors.exchangeRate}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Location"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10 }}
                  error={!!fieldErrors.location}
                  helperText={fieldErrors.location}
                  disabled
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Billing Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10 }}
                  error={!!fieldErrors.billingAddress}
                  helperText={fieldErrors.billingAddress}
                />
              </div>
              <div className="col-md-3 mb-3">
                <TextField
                  id="outlined-textarea-zip"
                  label="Shipping Address"
                  variant="outlined"
                  size="small"
                  fullWidth
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  inputProps={{ maxLength: 10 }}
                  error={!!fieldErrors.shippingAddress}
                  helperText={fieldErrors.shippingAddress}
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
                  <Tab value={0} label="Sales Invoice Local Detail" />
                  <Tab value={1} label="Sales Invoice Summary" />
                  <Tab value={2} label="Terms and Conditions" />
                  <Tab value={3} label="Summary" />
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
                                  <th className="px-2 py-2 text-white text-center"  >
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center">
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" >Item</th>
                                  <th className="px-2 py-2 text-white text-center">Item Desc</th>
                                  <th className="px-2 py-2 text-white text-center">Units</th>
                                  <th className="px-2 py-2 text-white text-center">Qty</th>
                                  <th className="px-2 py-2 text-white text-center">Rate</th>
                                  <th className="px-2 py-2 text-white text-center">Gross Amount</th>
                                  <th className="px-2 py-2 text-white text-center">Discount %</th>
                                  <th className="px-2 py-2 text-white text-center">Discount Amount</th>
                                  <th className="px-2 py-2 text-white text-center">Net amount</th>
                                </tr>
                              </thead>
                              <tbody>
                                {localDetailTableData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(row.id, localDetailTableData, setLocalDetailTableData, localDetailTableErrors, setLocalDetailTableErrors)
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <Autocomplete
                                        disablePortal
                                        options={partyList.map((option, index) => ({ ...option, key: index }))}
                                        getOptionLabel={(option) => option.partyname || ''}
                                        sx={{ width: '100%' }}
                                        size="small"
                                        value={formData.item ? partyList.find((c) => c.partyname === formData.item) : null}
                                        onChange={(event, newValue) => {
                                          handleInputChange({
                                            target: {
                                              name: 'item',
                                              value: newValue ? newValue.partyname : '',
                                            },
                                          });
                                        }}
                                        renderInput={(params) => (
                                          <TextField
                                            {...params}
                                            label="Item"
                                            name="item"
                                            error={!!fieldErrors.item}
                                            helperText={fieldErrors.item}
                                            InputProps={{
                                              ...params.InputProps,
                                              style: { height: 40, width: 200 },
                                            }}
                                          />
                                        )}
                                      />
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.itemDesc}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocalDetailTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, itemDesc: value } : r))
                                          );
                                          setLocalDetailTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemDesc: !value ? 'Item Desc is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={localDetailTableErrors[index]?.itemDesc ? 'error form-control' : 'form-control'}
                                        style={{ width: '150px' }}
                                        disabled
                                      />
                                      {localDetailTableErrors[index]?.itemDesc && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {localDetailTableErrors[index].itemDesc}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.units}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocalDetailTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, itemDesc: value } : r))
                                          );
                                          setLocalDetailTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemDesc: !value ? 'Item Desc is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={localDetailTableErrors[index]?.itemDesc ? 'error form-control' : 'form-control'}
                                        style={{ width: '150px' }}
                                        disabled
                                      />
                                      {localDetailTableErrors[index]?.itemDesc && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {localDetailTableErrors[index].itemDesc}
                                        </div>
                                      )}
                                    </td>

                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.qty}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocalDetailTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r))
                                          );
                                          setLocalDetailTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              qty: !value ? 'Item Desc is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={localDetailTableErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                        style={{ width: '150px' }}
                                        disabled
                                      />
                                      {localDetailTableErrors[index]?.qty && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {localDetailTableErrors[index].qty}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.rate}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocalDetailTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, rate: value } : r))
                                          );
                                          setLocalDetailTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              rate: !value ? 'Rate is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={localDetailTableErrors[index]?.rate ? 'error form-control' : 'form-control'}
                                        style={{ width: '150px' }}
                                      />
                                      {localDetailTableErrors[index]?.rate && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {localDetailTableErrors[index].rate}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.grossAmount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocalDetailTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, grossAmount: value } : r))
                                          );
                                          setLocalDetailTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              grossAmount: !value ? 'Gross Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={localDetailTableErrors[index]?.grossAmount ? 'error form-control' : 'form-control'}
                                        style={{ width: '150px' }}
                                      />
                                      {localDetailTableErrors[index]?.grossAmount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {localDetailTableErrors[index].grossAmount}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.discount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocalDetailTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, discount: value } : r))
                                          );
                                          setLocalDetailTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              discount: !value ? 'Discount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={localDetailTableErrors[index]?.discount ? 'error form-control' : 'form-control'}
                                        style={{ width: '150px' }}
                                      />
                                      {localDetailTableErrors[index]?.discount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {localDetailTableErrors[index].discount}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.discountAmount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocalDetailTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, discountAmount: value } : r))
                                          );
                                          setLocalDetailTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              discountAmount: !value ? 'Discount Amount is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={localDetailTableErrors[index]?.discountAmount ? 'error form-control' : 'form-control'}
                                        style={{ width: '150px' }}
                                      />
                                      {localDetailTableErrors[index]?.discountAmount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {localDetailTableErrors[index].discountAmount}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.netamount}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setLocalDetailTableData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, netamount: value } : r))
                                          );
                                          setLocalDetailTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              netamount: !value ? 'Landed Value is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={localDetailTableErrors[index]?.netamount ? 'error form-control' : 'form-control'}
                                        style={{ width: '150px' }}
                                      />
                                      {localDetailTableErrors[index]?.netamount && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {localDetailTableErrors[index].netamount}
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
                            id="totalQuantity"
                            label="Total Quantity"
                            name="totalQuantity"
                            size="small"
                            value={formData.totalQuantity}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.totalQuantity}
                            helperText={fieldErrors.totalQuantity}
                          />
                        </FormControl>
                      </div>

                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="totalAmount"
                            label='Total Amount'
                            name="totalAmount"
                            size="small"
                            value={formData.totalAmount}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.totalAmount}
                            helperText={fieldErrors.totalAmount}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="totalAmountInWords"
                            label='Total Amount in Words'
                            name="totalAmountInWords"
                            size="small"
                            value={formData.totalAmountInWords}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!fieldErrors.totalAmountInWords}
                            helperText={fieldErrors.totalAmountInWords}
                          />
                        </FormControl>
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
                                    Terms
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {termsandConditionsTable.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handlePriceDeleteRow(row.id, termsandConditionsTable, setTermsandConditionsTable, termsandConditionsTableErrors, setTermsandConditionsTableErrors)
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
                                        value={row.terms}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTermsandConditionsTable((prev) => prev.map((r) => (r.id === row.id ? { ...r, terms: value } : r)));
                                          setTermsandConditionsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              terms: !value ? 'Terms is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={termsandConditionsTableErrors[index]?.terms ? 'error form-control' : 'form-control'}
                                      />
                                      {termsandConditionsTableErrors[index]?.terms && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {termsandConditionsTableErrors[index].terms}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        // style={{ width: '150px' }}
                                        type="text"
                                        value={row.description}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setTermsandConditionsTable((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, description: value } : r))
                                          );
                                          setTermsandConditionsTableErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              description: !value ? 'Description is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={termsandConditionsTableErrors[index]?.description ? 'error form-control' : 'form-control'}
                                      />
                                      {termsandConditionsTableErrors[index]?.description && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {termsandConditionsTableErrors[index].description}
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
                {value === 3 && (
                <>
                  <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="remarks"
                    label="Remarks" 
                    name="salesOrderNo"
                    size="small"
                    value={formData.remarks}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.remarks}
                    helperText={fieldErrors.remarks }
                  />
                </FormControl>
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

export default SalesInvoiceExport;
