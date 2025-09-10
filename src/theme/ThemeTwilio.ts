import { CustomThemeType } from "../types/theme";

export const ThemeTwilio = (isLight = true, themeData: CustomThemeType) => {
  if (!themeData.dark || !themeData.light) return {};

  // brand colors
  const cPrimary = isLight
    ? themeData.light.primaryColor
    : themeData.dark.primaryColor;
  const cCompanyPrimary = isLight
    ? themeData.light.primaryColor
    : themeData.dark.primaryColor;
  const cCompanySecondary = isLight
    ? themeData.light.secondaryColor
    : themeData.dark.secondaryColor;

  return {
    isLight: isLight,
    baseName: isLight ? "#FFECF2" : themeData.dark.primaryColor,

    // base theme colors
    colors: {
      tabSelectedColor: cCompanyPrimary,
      focusColor: cCompanyPrimary,
      completeTaskColor: "#26a2ff",
      defaultButtonColor: cCompanyPrimary,
      flexBlueColor: cCompanyPrimary,
      companyPrimaryColor: cCompanyPrimary,
      companySecondaryColor: cCompanySecondary,
    },

    // component overrides
    componentThemeOverrides: {
      // top header
      MainHeader: {
        Container: {
          background: cCompanySecondary,
          color: cCompanyPrimary,
          ".Twilio-UserCard-InfoContainer": { color: cPrimary },
          ".Twilio-Icon-Dialpad": { color: cCompanyPrimary },
          ".Twilio-Icon-Mute": { color: cCompanyPrimary },
          ".Twilio-Icon-Hamburger": { color: cCompanyPrimary },
          ".css-vuifue": { border: `1px solid ${cCompanyPrimary}` },
          ".css-1vwkwm6": { color: cCompanyPrimary },
          borderBottom: `1px solid #ddd`,
        },
      },
      // left sidebar
      SideNav: {
        Container: {
          background: cCompanySecondary,
          ".Twilio-Side-Link-IconContainer": { color: cCompanyPrimary },
          ".Twilio-Side-Link--Active div span, .Twilio-Side-Link div span": {
            color: cCompanyPrimary,
          },
        },
        Button: {
          background: cCompanySecondary,
          color: cCompanyPrimary,
          lightHover: true,
        },
      },
      // css props global
      RootContainer: {
        "*::-webkit-scrollbar": {
          width: "6px",
        },
        "*::-webkit-scrollbar-thumb": {
          backgroundColor: cCompanyPrimary,
          borderRadius: "20px",
        },
        ".Twilio-MessageBubble .MediaMessageError": {
          display: "none",
        },
        ".Twilio-Media-MessageBubble": {
          display: "none",
        },
        "div.Twilio.Twilio-TeamsView > div:nth-child(2)": {
          overflow: "auto",
          position: "fixed",
          right: "0",
          top: "0",
          bottom: "0",
          zIndex: "100",
          background: "inherit",
        },
        ".Twilio-UserCard-InfoContainer-SecondLine span": {
          whiteSpace: "normal",
        },
        ".Twilio-IncomingTask-Accept, .Twilio-IncomingTask-Reject": {
          display: "none",
        },
        ".Twilio-WorkerDirectoryTabs": {
          padding: "10px 15px 10px 10px",
        },
      },
      Supervisor: {
        WorkerCanvas: {
          Container: {
            overflow: "auto",
            maxHeight: "100%",
          },
        },
      },
    },
  };
};
