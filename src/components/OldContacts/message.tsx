import React from "react";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import { BubbleMessageWrapper } from "components/MessageMedia/BubbleMessageWrapper";
import { MessageContainer } from "./styled";

const useStyles = makeStyles((theme: Theme) => {
  return createStyles({
    messageContent: {
      padding: 0,
      margin: 0,
    },
    messageTimeStampRight: {
      position: "absolute",
      fontSize: ".85em",
      marginTop: "10px",
      bottom: "5px",
      right: "10px",
    },
  });
});

type MessageProps = {
  message: string;
  timestamp: string;
  displayName: string;
  media: Array<any>;
  isLeftMessage: boolean;
};

export const Message = ({
  message,
  timestamp,
  displayName,
  media,
  isLeftMessage,
}: MessageProps) => {
  const classes = useStyles();

  //isLeftMessage={isLeftMessage ? classes.messageRow : classes.messageRowRight}

  return (
    <MessageContainer isLeftMessage={isLeftMessage} className="">
      <div
        className={
          isLeftMessage ? "message customerMessage" : "message agentMessage"
        }
      >
        <div className="displayName">
          <span className="bold">{displayName}</span>
          <span>{timestamp}</span>
        </div>
        <div>
          {message ? (
            <p className={classes.messageContent}>{message}</p>
          ) : (media?.length ?? 0) > 0 ? (
            <span className="message-card-body">
              <BubbleMessageWrapper historyMessage={media[0]} />
            </span>
          ) : (
            <p className={classes.messageContent}>
              Mensagem ou mídia não localizada
            </p>
          )}
        </div>
      </div>
    </MessageContainer>
  );
};
