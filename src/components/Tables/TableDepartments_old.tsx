import * as MUI from '@mui/material';
import { CustomInput } from '../Custom/CustomInput';
import { Delete, TextFields } from '@mui/icons-material';
import { ProgressCircular } from '../Progress/Circular';
import { DepartmentItemType } from '../../types/department';

type Props = {
    data: DepartmentItemType[];   
    tabs: string[];     
    edit: boolean;
    changeItem: (id: string, value: string) => void;
    loading: boolean;
    deleteItem: (id: string) => void;
}

export const TableDepartments = ({ data, tabs, edit, loading, changeItem, deleteItem }: Props) => {
    if(loading) {
        return <ProgressCircular />
    }
    
    return (
        <MUI.Table>
            <MUI.TableHead>
                <MUI.TableRow>
                    <MUI.TableCell>Nome</MUI.TableCell>                
                    <MUI.TableCell align="right"></MUI.TableCell>
                </MUI.TableRow>
            </MUI.TableHead>
            <MUI.TableBody>
                {data && (data.length > 0 && edit) && data.map((item) => (
                    <MUI.TableRow key={item.id}>
                        <MUI.TableCell component="th" scope="row" align="center">
                            <CustomInput
                                width="100%"
                                height="36px"
                                label=""
                                placeholder=""
                                type="text"
                                value={item.name}
                                marginBottom="0"
                                textAlign="end"
                                Icon={TextFields}                              
                                onChange={(e) => changeItem(item.id, e.target.value)}
                            />
                        </MUI.TableCell>    
                        <MUI.TableCell align="right">               
                            <MUI.IconButton onClick={() => deleteItem(item.id)}>
                                <Delete />
                            </MUI.IconButton>
                        </MUI.TableCell>                      
                    </MUI.TableRow>
                ))}  
                {data && (data?.length > 0 && !edit) && data.map((item, index) => (
                    <MUI.TableRow key={index}>
                        <MUI.TableCell component="th" scope="row">{item.name}</MUI.TableCell>    
                        <MUI.TableCell align="right"></MUI.TableCell>                      
                    </MUI.TableRow>
                ))}              
            </MUI.TableBody>
        </MUI.Table>
    )
}