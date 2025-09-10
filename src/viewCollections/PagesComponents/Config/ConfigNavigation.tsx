import * as MUI from "@mui/material";
import { configNavigation } from "../../../helpers/navigation/configNavigation";
import { invokeAction } from "../../../actions/invoke";
import { ConfigNavigationWrapper } from "./styled";

type Props = {
  slug: string;
};

export const ConfigNavigation = ({ slug }: Props) => {
  return (
    <MUI.Box
      sx={{ borderBottom: 1, borderColor: "divider", marginBottom: "20px" }}
    >
      <ConfigNavigationWrapper 
        value={slug}
        variant="scrollable"
        scrollButtons="auto"
        aria-label="scrollable auto tabs example"
      >
        {configNavigation.map((nav) => (
          <MUI.Tab
            label={nav.label}
            key={nav.slug}
            value={nav.slug}
            onClick={() => invokeAction.navigateToView(nav.slug)}
          />
        ))}
      </ConfigNavigationWrapper>
    </MUI.Box>
  );
};
