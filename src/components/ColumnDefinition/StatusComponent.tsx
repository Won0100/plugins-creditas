import { IWorker } from "@twilio/flex-ui";
import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import { ActivityColorType } from "../../types/activities";
import { userInstance } from "services/manager/user";

type Props = {
  worker: IWorker;
};

export const StatusComponent = ({ worker }: Props) => {
  const [activitiesFlagColor, setActivitiesFlagColor] = useState<ActivityColorType>();  
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!activitiesFlagColor) {
      const getState = userInstance.getState();
      const flagColors = getState["activities-flag-color"].activitiesFlagColor;

      if (flagColors) {
        setActivitiesFlagColor(flagColors);
      }
    }
  }, [worker, loading]);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 3000);
  }, []);

  return (
    <Box
      key={worker.sid}
      bgcolor={(activitiesFlagColor && worker.activityName) && activitiesFlagColor[worker.activityName]?.bgColor || "#ffffff"}
      padding="10px 20px"
      display="inline-block"
      borderRadius="20px"
      color={(activitiesFlagColor && worker.activityName) && activitiesFlagColor[worker.activityName]?.color || "#000000"}
    >
      {worker.activityName}
    </Box>
  );
};
