import React from 'react';
import { CustomSwitch } from '../Custom/CustomSwitch';
import { styled } from '@mui/material/styles';
import { QueueOrder } from '../../services/fifoLifoService';

interface FifoLifoToggleProps {
  value: QueueOrder;
  onChange: (value: QueueOrder) => void;
  disabled?: boolean;
}

const Label = styled('span')<{ selected: boolean }>(({ selected }) => ({
  color: selected ? 'green' : 'normal',
  fontWeight: selected ? 'bold' : 'normal',
  fontSize: '1rem',
  minWidth: 40,
  textAlign: 'center',
}));

export const FifoLifoToggle: React.FC<FifoLifoToggleProps> = ({ value, onChange, disabled }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Label selected={value === 'FIFO'}>FIFO</Label>
      <CustomSwitch
        status={value === 'LIFO'}
        handleChange={(checked) => onChange(checked ? 'LIFO' : 'FIFO')}
        disabled={disabled}
      />
      <Label selected={value === 'LIFO'}>LIFO</Label>
    </div>
  );
};

export default FifoLifoToggle;
