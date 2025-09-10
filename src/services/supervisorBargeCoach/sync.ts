import type { SupervisorData } from '../../types/supervisorBargeCoach/supervisorData';
import {readDocument} from '../syncClient';

export const initSyncDoc = async (workerSid: string, conferenceSid: string, supervisorFullName: string, supervisorStatus: string, updateStatus: "add" | "remove") => {
  const docName = `syncDoc.${workerSid}`;
  const doc = await readDocument(docName);
  // logger.log(
  //   `Updating (${updateStatus}) doc ${docName} with supervisors ${supervisorFullName} (${supervisorStatus}) on conference ${conferenceSid}`,
  // );

  const supervisorList: SupervisorData[] = [];

  if ((<{supervisors?: SupervisorData[]}>doc.data).supervisors) {
    supervisorList.concat(...(<{supervisors: SupervisorData[]}>doc.data).supervisors);
  }

  if (updateStatus === 'add') {
    supervisorList.push({
      conference: conferenceSid,
      supervisor: supervisorFullName,
      status: supervisorStatus,
    });

    await updateSyncDoc(docName, supervisorList);
    return;
  }

  if (updateStatus === 'remove') {
    const removeSupervisorIndex = supervisorList.findIndex((s) => s.supervisor === supervisorFullName);
    if (removeSupervisorIndex > -1) {
      supervisorList.splice(removeSupervisorIndex, 1);
    }
    
    await updateSyncDoc(docName, supervisorList);
  }
};

export const updateSyncDoc = async (docName: string, supervisors: SupervisorData[]) => {
  const doc = await readDocument(docName);

  await doc.update({
    ...doc.data,
    data: {
      supervisors 
    },
  });

  return readDocument(docName);
};

export const clearSyncDoc = async (docName: string) => {
  await updateSyncDoc(docName, []);
};

export const closeSyncDoc = async (docName: string) => {
  const doc = await readDocument(docName);
  doc.close();
};