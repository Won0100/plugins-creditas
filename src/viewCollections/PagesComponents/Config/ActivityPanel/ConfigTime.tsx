import * as MUI from "@mui/material";
import { CustomInput } from "../../../../components/Custom/CustomInput";
import { Numbers, Timelapse } from "@mui/icons-material";
import { date } from "../../../../helpers/date";
import { CustomSelect } from "components/Custom/CustomSelect";
import { Dispatch } from "react";
import { TeamsItemType } from "types/teams";
import { TeamsActivitiesDataType } from "types/activities";

type Props = {  
  activity: string;
  team: string;
  setTeam: Dispatch<string>;
  teamsSync: TeamsItemType[];
  activitiesForTeamSync: TeamsActivitiesDataType | undefined;
  setActivitiesForTeamSync: Dispatch<TeamsActivitiesDataType | undefined>;
  loading: boolean;
}

export const ConfigTime = ({ activity, team, setTeam, teamsSync, activitiesForTeamSync, setActivitiesForTeamSync, loading }: Props) => {  
    return (
        <MUI.Box>
            <CustomSelect
                label="Times"
                placeholder="Times"
                value={team}
                setValue={setTeam}
                options={teamsSync.map(teams => {
                return {
                    label: teams.name,
                    value: teams.name
                }
                })}
            />     
            <MUI.Box marginTop="20px">                
                <MUI.Stack direction="row" gap="10px">
                <CustomInput
                    label="Tempo mínimo"
                    placeholder="Tempo mínimo"
                    type="time"
                    value={(team && activity && activitiesForTeamSync?.data[team] && activitiesForTeamSync?.data[team][activity]) && date.millisecondsToString(activitiesForTeamSync?.data[team][activity]?.minTime as number) || '0'}
                    width="100%"
                    Icon={Timelapse}
                    disabled={loading}   
                    onChange={(e) => {
                    if(team && activity && activitiesForTeamSync?.data[team] && activitiesForTeamSync?.data[team][activity])
                    setActivitiesForTeamSync({
                        index: activitiesForTeamSync?.index,
                        data: {                                    
                        [team]: {   
                            ...activitiesForTeamSync?.data[team],
                            [activity]: {
                            ...activitiesForTeamSync?.data[team][activity],
                            minTime: date.stringForMiliseconds(e.target.value)
                            }
                        }
                        }
                    })
                    }}        
                />
                <CustomInput
                    label="Tempo máximo"
                    placeholder="Tempo máximo"
                    type="time"
                    value={(team && activity && activitiesForTeamSync?.data[team] && activitiesForTeamSync?.data[team][activity]) && date.millisecondsToString(activitiesForTeamSync?.data[team][activity]?.maxTime as number) || '0'}
                    width="100%"
                    Icon={Timelapse}
                    disabled={loading}      
                    onChange={(e) => {
                    if(team && activity && activitiesForTeamSync?.data[team] && activitiesForTeamSync?.data[team][activity])
                    setActivitiesForTeamSync({
                        index: activitiesForTeamSync?.index,
                        data: {                                    
                        [team]: {   
                            ...activitiesForTeamSync?.data[team],
                            [activity]: {
                            ...activitiesForTeamSync?.data[team][activity],
                            maxTime: date.stringForMiliseconds(e.target.value)
                            }
                        }
                        }
                    })
                    }}       
                />
                <CustomInput
                    label="Limite de uso diário"
                    placeholder="Limite de uso diário"
                    type="number"
                    value={
                    (team && activity && activitiesForTeamSync?.data[team] && activitiesForTeamSync?.data[team][activity]) && 
                    activitiesForTeamSync?.data[team][activity]?.dailyUsageLimit
                        ? activitiesForTeamSync?.data[team][activity]?.dailyUsageLimit?.toString()
                        : "0"
                    }
                    width="100%"
                    Icon={Numbers}
                    disabled={loading}
                    onChange={(e) => {
                    if(team && activity && activitiesForTeamSync?.data[team] && activitiesForTeamSync?.data[team][activity])
                    setActivitiesForTeamSync({
                        index: activitiesForTeamSync?.index,
                        data: {                                    
                        [team]: {   
                            ...activitiesForTeamSync?.data[team],
                            [activity]: {
                            ...activitiesForTeamSync?.data[team][activity],
                            dailyUsageLimit: parseInt(e.target.value)
                            }
                        }
                        }
                    })
                    }}
                />
                </MUI.Stack>                
            </MUI.Box>
        </MUI.Box>
    )
}