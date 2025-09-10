import * as MUI from '@mui/material';
import { Delete } from '@mui/icons-material';
import { ProgressCircular } from '../Progress/Circular';
import { RecurrenceType } from 'types/dialer/recurrence';
import { date } from 'helpers/date';

type Props = {
    data: RecurrenceType[];    
    //edit: boolean;
    //changeData: (id: string, type: InfoModeType, field: InfoFieldType, value: string) => void;
    //loading: boolean;
    //deleteItemData: (id: string, type: InfoModeType) => void;
}

export const TableRecurrence = ({ data }: Props) => {
    // if(loading) {
    //     return <ProgressCircular />
    // }
    
    return (
        <MUI.Table>
            <MUI.TableHead>
                <MUI.TableRow>
                    <MUI.TableCell>Status</MUI.TableCell>
                    <MUI.TableCell align="right">Código</MUI.TableCell>                
                    <MUI.TableCell align="right">Intervalo de acionamento</MUI.TableCell>
                    <MUI.TableCell align="right">Limite máximo diário</MUI.TableCell>
                    <MUI.TableCell align="right">Limite máximo invalidação contato</MUI.TableCell>
                    <MUI.TableCell align="right">Criação</MUI.TableCell>
                    <MUI.TableCell align="right">Atualização</MUI.TableCell>
                </MUI.TableRow>
            </MUI.TableHead>
            <MUI.TableBody>
                {data?.map((item, index) => (
                    <MUI.TableRow key={index}>
                        <MUI.TableCell component="th" scope="row">{item.name}</MUI.TableCell>                        
                        <MUI.TableCell align="right">{item.cod}</MUI.TableCell>    
                        <MUI.TableCell align="right">{item.interval_1}s</MUI.TableCell>    
                        <MUI.TableCell align="right">{item.interval_2}x</MUI.TableCell>
                        <MUI.TableCell align="right">{item.interval_3}x</MUI.TableCell>
                        <MUI.TableCell align="right">{date.getFormattedLocalDate(item.createdAt as string)}</MUI.TableCell>    
                        <MUI.TableCell align="right">{date.getFormattedLocalDate(item.updatedAt as string)}</MUI.TableCell>
                    </MUI.TableRow>
                ))}              
            </MUI.TableBody>
        </MUI.Table>
    )
}