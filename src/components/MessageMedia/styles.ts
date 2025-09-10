import { styled } from '@twilio/flex-ui';

export const BubbleMessageWrapperDiv = styled('div')`
  padding: '5px';
  margin: '0px';
`;

export const ContentApiMessage = styled('div')`
  padding: 0 12px 8px;
  margin: 3px 0 0;
  white-space: pre-line;
`

export const MainWrapper = styled('div')`
  .audio-react-recorder {
    display: none;
  }

  display: flex;
  justify-content: center;
  align-items: center;
  
  button {
    padding: 5px;
    margin: 0 5px;
    border-radius: 5px;
    background: none;
    color: '#ffffff';
    border: none;

    .Twilio-Icon {
      svg {
        width: 26px;
        height: 26px;
      }
    }

    &:hover {
      cursor: pointer;
      border-width: 1px;
      background-color: rgba(255, 255, 255, 0.2);
      border-radius: 50%;
    }

    &:disabled {
      &:hover,
      &:active {
        cursor: not-allowed;
        transform: translate3d(0, 0, 0);
        box-shadow: initial;
      }
    }
  }
`;