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
  const clearCacheButton = document.querySelector("#clear-cache");
  const backToConsoleButton = document.querySelector("#back-to-console");
  const depotTitle = document.querySelector("#depot-title");
  const depotContent = document.querySelector("#depot-content");
  const rewardEffect = document.querySelector("#reward-effect");
  const rewardKicker = rewardEffect.querySelector("[data-reward-kicker]");
  const rewardTitle = rewardEffect.querySelector("[data-reward-title]");
  const starMap = document.querySelector("#star-map");
  const closeStarMapButton = document.querySelector("#close-star-map");

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
    clearCacheButton,
    backToConsoleButton,
    depotTitle,
    depotContent,
    rewardEffect,
    rewardKicker,
    rewardTitle,
    starMap,
    closeStarMapButton,
    setInvalid
  };
})();
