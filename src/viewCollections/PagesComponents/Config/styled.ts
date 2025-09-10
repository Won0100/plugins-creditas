import { styled, Tabs } from "@mui/material";

export const ConfigNavigationWrapper = styled(Tabs)(() => ({
  ".MuiTabs-scroller": {
    overflowX: "auto !important",
    overflowY: "hidden",
    "&::-webkit-scrollbar": {
      height: "8px",
    },
  },
}));
