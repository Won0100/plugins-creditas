import { FlexState } from "@twilio/flex-ui"
import { TeamsActivitiesDataType, ActivityColorType } from "./activities"
import { ActivitiesTimes } from "../states/activitiesTimes/ActivitiesTimes";

export interface StatesExtendsType extends FlexState {
    ['activity-teams']: {
      activityTeams: TeamsActivitiesDataType[];
    },
    ['activities-flag-color']: {
      activitiesFlagColor: ActivityColorType;
    }
    ['activities-times']: {
      activitiesTimes: ActivitiesTimes
    }
}