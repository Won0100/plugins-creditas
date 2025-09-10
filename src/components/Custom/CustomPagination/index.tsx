import * as MUI from '@mui/material';
import { BaseSyntheticEvent, Dispatch } from 'react';
import * as S from './styled';

type Props = {
    page: string;
    setPage: Dispatch<string>;
    pages: number;
}

export const CustomPagination = ({ page, setPage, pages }: Props) => {
    if(pages === 0) return <></>;

    const handlePage = (e: BaseSyntheticEvent, pageItem: number) => {
        setPage((pageItem - 1).toString());
    }

    return (
        <MUI.Box width="100%">
            <MUI.Divider />
            <MUI.Stack 
                direction="row" 
                justifyContent="flex-end"          
                margin="25px 0"       
            >            
                <MUI.Pagination
                    page={parseInt(page) + 1}           
                    count={pages} 
                    color="primary"
                    onChange={handlePage}                 
                />
            </MUI.Stack>
        </MUI.Box>
    );
}