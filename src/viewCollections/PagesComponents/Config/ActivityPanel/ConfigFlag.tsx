import * as MUI from "@mui/material";
import { Dispatch } from "react";
import { ColorLens } from "@mui/icons-material";
import { CustomInput } from "../../../../components/Custom/CustomInput";
import { ActivityColorType } from "types/activities";

type Props = {
    activity: string;
    activitiesFlagColor: ActivityColorType;
    setActivitiesFlagColor: Dispatch<ActivityColorType>;
    loading: boolean;
}

export const ConfigFlag = ({ activity, loading, activitiesFlagColor, setActivitiesFlagColor }: Props) => {
    return (
        <MUI.Box>
            <MUI.Stack direction="row" gap="10px">
                <CustomInput
                    label="Cor do texto"
                    placeholder="Cor do texto"
                    type="color"
                    value={activitiesFlagColor[activity]?.color || '#000000'}
                    width="100%"
                    Icon={ColorLens}
                    disabled={loading}
                    onChange={(e) => {                    
                        setActivitiesFlagColor({
                            ...activitiesFlagColor,
                            [activity]: {
                            ...activitiesFlagColor[activity],
                                color: e.target.value
                            }
                        })
                    }}
                />
                <CustomInput
                    label="Cor de fundo"
                    placeholder="Cor de fundo"
                    type="color"
                    value={activitiesFlagColor[activity]?.bgColor || '#ffffff'}
                    width="100%"
                    Icon={ColorLens}
                    disabled={loading}
                    onChange={(e) => {                    
                        setActivitiesFlagColor({
                            ...activitiesFlagColor,
                            [activity]: {
                            ...activitiesFlagColor[activity],
                                bgColor: e.target.value
                            }
                        })
                    }}
                />
                </MUI.Stack>
        </MUI.Box>
    )
}