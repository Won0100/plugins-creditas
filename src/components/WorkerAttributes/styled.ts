import { styled } from '@twilio/flex-ui';

export const Container = styled('div')`
  display: flex;
  flex-direction: column;
  padding: 0.5rem 1rem 1rem;
  gap: 0.5rem;
  margin-top: 2rem;

  .custom-select {
    padding: 0.5rem;
    font-size: 1rem;
    background: none;
    color: #fff;
  }
`

export const ButtonsGroup = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-end;
  gap: 4px;

  button {
    width: 22%;
    height: 2.2rem;
    font-size: 0.875rem;
    font-weight: 600;
    line-height: 1.25rem;
    white-space: nowrap;
    cursor: pointer;
    align-self: center;
    box-shadow: none;
    border-style: solid;
    border-width: 1px;
    border-radius: 4px;
    text-transform: initial;

    &:disabled {
      cursor: not-allowed;
      opacity: 0.4;
    }
  }
   
  .save {
    color: #222;
    background: rgb(2, 99, 224);
    border-color: rgb(2, 99, 224);
    background-color: rgb(2, 99, 224);

    &:hover {
      background: rgb(3, 11, 93);
      border-color: rgb(0, 20, 137);
      background-color: rgb(3, 11, 93);
    }
  }

  .reset {
    color: rgb(18, 28, 45);
    background: rgb(255, 255, 255);
    border-color: rgb(136, 145, 170);
    background-color: rgb(255, 255, 255);

    &:hover {
      background: rgb(235, 244, 255);
      border-color: rgb(0, 20, 137);
      background-color: rgb(235, 244, 255);
    }
  }
`

export const Title = styled('span')`
  font-weight: bold;
`

export const Divisor = styled('div')`
  border: none;
  border-top: 1px solid #ccc;
  height: 0;
  margin: 8px 0;
`