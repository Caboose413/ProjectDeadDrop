const DeadDropOperatorPanel = (() => {
  const initialMessage = "ECHO-07 link waiting. Cargo ledgers hide routes.";
  let requestVersion = 0;

  function setState(label, className = "") {
    DeadDropDom.operatorLinkState.textContent = label;
    DeadDropDom.operatorLinkState.className = `operator-link-state ${className}`.trim();
  }

  function appendMessage(role, text) {
    const message = document.createElement("div");
    message.className = `operator-message operator-message-${role}`;

    const label = document.createElement("span");
    label.textContent = role === "local" ? "ECHO-07" : "The Operator";

    const body = document.createElement("p");
    body.textContent = text;

    message.append(label, body);
    DeadDropDom.operatorChatLog.appendChild(message);
    DeadDropDom.operatorChatLog.scrollTop = DeadDropDom.operatorChatLog.scrollHeight;
  }

  async function ask(prompt, { echoLocal = true, refocus = true } = {}) {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;
    const requestId = ++requestVersion;

    if (echoLocal) appendMessage("local", trimmedPrompt);
    DeadDropDom.operatorChatInput.value = "";
    DeadDropDom.operatorChatInput.disabled = true;
    setState("OPEN", "is-waiting");

    const result = await DeadDropOperator.reply(trimmedPrompt);
    if (requestId !== requestVersion) return;

    appendMessage("remote", result.reply);
    DeadDropDom.operatorChatInput.disabled = false;
    setState(result.live ? "LIVE" : "CACHE", result.live ? "is-live" : "is-cache");
    if (refocus) DeadDropDom.operatorChatInput.focus();
  }

  function receive(prompt) {
    ask(prompt, { echoLocal: false, refocus: false });
  }

  function focus() {
    DeadDropDom.operatorChatInput.focus();
  }

  function reset() {
    requestVersion += 1;
    DeadDropDom.operatorChatInput.value = "";
    DeadDropDom.operatorChatInput.disabled = false;
    DeadDropDom.operatorChatLog.replaceChildren();
    appendMessage("remote", initialMessage);
    setState("STANDBY");
  }

  DeadDropDom.operatorChatForm.addEventListener("submit", (event) => {
    event.preventDefault();
    ask(DeadDropDom.operatorChatInput.value);
  });

  return { ask, receive, appendMessage, focus, reset };
})();
