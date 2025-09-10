import { FilterContainer } from './styled';
import { CustomInput } from '../Custom/CustomInput';
import { Dispatch } from 'react';
import { TextFields } from '@mui/icons-material';

type Props = {
  currentValue?: string;
  handleChange?: Dispatch<string>;
  fieldName?: string;
}

export const FreeTextFilter = ({ handleChange, currentValue, fieldName }: Props) => {
  return (
    <FilterContainer>
      <CustomInput        
        placeholder={fieldName as string}
        type="text"
        onChange={(e) => handleChange && handleChange(e.target.value)}
        label={fieldName as string}
        value={currentValue}
        width="100%"
        height="38px"
        Icon={TextFields}
      />
    </FilterContainer>
  );
};
