import { MainNavigationType } from "../../types/navigation";
import { configNavigation } from "./configNavigation";
import * as MUIcon from "@mui/icons-material";
import { userInstance } from "../../services/manager/user";
import { localStorage } from "../../helpers/localStorage/actions";
import { LocalStorageItemType } from "../../helpers/localStorage/LocalStorageItemType";

type InsightsProps = {
  value: {
    insightsActive: boolean;
  };
};

const { userType, checkRoleCustom } = userInstance;
// const workerAttributes = getWorkerClient()?.attributes;
const insights: InsightsProps = JSON.parse(
  localStorage.get(LocalStorageItemType.FLEX_SDK_CACHE_FEATURES_CONFIG) ?? "{}"
);

export const mainNavigation: MainNavigationType[] = [
  {
    Icon: MUIcon.SupportAgentOutlined,
    label: "Atendimentos",
    slug: "agent-desktop",
  },
];

if(userType("admin") || userType("supervisor")) {
  mainNavigation.push(    
    {
      Icon: MUIcon.GroupsOutlined,
      label: "Equipes",
      slug: "teams",
    },
    {
      Icon: MUIcon.DvrOutlined,
      label: "Filas de Tarefas",
      slug: "queues-stats",
    }
  );
}

if (userType("admin")) {
  mainNavigation.unshift({
    Icon: MUIcon.AdminPanelSettingsOutlined,
    label: "Administrador",
    slug: "admin",
  });
}

if (checkRoleCustom("supervisor") || checkRoleCustom("admin") || userType("admin")) {
  // mainNavigation.push(    
  //   {
  //     Icon: MUIcon.CampaignOutlined,
  //     label: "Campanhas",
  //     slug: localStorage.get("ATHAN_DIALER_LOCATION") ?? "dialer-login",
  //   }
  // );  

  if (insights?.value?.insightsActive) {
    mainNavigation.push(
      {
        Icon: MUIcon.AssessmentOutlined,
        label: "Relatórios",
        slug: "dashboards",
      },
      {
        Icon: MUIcon.InsightsOutlined,
        label: "Análises",
        slug: "analyze",
      },
      {
        Icon: MUIcon.AssessmentOutlined,
        label: "Gestão de Qualidade",
        slug: "quality-management",
      },
    //   {
    //     Icon: MUIcon.SummarizeOutlined,
    //     label: "Inspeções",
    //     slug: "inspections",
    //   },
    //   {
    //     Icon: MUIcon.SupervisorAccountOutlined,
    //     label: "Agentes",
    //     slug: "agents",
    //   },
    //   {
    //     Icon: MUIcon.VoiceChatOutlined,
    //     label: "Pesquisa por voz",
    //     slug: "speech-searches",
    //   }
    );
  }
}

// pages
if (userType("admin")) {
  mainNavigation.push({
    Icon: MUIcon.LibraryBooks,
    label: "Atalhos",
    slug: "atalhos",
  });
  mainNavigation.push({
    Icon: MUIcon.SettingsOutlined,
    label: "Configurações",
    slug: configNavigation[0].slug,
  });
}
