import { styled } from '@twilio/flex-ui';

export const CustomTable = styled.table`
  box-sizing: border-box;
  border-collapse: collapse;
  border-color: ${props => (props.theme as any).tokens.borderColors.colorBorderWeaker};
  border-spacing: 0px;
  border-style: solid;
  border-width: 1px;
  table-layout: auto;
  width: 100%;

  & thead {
    box-sizing: border-box;
    background-color: ${props => (props.theme as any).tokens.backgroundColors.colorBackground};
    border-bottom: 2px solid ${props => (props.theme as any).tokens.borderColors.colorBorderWeaker};
  }

  & thead th {
    box-sizing: border-box;
    font-size: 0.875rem;
    line-height: 1.25rem;
    font-weight: 600;
    padding: 0.75rem 1rem;
    position: relative;
    text-align: left;
    vertical-align: inherit;
  }

  & tbody tr {
    box-sizing: border-box;
    border-style: solid;
    border-color: ${props => (props.theme as any).tokens.borderColors.colorBorderWeaker};
    border-width: 0px 0px 1px;
  }

  & tbody tr:last-of-type {
    border-width: 0px;
  }

  & tbody tr:nth-of-type(2n) {
    background-color: ${props => (props.theme as any).tokens.backgroundColors.colorBackground};
  }

  & tbody tr td {
    box-sizing: border-box;
    font-size: 0.875rem;
    line-height: 1.25rem;
    padding: 0.75rem 1rem;
    position: relative;
    text-align: left;
    vertical-align: inherit;
    overflow-wrap: break-word;
  }

  .hide-child-combo-label label[data-paste-element='LABEL'] {
    display: none;
  }
`;
