import { ITask, withTaskContext } from "@twilio/flex-ui";
import { merge } from "lodash";
import { useEffect, useState } from "react";

import { SaveAltOutlined, CheckCircleOutline } from "@mui/icons-material";
import { Stack } from "@mui/material";
import { CustomButton } from "components/Custom/CustomButton";
import { CustomSelect } from "components/Custom/CustomSelect";
import { CustomTextarea } from "components/Custom/CustomTextarea";
import { userInstance } from "services/manager/user";
import { departmentDocument } from "services/sync/department";

import { tabsDocument } from "services/sync/tabs";
import { Tabs } from "types/tabs";

interface ComponentProps {
  task?: ITask;
  uniqueName: string;
  label: string;
}

const TaskWrapUpForm = ({ task }: ComponentProps) => {
  const [changed, setChanged] = useState(false);
  const [topic, setTopic] = useState("");
  const [reason, setReason] = useState("");
  const [subTopic, setSubTopic] = useState("");
  const [topics, setTopics] = useState<{ label: string; value: string }[]>();
  const [defaultTopics, setDefaultTopics] = useState<Tabs[]>();
  const [subTopics, setSubTopics] = useState<any>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  async function getTeamReasons() {
    const departmentsDoc = await departmentDocument.get();
    const tabsDoc = await tabsDocument.get();

    if (departmentsDoc) {
      const workerDepartment =
        userInstance.getWorkerClient()?.attributes.department_id;

      if (workerDepartment) {
        const departmentTabs = departmentsDoc.departments.find(
          (department) => department.id === workerDepartment
        )?.tabs;

        if (departmentTabs && tabsDoc) {
          const tabsToShow = tabsDoc.tabs.filter((tab) =>
            departmentTabs.find((dTab) => dTab === tab.name)
          );

          setDefaultTopics(tabsToShow);

          setTopics(
            tabsToShow.map((topic) => ({
              label: topic.name,
              value: topic.name,
            }))
          );

          if (task?.attributes?.conversations.outcome) {
            setSubTopic(task?.attributes?.conversations?.outcome);

            setTopic(task?.attributes?.conversations?.initiative ?? "");
          }
        }
      }
    }
  }

  useEffect(() => {
    if (task) {
      getTeamReasons();
      
      if (task?.attributes?.conversations) {
        if (task.attributes.conversations.content) {
          setReason(task.attributes.conversations.content);
        }
        
        if (task.attributes.conversations.initiative) {
          setTopic(task.attributes.conversations.initiative);
        }
      }
    }
  }, [task]);

  useEffect(() => {
    const topicSelected =
      defaultTopics && defaultTopics.find((tp) => tp.name === topic);

    if (topicSelected && topicSelected["sub-tabs"]) {
      setSubTopics(
        topicSelected["sub-tabs"].map((topic) => ({
          label: topic,
          value: topic,
        }))
      );
      
      if (task?.attributes?.conversations) {
        if (task.attributes.conversations.outcome) {
          setSubTopic(task.attributes.conversations.outcome);
        }
      }
    }
  }, [topic, defaultTopics, task?.attributes?.conversations]);

  useEffect(() => {
    if (
      (topic && task?.attributes?.conversations?.initiative !== topic) ||
      (subTopic && task?.attributes?.conversations?.outcome !== subTopic) ||
      task?.attributes?.conversations?.content !== reason
    ) {
      setChanged(true);
      setSaveSuccess(false);
    } else {
      setChanged(false);
    }
  }, [topic, subTopic, reason, task?.attributes?.conversations]);

  const saveForm = async () => {
    setIsSaving(true);
    
    const conversationsData = {
      conversations: {
        initiative: topic,
        outcome: subTopic,
        content: reason,
      },
    };

    try {
      if (task) {
        await task.setAttributes(merge(task.attributes, conversationsData));
      }

      setChanged(false);
      setSaveSuccess(true);
    } catch (error) {
      console.error("Erro ao salvar formulário:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Stack direction="column" padding="2rem" width="100%" alignItems="center">
      {topics && (
        <>
          <CustomSelect
            id="topic"
            label="Tópico"
            value={topic}
            setValue={setTopic}
            options={topics}
            width="25rem"
          />
          <CustomSelect
            id="subTopic"
            label="Sub-tópico"
            value={subTopic}
            setValue={setSubTopic}
            options={subTopics}
            width="25rem"
          />
        </>
      )}
      <CustomTextarea
        label="Comentários"
        placeholder=""
        value={reason}
        setValue={(e) => setReason(e.target.value)}
      />
      <Stack direction="row" alignItems="center" spacing={1}>
        <CustomButton
          Icon={saveSuccess ? CheckCircleOutline : SaveAltOutlined}
          value={isSaving ? "Salvando..." : saveSuccess ? "Salvo" : "Salvar"}
          margin="0"
          width="auto"
          onClick={saveForm}
          disabled={!changed || isSaving || saveSuccess}
          color={saveSuccess ? "success" : "primary"}
        />
      </Stack>
    </Stack>
  );
};

export default withTaskContext(TaskWrapUpForm);