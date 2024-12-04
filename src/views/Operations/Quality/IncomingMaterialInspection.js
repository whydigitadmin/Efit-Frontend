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

const IncomingMaterialInspection = () => {
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState([]);
  const [orgId, setOrgId] = useState(parseInt(localStorage.getItem('orgId'), 10));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState();

  const [formData, setFormData] = useState({
    incomingInspRepNo: '',
    incomingInspDate: null,
    materialType: '',
    grnNo: '',
    poNo: '',
    supplierName: '',
    dcNo: '',
    type: '',
    itemNo: '',
    material: '',
    qtyReceived: '',
    inspectedQuantity: '',
    documentFormateNo: '',
    documentFormateDate: null,
    inspectedBy: '',
    inspectedDate: null,
    approvedBy: '',
    approvedDate: null,
    narration: ''
  });
  const [fieldErrors, setFieldErrors] = useState({
    incomingInspRepNo: '',
    incomingInspDate: null,
    materialType: '',
    grnNo: '',
    poNo: '',
    supplierName: '',
    dcNo: '',
    type: '',
    itemNo: '',
    material: '',
    qtyReceived: '',
    inspectedQuantity: '',
    documentFormateNo: '',
    documentFormateDate: null,
    inspectedBy: '',
    inspectedDate: null,
    approvedBy: '',
    approvedDate: null,
    narration: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [materialInspectionDetailsData, setMaterialInspectionDetailsData] = useState([
    {
      id: 1,
      parameter: '',
      specification: '',
      lst: '',
      ust: '',
      observedValue: '',
      sample1: '',
      sample2: '',
      sample3: '',
      sample4: '',
      sample5: '',
      sample6: '',
      sample7: '',
      sample8: '',
      remarks: ''
    }
  ]);
  const [materialInspectionErrors, setMaterialInspectionErrors] = useState([
    {
      parameter: '',
      specification: '',
      lst: '',
      ust: '',
      observedValue: '',
      sample1: '',
      sample2: '',
      sample3: '',
      sample4: '',
      sample5: '',
      sample6: '',
      sample7: '',
      sample8: '',
      remarks: ''
    }
  ]);

  const [appearanceData, setAppearanceData] = useState([
    {
      characteristics: '',
      methodOfInspection: '',
      specification: ''
    }
  ]);
  const [appearanceErrors, setAppearanceErrors] = useState([
    {
      characteristics: '',
      methodOfInspection: '',
      specification: ''
    }
  ]);

  const [visualInspectionData, setVisualInspectionData] = useState([
    {
      testCertificate: '',
      acceptedQty: '',
      rework: '',
      segregate: '',
      concessionallyAccepted: '',
      scrap: ''
    }
  ]);
  const [visualInspectionErrors, setVisualInspectionErrors] = useState([
    {
      testCertificate: '',
      acceptedQty: '',
      rework: '',
      segregate: '',
      concessionallyAccepted: '',
      scrap: ''
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
    if (isLastRowEmpty(materialInspectionDetailsData)) {
      displayRowError(materialInspectionDetailsData);
      return;
    }
    const newRow = {
      id: Date.now(),
      parameter: '',
      specification: '',
      lst: '',
      ust: '',
      observedValue: '',
      sample1: '',
      sample2: '',
      sample3: '',
      sample4: '',
      sample5: '',
      sample6: '',
      sample7: '',
      sample8: '',
      remarks: ''
    };
    setMaterialInspectionDetailsData([...materialInspectionDetailsData, newRow]);
    setMaterialInspectionErrors([
      ...materialInspectionErrors,
      {
        parameter: '',
        specification: '',
        lst: '',
        ust: '',
        observedValue: '',
        sample1: '',
        sample2: '',
        sample3: '',
        sample4: '',
        sample5: '',
        sample6: '',
        sample7: '',
        sample8: '',
        remarks: ''
      }
    ]);
  };
  const isLastRowEmpty = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === materialInspectionDetailsData) {
      return (
        !lastRow.parameter ||
        !lastRow.specification ||
        !lastRow.lst ||
        !lastRow.ust ||
        !lastRow.observedValue ||
        !lastRow.sample1 ||
        !lastRow.sample2 ||
        !lastRow.sample3 ||
        !lastRow.sample4 ||
        !lastRow.sample5 ||
        !lastRow.sample6 ||
        !lastRow.sample7 ||
        !lastRow.sample8 ||
        !lastRow.remarks
      );
    }
    return false;
  };

  const displayRowError = (table) => {
    if (table === materialInspectionDetailsData) {
      setMaterialInspectionErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          parameter: !table[table.length - 1].parameter ? 'Parameter is required' : '',
          specification: !table[table.length - 1].specification ? 'Specification is required' : '',
          lst: !table[table.length - 1].lst ? 'Lst is required' : '',
          ust: !table[table.length - 1].ust ? 'Ust is required' : '',
          observedValue: !table[table.length - 1].observedValue ? 'Observed Value is required' : '',
          sample1: !table[table.length - 1].sample1 ? 'Sample 1 is required' : '',
          sample2: !table[table.length - 1].sample2 ? 'Sample 2 is required' : '',
          sample3: !table[table.length - 1].sample3 ? 'Sample 3 is required' : '',
          sample4: !table[table.length - 1].sample4 ? 'Sample 4 is required' : '',
          sample5: !table[table.length - 1].sample5 ? 'Sample 5 is required' : '',
          sample6: !table[table.length - 1].sample6 ? 'Sample 6 is required' : '',
          sample7: !table[table.length - 1].sample7 ? 'Sample 7 is required' : '',
          sample8: !table[table.length - 1].sample8 ? 'Sample 8 is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : ''
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
  const handleAppearanceAddRow = () => {
    if (isLastRowEmptyAppearance(appearanceData)) {
      displayRowAppearanceError(appearanceData);
      return;
    }
    const newRow = {
      id: Date.now(),
      characteristics: '',
      methodOfInspection: '',
      specification: ''
    };
    setAppearanceData([...appearanceData, newRow]);
    setAppearanceErrors([
      ...appearanceErrors,
      {
        characteristics: '',
        methodOfInspection: '',
        specification: ''
      }
    ]);
  };

  const isLastRowEmptyAppearance = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === appearanceData) {
      return !lastRow.characteristics || !lastRow.methodOfInspection || !lastRow.specification;
    }
    return false;
  };

  const displayRowAppearanceError = (table) => {
    if (table === appearanceData) {
      setAppearanceErrors((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          characteristics: !table[table.length - 1].characteristics ? 'Characteristics is required' : '',
          methodOfInspection: !table[table.length - 1].methodOfInspection ? 'Method Of Inspection is required' : '',
          specification: !table[table.length - 1].specification ? 'Specification is required' : ''
        };
        return newErrors;
      });
    }
  };

  const handleDeleteAppearanceRow = (id, table, setTable, errorTable, setErrorTable) => {
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
      incomingInspRepNo: '',
      incomingInspDate: null,
      materialType: '',
      grnNo: '',
      poNo: '',
      supplierName: '',
      dcNo: '',
      type: '',
      itemNo: '',
      material: '',
      qtyReceived: '',
      inspectedQuantity: '',
      documentFormateNo: '',
      documentFormateDate: null,
      inspectedBy: '',
      inspectedDate: null,
      approvedBy: '',
      approvedDate: null,
      narration: ''
    });
    setFieldErrors({});
    setMaterialInspectionDetailsData([
      {
        id: 1,
        parameter: '',
        specification: '',
        lst: '',
        ust: '',
        observedValue: '',
        sample1: '',
        sample2: '',
        sample3: '',
        sample4: '',
        sample5: '',
        sample6: '',
        sample7: '',
        sample8: '',
        remarks: ''
      }
    ]);
    setMaterialInspectionErrors('');
    setAppearanceData([
      {
        characteristics: '',
        methodOfInspection: '',
        specification: ''
      }
    ]);
    setAppearanceErrors('');
    setVisualInspectionData([
      {
        testCertificate: '',
        acceptedQty: '',
        rework: '',
        segregate: '',
        concessionallyAccepted: '',
        scrap: ''
      }
    ]);
    setVisualInspectionErrors('');
    setEditId('');
  };

  const handleSave = async () => {
    console.log('THE HANDLE SAVE IS WORKING');

    const errors = {};
    if (!formData.incomingInspRepNo) errors.incomingInspRepNo = 'incoming Insp Rep No is required';
    if (!formData.incomingInspDate) errors.incomingInspDate = 'Incoming Ins pDate is required';
    if (!formData.materialType) errors.materialType = 'Material Type is required';
    if (!formData.grnNo) errors.grnNo = 'Grn No is required';
    if (!formData.poNo) errors.poNo = 'PO No / PC No is required';
    if (!formData.supplierName) errors.supplierName = 'Supplier Name is required';
    if (!formData.dcNo) errors.dcNo = 'DC/Inv No is required';
    if (!formData.type) errors.type = 'Type is required';
    if (!formData.itemNo) errors.itemNo = 'Item No is required';
    if (!formData.material) errors.material = 'Material is required';
    if (!formData.qtyReceived) errors.qtyReceived = 'Qty Received is required';
    if (!formData.inspectedQuantity) errors.inspectedQuantity = 'Inspected Quantity is required';
    if (!formData.documentFormateNo) errors.documentFormateNo = 'Document Formate No is required';
    if (!formData.documentFormateDate) errors.documentFormateDate = 'Document Formate Date is required';
    if (!formData.inspectedBy) errors.inspectedBy = 'Inspected By is required';
    if (!formData.inspectedDate) errors.inspectedDate = 'Inspected Date is required';
    if (!formData.approvedBy) errors.approvedBy = 'Approved By is required';
    if (!formData.approvedDate) errors.approvedDate = 'Approved Date is required';
    if (!formData.narration) errors.narration = 'Narration is required';

    let materialInspectionDetailsDataValid = true;
    if (!materialInspectionDetailsData || !Array.isArray(materialInspectionDetailsData) || materialInspectionDetailsData.length === 0) {
      materialInspectionDetailsDataValid = false;
      setMaterialInspectionErrors([{ general: 'Purchase Order Details Data is required' }]);
    } else {
      const newTableErrors = materialInspectionDetailsData.map((row, index) => {
        const rowErrors = {};
        if (!row.parameter) {
          rowErrors.parameter = 'Parameter is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.specification) {
          rowErrors.specification = 'Specification is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.lst) {
          rowErrors.lst = 'Lst is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.ust) {
          rowErrors.ust = 'Ust is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.observedValue) {
          rowErrors.observedValue = 'Observed Value is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.sample1) {
          rowErrors.sample1 = 'Sample 1 is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.sample2) {
          rowErrors.sample2 = 'Sample 2 is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.sample3) {
          rowErrors.sample3 = 'Sample 3 is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.sample4) {
          rowErrors.sample4 = 'Sample 4 is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.sample5) {
          rowErrors.sample5 = 'Sample 5 is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.sample6) {
          rowErrors.sample6 = 'Sample 6 is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.sample7) {
          rowErrors.sample7 = 'Sample 7 is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.sample8) {
          rowErrors.sample8 = 'Sample 8 is required';
          materialInspectionDetailsDataValid = false;
        }
        if (!row.remarks) {
          rowErrors.remarks = 'Remarks is required';
          materialInspectionDetailsDataValid = false;
        }

        return rowErrors;
      });
      setMaterialInspectionErrors(newTableErrors);
    }

    let appearanceDataValid = true;
    const newTableErrors1 = appearanceData.map((row) => {
      const rowErrors = {};
      if (!row.characteristics) {
        rowErrors.characteristics = 'Characteristics is required';
        appearanceDataValid = false;
      }
      if (!row.methodOfInspection) {
        rowErrors.methodOfInspection = 'Method of Inspection is required';
        appearanceDataValid = false;
      }
      if (!row.specification) {
        rowErrors.specification = 'Specification is required';
        appearanceDataValid = false;
      }
      return rowErrors;
    });

    setAppearanceErrors(newTableErrors1);

    let visualInspectionDataValid = true;
    const visualInspectionErrors = visualInspectionData.map((row) => {
      const rowErrors = {};
      if (!row.testCertificate) {
        rowErrors.testCertificate = 'Test Certificate is required';
        visualInspectionDataValid = false;
      }
      if (!row.acceptedQty) {
        rowErrors.acceptedQty = 'Accepted Qty is required';
        visualInspectionDataValid = false;
      }
      if (!row.rework) {
        rowErrors.rework = 'Rework is required';
        visualInspectionDataValid = false;
      }
      if (!row.segregate) {
        rowErrors.segregate = 'Segregate is required';
        visualInspectionDataValid = false;
      }
      if (!row.concessionallyAccepted) {
        rowErrors.concessionallyAccepted = 'Concessionally Accepted is required';
        visualInspectionDataValid = false;
      }
      if (!row.scrap) {
        rowErrors.scrap = 'Scrap is required';
        visualInspectionDataValid = false;
      }
      return rowErrors;
    });

    setVisualInspectionErrors(visualInspectionErrors);

    setFieldErrors(errors);

    if (Object.keys(errors).length === 0 && materialInspectionDetailsDataValid && appearanceDataValid && visualInspectionDataValid) {
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
  //       setMaterialInspectionDetailsData(
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
                    id="incomingInspRepNo"
                    label="Incoming Insp Rep No"
                    name="incomingInspRepNo"
                    size="small"
                    value={formData.incomingInspRepNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.incomingInspRepNo}
                    helperText={fieldErrors.incomingInspRepNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Incoming Insp Date"
                      value={formData.incomingInspDate ? dayjs(formData.incomingInspDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('incomingInspDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.incomingInspDate}
                      helperText={fieldErrors.incomingInspDate ? fieldErrors.incomingInspDate : ''}
                    />
                  </LocalizationProvider>
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
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.grnNo}>
                  <InputLabel id="grnNo">GRN No</InputLabel>
                  <Select labelId="grnNo" id="grnNo" label="GRN No" onChange={handleInputChange} name="grnNo" value={formData.grnNo}>
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.grnNo && <FormHelperText>{fieldErrors.grnNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="poNo"
                    label="PO No/PC No"
                    name="poNo"
                    size="small"
                    value={formData.poNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.poNo}
                    helperText={fieldErrors.poNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="supplierName"
                    label="sSupplier Name"
                    name="supplierName"
                    size="small"
                    value={formData.supplierName}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.supplierName}
                    helperText={fieldErrors.supplierName}
                  />
                </FormControl>
              </div>
              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="dcNo"
                    label="Dc/Inv No"
                    name="dcNo"
                    size="small"
                    value={formData.dcNo}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.dcNo}
                    helperText={fieldErrors.dcNo}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.type}>
                  <InputLabel id="type">Type</InputLabel>
                  <Select labelId="type" id="type" label="Type" onChange={handleInputChange} name="type" value={formData.type}>
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.type && <FormHelperText>{fieldErrors.type}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.itemNo}>
                  <InputLabel id="itemNo">Item No</InputLabel>
                  <Select labelId="itemNo" id="itemNo" label="Item No" onChange={handleInputChange} name="itemNo" value={formData.itemNo}>
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.itemNo && <FormHelperText>{fieldErrors.itemNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="material"
                    label="Material"
                    name="material"
                    size="small"
                    value={formData.material}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.material}
                    helperText={fieldErrors.material}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="qtyReceived"
                    label="Qty Received"
                    name="qtyReceived"
                    size="small"
                    value={formData.qtyReceived}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.qtyReceived}
                    helperText={fieldErrors.qtyReceived}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth variant="filled">
                  <TextField
                    id="inspectedQuantity"
                    label="Inspected Quantity"
                    name="inspectedQuantity"
                    size="small"
                    value={formData.inspectedQuantity}
                    onChange={handleInputChange}
                    inputProps={{ maxLength: 30 }}
                    error={!!fieldErrors.inspectedQuantity}
                    helperText={fieldErrors.inspectedQuantity}
                  />
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.documentFormateNo}>
                  <InputLabel id="documentFormateNo">Document Format No</InputLabel>
                  <Select
                    labelId="documentFormateNo"
                    id="documentFormateNo"
                    label="Document Format No"
                    onChange={handleInputChange}
                    name="documentFormateNo"
                    value={formData.documentFormateNo}
                  >
                    <MenuItem value="Head Office">Head Office</MenuItem>
                    <MenuItem value="Branch">Branch</MenuItem>
                  </Select>
                  {fieldErrors.documentFormateNo && <FormHelperText>{fieldErrors.documentFormateNo}</FormHelperText>}
                </FormControl>
              </div>

              <div className="col-md-3 mb-3">
                <FormControl fullWidth>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DatePicker
                      label="Date"
                      value={formData.documentFormateDate ? dayjs(formData.documentFormateDate, 'YYYY-MM-DD') : null}
                      onChange={(date) => handleDateChange('documentFormateDate', date)}
                      slotProps={{
                        textField: { size: 'small', clearable: true }
                      }}
                      format="DD-MM-YYYY"
                      error={!!fieldErrors.documentFormateDate}
                      helperText={fieldErrors.documentFormateDate ? fieldErrors.documentFormateDate : ''}
                    />
                  </LocalizationProvider>
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
                  <Tab value={0} label="Material Inspection Details" />
                  <Tab value={1} label="Appearance" />
                  <Tab value={2} label="Visual Inspection" />
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
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '68px' }}>
                                    Action
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '50px' }}>
                                    S.No
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                    Parameter
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Specification
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Lsl
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Usl
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    observedvalue
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Sample 1
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Sample 2
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Sample 3
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Sample 4
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Sample 5
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Sample 6
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Sample 7
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Sample 8
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Remarks
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {materialInspectionDetailsData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            materialInspectionDetailsData,
                                            setMaterialInspectionDetailsData,
                                            materialInspectionErrors,
                                            setMaterialInspectionErrors
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
                                        value={row.parameter}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, parameter: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              parameter: !value ? 'Parameter is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.parameter ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.parameter && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].parameter}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.specification}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, specification: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              specification: !value ? 'Specification is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.specification ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.specification && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].specification}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.lst}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, lst: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              lst: !value ? 'Lsl is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.lst ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.lst && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].lst}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.ust}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, ust: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              ust: !value ? 'Usl is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.ust ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.ust && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].ust}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.observedValue}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, observedValue: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              observedValue: !value ? 'Observed Value is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.observedValue ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.observedValue && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].observedValue}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.sample1}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sample1: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sample1: !value ? 'Sample 1 is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.sample1 ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.sample1 && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].sample1}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.sample2}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sample2: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sample2: !value ? 'Sample 2 is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.sample2 ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.sample2 && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].sample2}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.sample3}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sample3: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sample3: !value ? 'Sample 3 is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.sample3 ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.sample3 && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].sample3}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.sample4}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sample4: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sample4: !value ? 'Sample 4 is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.sample4 ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.sample4 && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].sample4}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.sample5}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sample5: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sample5: !value ? 'Sample 5 is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.sample5 ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.sample5 && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].sample5}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.sample6}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sample6: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sample6: !value ? 'Sample 6 is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.sample6 ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.sample6 && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].sample6}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.sample7}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sample7: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sample7: !value ? 'Sample 7 is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.sample7 ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.sample7 && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].sample7}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.sample8}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, sample8: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              sample8: !value ? 'Sample 8 is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.sample8 ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.sample8 && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].sample8}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.remarks}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setMaterialInspectionDetailsData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                          );
                                          setMaterialInspectionErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              remarks: !value ? 'Remarks is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={materialInspectionErrors[index]?.remarks ? 'error form-control' : 'form-control'}
                                      />
                                      {materialInspectionErrors[index]?.remarks && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {materialInspectionErrors[index].remarks}
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
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAppearanceAddRow} />
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
                                    Characteristics
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '150px' }}>
                                    Method of Inspection
                                  </th>
                                  <th className="px-2 py-2 text-white text-center" style={{ width: '200px' }}>
                                    Specification
                                  </th>
                                </tr>
                              </thead>
                              <tbody>
                                {appearanceData.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteAppearanceRow(
                                            row.id,
                                            appearanceData,
                                            setAppearanceData,
                                            appearanceErrors,
                                            setAppearanceErrors
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
                                        value={row.characteristics}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setAppearanceData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, characteristics: value } : r))
                                          );
                                          setAppearanceErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              characteristics: !value ? 'Characteristics is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={appearanceErrors[index]?.characteristics ? 'error form-control' : 'form-control'}
                                      />
                                      {appearanceErrors[index]?.characteristics && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {appearanceErrors[index].characteristics}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.methodOfInspection}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setAppearanceData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, methodOfInspection: value } : r))
                                          );
                                          setAppearanceErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              methodOfInspection: !value ? 'Method of Inspection is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={appearanceErrors[index]?.methodOfInspection ? 'error form-control' : 'form-control'}
                                      />
                                      {appearanceErrors[index]?.methodOfInspection && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {appearanceErrors[index].methodOfInspection}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        style={{ width: '150px' }}
                                        type="text"
                                        value={row.specification}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setAppearanceData((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, specification: value } : r))
                                          );
                                          setAppearanceErrors((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              specification: !value ? 'Specification is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={appearanceErrors[index]?.specification ? 'error form-control' : 'form-control'}
                                      />
                                      {appearanceErrors[index]?.specification && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {appearanceErrors[index].specification}
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
                    <div className="row d-flex">
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!visualInspectionErrors.testCertificate}>
                          <InputLabel id="testCertificate">Test Certificate</InputLabel>
                          <Select
                            labelId="testCertificate"
                            id="testCertificate"
                            label="Test Certificate"
                            onChange={handleInputChange}
                            name="testCertificate"
                            value={visualInspectionData.testCertificate}
                          >
                            <MenuItem value="Head Office">Head Office</MenuItem>
                            <MenuItem value="Branch">Branch</MenuItem>
                          </Select>
                          {visualInspectionErrors.testCertificate && <FormHelperText>{visualInspectionErrors.testCertificate}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="acceptedQty"
                            label="Accepted Qty"
                            name="acceptedQty"
                            size="small"
                            value={visualInspectionData.acceptedQty}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!visualInspectionErrors.acceptedQty}
                            helperText={visualInspectionErrors.acceptedQty}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="rework"
                            label="Rework"
                            name="rework"
                            size="small"
                            value={visualInspectionData.rework}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!visualInspectionErrors.rework}
                            helperText={visualInspectionErrors.rework}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="segregate"
                            label="Segregate"
                            name="segregate"
                            size="small"
                            value={visualInspectionData.segregate}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!visualInspectionErrors.segregate}
                            helperText={visualInspectionErrors.segregate}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="concessionallyAccepted"
                            label="Concessionally Accepted"
                            name="concessionallyAccepted"
                            size="small"
                            value={visualInspectionData.concessionallyAccepted}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!visualInspectionErrors.concessionallyAccepted}
                            helperText={visualInspectionErrors.concessionallyAccepted}
                          />
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth variant="filled">
                          <TextField
                            id="scrap"
                            label="Scrap"
                            name="scrap"
                            size="small"
                            value={visualInspectionData.scrap}
                            onChange={handleInputChange}
                            inputProps={{ maxLength: 30 }}
                            error={!!visualInspectionErrors.scrap}
                            helperText={visualInspectionErrors.scrap}
                          />
                        </FormControl>
                      </div>
                    </div>
                  </>
                )}
                {value === 3 && (
                  <>
                    <div className="row d-flex">
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.inspectedBy}>
                          <InputLabel id="testCertificate">Inspected By</InputLabel>
                          <Select
                            labelId="inspectedBy"
                            id="inspectedBy"
                            label="Inspected By"
                            onChange={handleInputChange}
                            name="inspectedBy"
                            value={formData.inspectedBy}
                          >
                            <MenuItem value="Head Office">Head Office</MenuItem>
                            <MenuItem value="Branch">Branch</MenuItem>
                          </Select>
                          {fieldErrors.inspectedBy && <FormHelperText>{fieldErrors.inspectedBy}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Inspected Date"
                              value={formData.inspectedDate ? dayjs(formData.inspectedDate, 'YYYY-MM-DD') : null}
                              onChange={(date) => handleDateChange('inspectedDate', date)}
                              slotProps={{
                                textField: { size: 'small', clearable: true }
                              }}
                              format="DD-MM-YYYY"
                              error={!!fieldErrors.inspectedDate}
                              helperText={fieldErrors.inspectedDate ? fieldErrors.inspectedDate : ''}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.approvedBy}>
                          <InputLabel id="approvedBy">Approved By</InputLabel>
                          <Select
                            labelId="approvedBy"
                            id="approvedBy"
                            label="Approved By"
                            onChange={handleInputChange}
                            name="approvedBy"
                            value={formData.approvedBy}
                          >
                            <MenuItem value="Head Office">Head Office</MenuItem>
                            <MenuItem value="Branch">Branch</MenuItem>
                          </Select>
                          {fieldErrors.approvedBy && <FormHelperText>{fieldErrors.approvedBy}</FormHelperText>}
                        </FormControl>
                      </div>
                      <div className="col-md-3 mb-3">
                        <FormControl fullWidth>
                          <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DatePicker
                              label="Approved Date"
                              value={formData.approvedDate ? dayjs(formData.approvedDate, 'YYYY-MM-DD') : null}
                              onChange={(date) => handleDateChange('approvedDate', date)}
                              slotProps={{
                                textField: { size: 'small', clearable: true }
                              }}
                              format="DD-MM-YYYY"
                              error={!!fieldErrors.approvedDate}
                              helperText={fieldErrors.approvedDate ? fieldErrors.approvedDate : ''}
                            />
                          </LocalizationProvider>
                        </FormControl>
                      </div>
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

export default IncomingMaterialInspection;
