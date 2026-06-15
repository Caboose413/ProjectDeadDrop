const VALID_ID = "ECHO-07";
const VALID_PASSWORD_HEX = "6166746572696d616765";
const ACCESS_CACHE_KEY = "dead_drop_access_granted";

const loginScreen = document.querySelector("#login-screen");
const consoleScreen = document.querySelector("#console-screen");
const form = document.querySelector("#access-form");
const operatorId = document.querySelector("#operator-id");
const password = document.querySelector("#operator-password");
const message = document.querySelector("#form-message");
const consoleForm = document.querySelector("#console-form");
const consoleInput = document.querySelector("#console-input");
const consoleOutput = document.querySelector("#console-output");
const clearCacheButton = document.querySelector("#clear-cache");
const rewardEffect = document.querySelector("#reward-effect");
const rewardKicker = rewardEffect.querySelector("[data-reward-kicker]");
const rewardTitle = rewardEffect.querySelector("[data-reward-title]");
let riddleArmed = false;
let locationMarkerRecovered = false;
let rewardEffectTimer = null;

rewardEffect.hidden = true;
document.body.classList.remove("reward-effect-active");

const SIGNAL_CODECS = {
  base64: {
    label: "Base64 payload",
    decode: (payload) => atob(payload)
  },
  hex: {
    label: "Hex byte string",
    decode: (payload) => decodeHex(payload.replace(/\s+/g, ""))
  },
  reverse: {
    label: "Reverse string",
    decode: (payload) => payload.split("").reverse().join("")
  }
};

function setInvalid(input, invalid) {
  input.setAttribute("aria-invalid", invalid ? "true" : "false");
}

function decodeHex(hex) {
  return hex.match(/.{1,2}/g).map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
}

function appendConsoleLine(text, className = "sys") {
  const line = document.createElement("div");
  line.className = className;
  line.textContent = text;
  consoleOutput.appendChild(line);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function appendConsoleBlock(lines, className = "sys") {
  lines.forEach((line) => appendConsoleLine(line, className));
}

function resetConsoleOutput() {
  consoleOutput.innerHTML = "";
  appendConsoleBlock([
    "[ DEAD DROP :: RECOVERY CONSOLE ]",
    "[ SESSION: PROVISIONAL ]",
    "[ TYPE HELP FOR COMMANDS ]",
    ""
  ]);
}

function appendConsoleGrid(title, columns, rows, footerLines = []) {
  const wrapper = document.createElement("section");
  wrapper.className = "console-grid-block";

  const heading = document.createElement("div");
  heading.className = "console-grid-title";
  heading.textContent = title;
  wrapper.appendChild(heading);

  const grid = document.createElement("div");
  grid.className = `console-grid console-grid-${columns.length}`;
  grid.style.setProperty("--cols", columns.length);

  columns.forEach((column) => {
    const cell = document.createElement("div");
    cell.className = "console-grid-cell console-grid-head";
    cell.textContent = column;
    grid.appendChild(cell);
  });

  rows.forEach((row) => {
    row.forEach((value) => {
      const cell = document.createElement("div");
      cell.className = "console-grid-cell";
      if (typeof value === "object") {
        cell.textContent = value.text;
        if (value.className) cell.classList.add(value.className);
      } else {
        cell.textContent = value;
      }
      grid.appendChild(cell);
    });
  });

  wrapper.appendChild(grid);

  footerLines.forEach((line) => {
    const footer = document.createElement("div");
    footer.className = "console-grid-note";
    footer.textContent = line;
    wrapper.appendChild(footer);
  });

  consoleOutput.appendChild(wrapper);
  consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

function getSignalCodec(type) {
  return Object.entries(SIGNAL_CODECS).find(([name, codec]) => {
    return name === type;
  });
}

function listSignalCodecs() {
  return Object.entries(SIGNAL_CODECS).map(([name, codec]) => {
    return `  ${name} - ${codec.label}`;
  });
}

function printL4Info() {
  appendConsoleBlock([
    "L4INFO // LOCATION MARKER CONTEXT",
    "ID-413 appears on both ledgers. Goods cleared clean, but the data channel carried extra weight.",
    "The recovered marker points to L4 Shallow Fields Station, a quiet transfer point outside the normal route checks.",
    "The illegal console did not move the imprint by itself. It tagged the transition record, then handed it through the trade lane.",
    "That makes L4 the place to start looking: grey-market cargo, relay pings, and a missing imprint all crossed there."
  ]);
}

function printLockedLocationMarker() {
  appendConsoleBlock([
    "CURRENT LOCATION MARKER",
    "[ unresolved ]",
    "recover the depot signal payload before requesting marker data"
  ], "err");
}

function playRewardSound() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  const context = new AudioContext();
  const master = context.createGain();
  master.gain.setValueAtTime(0.0001, context.currentTime);
  master.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.025);
  master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.62);
  master.connect(context.destination);

  [220, 330, 440].forEach((frequency, index) => {
    const osc = context.createOscillator();
    const gain = context.createGain();
    const start = context.currentTime + index * 0.09;
    osc.type = "triangle";
    osc.frequency.setValueAtTime(frequency, start);
    gain.gain.setValueAtTime(0.0001, start);
    gain.gain.exponentialRampToValueAtTime(0.5, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
    osc.connect(gain);
    gain.connect(master);
    osc.start(start);
    osc.stop(start + 0.3);
  });

  window.setTimeout(() => context.close(), 900);
}

function hideRewardPopup() {
  if (rewardEffectTimer) {
    window.clearTimeout(rewardEffectTimer);
    rewardEffectTimer = null;
  }

  rewardEffect.hidden = true;
  document.body.classList.remove("reward-effect-active");
}

function showRewardPopup({ kicker, title, duration = 1500, playSound = true }) {
  rewardKicker.textContent = kicker;
  rewardTitle.textContent = title;

  if (playSound) playRewardSound();
  if (rewardEffectTimer) window.clearTimeout(rewardEffectTimer);

  document.body.classList.remove("reward-effect-active");
  rewardEffect.hidden = true;
  void rewardEffect.offsetWidth;
  rewardEffect.hidden = false;
  void document.body.offsetWidth;
  document.body.classList.add("reward-effect-active");

  rewardEffectTimer = window.setTimeout(hideRewardPopup, duration);
}

function triggerGoalEffect() {
  showRewardPopup({
    kicker: "Location Marker Recovered",
    title: "L4 Shallow Fields Station"
  });
}

function unlockConsole({ showAccessReward = false } = {}) {
  localStorage.setItem(ACCESS_CACHE_KEY, "true");
  loginScreen.hidden = true;
  consoleScreen.hidden = false;
  consoleInput.focus();

  if (showAccessReward) {
    showRewardPopup({
      kicker: "Access Granted",
      title: "Dead Drop Node Open"
    });
  }
}

function resetAccess() {
  localStorage.removeItem(ACCESS_CACHE_KEY);
  resetConsoleOutput();
  riddleArmed = false;
  locationMarkerRecovered = false;
  consoleInput.value = "";
  consoleScreen.hidden = true;
  loginScreen.hidden = false;
  operatorId.value = "";
  password.value = "";
  message.textContent = "";
  setInvalid(operatorId, false);
  setInvalid(password, false);
  operatorId.focus();
}

function runCommand(rawCommand) {
  const command = rawCommand.trim().toLowerCase();
  if (!command) return;

  appendConsoleLine(`dead-drop> ${rawCommand}`, "echo");

  if (command === "help") {
    appendConsoleBlock([
      "help show this list",
      "ls list recovered depots",
      "cd <dir> open a depot",
      "signal <method> <data> decode signal payload",
      "status show case status",
      "clear clear terminal (alias cls)",
      "findme identify current session"
    ]);
    return;
  }

  if (command.startsWith("signal")) {
    const parts = rawCommand.includes(",")
      ? rawCommand.split(",").map((part) => part.trim())
      : rawCommand.trim().split(/\s+/);
    const method = (parts[1] || "").toLowerCase();
    const payload = rawCommand.includes(",")
      ? parts.slice(2).join(",").trim()
      : parts.slice(2).join("");

    if (method === "help" || method === "--help") {
      appendConsoleBlock([
        "signal decodes payloads recovered from data depots.",
        "",
        "usage:",
        "  signal <type> <payload>",
        "",
        "types:",
        ...listSignalCodecs()
      ]);
      return;
    }

    if (parts.length < 3 || !method || !payload) {
      appendConsoleBlock([
        "usage:",
        "  signal <type> <payload>",
        "  signal help"
      ], "err");
      return;
    }

    const codecEntry = getSignalCodec(method);
    if (!codecEntry) {
      appendConsoleLine(`unsupported signal method: ${method}`, "err");
      appendConsoleLine("type signal help for available payload types", "sys");
      return;
    }

    const [codecName, codec] = codecEntry;
    try {
      const decoded = codec.decode(payload);
      appendConsoleLine(`signal ${codecName} decoded: ${decoded}`, "warn");
      if (decoded.toLowerCase() === "l4 shallow fields station") {
        locationMarkerRecovered = true;
        appendConsoleLine("goal reached: location marker recovered", "warn");
        printL4Info();
        triggerGoalEffect();
      }
    } catch (error) {
      appendConsoleLine("signal decode failed", "err");
    }
    return;
  }

  if (command === "ls") {
    appendConsoleBlock([
      "drwxr-x---  depot01/    [grey-market goods manifest]",
      "drwxr-x---  depot02/   [relay data and message pings]",
      "drwxr-x---  depot03/   [banu exchange fragments]"
    ]);
    return;
  }

  if (command === "l4info") {
    if (!locationMarkerRecovered) {
      printLockedLocationMarker();
      return;
    }

    printL4Info();
    return;
  }

  if (command === "ls help") {
    appendConsoleBlock([
      "ls shows recovered depot manifests available to this session.",
      "Use cd <depot> to inspect a depot manifest.",
      "",
      "example:",
      "  ls",
      "  cd depot01"
    ]);
    return;
  }

  if (command === "open depot01" || command === "open depot01/" || command === "cd depot01" || command === "cd depot01/") {
    appendConsoleGrid(
      "DEPOT-01 // GREY-MARKET GOODS MANIFEST",
      ["Entry", "Goods", "Qty", "From", "Route", "To", "Status"],
      [
        ["#1", "Alu", "40 scu", "Nyx", "> StL$", "Pyro", "Delivered, OutBound"],
        ["#2", "Steel", "12 scu", "St-Gate", "> StL$", "Alu", "Delivered, InBound"],
        ["#3", "Iron", "25 scu", "Alu", "> Banu-X9", "Pyro", "Delivered, OutBound"],
        ["#4", "Plastic", "9 scu", "Pyro", "> StL$", "Nyx", "Delayed, InBound"],
        ["#5", "Water", "18 scu", "St-Gate", "> Alu", "StL$", "Delivered, InBound"],
        ["#6", "Med-gel", "2 scu", "Clinic", "> StL$", "Pyro", "Hold, Audit"]
      ],
      [
        "validation: ID-413",
        "carrier note: goods ledger is clean; data channel reviewed separately"
      ]
    );
    return;
  }

  if (command === "open depot02" || command === "open depot02/" || command === "cd depot02" || command === "cd depot02/") {
    appendConsoleGrid(
      "DEPOT02 // RELAY DATA AND MESSAGE PINGS",
      ["Entry", "Type", "From", "Route", "To", "Status"],
      [
        ["#1", "ping", "St-Gate", ">", "Pyro-RAB-03", "Timedout 650ms"],
        ["#2", "msg", "Alu", ">", "Banu-X9", "Delivered, OutBound"],
        ["#3", "ping", "Nyx", "<", "StL$", "Data package base64"],
        ["", "package", "", "", "", { text: "TDQgU2hhbGxvdyBGaWVsZHMgU3RhdGlvbg==", className: "is-payload" }],
        ["#4", "ack", "Pyro", "<", "St-Gate", "Delivered, InBound"],
        ["#5", "packet", "StL$", ">", "carrier", "WeightMismatch"],
        ["#6", "burst", "unknown", "<", "StL$", "Fragmented"]
      ],
      [
        "validation: ID-413",
        "carrier note: message weight exceeds goods declaration"
      ]
    );
    return;
  }

  if (command === "open depot03" || command === "open depot03/" || command === "cd depot03" || command === "cd depot03/") {
    appendConsoleBlock([
      "DEPOT03 // BANU EXCHANGE FRAGMENTS",
      "------------------------------------------------",
      "2926-06-02 20:03:09  TRADE    ID-622  Status=Delivered,InBound",
      "2926-06-02 20:04:27  TRADE    ID-622  Status=Delivered,OutBound",
      "",
      "translation confidence too low for recovery"
    ]);
    return;
  }

  if (command.startsWith("open ") || command.startsWith("cd ")) {
    appendConsoleLine("depot not found", "err");
    return;
  }

  if (command === "status") {
    appendConsoleBlock([
      "CASE:       07-LOSTREGEN",
      "SUBJECT:    [REDACTED]",
      "IMPRINT:    unresolved / transition residue detected",
      "ROUTE:      clinic -> carrier -> grey-market relay -> unknown",
      `MARKER:     ${locationMarkerRecovered ? "L4 Shallow Fields Station" : "[unresolved]"}`,
      "RISK:       extraction attempt suspected"
    ]);
    return;
  }

  if (command === "findme" || command === "whoami") {
    appendConsoleBlock([
      "USER:       ECHO-07",
      "SESSION:    provisional",
      "CLEARANCE:  recovery console",
      `MARKER:     ${locationMarkerRecovered ? "L4 Shallow Fields Station" : "[unresolved]"}`
    ]);
    return;
  }

  if (command === "trace") {
    appendConsoleBlock([
      "TRACE 01: regen receipt exists, completion event missing",
      "TRACE 02: transition checksum does not match clinic ledger",
      "TRACE 03: Banu trade traffic overlaps with final imprint ping",
      "TRACE 04: illegal device appears in route metadata",
      "TRACE 05: human broker identity unresolved"
    ]);
    return;
  }

  if (command === "dead-drop") {
    appendConsoleBlock([
      "A dead drop is a handoff without a meeting.",
      "This one hides inside ordinary cargo traffic.",
      "The broker thought they were moving sealed goods.",
      "The payload behaved like memory."
    ], "warn");
    return;
  }

  if (command === "riddle") {
    riddleArmed = true;
    appendConsoleBlock([
      "RECOVERED ROUTE VERSE // DAMAGED",
      "",
      "I am not a station, though cargo waits in my dark.",
      "I am not a planet, though two bodies teach me where to stand.",
      "I am the fourth quiet knot in a five-point crown.",
      "Smugglers love my stillness because patrols look past the balance.",
      "",
      "submit: answer <location>"
    ], "warn");
    return;
  }

  if (command.startsWith("answer ")) {
    const answer = command.substring("answer ".length).trim().replace(/\s+/g, "");
    if (!riddleArmed) {
      appendConsoleLine("no active riddle", "err");
      return;
    }

    if (answer === "l4" || answer === "lagrange4" || answer === "lagrangepoint4") {
      appendConsoleBlock([
        "LOCATION CLUE ACCEPTED",
        "Dead drop relay marker recovered:",
        "L4 LAGRANGE REGION",
        "Illegal device signature: intermittent / low-power / trade-band masked"
      ], "warn");
      return;
    }

    appendConsoleLine("location rejected", "err");
    return;
  }

  if (command === "clear" || command === "cls") {
    resetConsoleOutput();
    riddleArmed = false;
    return;
  }

  appendConsoleLine("command not recognized", "err");
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const idValue = operatorId.value.trim();
  const passwordValue = password.value.trim();
  const missingId = !idValue;
  const missingPassword = !passwordValue;

  setInvalid(operatorId, missingId);
  setInvalid(password, missingPassword);

  if (missingId || missingPassword) {
    message.textContent = "ID and password required.";
    return;
  }

  const valid = idValue.toUpperCase() === VALID_ID && passwordValue === decodeHex(VALID_PASSWORD_HEX);
  setInvalid(operatorId, !valid);
  setInvalid(password, !valid);

  if (!valid) {
    message.textContent = "Access denied. Identity marker does not match recovery ledger.";
    return;
  }

  message.textContent = "";
  unlockConsole({ showAccessReward: true });
});

consoleForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const rawCommand = consoleInput.value;
  consoleInput.value = "";
  runCommand(rawCommand);
});

clearCacheButton.addEventListener("click", resetAccess);

if (localStorage.getItem(ACCESS_CACHE_KEY) === "true") {
  loginScreen.hidden = true;
  consoleScreen.hidden = false;
  consoleInput.focus();
}
