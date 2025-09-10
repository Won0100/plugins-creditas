import { View, ViewCollection } from "@twilio/flex-ui";
import { CustomizeTheme } from "./PagesComponents/Config/CustomizeTheme";
import { TaskInfo } from "./PagesComponents/Config/TaskInfo";
import { Login } from "./PagesComponents/DialerLogin/Login";
import { SelectUser } from "./PagesComponents/DialerLogin/SelectUser";
import { Campaigns } from "./PagesComponents/Campaigns";
import { Statistics } from "./PagesComponents/Campaigns/Statistics";
import { Form } from "./PagesComponents/Campaigns/Form";
import { userInstance } from "../services/manager/user";
import { DowntimeManager } from "./PagesComponents/Config/DowntimeManager";
import { ActivityPanel } from "./PagesComponents/Config/ActivityPanel";
import { DepartmentsAndTeams } from "./PagesComponents/Config/DepartmentsAndTeams";
import { ConfigReports } from "./PagesComponents/Config/ConfigReports";
import { InactivityManager } from "./PagesComponents/Config/InactivityManager";
import { WorkerDirectoryHiddenQueues } from "./PagesComponents/Config/WorkerDirectoryHiddenQueues";

import Atalhos from "./PagesComponents/Atalhos";

export const handleViewCollections = () => {
  const { userType } = userInstance;

  if (userType("admin") || userType("supervisor")) {
    //config views
    ViewCollection.Content.add(
      <View key="config-theme" name="config-theme">
        <CustomizeTheme slug="config-theme" />
      </View>
    );
    ViewCollection.Content.add(
      <View key="config-downtime-manager" name="config-downtime-manager">
        <DowntimeManager slug="config-downtime-manager" />
      </View>
    );
    ViewCollection.Content.add(
      <View key="config-task-info-panel" name="config-task-info-panel">
        <TaskInfo slug="config-task-info-panel" />
      </View>
    );
    ViewCollection.Content.add(
      <View key="config-activity-panel" name="config-activity-panel">
        <ActivityPanel slug="config-activity-panel" />
      </View>
    );
    ViewCollection.Content.add(
      <View
        key="config-departments-and-teams"
        name="config-departments-and-teams"
      >
        <DepartmentsAndTeams slug="config-departments-and-teams" />
      </View>
    );
    ViewCollection.Content.add(
      <View key="config-reports" name="config-reports">
        <ConfigReports slug="config-reports" />
      </View>
    );
    ViewCollection.Content.add(
      <View key="inactivity-manager" name="inactivity-manager">
        <InactivityManager slug="inactivity-manager" />
      </View>
    );
    ViewCollection.Content.add(
      <View
        key="worker-directory-hidden-queues-manager"
        name="worker-directory-hidden-queues-manager"
      >
        <WorkerDirectoryHiddenQueues slug="worker-directory-hidden-queues-manager" />
      </View>
    );

    ViewCollection.Content.add(
      <View key="atalhos" name="atalhos">
        <Atalhos />
      </View>
    );

    //dialer views
    ViewCollection.Content.add(
      <View key="dialer-login" name="dialer-login">
        <Login />
      </View>
    );
    ViewCollection.Content.add(
      <View key="dialer-select-user" name="dialer-select-user">
        <SelectUser />
      </View>
    );
    ViewCollection.Content.add(
      <View key="dialer-campaigns" name="dialer-campaigns">
        <Campaigns />
      </View>
    );
    ViewCollection.Content.add(
      <View key="dialer-campaigns-statistic" name="dialer-campaigns-statistic">
        <Statistics />
      </View>
    );
    ViewCollection.Content.add(
      <View key="dialer-campaigns-form" name="dialer-campaigns-form">
        <Form />
      </View>
    );
  }
};
