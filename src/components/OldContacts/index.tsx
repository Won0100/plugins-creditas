import { MutableRefObject, useEffect, useRef, useState } from "react";
import { OldContactsWrapper } from "./styled";
import { Notifications } from "@twilio/flex-ui";
import { oldContacts } from "../../services/oldContacts";
import { TaskCanvasChildrenProps } from "@twilio/flex-ui/src/components/supervisor";
import { ArrowBack } from "@mui/icons-material";
import { ProgressCircular } from "../Progress/Circular";
import { Box, CircularProgress } from "@mui/material";
import { Message } from "./message";

interface Props extends TaskCanvasChildrenProps {
  uniqueName: string;
  label: string;
}

export const OldContacts = ({ task }: Props) => {
  const [
    listConversationsWrapperIsActive,
    setListConversationsWrapperIsActive,
  ] = useState(true);
  const [listConversations, setListConversations] = useState<any[]>([]);
  const [messagesList, setMessagesList] = useState<any[]>([]);
  const [conversationInformation, setConversationInformation] = useState<any>(
    {}
  );
  const [loading, setLoading] = useState(false);
  const [anchor, setAnchor] = useState(window.location.pathname);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const endOfConversationListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (anchor !== window.location.pathname) {
      setAnchor(window.location.pathname);
      setListConversationsWrapperIsActive(true);
    }

    conversationsByAddress();
  }, [window.location.pathname]);  

  useEffect(() => {
    if (listConversationsWrapperIsActive) {
      requestAnimationFrame(() => endOfConversationListRef?.current?.scrollIntoView());
      return;
    }

    const scroll = () => {
      endOfMessagesRef?.current?.scrollIntoView();
    }

    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
    setTimeout(() => requestAnimationFrame(scroll), 2000);
  }, [listConversationsWrapperIsActive, messagesList, listConversations]);

  async function conversationsByAddress() {
    setLoading(true);
    try {
      const { success, data, message } =
        await oldContacts.getConversationsByAddress(
          task?.attributes.customerAddress || task?.defaultFrom
        );

      if (!success) {
        console.warn("Error to get conversation history", message);
        return Notifications.showNotification("getConversationsError");
      }

      setListConversations(data);
    } catch (err) {
      //console.warn('Error to get conversation history', message);
      //return Notifications.showNotification('getConversationsError');
    } finally {
      setLoading(false);
    }
  }

  async function getMessagesByConversation(conversationSid: string) {
    setLoading(true);
    try {
      const { success, data, message } =
        await oldContacts.getMessagesByConversationSid(conversationSid);

      if (!success) {
        console.warn(
          "Error to get messages from conversation",
          message && message
        );
        return Notifications.showNotification("getMessagesError");
      }

      setListConversationsWrapperIsActive(false);
      setMessagesList(data);
    } catch (err) {
      // console.warn('Error to get messages from conversation', err.message);
      // return Notifications.showNotification('getMessagesError');
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Box width="100%" textAlign="center">
        <ProgressCircular />
      </Box>
    );
  }

  return (
    <OldContactsWrapper>
      {listConversationsWrapperIsActive ? (
        <div className="list-wrapper">
          {listConversations.length > 0 ? (
            listConversations.map((conversation) => {
              return (
                <div className="list-card" key={conversation?.conversationSid}>
                  <p>
                    {new Date(
                      conversation?.conversationDateCreated
                    ).toLocaleString("pt-BR", {
                      timeStyle: "short",
                      dateStyle: "short",
                    })}
                  </p>
                  <button
                    onClick={() => {
                      setConversationInformation({
                        sid: conversation?.conversationSid,
                        dateCreated: conversation?.conversationDateCreated,
                        client:
                          conversation?.participantMessagingBinding?.address,
                      });

                      getMessagesByConversation(conversation.conversationSid);
                    }}
                  >
                    Ver mensagens
                  </button>
                </div>
              );
            })
          ) : (
            <p className="list-card-empty">
              Não tem conversas,{" "}
              <a href="#" onClick={() => conversationsByAddress()}>
                Clique aqui para recarregar
              </a>
            </p>
          )}
          <div ref={endOfConversationListRef} />
        </div>
      ) : (
        <div className="message-wrapper">
          <div className="message-header">
            <div className="message-header-actions">
              <button onClick={() => setListConversationsWrapperIsActive(true)}>
                <ArrowBack color="primary" />
              </button>
            </div>
            <div className="message-header-information">
              <p title={conversationInformation.sid}>
                <b>SID:</b> {conversationInformation.sid}
              </p>
              <p>
                <b>Criação:</b>{" "}
                {new Date(conversationInformation.dateCreated).toLocaleString(
                  "pt-BR",
                  {
                    timeStyle: "short",
                    dateStyle: "short",
                  }
                )}
              </p>
            </div>
          </div>
          <div className="message-list-container">
            {loading && <CircularProgress />}
            {!loading && messagesList.length > 0 ? (
              messagesList.map((message) => {                
                const timestamp = new Date(
                  message.dateCreated
                ).toLocaleTimeString("pt-BR", { timeStyle: "short" });
                return (
                  <Message
                    message={message.body}
                    timestamp={timestamp}
                    displayName={message.author}
                    media={message.media}
                    isLeftMessage={
                      conversationInformation.client === message.author
                        ? true
                        : false
                    }
                  />
                );
              })
            ) : (
              <span>Não tem mensagens nessa conversa</span>
            )}
            <div ref={endOfMessagesRef} />   
          </div>
        </div>
      )}
    </OldContactsWrapper>
  );
};
