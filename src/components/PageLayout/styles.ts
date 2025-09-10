import { styled, Box } from "@mui/material";

export const Title = styled('div')(() => `
    font-size: 24px;
    margin: 1.5rem 0px;
    font-weight: bold;    
`);

export const Description = styled('div')(() => `
    font-size: 14px;
    margin: 1.5rem 0px;
    font-weight: light;    
`);

export const Header = styled(Box)(() => `
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`);

export const PageContainer = styled(Box)(() => `
    height: calc(100% - 68px);
    overflow: auto;
    display: flex;
    flex-direction: column;
    position: relative;
`);