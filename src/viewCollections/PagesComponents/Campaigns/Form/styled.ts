import { styled, Typography, Stack } from '@mui/material';

export const Img = styled('img')(() => `
    width: 250px;
    object-fit: contain;
`);

export const TextTemplate = styled(Typography)(() => `
    position: absolute;
    width: 100px;       
    max-height: 200px;
    overflow-x: hidden;
    margin-top: 20px;
    font-size: 0.7rem;
    color: #000;
`);