import * as MUI from '@mui/material';
import { CustomizeTaskInfoType, InfoModeType, InfoFieldType } from '../../types/customizeTaskInfo';
import { CustomInput } from '../Custom/CustomInput';
import { Delete, TextFields } from '@mui/icons-material';
import { ProgressCircular } from '../../components/Progress/Circular';

type Props = {
    data: CustomizeTaskInfoType;    
    typeInfo: InfoModeType;
    edit: boolean;
    changeData: (id: string, type: InfoModeType, field: InfoFieldType, value: string) => void;
    loadingGet: boolean;
    deleteItemData: (id: string, type: InfoModeType) => void;
}

export const TableTaskInfo = ({ deleteItemData, data, edit, typeInfo, changeData, loadingGet }: Props) => {
    if(loadingGet) {
        return <ProgressCircular />
    }
    
    return (
        <MUI.Table>
            <MUI.TableHead>
                <MUI.TableRow>
                    <MUI.TableCell>Título</MUI.TableCell>
                    <MUI.TableCell align="right">Valor</MUI.TableCell>                
                    <MUI.TableCell align="right"></MUI.TableCell>
                </MUI.TableRow>
            </MUI.TableHead>
            <MUI.TableBody>
                {data && (data[typeInfo].length > 0 && edit) && data[typeInfo].map((item) => (
                    <MUI.TableRow key={item.id}>
                        <MUI.TableCell component="th" scope="row" align="center">
                            <CustomInput
                                width="100%"
                                height="36px"
                                label=""
                                placeholder=""
                                type="text"
                                value={item.label}  
                                marginBottom="0"
                                Icon={TextFields}                              
                                onChange={(e) => changeData(
                                    item.id,
                                    typeInfo,
                                    'label',
                                    e.target.value
                                )}
                            />
                        </MUI.TableCell>                        
                        <MUI.TableCell align="right">
                            <CustomInput
                                width="100%"
                                height="36px"
                                label=""
                                placeholder=""
                                type="text"
                                value={item.value}
                                marginBottom="0"
                                textAlign="end"
                                Icon={TextFields}                              
                                onChange={(e) => changeData(
                                    item.id as string,
                                    typeInfo,
                                    'value',
                                    e.target.value
                                )}
                            />
                        </MUI.TableCell>    
                        <MUI.TableCell align="right">               
                            <MUI.IconButton onClick={() => deleteItemData(item.id, typeInfo)}>
                                <Delete />
                            </MUI.IconButton>             
                        </MUI.TableCell>                      
                    </MUI.TableRow>
                ))}  
                {data && (data[typeInfo]?.length > 0 && !edit) && data[typeInfo].map((item, index) => (
                    <MUI.TableRow key={index}>
                        <MUI.TableCell component="th" scope="row">{item.label}</MUI.TableCell>                        
                        <MUI.TableCell align="right">{item.value}</MUI.TableCell>    
                        <MUI.TableCell align="right"></MUI.TableCell>                      
                    </MUI.TableRow>
                ))}              
            </MUI.TableBody>
        </MUI.Table>
    )
}