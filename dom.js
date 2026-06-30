const DeadDropDom = (() => {
  const loginScreen = document.querySelector("#login-screen");
  const consoleScreen = document.querySelector("#console-screen");
  const depotScreen = document.querySelector("#depot-screen");
  const form = document.querySelector("#access-form");
  const operatorId = document.querySelector("#operator-id");
  const password = document.querySelector("#operator-password");
  const message = document.querySelector("#form-message");
  const consoleForm = document.querySelector("#console-form");
  const consoleInput = document.querySelector("#console-input");
  const consoleOutput = document.querySelector("#console-output");
  const clearCacheButtons = Array.from(document.querySelectorAll(".clear-cache-button"));
  const backToConsoleButton = document.querySelector("#back-to-console");
  const depotTitle = document.querySelector("#depot-title");
  const depotContent = document.querySelector("#depot-content");
  const logWindow = document.querySelector("#log-window");
  const closeLogWindowButton = document.querySelector("#close-log-window");
  const logWindowTitle = document.querySelector("#log-window-title");
  const logWindowContent = document.querySelector("#log-window-content");
  const rewardEffect = document.querySelector("#reward-effect");
  const rewardKicker = rewardEffect.querySelector("[data-reward-kicker]");
  const rewardTitle = rewardEffect.querySelector("[data-reward-title]");
  const starMap = document.querySelector("#star-map");
  const closeStarMapButton = document.querySelector("#close-star-map");
  const cctvFragment = document.querySelector("#cctv-fragment");
  const cctvVideo = document.querySelector("#cctv-video");
  const closeCctvButton = document.querySelector("#close-cctv");
  const operatorChatForm = document.querySelector("#operator-chat-form");
  const operatorChatInput = document.querySelector("#operator-chat-input");
  const operatorChatLog = document.querySelector("#operator-chat-log");
  const operatorLinkState = document.querySelector("#operator-link-state");
  const operatorNameLabels = Array.from(document.querySelectorAll("[data-operator-name]"));

  rewardEffect.hidden = true;
  document.body.classList.remove("reward-effect-active");

  function setInvalid(input, invalid) {
    input.setAttribute("aria-invalid", invalid ? "true" : "false");
  }

  return {
    loginScreen,
    consoleScreen,
    depotScreen,
    form,
    operatorId,
    password,
    message,
    consoleForm,
    consoleInput,
    consoleOutput,
    clearCacheButtons,
    backToConsoleButton,
    depotTitle,
    depotContent,
    logWindow,
    closeLogWindowButton,
    logWindowTitle,
    logWindowContent,
    rewardEffect,
    rewardKicker,
    rewardTitle,
    starMap,
    closeStarMapButton,
    cctvFragment,
    cctvVideo,
    closeCctvButton,
    operatorChatForm,
    operatorChatInput,
    operatorChatLog,
    operatorLinkState,
    operatorNameLabels,
    setInvalid
  };
})();
