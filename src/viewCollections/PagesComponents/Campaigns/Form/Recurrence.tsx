import * as MUI from '@mui/material';
import * as MUIIcon from '@mui/icons-material';
import * as S from './styled';
import { CustomButton } from '../../../../components/Custom/CustomButton';
import { CustomInput } from '../../../../components/Custom/CustomInput';
import { CustomSelect } from '../../../../components/Custom/CustomSelect';
import { SimpleTitle } from '../../../../viewCollections/commonStyled';
import { Dispatch } from 'react';
import { campaign } from '../../../../helpers/dialer/campaign';
import { RecurrenceType } from 'types/dialer/recurrence';
import { TableRecurrence } from 'components/Tables/TableRecurrence';

type Props = {
    payloadRecurrence: RecurrenceType | undefined;
    setPayloadRecurrence: Dispatch<RecurrenceType>;
    typeCampaign: string;
    dataRecurrence: RecurrenceType[];
}

export const Recurrence = ({ payloadRecurrence, setPayloadRecurrence, typeCampaign, dataRecurrence }: Props) => {
    return (
        <MUI.Box>
            <SimpleTitle color="error">PARA O USO DA RÉGUA É NECESSÁRIO A CRIAÇÃO DE UMA RECORRÊNCIA DO TIPO ÚNICO!</SimpleTitle>
            <SimpleTitle>Informações da recorrência</SimpleTitle>
            <MUI.Stack direction="row" gap="10px" flexWrap="wrap">
                <CustomSelect
                    label="Tipo de recorrência"
                    placeholder="Tipo de recorrência"
                    height="36px"
                    required
                    Icon={MUIIcon.GridView}
                    options={campaign.recurrenceTypes(typeCampaign).map((item) => {
                        return {
                            label: item.label,
                            value: item.value
                        }
                    })}
                    value={payloadRecurrence?.name}
                    setValue={(e) => setPayloadRecurrence({ 
                        ...payloadRecurrence, 
                        name: e
                    })}
                />
                <CustomInput
                    label="Código"
                    placeholder="Código"
                    type="text"                 
                    height="36px"  
                    required     
                    Icon={MUIIcon.Numbers}
                    value={payloadRecurrence?.cod}
                    onChange={(e) => setPayloadRecurrence({ 
                        ...payloadRecurrence, 
                        cod: e.target.value
                    })}
                />
                <CustomInput
                    label="Intervalo de acionamento"
                    placeholder="Intervalo de acionamento"
                    type="number"                 
                    height="36px"  
                    required     
                    Icon={MUIIcon.Numbers}
                    value={payloadRecurrence?.interval_1?.toString()}
                    onChange={(e) => setPayloadRecurrence({ 
                        ...payloadRecurrence, 
                        interval_1: parseInt(e.target.value)
                    })}
                />
                <CustomInput
                    label="Limite máximo diário"
                    placeholder="Limite máximo diário"
                    type="number"                 
                    height="36px"  
                    required     
                    Icon={MUIIcon.Numbers}
                    value={payloadRecurrence?.interval_2?.toString()}
                    onChange={(e) => setPayloadRecurrence({ 
                        ...payloadRecurrence, 
                        interval_2: parseInt(e.target.value)
                    })}
                />
                <CustomInput
                    label="Limite máximo invalidação contato"
                    placeholder="Limite máximo invalidação contato"
                    type="number"                 
                    height="36px"  
                    required     
                    Icon={MUIIcon.Numbers}
                    value={payloadRecurrence?.interval_3?.toString()}
                    onChange={(e) => setPayloadRecurrence({ 
                        ...payloadRecurrence, 
                        interval_3: parseInt(e.target.value)
                    })}
                />
            </MUI.Stack>
            <MUI.Stack marginTop="20px" direction="row" justifyContent="space-between">
                <CustomButton
                    value="Criar recorrência"
                    Icon={MUIIcon.Campaign}
                    width="auto"
                />
                <CustomButton
                    value="Pular passo"
                    Icon={MUIIcon.SkipNext}
                    width="auto"
                /> 
            </MUI.Stack>
            <TableRecurrence
                data={dataRecurrence}

            />
        </MUI.Box>   
    )    
}
