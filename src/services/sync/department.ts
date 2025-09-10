import { Manager } from "@twilio/flex-ui";
import { readDocument, readDocumentData } from "services/syncClient";
import { DepartmentType } from "../../types/department";

const manager = Manager.getInstance();
const uniqueName = `departments-${manager.serviceConfiguration.account_sid}`;

export const departmentDocument = {
  get: async (): Promise<DepartmentType | undefined> => {
    try {
      const document = await readDocumentData<DepartmentType>(uniqueName);

      return document;
    } catch (err: any) {
      console.error("departmentDocument.get: ", err.message);
    }
  },
  update: async (payload: DepartmentType) => {
    try {
      const document = await readDocument(uniqueName);

      const documentUpdated = await document.update(payload);

      return documentUpdated;
    } catch (err: any) {
      console.error("departmentDocument.update: ", err.message);
    }
  },
};
