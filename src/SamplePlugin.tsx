import { FlexPlugin } from "@twilio/flex-plugin";
import { handleFlexUIComponent } from "./components";
import { handleViewCollections } from "./viewCollections";
import { setCustomProviders } from "./providers";
import {
  hydrateInitialState,
  setUpNotifications,
  setUpActivities,
} from "./initializers";
import { replaceActions } from "./actions/replace";
import {
  registerActions,
  registerActionsEventHandlers,
} from "./actions/register";
import { handleEvents } from "./events/handler";
import { registerReducers } from "./states";
import { userInstance } from "./services/manager/user";
import { handleLogs } from "services/datadog";
import { backgroundMessageHandler } from "./helpers/backgroundMessageHandler";
import { conversationCleanupHandler } from "./helpers/conversationCleanupHandler";

const PLUGIN_NAME = "SamplePlugin";

export default class SamplePlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  async init(): Promise<void> {
    const getInstance = userInstance.getInstance();

    // Initialize background message handler
    backgroundMessageHandler;
    
    // Initialize conversation cleanup handler
    conversationCleanupHandler;

    setUpActivities();
    setUpNotifications();
    replaceActions();
    registerActions();
    registerActionsEventHandlers();

    handleEvents();
    registerReducers();
    await setCustomProviders();

    await handleFlexUIComponent(getInstance);
    handleViewCollections();
    await handleLogs();
    await hydrateInitialState();
  }
}
