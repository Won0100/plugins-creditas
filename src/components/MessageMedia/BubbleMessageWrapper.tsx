import React, { useState, useEffect } from "react";
import { BubbleMessageWrapperDiv, ContentApiMessage } from "./styles";
import { MediaMessageComponent } from "./Media";
import { Unsupported } from "./Media/components/Unsupported";
import { CircularProgress } from "@mui/material";
import { oldContacts } from "../../services/oldContacts";
import { userInstance } from "../../services/manager/user";

type SourceProps = {
  type?: string;
  media?: any;
  body?: string;
  attributes: {
    mediaType?: string;
    media?: any;
    contentApiMessage?: string;
    channelFormatMessage?: string;
  };
};

type Props = {
  message?: {
    source?:  SourceProps;
  };
  historyMessage?: {
    sid: string;
    content_type: string;
  }
}

export const BubbleMessageWrapper = ({
  message,
  historyMessage,
}: Props) => {
  const [mediaUrl, setMediaUrl] = useState("");
  const [newSource, setNewSource] = useState<SourceProps>();
  const [workerToken] = useState(userInstance.workerToken());
  const [chatServiceSid] = useState(userInstance.chatServiceSid());

  useEffect(() => {
    const fetchMediaUrl = async () => {
      if (historyMessage) {
        const historyMediaUrl = await oldContacts.getMediaBySid(
          workerToken,
          chatServiceSid,
          historyMessage.sid
        );        
        setMediaUrl(historyMediaUrl);
        setNewSource({
          attributes: {
            mediaType: historyMessage.content_type,
          }
        });
      } else {
        const messageMediaUrl = message?.source?.media
          ? await message?.source?.media?.getContentTemporaryUrl()
          : message?.source?.attributes?.media;

        if (messageMediaUrl) {
          setMediaUrl(messageMediaUrl);
          setNewSource(message?.source);
        }
      }
    };

    (async () => await fetchMediaUrl())();
  }, [message?.source]);

  if (!mediaUrl && newSource?.type === "media") {
    return <CircularProgress />;
  }

  if (mediaUrl && newSource) {
    return (
      <BubbleMessageWrapperDiv>
        <MediaMessageComponent
          mediaUrl={mediaUrl}
          mediaType={
            newSource?.media?.contentType ?? newSource?.attributes.mediaType
          }
        />
      </BubbleMessageWrapperDiv>
    );
  } else if (message?.source?.attributes?.mediaType) {
    return (
      <BubbleMessageWrapperDiv>
        <MediaMessageComponent
          mediaUrl={newSource?.attributes.media}
          mediaType={newSource?.attributes.mediaType}
        />
      </BubbleMessageWrapperDiv>
    );
  } else if (
    newSource?.attributes.contentApiMessage &&
    newSource?.attributes.channelFormatMessage
  ) {
    return (
      <ContentApiMessage>
        <span>{newSource?.attributes.channelFormatMessage}</span>
      </ContentApiMessage>
    );
  } else if (newSource?.attributes && newSource?.body === "") {
    return <Unsupported />;
  }

  return <></>;
};
