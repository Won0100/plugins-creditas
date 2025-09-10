import React from 'react';

import { readDocument } from '../../services/syncClient';
import { SyncDocument } from 'twilio-sync';

type CallbackListener = (eventData: {
  data: any;
  previousData: any;
  isLocal: boolean;
}) => void

export type CallbackListenerParams = Parameters<CallbackListener>;

type ListenerItem = { 
  doc: SyncDocument;
  callback: CallbackListener
};

export default class AbstractSyncComponent<P = {}, S = {}, SS = any> extends React.Component<P, S, SS> {
  _listeners: ListenerItem[] = [];

  setupListener = async (docName: string, callback: CallbackListener) => {
    const doc = await readDocument(docName);
    doc.on('updated', callback);

    this._listeners.push({ doc, callback });
  };

  componentWillUnmount() {
    this._listeners.forEach(({ doc, callback }) => {
      doc.off('updated', callback);
    });
  }

  render() {
    return (<></>);
  }
}
