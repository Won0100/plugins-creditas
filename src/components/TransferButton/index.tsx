import React, { useEffect, useState, FC } from "react";
import { Actions, styled } from "@twilio/flex-ui";
import { Shortcut } from "@mui/icons-material";
import { CircularProgress } from "@mui/material";

interface IconWrapperProps {
  isLoading: boolean;
}

const IconWrapper = styled.div<IconWrapperProps>`
  margin: 0.8rem;
  cursor: ${(props) => (props.isLoading ? "not-allowed" : "pointer")};
`;

export const TransferButton: FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeTransferTask = () => setIsLoading(true);
    const handleAfterTransferTask = () => setIsLoading(false);

    Actions.addListener("beforeTransferTask", handleBeforeTransferTask);
    Actions.addListener("afterTransferTask", handleAfterTransferTask);

    return () => {
      Actions.removeListener("beforeTransferTask", handleBeforeTransferTask);
      Actions.removeListener("afterTransferTask", handleAfterTransferTask);
    };
  }, []);

  return isLoading ? (
    <IconWrapper isLoading={isLoading}>
      <CircularProgress size={20} />
    </IconWrapper>
  ) : (
    <IconWrapper
      isLoading={false}
      onClick={() => Actions.invokeAction("ShowDirectory")}
    >
      <Shortcut/>
    </IconWrapper>
  );
};
