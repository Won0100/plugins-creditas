import * as MUI from "@mui/material";
import { PageLayout } from "../../../../components/PageLayout";
import { ConfigNavigation } from "../ConfigNavigation";
import { useState } from "react";
import { CustomTabPanel } from "../../../../components/Custom/CustomTabPanel";
import { HiddenQueues } from "./HiddenQueues";

type Props = {
  slug: string;
};

export const ConfigReports = ({ slug }: Props) => {
  const [value, setValue] = useState(0);

  return (
    <PageLayout title="Configurações">
      <ConfigNavigation slug={slug} />
      <MUI.Tabs value={value} onChange={(e, value) => setValue(value)}>
        <MUI.Tab label="Filas visíveis" />
      </MUI.Tabs>
      <CustomTabPanel value={value} index={0}>
        <HiddenQueues />
      </CustomTabPanel>
    </PageLayout>
  );
};
