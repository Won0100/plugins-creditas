import { styled } from '@mui/material';

export const TextTable = styled('span')(() => `
    font-family: "Inter var experimental", "Inter var", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
    font-weight: 500;
    font-size: 0.875rem;
    line-height: 1.5rem;
    display: table-cell;
    vertical-align: inherit;
    border-bottom: 1px solid rgba(81, 81, 81, 1);
    text-align: left;
    padding: 16px;    
`);