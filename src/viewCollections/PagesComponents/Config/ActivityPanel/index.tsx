import * as MUI from "@mui/material";
import { PageLayout } from "../../../../components/PageLayout";
import { ConfigNavigation } from "../ConfigNavigation";
import { useEffect, useState } from "react";
import { CustomTabPanel } from "components/Custom/CustomTabPanel";
import { Activity } from "twilio-taskrouter";
import { ConfigTime } from "./ConfigTime";
import { ConfigFlag } from "./ConfigFlag";
import { userInstance } from "services/manager/user";
import { Save } from "@mui/icons-material";
import { CustomButton } from "components/Custom/CustomButton";
import { ActivitiesSyncType, ActivityColorType, TeamsActivitiesDataType } from "../../../../types/activities";
import { Backdrop } from "../../../../components/Backdrop";
import { activityPanelList } from "../../../../services/sync/activityPanel";
import { teamsDocument } from "../../../../services/sync/teams";
import { useSnackbar } from "../../../../hooks/useSnackbar";
import { TeamsItemType } from "types/teams";
import { activitiesFlagColorDocument } from "services/sync/activitiesFlagColor";

type Props = {
  slug: string;
};

export const ActivityPanel = ({ slug }: Props) => {
  const [value, setValue] = useState(0);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [activity, setActivity] = useState("");
  const [activitiesForTeamSync, setActivitiesForTeamSync] = useState<TeamsActivitiesDataType | undefined>();
  const [teamsSync, setTeamsSync] = useState<TeamsItemType[]>([]);
  const [activeTeamsSync, setActiveTeamsSync] = useState<TeamsActivitiesDataType[]>([]);
  const [activitiesFlagColor, setActivitiesFlagColor] = useState<ActivityColorType>({});
  const [team, setTeam] = useState('');
  const [loading, setLoading] = useState(false);

  const { throwAlert } = useSnackbar();
  const { getActivities, dispatch } = userInstance;

  useEffect(() => {
    (async () => {
      const activitiesResponse = getActivities();
      const [teams] = await Promise.all([
        teamsDocument.get(),
        getActivityPanelList()
      ])    

      if(teams && teams.data.teams) {
        setTeam(teams.data.teams[0].name);
        setTeamsSync(teams.data.teams);
      }; 

      if(activitiesResponse?.length > 0) {
        setActivity(activitiesResponse[0].name);
        setActivities(activitiesResponse);
      }     
    })();
  }, []);

  useEffect(() => {
    if((teamsSync.length > 0 && team) && activities.length > 0) (async () => await handleSyncList())();
  }, [teamsSync, activities, team]);

  useEffect(() => {
    if(!activitiesFlagColor[activity] && activities.length > 0) {
      (async () => await getActivityFlagColors())();
    }
  }, [activities, activity])

  const getActivityPanelList = async () => {
    const activeTeams= await activityPanelList.get();

    if(activeTeams && activeTeams.length) {
      setActiveTeamsSync(activeTeams);
      dispatch({
        type: 'SET_DATA_TEAMS_ACTIVITIES',
        payload: activeTeams
      });
    }
  }

  const getActivityFlagColors = async () => {
    const flagColors = await activitiesFlagColorDocument.get();
    
    if(flagColors && flagColors.data) {
      setActivitiesFlagColor(flagColors.data);
      dispatch({
        type: 'SET_DATA_ACTIVITIES_FLAG_COLOR',
        payload: flagColors.data
      });
    } else {
      let newState: ActivityColorType = {};

      for(let i = 0; i < activities.length; i++) {
        newState = {
          ...newState,
          [activities[i].name]: {
            bgColor: '#000000',
            color: '#ffffff'
          }
        }
      }

      setActivitiesFlagColor(newState);
    }
  }

  const handleSyncList = async () => {
    try {
      await getActivityPanelList();
      setLoading(true);
      if(!team) return;                   
      let newState = {} as TeamsActivitiesDataType;    

      if(activeTeamsSync.length > 0) {
        for(let i = 0; i < activeTeamsSync.length; i++) {          
          if(activeTeamsSync[i].data[team]) {
            newState = activeTeamsSync[i];
            break;
          }
        }
      }

      if(!newState.data || !newState.index) {
        let newStateData = {} as ActivitiesSyncType;

        for(let i = 0; i < activities.length; i++) {
          newStateData = {
            [team]: {
              ...newStateData[team],
              [activities[i].name]: {
                dailyUsageLimit: 0,
                maxTime: 0,
                minTime: 0
              }
            }
          }
        }

        const createNewIndex = await activityPanelList.createIndex(newStateData);

        if(createNewIndex && createNewIndex.data) {
          newState = createNewIndex;
        }
      }

      setActivitiesForTeamSync(newState);            
    } catch (error) {
      console.error("Error fetching or processing document:", error);        
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const save = async () => {
    setLoading(true);
    const [updateIndexActivityPanel, updateFlagColor] = await Promise.all([
      activityPanelList.updateIndex(activitiesForTeamSync as TeamsActivitiesDataType),
      activitiesFlagColorDocument.update(activitiesFlagColor)
    ])    

    if(updateIndexActivityPanel && updateIndexActivityPanel.data) {            
      await getActivityPanelList();
    }

    if(updateFlagColor && updateFlagColor.data) {
      await getActivityFlagColors();
    }

    throwAlert("success", "Atividades atualizadas!");
    setLoading(false);
  };

  return (
    <PageLayout title="Configurações">
      <ConfigNavigation slug={slug} />
      <MUI.Tabs style={{ marginBottom: "10px" }} value={value} onChange={handleChange}>
        <MUI.Tab label="Tempo por times e atividades" />
        <MUI.Tab label="Personalização de flags de atividades" />
      </MUI.Tabs>
      <MUI.Tabs
          value={activity}
          onChange={(e, value) => {
          setActivity(value);
          }}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="scrollable auto tabs example"
      >
          {activities.map((item) => (
          <MUI.Tab value={item.name} label={item.name} key={item.sid} />
      ))}
      </MUI.Tabs> 
      <CustomTabPanel value={value} index={0}>
        <ConfigTime          
          activity={activity}      
          team={team}    
          setTeam={setTeam}
          teamsSync={teamsSync}
          activitiesForTeamSync={activitiesForTeamSync}
          setActivitiesForTeamSync={setActivitiesForTeamSync}
          loading={loading}
        />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <ConfigFlag
          activity={activity}
          activitiesFlagColor={activitiesFlagColor}
          setActivitiesFlagColor={setActivitiesFlagColor}
          loading={loading}
        />
      </CustomTabPanel>
      <CustomButton
        value="Salvar"
        Icon={Save}
        margin="20px 0"
        onClick={save}
        disabled={loading}
        />
        <Backdrop loading={loading} />
    </PageLayout>
  );
};
