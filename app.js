function unlockConsole({ showAccessReward = false } = {}) {
  localStorage.setItem(DeadDropConfig.ACCESS_CACHE_KEY, "true");
  DeadDropDom.loginScreen.hidden = true;
  DeadDropDom.consoleScreen.hidden = false;
  DeadDropDom.consoleInput.focus();

  if (showAccessReward) {
    DeadDropReward.show({
      kicker: "Access Granted",
      title: "Dead Drop Node Open"
    });
  }
}

function resetAccess() {
  localStorage.removeItem(DeadDropConfig.ACCESS_CACHE_KEY);
  DeadDropStarMap.hide();
  DeadDropCctv.hide();
  DeadDropConsole.closeLogDepot();
  DeadDropConsole.resetOutput();
  DeadDropCommands.resetState();
  DeadDropCommandHistory.reset();
  DeadDropOperatorPanel.reset();
  DeadDropDom.consoleInput.value = "";
  DeadDropDom.depotScreen.hidden = true;
  DeadDropDom.consoleScreen.hidden = true;
  DeadDropDom.loginScreen.hidden = false;
  DeadDropDom.operatorId.value = "";
  DeadDropDom.password.value = "";
  DeadDropDom.message.textContent = "";
  DeadDropDom.setInvalid(DeadDropDom.operatorId, false);
  DeadDropDom.setInvalid(DeadDropDom.password, false);
  DeadDropDom.operatorId.focus();
}

DeadDropDom.form.addEventListener("submit", (event) => {
  event.preventDefault();

  const idValue = DeadDropDom.operatorId.value.trim();
  const passwordValue = DeadDropDom.password.value.trim();
  const missingId = !idValue;
  const missingPassword = !passwordValue;

  DeadDropDom.setInvalid(DeadDropDom.operatorId, missingId);
  DeadDropDom.setInvalid(DeadDropDom.password, missingPassword);

  if (missingId || missingPassword) {
    DeadDropDom.message.textContent = "ID and password required.";
    return;
  }

  const valid = idValue.toUpperCase() === DeadDropConfig.VALID_ID
    && passwordValue === DeadDropCodecs.decodeHex(DeadDropConfig.VALID_PASSWORD_HEX);
  DeadDropDom.setInvalid(DeadDropDom.operatorId, !valid);
  DeadDropDom.setInvalid(DeadDropDom.password, !valid);

  if (!valid) {
    DeadDropDom.message.textContent = "Access denied. Identity marker does not match recovery ledger.";
    return;
  }

  DeadDropDom.message.textContent = "";
  unlockConsole({ showAccessReward: true });
});

DeadDropDom.consoleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const rawCommand = DeadDropDom.consoleInput.value;
  DeadDropCommandHistory.record(rawCommand);
  DeadDropDom.consoleInput.value = "";
  DeadDropCommands.run(rawCommand);
});

DeadDropDom.consoleInput.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
  if (!DeadDropCommandHistory.hasHistory()) return;

  event.preventDefault();

  const direction = event.key === "ArrowUp" ? "previous" : "next";
  DeadDropDom.consoleInput.value = DeadDropCommandHistory.browse(direction, DeadDropDom.consoleInput.value);
  DeadDropDom.consoleInput.setSelectionRange(
    DeadDropDom.consoleInput.value.length,
    DeadDropDom.consoleInput.value.length
  );
});

DeadDropDom.clearCacheButtons.forEach((button) => {
  button.addEventListener("click", resetAccess);
});
DeadDropDom.backToConsoleButton.addEventListener("click", DeadDropConsole.closeDepot);
DeadDropDom.closeLogWindowButton.addEventListener("click", DeadDropConsole.closeLogDepot);

function navigateBackInApp(event) {
  if (event.button !== 3 || DeadDropDom.loginScreen.hidden === false) return;

  event.preventDefault();
  event.stopPropagation();

  if (!DeadDropDom.cctvFragment.hidden) {
    DeadDropCctv.hide();
    return;
  }

  if (!DeadDropDom.logWindow.hidden) {
    DeadDropConsole.closeLogDepot();
    return;
  }

  if (!DeadDropDom.starMap.hidden) {
    DeadDropStarMap.hide();
    return;
  }

  if (!DeadDropDom.depotScreen.hidden) {
    DeadDropConsole.closeDepot();
  }
}

window.addEventListener("mouseup", navigateBackInApp);
window.addEventListener("auxclick", navigateBackInApp);
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !DeadDropDom.logWindow.hidden) {
    DeadDropConsole.closeLogDepot();
  }
});

if (localStorage.getItem(DeadDropConfig.ACCESS_CACHE_KEY) === "true") {
  DeadDropDom.loginScreen.hidden = true;
  DeadDropDom.consoleScreen.hidden = false;
  DeadDropDom.depotScreen.hidden = true;
  DeadDropDom.consoleInput.focus();
}
