// assets
import { IconKey } from '@tabler/icons-react';

// constant
const icons = {
  IconKey
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const opsTransaction = {
  id: 'ops',
  title: 'OPS MASTER',
  //   caption: 'Pages Caption',
  type: 'group',
  children: [
    {
      id: 'ops',
      title: 'Ops Master',
      type: 'collapse',
      icon: icons.IconKey,

      children: [
        {
          id: 'department',
          title: 'Department',
          type: 'item',
          url: '/Finance/opsTransaction/Department'
        },
        {
          id: 'designation',
          title: 'Designation',
          type: 'item',
          url: '/Finance/opsTransaction/Designation'
        },
        {
          id: 'drawingMaster',
          title: 'Drawing Master',
          type: 'item',
          url: '/Finance/opsTransaction/DrawingMaster'
        },
        {
          id: 'gst',
          title: 'Gst',
          type: 'item',
          url: '/Finance/opsTransaction/Gst'
        },
        {
          id: 'itemMaster',
          title: 'Item Master',
          type: 'item',
          url: '/Finance/opsTransaction/ItemMaster'
        },
        {
          id: 'machineMaster',
          title: 'Machine Master',
          type: 'item',
          url: '/Finance/opsTransaction/MachineMaster'
        },
        {
          id: 'materialType',
          title: 'Material Type',
          type: 'item',
          url: '/Finance/opsTransaction/MaterialType'
        },
        {
          id: 'measuringInstrument',
          title: 'Measuring Instrument',
          type: 'item',
          url: '/Finance/opsTransaction/MeasuringInstrument'
        },
        {
          id: 'stockLocation',
          title: 'Stock Location',
          type: 'item',
          url: '/Finance/opsTransaction/StockLocation'
        },
        {
          id: 'uom',
          title: 'Uom',
          type: 'item',
          url: '/Finance/opsTransaction/Uom'
        }
      ]
    }
  ]
};

export default opsTransaction;
