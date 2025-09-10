import { Box, keyframes, styled } from "@mui/material";

interface InactivityAgentAlertWrapperProps {
  showAlert?: boolean;
}

const pulseRed = keyframes`
  0% {
    background-color: #ae0000;
  }
  50% {
    background-color: transparent;
  }
  100% {
    background-color: #ae0000;
  }
`;

export const InactivityAgentAlertWrapper = styled(
  Box
)<InactivityAgentAlertWrapperProps>(({ showAlert }) => ({
  ".Twilio-TaskListBaseItem": {
    animation: showAlert ? `${pulseRed} 2.5s infinite` : "none",
  },
  ".Twilio-TaskCard": {
    animation: showAlert ? `${pulseRed} 2.5s infinite` : "none",
  },
}));
