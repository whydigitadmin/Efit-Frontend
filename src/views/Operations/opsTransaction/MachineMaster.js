import ClearIcon from '@mui/icons-material/Clear';
import FormatListBulletedTwoToneIcon from '@mui/icons-material/FormatListBulletedTwoTone';
import SaveIcon from '@mui/icons-material/Save';
import SearchIcon from '@mui/icons-material/Search';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { Button, FormHelperText } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import 'react-tabs/style/react-tabs.css';
import 'react-toastify/dist/ReactToastify.css';
import ActionButton from 'utils/ActionButton';
import CommonTable from 'views/basicMaster/CommonTable';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {Modal, Box, Typography } from '@mui/material';
import { FaCloudUploadAlt, FaEye } from 'react-icons/fa';
import apiCalls from 'apicall'; 
import { showToast } from 'utils/toast-component';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CommonListViewTable from '../../basicMaster/CommonListViewTable';

const VisuallyHiddenInput = ({ ...props }) => {
  return <input type="file" style={{ display: 'none' }} {...props} />;
};

const dummyImageURL = 'https://t3.ftcdn.net/jpg/04/62/93/66/240_F_462936689_BpEEcxfgMuYPfTaIAOC1tCDurmsno7Sp.jpg';


function MachineMaster() {
  const [selectedPartImgFiles, setSelectedPartImgFiles] = useState([]);
  const [partImgUploadedFiles, setPartImgUploadedFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [openPreviewModal, setOpenPreviewModal] = useState(false);
  const [showForm, setShowForm] = useState(true);
  const [data, setData] = useState(true);
  const [branch, setBranch] = useState(localStorage.getItem('branch'));
  const [branchCode, setBranchCode] = useState(localStorage.getItem('branchcode'));
  const [finYear, setFinYear] = useState(localStorage.getItem('finYear'));
  const [orgId, setOrgId] = useState(localStorage.getItem('orgId'));
  const [loginUserName, setLoginUserName] = useState(localStorage.getItem('userName'));
  const [value, setValue] = useState(0);
  const [editId, setEditId] = useState('');
  const [allAccountName, setAllAccountName] = useState([]);
  const [department, setDepartment] = useState([]);
  const [currencies, setCurrencies] = useState([]);
  const [docId, setDocId] = useState('');
  const [selectedRows, setSelectedRows] = useState([]);
  const [formData, setFormData] = useState({
    docDate: dayjs(),
    departmentName:'',
    type:'',
    machineNo:'',
    machineName:'',
    calibrationRequired:'',
    location:'',
    processNo:'',
    machineCategory:'',
    section:'',
    model:'',
    serialNo:'',
    status:'',
    manufacturedBy:'',
    madeIn:'',
    purchasedFrom:'',
    modeOfPurchase:'',
    machineIncharge:'',
    machineUsedFor:'',
    pmCheckListNo:'',
    remarks:'',
    //3rd Tab
    instrumentName:''
  });

  const [fieldErrors, setFieldErrors] = useState({
    docDate: dayjs(),
    departmentName:'',
    type:'',
    machineNo:'',
    machineName:'',
    calibrationRequired:'',
    location:'',
    processNo:'',
    machineCategory:'',
    section:'',
    model:'',
    serialNo:'',
    status:'',
    manufacturedBy:'',
    madeIn:'',
    purchasedFrom:'',
    modeOfPurchase:'',
    machineIncharge:'',
    machineUsedFor:'',
    pmCheckListNo:'',
    remarks:'',
    //3rd Tab
    instrumentName:''
  });

  const listViewColumns = [
    { accessorKey: 'docDate', header: 'Date', size: 140 },
    { accessorKey: 'docId', header: 'Document No', size: 140 },
    { accessorKey: 'department', header: 'Department', size: 140 }
  ];

  const [detailsTableData1, setDetailsTableData1] = useState([
    {
      id: 1,
      installationDate:'',
      powerConsumption:'',
      consumption:'',
      powerProduced:'',
      capacity:'',
      unit:'',
      bedSizeMM:'',
      currentInAMPS:'',
      voltage:'',
      cussionTonnage:'',
      machineType:'',
      hourlyRate:'',
      instrumentWt:'',
      uom:'',
      warrentyStartDate:'',
      warrentyEndDate:'',
      lastCalibratedDate:'',
      nextDueDate:'',
      year:'',
      range:'',
      errorAllowed:'',
      frequencyOfCalibration:'',
      maintananceDate:''
    }
  ]);
  const [detailsTableErrors1, setDetailsTableErrors1] = useState([
    {
      id: 1,
      installationDate:'',
      powerConsumption:'',
      consumption:'',
      powerProduced:'',
      capacity:'',
      unit:'',
      bedSizeMM:'',
      currentInAMPS:'',
      voltage:'',
      cussionTonnage:'',
      machineType:'',
      hourlyRate:'',
      instrumentWt:'',
      uom:'',
      warrentyStartDate:'',
      warrentyEndDate:'',
      lastCalibratedDate:'',
      nextDueDate:'',
      year:'',
      range:'',
      errorAllowed:'',
      frequencyOfCalibration:'',
      maintananceDate:''
    }
  ]);
  const [detailsTableData2, setDetailsTableData2] = useState([
    {
      id: 1,
      itemId:'',
      itemDescription:'',
      piece:'',
      ProdQTYHr:'',
      operationName:'',
      remarks:''
    }
  ]);
  const [detailsTableErrors2, setDetailsTableErrors2] = useState([
    {
      id: 1,
      itemId:'',
      itemDescription:'',
      piece:'',
      ProdQTYHr:'',
      operationName:'',
      remarks:''
    }
  ]);
  const [file, setFile] = useState('');
  const [listView, setListView] = useState(false);
  const [listViewData, setListViewData] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    getMachineMasterDocId();
    getAllMachineMasterByOrgId();
    getMachineMasterDepartment();
    // getAllAccountName();
  }, []);

  const handleClear = () => {
    setFile('')
    setFormData({
      docDate: dayjs(),
      departmentName:'',
      type:'',
      machineNo:'',
      machineName:'',
      calibrationRequired:'',
      location:'',
      processNo:'',
      machineCategory:'',
      section:'',
      model:'',
      serialNo:'',
      status:'',
      manufacturedBy:'',
      madeIn:'',
      purchasedFrom:'',
      modeOfPurchase:'',
      machineIncharge:'',
      machineUsedFor:'',
      pmCheckListNo:'',
      remarks:'',
      //3rd Tab
      instrumentName:''
    });
    setFieldErrors({
      docDate: dayjs(),
      departmentName:'',
      type:'',
      machineNo:'',
      machineName:'',
      calibrationRequired:'',
      location:'',
      processNo:'',
      machinecategory:'',
      section:'',
      model:'',
      serialNo:'',
      status:'',
      manufacturedBy:'',
      madeIn:'',
      purchasedFrom:'',
      modeOfPurchase:'',
      machineIncharge:'',
      machineUsedFor:'',
      pmCheckListNo:'',
      remarks:'',
      //3rd Tab
      instrumentName:''
    });
    setDetailsTableData1([
      { id: 1,
        installationDate:'',
        powerConsumption:'',
        consumption:'',
        powerProduced:'',
        capacity:'',
        unit:'',
        bedSizeMM:'',
        currentInAMPS:'',
        voltage:'',
        cussionTonnage:'',
        machineType:'',
        hourlyRate:'',
        instrumentWt:'',
        uom:'',
        warrentyStartDate:'',
        warrentyEndDate:'',
        lastCalibratedDate:'',
        nextDueDate:'',
        year:'',
        range:'',
        errorAllowed:'',
        frequencyOfCalibration:'',
        maintananceDate:'' }
    ]);
    setDetailsTableErrors1('');
    setDetailsTableData2([
      { id: 1,
        itemId:'',
        itemDescription:'',
        piece:'',
        ProdQTYHr:'',
        operationName:'',
        remarks:'' }
    ]);
    setDetailsTableErrors2('');
    setEditId('');
    setSelectedPartImgFiles([]);
    getMachineMasterDocId();
  };
  const handleInputChange = (e) => {
    const { name, value, checked, selectionStart, selectionEnd, type } = e.target;
    const codeRegex = /^[a-zA-Z0-9#_\-\/\\ ]*$/;
    const numRegex = /^[0-9- ]*$/;
    const nameRegex = /^[a-zA-Z- ]*$/;
    let errorMessage = '';

    switch (name) {
      case 'machineNo':
      case 'machineName':
      case 'calibrationRequired':
      case 'location':
      case 'processNo':
      case 'machineCategory':
      case 'model':
      case 'serialNo':
      case 'status':
      case 'manufacturedBy':
      case 'madeIn':
      case 'purchasedFrom':
      case 'modeOfPurchase':
      case 'machineIncharge':
      case 'machineUsedFor':
      case 'pmCheckListNo':
      case 'remarks':
      case 'instrumentName':
      case 'itemDescription ':
      case 'unit':
      case 'bedSizeMM':
      case 'cussionTonnage':
      case 'machineType':
      case 'uom':
      case 'year':
      case 'frequencyOfCalibration':
        if (!codeRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
      break;
      case 'section':
      case 'powerConsumption':
      case 'consumption':
      case 'powerProduced':
      case 'capacity':
      case 'currentInAMPS':
      case 'voltage':
      case 'hourlyRate':
      case 'instrumentWt':
      case 'ProdQTYHr':
      case 'piece':
      case 'errorAllowed':
      case 'range':
        if (!numRegex.test(value)) {
          errorMessage = 'Invalid Format';
        }
      break;
      default:
      break;
    }
    if (errorMessage) {
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: errorMessage }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: type === 'text' || type === 'textarea' ? value.toUpperCase() : value
      }));
      setFieldErrors((prevErrors) => ({ ...prevErrors, [name]: '' }));
    }
    // Preserve cursor position for text inputs
    if (type === 'text' || type === 'textarea') {
      setTimeout(() => {
        const inputElement = document.getElementsByName(name)[0];
        if (inputElement && inputElement.setSelectionRange) {
          inputElement.setSelectionRange(selectionStart, selectionEnd);
        }
      }, 0);
    }
  }; 
 
  const handleDateChange = (field, date) => {
    const formattedDate = dayjs(date);
    console.log('formattedDate', formattedDate);
    setFormData((prevData) => ({ ...prevData, [field]: formattedDate }));
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleAddRow1 = () => {
    if (isLastRowEmpty1(detailsTableData1)) {
      displayRowError1(detailsTableData1);
      return;
    }
    const newRow = {
      id: Date.now(),
      installationDate:'',
      powerConsumption:'',
      consumption:'',
      powerProduced:'',
      capacity:'',
      unit:'',
      bedSizeMM:'',
      currentInAMPS:'',
      voltage:'',
      cussionTonnage:'',
      machineType:'',
      hourlyRate:'',
      instrumentWt:'',
      uom:'',
      warrentyStartDate:'',
      warrentyEndDate:'',
      lastCalibratedDate:'',
      nextDueDate:'',
      year:'',
      range:'',
      errorAllowed:'',
      frequencyOfCalibration:'',
      maintananceDate:''
    };
    setDetailsTableData1([...detailsTableData1, newRow]);
    setDetailsTableErrors1([
      ...detailsTableErrors1,
      { installationDate:'',
        powerConsumption:'',
        consumption:'',
        powerProduced:'',
        capacity:'',
        unit:'',
        bedSizeMM:'',
        currentInAMPS:'',
        voltage:'',
        cussionTonnage:'',
        machineType:'',
        hourlyRate:'',
        instrumentWt:'',
        uom:'',
        warrentyStartDate:'',
        warrentyEndDate:'',
        lastCalibratedDate:'',
        nextDueDate:'',
        year:'',
        range:'',
        errorAllowed:'',
        frequencyOfCalibration:'',
        maintananceDate:'' }
    ]);
  };

  const isLastRowEmpty1 = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData1) {
      return (
        !lastRow.installationDate ||
        !lastRow.powerConsumption ||
        !lastRow.consumption ||
        !lastRow.powerProduced ||
        !lastRow.capacity ||
        !lastRow.unit ||
        !lastRow.bedSizeMM ||
        !lastRow.currentInAMPS ||
        !lastRow.voltage ||
        !lastRow.cussionTonnage ||
        !lastRow.machineType ||
        !lastRow.hourlyRate ||
        !lastRow.instrumentWt ||
        !lastRow.uom ||
        !lastRow.warrentyStartDate ||
        !lastRow.warrentyEndDate ||
        !lastRow.lastCalibratedDate ||
        !lastRow.nextDueDate ||
        !lastRow.year ||
        !lastRow.range ||
        !lastRow.errorAllowed ||
        !lastRow.frequencyOfCalibration ||
        !lastRow.maintananceDate
      );
    }
    return false;
  };

  const displayRowError1 = (table) => {
    if (table === detailsTableData1) {
      setDetailsTableErrors1((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          installationDate: !table[table.length - 1].installationDate ? 'InstallationDate is required' : '',
          powerConsumption: !table[table.length - 1].powerConsumption ? 'Power Consumption is required' : '',
          consumption: !table[table.length - 1].consumption ? 'Consumption is required' : '',
          powerProduced: !table[table.length - 1].powerProduced ? 'Power Produced is required' : '',
          capacity: !table[table.length - 1].capacity ? 'Capacity is required' : '',
          unit: !table[table.length - 1].unit ? 'Unit is required' : '',
          bedSizeMM: !table[table.length - 1].bedSizeMM ? 'Bed Size MM is required' : '',
          currentInAMPS: !table[table.length - 1].currentInAMPS ? 'Current In AMPS is required' : '',
          voltage: !table[table.length - 1].voltage ? 'Voltage is required' : '',
          cussionTonnage: !table[table.length - 1].cussionTonnage ? 'Cussion Tonnage is required' : '',
          machineType: !table[table.length - 1].machineType ? 'Machine Type is required' : '',
          hourlyRate: !table[table.length - 1].hourlyRate ? 'Hourly Rate is required' : '',
          instrumentWt: !table[table.length - 1].instrumentWt ? 'Instrument Wt is required' : '',
          uom: !table[table.length - 1].uom ? 'UOM is required' : '',
          warrentyStartDate: !table[table.length - 1].warrentyStartDate ? 'Warrenty Start Date is required' : '',
          warrentyEndDate: !table[table.length - 1].warrentyEndDate ? 'Warrenty End Date is required' : '',
          lastCalibratedDate: !table[table.length - 1].lastCalibratedDate ? 'Last Calibrated Date is required' : '',
          nextDueDate: !table[table.length - 1].nextDueDate ? 'Next Due Date is required' : '',
          year: !table[table.length - 1].year ? 'Year is required' : '',
          range: !table[table.length - 1].range ? 'Range is required' : '',
          errorAllowed: !table[table.length - 1].errorAllowed ? 'Error Allowed is required' : '',
          frequencyOfCalibration: !table[table.length - 1].frequencyOfCalibration ? 'Frequency Of Calibration is required' : '',
          maintananceDate: !table[table.length - 1].maintananceDate ? 'Maintanance Date is required' : '',
        };
        return newErrors;
      });
    }
  };

  const handleAddRow2 = () => {
    if (isLastRowEmpty2(detailsTableData2)) {
      displayRowError2(detailsTableData2);
      return;
    }
    const newRow = {
      id: Date.now(),
      itemId:'',
      itemDescription:'',
      piece:'',
      ProdQTYHr:'',
      operationName:'',
      remarks:''
    };
    setDetailsTableData2([...detailsTableData2, newRow]);
    setDetailsTableErrors2([
      ...detailsTableErrors2,
      { itemId:'',
        itemDescription:'',
        piece:'',
        ProdQTYHr:'',
        operationName:'',
        remarks:''}
    ]);
  };

  const isLastRowEmpty2 = (table) => {
    const lastRow = table[table.length - 1];
    if (!lastRow) return false;

    if (table === detailsTableData2) {
      return (
        !lastRow.itemId ||
        !lastRow.itemDescription ||
        !lastRow.piece ||
        !lastRow.ProdQTYHr ||
        !lastRow.operationName ||
        !lastRow.remarks
      );
    }
    return false;
  };

  const displayRowError2 = (table) => {
    if (table === detailsTableData2) {
      setDetailsTableErrors2((prevErrors) => {
        const newErrors = [...prevErrors];
        newErrors[table.length - 1] = {
          ...newErrors[table.length - 1],
          itemId: !table[table.length - 1].itemId ? 'Item Id is required' : '',
          itemDescription: !table[table.length - 1].itemDescription ? 'Item Description is required' : '',
          piece: !table[table.length - 1].piece ? 'Piece is required' : '',
          ProdQTYHr: !table[table.length - 1].ProdQTYHr ? 'Prod QTY Hr is required' : '',
          operationName: !table[table.length - 1].operationName ? 'Operation Name is required' : '',
          remarks: !table[table.length - 1].remarks ? 'Remarks is required' : ''
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
    if (!formData.departmentName) {
      errors.departmentName = 'Department is required';
    }
    if (!formData.type) {
      errors.type = 'Type is required';
    }
    if (!formData.machineNo) {
      errors.machineNo = 'Machine No is required';
    }
    if (!formData.machineName) {
      errors.machineName = 'Machine Name is required';
    }
    if (!formData.madeIn) {
      errors.madeIn = 'Made In is required';
    }
    
    // let detailTableDataValid1 = true;
    // const newTableErrors1 = detailsTableData1.map((row) => {
    //   const rowErrors = {};
    //   if (!row.accountName) {
    //     rowErrors.accountName = 'Account Name is required';
    //     detailTableDataValid1 = false;
    //   }
    //   if (!row.subLedgerCode) {
    //     rowErrors.subLedgerCode = 'Sub Ledger Code is required';
    //     detailTableDataValid1 = false;
    //   }
    //   if (!row.subledgerName) {
    //     rowErrors.subledgerName = 'Sub ledger Name is required';
    //     detailTableDataValid1 = false;
    //   }
    //   if (!row.debitAmount) {
    //     rowErrors.debitAmount = 'Debit Amount is required';
    //     detailTableDataValid1 = false;
    //   }
    //   if (!row.creditAmount) {
    //     rowErrors.creditAmount = 'Credit Amount is required';
    //     detailTableDataValid1 = false;
    //   }
    //   if (!row.creditBase) {
    //     rowErrors.creditBase = 'Credit Base is required';
    //     detailTableDataValid1 = false;
    //   }
    //   if (!row.debitBase) {
    //     rowErrors.debitBase = 'Debit Base is required';
    //     detailTableDataValid1 = false;
    //   }
    //   return rowErrors;
    // });
    // let detailTableDataValid2 = true;
    // const newTableErrors2 = detailsTableData1.map((row) => {
    //   const rowErrors = {};
    //   if (!row.accountName) {
    //     rowErrors.accountName = 'Account Name is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.subLedgerCode) {
    //     rowErrors.subLedgerCode = 'Sub Ledger Code is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.subledgerName) {
    //     rowErrors.subledgerName = 'Sub ledger Name is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.debitAmount) {
    //     rowErrors.debitAmount = 'Debit Amount is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.creditAmount) {
    //     rowErrors.creditAmount = 'Credit Amount is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.creditBase) {
    //     rowErrors.creditBase = 'Credit Base is required';
    //     detailTableDataValid2 = false;
    //   }
    //   if (!row.debitBase) {
    //     rowErrors.debitBase = 'Debit Base is required';
    //     detailTableDataValid2 = false;
    //   }
    //   return rowErrors;
    // });
    setFieldErrors(errors);
    // setDetailsTableErrors1(newTableErrors1);
    // setDetailsTableErrors2(newTableErrors2);

    if (Object.keys(errors).length === 0) {
          const MachineMasterVO1 = detailsTableData1.map((row) => ({
            ...(editId && { id: row.id }),
            bedSize: row.bedSizeMM,
            capacity: parseInt(row.capacity),
            consumption: parseInt(row.consumption),
            currentInAmps: parseInt(row.currentInAMPS),
            hourlyRate: parseInt(row.hourlyRate),
            instrumentWt: parseInt(row.instrumentWt),
            powerConsumption: parseInt(row.powerConsumption),
            powerProduced: parseInt(row.powerProduced),
            voltage: parseInt(row.voltage),
            installationDate: dayjs(row.installationDate).format('YYYY-MM-DD'),
            lastCalibratedDate: dayjs(row.lastCalibratedDate).format('YYYY-MM-DD'),
            maintenanceDate: dayjs(row.maintananceDate).format('YYYY-MM-DD'),
            nextDueDate: dayjs(row.nextDueDate).format('YYYY-MM-DD'),
            warrantyEndDate: dayjs(row.warrentyEndDate).format('YYYY-MM-DD'),
            warrantyStDate: dayjs(row.warrentyStartDate).format('YYYY-MM-DD'),
            cushionTonnage: row.cussionTonnage,
            errorAllowed: row.errorAllowed,
            frequenceOfCalibration: row.frequencyOfCalibration,
            machineType: row.machineType,
            rangeInfo: row.range,
            unit: row.unit,
            uom: row.uom,
            lifeCycle: row.year
    }));
      const MachineMasterVO2 = detailsTableData2.map((row) => ({
        ...(editId && { id: row.id }),
        cycleTime: row.piece,
        prodQtyHr: parseInt(row.ProdQTYHr),
        itemDescription: row.itemDescription,
        itemId: row.itemId,
        operationName: row.operationName,
        remarks: row.remarks,
      }));
      const saveFormData = {
        ...(editId && { id: editId }),
        branch: branch,
              branchCode: branchCode,
              createdBy: loginUserName,
              finYear: finYear,
              orgId: orgId,
              machineMasterDTO1: MachineMasterVO1,
              machineMasterDTO2: MachineMasterVO2,
              calibrationRequired: formData.calibrationRequired === "yes" ? true : false,
              department: formData.departmentName,
              // refDate: dayjs(formData.refDate).format('YYYY-MM-DD'),
              location: formData.location,
              // suppRefDate: dayjs(formData.suppRefDate).format('YYYY-MM-DD'),
              machineCategory: formData.machineCategory,
              machineIncharge: formData.machineIncharge,
              machineName: formData.machineName,
              machineNo: formData.machineNo,
              machineUsedFor: formData.machineUsedFor,
              madeIn: formData.madeIn,
              manufacturedBy: formData.manufacturedBy,
              modeOfPurchase: formData.modeOfPurchase,
              model: formData.model,
              pmCheckListNo: formData.pmCheckListNo,
              processNo: formData.processNo,
              purchasedFrom: formData.purchasedFrom,
              remarks: formData.remarks,
              section: parseInt(formData.section),
              serialNo: formData.serialNo,
              status: formData.status,
              type: formData.type,
              instrumentName: formData.instrumentName
              
      };
      console.log('DATA TO SAVE IS:', saveFormData);
      try {
              const response = await apiCalls('put', `/machinemaster/updateCreateMachineMaster`, saveFormData);
              if (response.status === true) {
                console.log('Response:', response);
                showToast('success', editId ? 'Machine Master Updated Successfully' : 'Machine Master Created successfully');
                // Extract the generated ID
                const generatedId = response.paramObjectsMap.machineMasterVO.id;
                console.log('Id',response.paramObjectsMap.machineMasterVO.id);
                if (generatedId && selectedPartImgFiles.length > 0) {
                  console.log('Generated ID:', generatedId);

                  // Wait for the file upload to complete
                  await handleFileUpload(generatedId);
                } else {
                  console.log('handleFileUpload failed');
                } 
                getAllMachineMasterByOrgId();
                handleClear();
              } else {
                showToast('error', response.paramObjectsMap.message || 'Machine Master creation failed');
              }
            } catch (error) {
              console.error('Error:', error);
              showToast('error', 'Machine Master creation failed');
            }
    } else {
      setFieldErrors(errors);
    }
  };
  const getMachineMasterDocId = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/machinemaster/getMachineMasterDocId?orgId=${orgId}`
      );
      setDocId(response.paramObjectsMap.machineMasterDocId);
    } catch (error) {
      console.error('Error fetching in Machine Master Doc Id :', error);
    }
  };

  const getMachineMasterDepartment = async () => {
    try {
      const response = await apiCalls(
        'get',
        `/issuetosubcontractor/getDepartmentName?orgId=${orgId}`
      );
      setDepartment(response.paramObjectsMap.routeCardVO);
    } catch (error) {
      console.error('Error fetching gate passes:', error);
    }
  };

  const getAllMachineMasterByOrgId = async () => {
    try {
      const result = await apiCalls('get', `/machinemaster/getAllMachineMasterByOrgId?orgId=${orgId}`);
      setData(result.paramObjectsMap.machineMasterVO || []);
      // showForm(true);
      console.log('machineMasterVO', result);
    } catch (err) {
      console.log('error', err);
    }
  };

  const getAllMachineMasterById = async (row) => {
    console.log('first', row);
    setShowForm(true);
    try {
      const result = await apiCalls('get', `/machinemaster/getAllMachineMasterById?id=${row.original.id}`);

      if (result) {
        const mmVO = result.paramObjectsMap.machineMasterVO;
        console.log("Machine Master VO",result.paramObjectsMap.machineMasterVO);
        setEditId(row.original.id);
        setDocId(mmVO.docId);
        setFormData({
          docDate: mmVO.docDate ? dayjs(mmVO.docDate, 'YYYY-MM-DD') : dayjs(),
          calibrationRequired: mmVO.calibrationRequired,
          departmentName: mmVO.department,
          location: mmVO.location,
          machineCategory: mmVO.machineCategory,
          machineIncharge: mmVO.machineIncharge,
          orgId: mmVO.orgId,
          machineName: mmVO.machineName,
          machineNo: mmVO.machineNo,
          machineUsedFor: mmVO.machineUsedFor,
          madeIn: mmVO.madeIn,
          manufacturedBy: mmVO.manufacturedBy,
          modeOfPurchase: mmVO.modeOfPurchase,
          model: mmVO.model,
          pmCheckListNo: mmVO.pmCheckListNo,
          processNo: mmVO.processNo,
          purchasedFrom: mmVO.purchasedFrom,
          remarks: mmVO.remarks,
          section: mmVO.section,
          serialNo: mmVO.serialNo,
          status: mmVO.status,
          type: mmVO.type,
          instrumentName: mmVO.instrumentName,
          selectedPartImgFiles: mmVO.attachements
        });
        setDetailsTableData1(
          mmVO.machineMasterVO1.map((row) => ({
            id: row.id,
            bedSizeMM: row.bedSize,
            capacity: row.capacity,
            consumption: row.consumption ,
            currentInAMPS: row.currentInAmps,
            cussionTonnage: row.cushionTonnage,
            errorAllowed: row.errorAllowed,
            frequencyOfCalibration: row.frequenceOfCalibration,
            hourlyRate: row.hourlyRate,
            installationDate: row.installationDate,
            instrumentWt: row.instrumentWt,
            lastCalibratedDate: row.lastCalibratedDate,
            year: row.lifeCycle,
            machineType: row.machineType,
            maintananceDate: row.maintenanceDate,
            nextDueDate: row.nextDueDate,
            powerConsumption: row.powerConsumption,
            powerProduced: row.powerProduced,
            range: row.rangeInfo,
            unit: row.unit,
            uom: row.uom,
            voltage: row.voltage,
            warrentyEndDate: row.warrantyEndDate,
            warrentyStartDate: row.warrantyStDate
          }))
        );
        setDetailsTableData2(
          mmVO.machineMasterVO2.map((row) => ({
            id: row.id,
            piece: row.cycleTime,
            itemDescription: row.itemDescription,
            itemId: row.itemId ,
            operationName: row.operationName,
            ProdQTYHr: row.prodQtyHr,
            remarks: row.remarks
          }))
        );
        
        console.log('DataToEdit', mmVO);
      } else {
        // Handle erro
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleFileUpload = async (generatedId) => {
    if (!generatedId) {
      console.warn('Generated ID is missing');
      showToast('error', 'Generated ID is required');
      return;
    }

    // Prepare FormData
    const formData = new FormData();
    for (let i = 0; i < partImgUploadedFiles.length; i++) {
      formData.append('file', partImgUploadedFiles[i]);
    }

    try {
      // Make the API call using the apiCalls helper function
      const response = await apiCalls(
        'post',
        `/machinemaster/uploadMachineAttachementsInBloob?id=${generatedId}`,
        formData,
        {},
        { 'Content-Type': 'multipart/form-data' } 
      );

      console.log('File Upload Response:', response);

      if (response.status === true) {
        showToast('success', response.message || 'File uploaded successfully!');
      } else {
        console.warn('File upload failed:', response);
        showToast('error', 'File upload failed');
      }
    } catch (error) {
      console.error('File Upload Error:', error);
      showToast('error', 'Failed to upload file');
    }
  };

  const handlePartImgFileUpload = (files) => {
    console.log('Test');
    setPartImgUploadedFiles(files);
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
    }
    const fileNames = Array.from(files).map((file) => file.name);
    setSelectedPartImgFiles(fileNames);
  };

  const handlePreview = (file) => {
    setSelectedFile(file);
    setOpenPreviewModal(true);
  };

  // const handleCloseModal = () => {
  //   setOpenPreviewModal(false);
  //   setSelectedFile(null);
  // };
  return (
    <>
      <div>
        {/* <ToastComponent /> */}
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
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.departmentName}>
                    <InputLabel id="departmentName">
                      {
                        <span>
                          Department<span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="departmentName"
                      label="Department"
                      id="departmentName"
                      onChange={handleInputChange}
                      name="departmentName"
                      value={formData.departmentName}
                    >
                      {department.map((item) => (
                        <MenuItem key={item.id} value={item.departmentName}>
                          {item.departmentName}
                        </MenuItem>
                      ))}
                    </Select>
                    {fieldErrors.departmentName && <FormHelperText style={{ color: 'red' }}>Department is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <FormControl size="small" variant="outlined" fullWidth error={!!fieldErrors.type}>
                    <InputLabel id="type">
                      {
                        <span>
                          Type <span className="asterisk">*</span>
                        </span>
                      }
                    </InputLabel>
                    <Select
                      labelId="type"
                      id="type"
                      label="Type"
                      onChange={handleInputChange}
                      name="type"
                      value={formData.type}
                    >
                      <MenuItem key="cnc" value="CNC">
                        CNC
                      </MenuItem>
                      <MenuItem key="vmc" value="VMC">
                        VMC
                      </MenuItem>
                    </Select> 
                    {fieldErrors.type && <FormHelperText style={{ color: 'red' }}>Type is required</FormHelperText>}
                  </FormControl>
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="machineNo"
                    label={
                      <span>
                        Machine Number <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineNo"
                    value={formData.machineNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineNo ? fieldErrors.machineNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.machineNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="machineName"
                    label={
                      <span>
                        Machine Name <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineName"
                    value={formData.machineName}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineName ? fieldErrors.machineName : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.machineName}
                  />
                </div>
                
                <div className="col-md-3 mb-3">
                  <TextField
                    id="calibrationRequired"
                    label= 'Calibration Required'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="calibrationRequired"
                    value={formData.calibrationRequired}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.calibrationRequired ? fieldErrors.calibrationRequired : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.calibrationRequired}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="location"
                    label= 'Location'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.location ? fieldErrors.location : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.location}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="processNo"
                    label= 'Process No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="processNo"
                    value={formData.processNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.processNo ? fieldErrors.processNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.processNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="machineCategory"
                    label= 'Machine Category'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineCategory"
                    value={formData.machineCategory}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineCategory ? fieldErrors.machineCategory : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.machineCategory}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="section"
                    label= 'Section'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="section"
                    value={formData.section}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.section ? fieldErrors.section : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.section}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="model"
                    label= 'Model'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.model ? fieldErrors.model : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.model}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="serialNo"
                    label= 'Serial No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="serialNo"
                    value={formData.serialNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.serialNo ? fieldErrors.serialNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.serialNo}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="status"
                    label= 'Status'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.status ? fieldErrors.status : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.status}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="manufacturedBy"
                    label= 'Manufactured By'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="manufacturedBy"
                    value={formData.manufacturedBy}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.manufacturedBy ? fieldErrors.manufacturedBy : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.manufacturedBy}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="madeIn"
                    label={
                      <span>
                        Made In <span className="asterisk">*</span>
                      </span>
                    }
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="madeIn"
                    value={formData.madeIn}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.madeIn ? fieldErrors.madeIn : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.madeIn}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="purchasedFrom"
                    label= 'Purchased From'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="purchasedFrom"
                    value={formData.purchasedFrom}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.purchasedFrom ? fieldErrors.purchasedFrom : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.purchasedFrom}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="modeOfPurchase"
                    label= 'Mode Of Purchase'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="modeOfPurchase"
                    value={formData.modeOfPurchase}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.modeOfPurchase ? fieldErrors.modeOfPurchase : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.modeOfPurchase}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="machineIncharge"
                    label= 'Machine Incharge'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineIncharge"
                    value={formData.machineIncharge}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineIncharge ? fieldErrors.machineIncharge : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.machineIncharge}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="machineUsedFor"
                    label= 'Machine Used For'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="machineUsedFor"
                    value={formData.machineUsedFor}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.machineUsedFor ? fieldErrors.machineUsedFor : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.machineUsedFor}
                  />
                </div>
                <div className="col-md-3 mb-3">
                  <TextField
                    id="pmCheckListNo"
                    label= 'PM Check List No'
                    variant="outlined"
                    size="small"
                    fullWidth
                    name="pmCheckListNo"
                    value={formData.pmCheckListNo}
                    onChange={handleInputChange}
                    helperText={<span style={{ color: 'red' }}>{fieldErrors.pmCheckListNo ? fieldErrors.pmCheckListNo : ''}</span>}
                    inputProps={{ maxLength: 40 }}
                    error={!!fieldErrors.pmCheckListNo}
                  />
                </div>
              </div>
              <div className="row d-flex">
                <div className="col-md-6">
                  <FormControl fullWidth variant="filled">
                    <TextField
                      id="remarks"
                      label="Remarks"
                      size="small"
                      name="remarks"
                      value={formData.remarks}
                      multiline
                      minRows={2}
                      inputProps={{ maxLength: 30 }}
                      onChange={handleInputChange}
                    />
                  </FormControl>
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
                    <Tab value={0} label="Technical Info" />
                    <Tab value={1} label="Machine Capacity" />
                    <Tab value={2} label="Machine Image" />
                  </Tabs>
                </Box>
                <Box sx={{ padding: 2 }}>
                  {value === 0 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="mb-1">
                          <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow1} />
                        </div>
                        {listView ? (
                          <div className="mt-4">
                            <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getAllMachineMasterById} />
                          </div>
                          ) : (
                        <div className="row mt-2">
                          <div className="col-lg-12">
                            <div className="table-responsive">
                              <table className="table table-bordered ">
                                <thead>
                                  <tr style={{ backgroundColor: '#673AB7' }}>
                                    <th className="table-header">Action</th>
                                    <th className="table-header">S.No</th>
                                    <th className="table-header">Installation Date</th>
                                    <th className="table-header">Power Consumption</th>
                                    <th className="table-header">Consumption</th>
                                    <th className="table-header">Power Produced</th>
                                    <th className="table-header">Capacity</th>
                                    <th className="table-header">Unit</th>
                                    <th className="table-header">Bed Size MM</th>
                                    <th className="table-header">Current In AMPS</th>
                                    <th className="table-header">Voltage</th>
                                    <th className="table-header">Cussion Tonnage</th>
                                    <th className="table-header">Machine Type</th>
                                    <th className="table-header">Hourly Rate</th>
                                    <th className="table-header">Instrument Rate</th>
                                    <th className="table-header">UOM</th>
                                    <th className="table-header">Warrenty Start Date</th>
                                    <th className="table-header">Warrenty End Date</th>
                                    <th className="table-header">Last Calibrated Date</th>
                                    <th className="table-header">Next Due Date</th>
                                    <th className="table-header">Year</th>
                                    <th className="table-header">Range</th>
                                    <th className="table-header">Error Allowed</th>
                                    <th className="table-header">Frequency Of Calibration</th>
                                    <th className="table-header">Maintanance Date</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {detailsTableData1.map((row, index) => (
                                    <tr key={row.id}>
                                      <td className="border px-2 py-2 text-center">
                                        <ActionButton
                                          title="Delete"
                                          icon={DeleteIcon}
                                          onClick={() =>
                                            handleDeleteRow(
                                              row.id,
                                              detailsTableData1,
                                              setDetailsTableData1,
                                              detailsTableErrors1,
                                              setDetailsTableErrors1
                                            )
                                          }
                                        />
                                      </td>
                                      <td className="text-center">
                                        <div className="pt-2">{index + 1}</div>
                                      </td>
                                      <td>
                                        <input
                                          type="date"
                                          value={row.installationDate}
                                          style={{ width: '200px' }}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, installationDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                installationDate: !date ? 'Installation Date is required' : '',
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.installationDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, DetailsTableData)}
                                        />
                                        {detailsTableErrors1[index]?.installationDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].installationDate}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.powerConsumption}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, powerConsumption: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                powerConsumption: !value ? 'Power Consumption is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.powerConsumption ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.powerConsumption && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].powerConsumption}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.consumption}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, consumption: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                consumption: !value ? 'Consumption is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.consumption ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.consumption && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].consumption}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.powerProduced}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, powerProduced: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                powerProduced: !value ? 'Power Produced is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.powerProduced ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.powerProduced && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].powerProduced}
                                          </div>
                                        )}
                                      </td>
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.capacity}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, capacity: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                capacity: !value ? 'Capacity is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.capacity ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.capacity && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].capacity}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.unit}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, unit: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                unit: !value ? 'Unit is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.unit ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.unit && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].unit}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.bedSizeMM}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, bedSizeMM: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                bedSizeMM: !value ? 'Bed Size MM is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.bedSizeMM ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.bedSizeMM && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].bedSizeMM}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.currentInAMPS}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, currentInAMPS: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                currentInAMPS: !value ? 'Current In AMPS is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.currentInAMPS ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.currentInAMPS && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].currentInAMPS}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.voltage}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, voltage: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                voltage: !value ? 'Voltage is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.voltage ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.voltage && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].voltage}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.cussionTonnage}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, cussionTonnage: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                cussionTonnage: !value ? 'Cussion Tonnage is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.cussionTonnage ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.cussionTonnage && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].cussionTonnage}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.machineType}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, machineType: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                machineType: !value ? 'Machine Type is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.machineType ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.machineType && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].machineType}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.hourlyRate}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, hourlyRate: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                hourlyRate: !value ? 'Hourly Rate is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.hourlyRate ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.hourlyRate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].hourlyRate}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.instrumentWt}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, instrumentWt: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                instrumentWt: !value ? 'Instrument Wt is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.instrumentWt ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.instrumentWt && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].instrumentWt}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.uom}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, uom: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                uom: !value ? 'UOM is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.uom ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.uom && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].uom}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <input
                                          type="date"
                                          style={{ width: '200px' }}
                                          value={row.warrentyStartDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, warrentyStartDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                warrentyStartDate: !date ? 'Warrenty Start Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.warrentyStartDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, detailsTableData1)}
                                        />
                                        {detailsTableErrors1[index]?.warrentyStartDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].warrentyStartDate}
                                          </div>
                                        )}
                                      </td> 
                                      <td>
                                        <input
                                          type="date"
                                          style={{ width: '200px' }}
                                          value={row.warrentyEndDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, warrentyEndDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                warrentyEndDate: !date ? 'Warrenty End Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.warrentyEndDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, detailsTableData1)}
                                        />
                                        {detailsTableErrors1[index]?.warrentyEndDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].warrentyEndDate}
                                          </div>
                                        )}
                                      </td> <td>
                                        <input
                                          type="date"
                                          style={{ width: '200px' }}
                                          value={row.lastCalibratedDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, lastCalibratedDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                lastCalibratedDate: !date ? 'Last Calibrated Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.lastCalibratedDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, detailsTableData1)}
                                        />
                                        {detailsTableErrors1[index]?.lastCalibratedDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].lastCalibratedDate}
                                          </div>
                                        )}
                                      </td> <td>
                                        <input
                                          type="date"
                                          style={{ width: '200px' }}
                                          value={row.nextDueDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, nextDueDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                nextDueDate: !date ? 'Next Due Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.nextDueDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, detailsTableData1)}
                                        />
                                        {detailsTableErrors1[index]?.nextDueDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].nextDueDate}
                                          </div>
                                        )}
                                      </td>
                                      
                                      <td className="border px-2 py-2">
                                        <input
                                          value={row.year}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, year: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                year: !value ? 'Year is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.year ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.year && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].year}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.range}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, range: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                range: !value ? 'Range is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.range ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.range && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].range}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.errorAllowed}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, errorAllowed: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                errorAllowed: !value ? 'Error Allowed is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.errorAllowed ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.errorAllowed && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].errorAllowed}
                                          </div>
                                        )}
                                      </td><td className="border px-2 py-2">
                                        <input
                                          value={row.frequencyOfCalibration}
                                          style={{ width: '150px' }}
                                          onChange={(e) => {
                                            const value = e.target.value;
                                            setDetailsTableData1((prev) =>
                                              prev.map((r) => (r.id === row.id ? { ...r, frequencyOfCalibration: value } : r))
                                            );
                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                frequencyOfCalibration: !value ? 'Frequency Of Calibration is required' : ''
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.frequencyOfCalibration ? 'error form-control' : 'form-control'}
                                        />
                                        {detailsTableErrors1[index]?.frequencyOfCalibration && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].frequencyOfCalibration}
                                          </div>
                                        )}
                                      </td>
                                      <td>
                                        <input
                                          type="date"
                                          style={{ width: '200px' }}
                                          value={row.maintananceDate}
                                          onChange={(e) => {
                                            const date = e.target.value;

                                            setDetailsTableData1((prev) =>
                                              prev.map((r) =>
                                                r.id === row.id ? { ...r, maintananceDate: date, endDate: date > r.endDate ? '' : r.endDate } : r
                                              )
                                            );

                                            setDetailsTableErrors1((prev) => {
                                              const newErrors = [...prev];
                                              newErrors[index] = {
                                                ...newErrors[index],
                                                maintananceDate: !date ? 'Maintanance Date is required' : '',
                                                endDate: date && row.endDate && date > row.endDate ? '' : newErrors[index]?.endDate
                                              };
                                              return newErrors;
                                            });
                                          }}
                                          className={detailsTableErrors1[index]?.maintananceDate ? 'error form-control' : 'form-control'}
                                          // onKeyDown={(e) => handleKeyDown(e, row, detailsTableData11)}
                                        />
                                        {detailsTableErrors1[index]?.maintananceDate && (
                                          <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                            {detailsTableErrors1[index].maintananceDate}
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
          )}
                      </div>
                    </>
                  )}
                  {value === 1 && (
                    <>
                    <div className="row d-flex ml">
                      <div className="mb-1">
                        <ActionButton title="Add" icon={AddIcon} onClick={handleAddRow2} />
                      </div>
                      {listView ? (
                        <div className="mt-4">
                          <CommonListViewTable data={listViewData} columns={listViewColumns} blockEdit={true} toEdit={getAllMachineMasterById} />
                        </div>
                        ) : (
                      <div className="row mt-2">
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-bordered ">
                              <thead>
                                <tr style={{ backgroundColor: '#673AB7' }}>
                                  <th className="table-header">Action</th>
                                  <th className="table-header">S.No</th>
                                  <th className="table-header">Item Id</th>
                                  <th className="table-header">Item Description</th>
                                  <th className="table-header">Cycle Time / Piece</th>
                                  <th className="table-header">Prod QTY Hr</th>
                                  <th className="table-header">Operation Name</th>
                                  <th className="table-header">Remarks</th>
                                </tr>
                              </thead>
                              <tbody>
                                {detailsTableData2.map((row, index) => (
                                  <tr key={row.id}>
                                    <td className="border px-2 py-2 text-center">
                                      <ActionButton
                                        title="Delete"
                                        icon={DeleteIcon}
                                        onClick={() =>
                                          handleDeleteRow(
                                            row.id,
                                            detailsTableData2,
                                            setDetailsTableData2,
                                            detailsTableErrors2,
                                            setDetailsTableErrors2
                                          )
                                        }
                                      />
                                    </td>
                                    <td className="text-center">
                                      <div className="pt-2">{index + 1}</div>
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.itemId}
                                        style={{ width: '150px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, itemId: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemId: !value ? 'Item Id is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.itemId ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.itemId && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].itemId}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.itemDescription}
                                        style={{ width: '150px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, itemDescription: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              itemDescription: !value ? 'Item Description is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.itemDescription ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.itemDescription && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].itemDescription}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.piece}
                                        style={{ width: '150px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, piece: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              piece: !value ? 'Piece is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.piece ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.piece && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].piece}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.ProdQTYHr}
                                        style={{ width: '150px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, ProdQTYHr: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              ProdQTYHr: !value ? 'Prod QTY Hr is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.ProdQTYHr ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.ProdQTYHr && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].ProdQTYHr}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.operationName}
                                        style={{ width: '150px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, operationName: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              operationName: !value ? 'Operation Name is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.operationName ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.operationName && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].operationName}
                                        </div>
                                      )}
                                    </td>
                                    <td className="border px-2 py-2">
                                      <input
                                        value={row.remarks}
                                        style={{ width: '150px' }}
                                        onChange={(e) => {
                                          const value = e.target.value;
                                          setDetailsTableData2((prev) =>
                                            prev.map((r) => (r.id === row.id ? { ...r, remarks: value } : r))
                                          );
                                          setDetailsTableErrors2((prev) => {
                                            const newErrors = [...prev];
                                            newErrors[index] = {
                                              ...newErrors[index],
                                              remarks: !value ? 'Remarks is required' : ''
                                            };
                                            return newErrors;
                                          });
                                        }}
                                        className={detailsTableErrors2[index]?.remarks ? 'error form-control' : 'form-control'}
                                      />
                                      {detailsTableErrors2[index]?.remarks && (
                                        <div className="mt-2" style={{ color: 'red', fontSize: '12px' }}>
                                          {detailsTableErrors2[index].remarks}
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
        )}
                    </div>
                  </>
                  )}
                    {value === 2 && (
                    <>
                      <div className="row d-flex ml">
                        <div className="row mt-2">
                        <>
                          <div className="row">
                            <div className="col-md-3 mb-3">
                              <TextField
                                label="Instrument Name"
                                variant="outlined"
                                size="small"
                                fullWidth
                                name="instrumentName"
                                value={formData.instrumentName}
                                onChange={handleInputChange}
                                error={!!fieldErrors.instrumentName}
                                helperText={fieldErrors.instrumentName}
                              />
                            </div>
                            <div className="col-md-3 mb-3">
                                      {formData.attachments ? (
                                        <>
                                          <div>
                                            <Button
                                              variant="contained"
                                              color="secondary"
                                              startIcon={<FaEye />}
                                              onClick={() => handlePreview(formData.attachments)}
                                              style={{ textTransform: 'none' }}
                                            >
                                              Preview
                                            </Button>
                                          </div>
                                        </>
                                      ) : (
                                        <>
                                          <div className="d-flex justify-content-center mb-2">
                                            <Button
                                              component="label"
                                              variant="contained"
                                              color="secondary"
                                              startIcon={<FaCloudUploadAlt />}
                                              style={{ textTransform: 'none', padding: '6px 12px' }}
                                            >
                                              Upload File
                                              <VisuallyHiddenInput onChange={(e) => handlePartImgFileUpload(e.target.files)} />
                                            </Button>
                                          </div>
                                          {selectedPartImgFiles.length > 0 && (
                                            <div className="d-flex justify-content-center uploaded-files mt-2">
                                              <Typography variant="body2">Uploaded Files:</Typography>
                                              {selectedPartImgFiles.map((fileName, index) => (
                                                <div key={index}>{fileName}</div>
                                              ))}
                                            </div>
                                          )}
                                        </>
                                      )}

                                      {/* Modal for file preview */}
                                      <Modal open={openPreviewModal} onClose={handleCloseModal}>
                                        <Box
                                          sx={{
                                            position: 'absolute',
                                            // top: '50%',
                                            // left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            width: '50%',
                                            bgcolor: 'background.paper',
                                            boxShadow: 24,
                                            p: 4,
                                            overflow: 'auto'
                                          }}
                                        >
                                          {selectedFile ? (
                                            <img
                                              src={`data:image/jpeg;base64,${selectedFile}`}
                                              alt="Preview"
                                              style={{ width: '100%', height: 'auto' }}
                                            />
                                          ) : (
                                            <Typography>No preview available</Typography>
                                          )}
                                          <Button color="secondary" onClick={handleCloseModal} style={{ marginTop: '20px' }} variant="outlined">
                                            Close
                                          </Button>
                                        </Box>
                                      </Modal>
                                    
                            </div>
                          </div>
                        </>
                        </div>
                      </div>
                    </>
                  )}
                </Box>
              </div>
            </>
          ) : (
            <CommonTable data={data} columns={listViewColumns} blockEdit={true} toEdit={getAllMachineMasterById} />
          )}
        </div>
      </div>
    </>
  );
};
export default MachineMaster;
