import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, FormHelperText, InputLabel, MenuItem, Select } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import 'react-datepicker/dist/react-datepicker.css';
import { Autocomplete, TextField } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import ActionButton from 'utils/ActionButton';
import ToastComponent, { showToast } from 'utils/toast-component';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import apiCalls from 'apicall';

const BillOfMaterial = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [accountNames, setAccountNames] = useState([]);
  const [routeCardList, setRouteCardList] = useState([]);
  const [formData, setFormData] = useState({
    active: true,
    docDate: dayjs(),
    productCode: '',
    productType: '',
    productName: '',
    uom: '',
    qty: 1.0,
    revision: false,
    default: false
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: new Date(),
    productCode: '',
    productType: '',
    productName: '',
    uom: '',
    revision: false,
    default: false
  });

  const listViewColumns = [
    { accessorKey: 'productType', header: 'Product Type', size: 140 },
    { accessorKey: 'productCode', header: 'Product Code', size: 140 },
    { accessorKey: 'productName', header: 'Product Name', size: 140 },
    { accessorKey: 'uom', header: 'UOM', size: 140 }
  ];

  const [detailsTableData, setDetailsTableData] = useState([
    {
      id: 1,
      item: '',
      itemDesc: '',
      itemType: '',
      qty: '',
      uom: ''
    }
  ]);
  const [detailsTableErrors, setDetailsTableErrors] = useState([
    {
      item: '',
      itemDesc: '',
      itemType: '',
      qty: '',
      uom: ''
    }
  ]);

  // useEffect(() => {
  //   getGeneralJournalDocId();
  //   getAllGeneralJournalByOrgId();
  //   getAccountNameFromGroup();
  // }, []);

  const getGeneralJournalDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/transaction/getGeneralJournalDocId?branchCode=${branchCode}&branch=${branch}&finYear=${finYear}&orgId=${orgId}`
      );
      setFormData((prevData) => ({
        ...prevData,
        docId: response.paramObjectsMap.generalJournalDocId,
        docDate: dayjs()
      }));
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllGeneralJournalByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/transaction/getAllGeneralJournalByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.generalJournalVO || []);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getGeneralJournalById = async (row) => {
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/transaction/getGeneralJournalById?id=${row.original.id}`);

      if (result) {
        const glVO = result.paramObjectsMap.generalJournalVO[0];
        setEditId(row.original.id);

        setFormData({
          woNo: glVO.woNo || '',
          id: glVO.id || '',
          docDate: glVO.docDate ? dayjs(glVO.docDate, 'YYYY-MM-DD') : dayjs(),
          docId: glVO.docId || '',
          customerName: glVO.customerName || '',
          customerPONo: glVO.customerPONo || '',
          quotationNo: glVO.quotationNo || '',
          currency: glVO.currency || '',
          productionMgr: glVO.productionMgr || '',
          refDate: glVO.refDate ? dayjs(glVO.refDate, 'YYYY-MM-DD') : dayjs(),
          remarks: glVO.remarks || '',
          orgId: glVO.orgId || ''
          // active: glVO.active || false,
        });
        setDetailsTableData(
          glVO.particularsJournalVO.map((row) => ({
            id: row.id,
            accountsName: row.accountsName,
            creditAmount: row.creditAmount,
            debitAmount: row.debitAmount,
            narration: row.narration,
            subLedgerCode: row.subLedgerCode,
            subledgerName: row.subledgerName
          }))
        );

        console.log('DataToEdit', glVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const getAccountNameFromGroup = async () => {
    try {
      const response = await apiCalls('get', `/transaction/getAccountNameFromGroup?orgId=${orgId}`);
      setAccountNames(response.paramObjectsMap.generalJournalVO);
      console.log('generalJournalVO', response.paramObjectsMap.generalJournalVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;

    let errorMessage = '';

    if (errorMessage) {
      setFieldErrors({ ...fieldErrors, [name]: errorMessage });
    } else {
      setFormData({ ...formData, [name]: value.toUpperCase() });

      setFieldErrors({ ...fieldErrors, [name]: '' });

      // Preserve the cursor position for text-based inputs
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

  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    // const formattedDate = dayjs(date).format('YYYY-MM-DD');
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleClear = () => {
    setFormData({
      active: true,
      productCode: '',
      productType: '',
      productName: '',
      uom: '',
      qty: 1.0,
      revision: false,
      default: false
    });
    // getAllActiveCurrency(orgId);
    setFieldErrors({
      productCode: '',
      productType: '',
      productName: '',
      uom: '',
      revision: false,
      default: false
    });
    setDetailsTableData([{ id: 1, item: '', itemDesc: '', itemType: '', qty: '', uom: '' }]);
    setDetailsTableErrors('');
    setEditId('');
    getGeneralJournalDocId();
  };

  const handleAddRow = () => {
    if (isLastRowEmpty(detailsTableData)) {
      displayRowError(detailsTableData);
      return;
    }
    const newRow = {
      id: Date.now(),
      item: '',
      qty: ''
    };
    setDetailsTableData([...detailsTableData, newRow]);
    setDetailsTableErrors([...detailsTableErrors, { item: '', qty: '' }]);
  };

  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData) {
      return !lastRow.item || !lastRow.qty;
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === detailsTableData) {
      setDetailsTableErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          item: !table[table.length - 1].item ? 'Item is required' : '',
          qty: !table[table.length - 1].qty ? 'Qty is required' : ''
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

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSave = async () => {
    const errors = {};

    if (!formData.productType) {
      errors.productType = 'Product Type is  required';
    }
    if (!formData.productCode) {
      errors.productCode = 'Product Code is  required';
    }

    let detailTableDataValid = true;
    const newTableErrors = detailsTableData.map((row) => {
      const rowErrors = {};
      if (!row.item) {
        rowErrors.item = 'Item is required';
        detailTableDataValid = false;
      }
      if (!row.qty) {
        rowErrors.qty = 'Qty is required';
        detailTableDataValid = false;
      }

      return rowErrors;
    });

    setFieldErrors(errors);
    setDetailsTableErrors(newTableErrors);

    if (Object.keys(errors).length === 0 && detailTableDataValid) {
      const GeneralJournalVO = detailsTableData.map((row) => ({
        ...(editId && { id: row.id }),
        item: row.item,
        itemDesc: row.itemDesc,
        itemType: row.itemType,
        qty: row.qty,
        uom: row.uom
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        active: formData.active,
        branch: branch,
        branchCode: branchCode,
        createdBy: loginUserName,
        productType: formData.productType,
        productCode: formData.productCode,
        productName: formData.productName,
        uom: formData.uom,
        finYear: finYear,
        orgId: orgId,
        // particularsJournalDTO: GeneralJournalVO,
        qty: formData.qty,
        revision: formData.revision,
        default: formData.default,
        machineName: formData.machineName
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
        const response = await apiCalls('put', `/transaction/updateCreateGeneralJournal`, saveFormData);
        if (response.status === true) {
          console.log('Response:', response);
          showToast('success', editId ? 'General Journal Updated Successfully' : 'General Journal Created successfully');
          getAllGeneralJournalByOrgId();
          handleClear();
        } else {
          showToast('error', response.paramObjectsMap.errorMessage || 'General Journal creation failed');
        }
      } catch (error) {
        console.error('Error:', error);
        showToast('error', 'General Journal creation failed');
      }
    } else {
      setFieldErrors(errors);
    }
  };

  return (
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
                    id="outlined-textarea-zip"
                    label="Document Id"
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="docId"
                    value={formData.docId}
                    onChange={handleInputChange}
                    disabled
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl fullWidth variant="filled" size="small">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        label="Document Date"
                        value={formData.docDate}
                        onChange={(date) => handleDateChange('docDate', date)}
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.productType}>
                    <InputLabel id="productType">
                      {
                        <span>
                          Product Type <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="productType"
                      id="productType"
                      label="Product Type"
                      onChange={handleInputChange}
                      name="productType"
                      value={formData.productType}
                    >
                      <MenuItem value="--Select--">--Select--</MenuItem>
                      <MenuItem value="FG">FG</MenuItem>
                      <MenuItem value="SFG">SFG</MenuItem>
                    </Select>
                    {fieldErrors.productType && <FormHelperText style={{ color: 'red' }}>Product Type is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <Autocomplete
                    disablePortal
                    options={routeCardList.map((option, index) => ({ ...option, key: index }))}
                    getOptionLabel={(option) => option.partyname || ''}
                    sx={{ width: '100%' }}
                    size="small"
                    value={formData.productCode ? routeCardList.find((c) => c.partyname === formData.productCode) : null}
                    onChange={(event, newValue) => {
                      handleInputChange({
                        target: {
                          name: 'productCode',
                          value: newValue ? newValue.partyname : ''
                        }
                      });
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Product Code"
                        name="productCode"
                        error={!!fieldErrors.productCode}
                        helperText={fieldErrors.productCode}
                        InputProps={{
                          ...params.InputProps,
                          style: { height: 40 }
                        }}
                      />
                    )}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Product Name"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="productName"
                    type="text"
                    value={formData.productName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.productName ? 'Product Name is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="UOM"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="uom"
                    type="text"
                    value={formData.uom}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.uom ? 'UOM is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="outlined-textarea-zip"
                    label="Qty"
                    variant="outlined"
                    size="small"
                    fullWidth
                    disabled
                    name="qty"
                    type="text"
                    value={formData.qty}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.qty ? 'Qty is required' : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControlLabel
                    control={<Checkbox checked={formData.revision} onChange={handleInputChange} name="revision" />}
                    label="Revision"
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControlLabel
                    control={<Checkbox checked={formData.active} onChange={handleInputChange} name="active" />}
                    label="Active"
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <FormControlLabel
                    control={<Checkbox checked={formData.default} onChange={handleInputChange} name="default" />}
                    label="Default"
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
                    <Tab value={0} label="BOM Details" />
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
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Item</th>
                                    <th className="table-header">Item Desc</th>
                                    <th className="table-header">Item Type</th>
                                    <th className="table-header">Qty</th>
                                    <th className="table-header">UOM</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detailsTableData.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
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
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td className="border px-2 py-2">
                                        <select
                                          value={row.item}
                                          style={{ width: '150px' }}
                                          className={detailsTableErrors[index]?.item ? 'error form-control' : 'form-control'}
                                          onChange={(e) =>
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, item: e.target.value } : r))
                                            )
                                          }
                                        >
                                          <option value="">-- Select --</option>
                                          {accountNames.map((item) => (
                                            <option key={item.id} value={item.accountName}>
                                              {item.accountName}
                                            </option>
                                          ))}
                                        </select>
                                        {detailsTableErrors[index]?.item && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].item}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.itemDesc}
                                          disabled
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, itemDesc: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemDesc: !value ? 'Item Desc is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.itemDesc ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.itemDesc && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].itemDesc}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.itemType}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, itemType: value } : r))
                                            );
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                itemType: !value ? 'Item Type is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.itemType ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.itemType && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].itemType}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.qty}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, qty: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                qty: !value ? 'Qty is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.qty ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.qty && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].qty}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          type="text"
                                          value={row.uom}
                                          disabled
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData((prev) => prev.map((r) => (r.id === row.id ? { ...r, uom: value } : r)));
                                            setDetailsTableErrors((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                uom: !value ? 'UOM is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors[index]?.uom ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors[index]?.uom && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors[index].uom}
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
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getGeneralJournalById} />
          )}
        </div>
      </div>
    </>
  );
};
export default BillOfMaterial;
