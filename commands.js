const DeadDropCommands = (() => {
  let riddleArmed = false;
  let locationMarkerRecovered = false;

  function resetState() {
    riddleArmed = false;
    locationMarkerRecovered = false;
  }

  function printL4Info() {
    DeadDropConsole.appendBlock([
      "L4INFO // LOCATION MARKER CONTEXT",
      "ID-413 appears on both ledgers. Goods cleared clean, but the data channel carried extra weight.",
      "The recovered marker points to L4 Shallow Fields Station, a quiet transfer point outside the normal route checks.",
      "The illegal console did not move the imprint by itself. It tagged the transition record, then handed it through the trade lane.",
      "That makes L4 the place to start looking: grey-market cargo, relay pings, and a missing imprint all crossed there."
    ]);
  }

  function printLockedLocationMarker() {
    DeadDropConsole.appendBlock([
      "CURRENT LOCATION MARKER",
      "[ unresolved ]",
      "recover the depot signal payload before requesting marker data"
    ], "err");
  }

  function openSolarSystemIndex() {
    DeadDropConsole.openDepot(
      "SYSTEM // STANTON NAVIGATION INDEX",
      ["Band", "Primary", "Known Bodies", "Signal Note"],
      [
        ["01", "Hurston", "Arial / Aberdeen / Magda / Ita", "industrial route noise"],
        ["02", "Crusader", "Cellin / Daymar / Yela / Port Olisar", "Pyro lane bleed"],
        ["03", "Delamar", "independent planetoid / recovered route object", "legacy nav object"],
        ["04", "ARC relay band", "ARC-L1 / ARC-L3 / ARC-L4 / ARC-L5", "four positions locked"],
        ["05", "ArcCorp", "Lyria / Wala", "trade traffic dense"],
        ["06", "microTech", "Calliope / Clio / Euterpe", "outer-band reflection"]
      ],
      [
        "marker interest: ARC-L4 / Pale Echo",
        "visual array: use starmap"
      ]
    );
  }

  async function askOperator(prompt) {
    if (!prompt) {
      DeadDropConsole.appendBlock([
        "usage:",
        "  operator <message>",
        "  op <message>",
        "  contact <message>"
      ], "err");
      return;
    }

    DeadDropConsole.appendLine("The Operator: [signal open / waiting]", "sys");
    DeadDropConsole.appendLine("operator channel routed to side pane", "sys");
    DeadDropOperatorPanel.ask(prompt);
  }

  function openOperatorChannel() {
    DeadDropConsole.appendBlock([
      "OPERATOR CHANNEL // DEGRADED",
      "link state: intermittent",
      "source: unresolved",
      "submit: operator <message>"
    ], "warn");
    DeadDropOperatorPanel.focus();
    DeadDropOperatorPanel.receive("ECHO-07 opened the Operator channel. Give one short first-contact clue.");
  }

  function run(rawCommand) {
    const command = rawCommand.trim().toLowerCase();
    if (!command) return;

    DeadDropConsole.appendLine(`dead-drop> ${rawCommand}`, "echo");

    if (command === "help") {
      DeadDropConsole.appendBlock([
        "help     - show this list",
        "ls       - list recovered depots",
        "cd       - <dir> open a depot",
        "signal   - <method> <data> decode signal payload",
        "operator - <message> contact unresolved channel",
        "starmap  - open recovered navigation array",
        "status   - show case status",
        "clear    - clear terminal (alias cls)",
        "findme   - identify current session"
      ]);
      return;
    }

    if (command === "operator" || command === "op" || command === "contact") {
      askOperator("");
      return;
    }

    if (command.startsWith("operator ") || command.startsWith("op ") || command.startsWith("contact ")) {
      const prompt = rawCommand.replace(/^\s*(operator|op|contact)\s+/i, "").trim();
      askOperator(prompt);
      return;
    }

    if (command === "starmap" || command === "map") {
      DeadDropConsole.appendLine("Stanton navigation array restored // four ARC relay positions locked", "warn");
      DeadDropStarMap.show();
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
        DeadDropConsole.appendBlock([
          "signal decodes payloads recovered from data depots.",
          "",
          "usage:",
          "  signal <type> <payload>",
          "",
          "types:",
          ...DeadDropCodecs.listSignalCodecs()
        ]);
        return;
      }

      if (parts.length < 3 || !method || !payload) {
        DeadDropConsole.appendBlock([
          "usage:",
          "  signal <type> <payload>",
          "  signal help"
        ], "err");
        return;
      }

      const codecEntry = DeadDropCodecs.getSignalCodec(method);
      if (!codecEntry) {
        DeadDropConsole.appendLine(`unsupported signal method: ${method}`, "err");
        DeadDropConsole.appendLine("type signal help for available payload types", "sys");
        return;
      }

      const [codecName, codec] = codecEntry;
      try {
        const decoded = codec.decode(payload);
        DeadDropConsole.appendLine(`signal ${codecName} decoded: ${decoded}`, "warn");
        if (decoded.toLowerCase() === "l4 shallow fields station") {
          locationMarkerRecovered = true;
          DeadDropConsole.appendLine("goal reached: location marker recovered", "warn");
          printL4Info();
          DeadDropReward.triggerGoalEffect();
          DeadDropOperatorPanel.receive("ECHO-07 recovered the L4 Shallow Fields Station marker. Give one short next clue without solving the whole case.");
        }
      } catch (error) {
        DeadDropConsole.appendLine("signal decode failed", "err");
      }
      return;
    }

    if (command === "ls") {
      DeadDropConsole.appendBlock([
        "drwxr-x---  depot01/    [grey-market goods manifest]",
        "drwxr-x---  depot02/   [relay data and message pings]",
        "drwxr-x---  depot03/   [banu exchange fragments]",
        "drwxr-x---  system/    [recovered Stanton navigation index]",
        "crw-r-----  operator/  [unresolved message channel]"
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
      DeadDropConsole.appendBlock([
        "ls shows recovered depot manifests available to this session.",
        "Use cd <depot> to inspect a depot manifest.",
        "Use cd system to inspect the recovered Stanton solar system index.",
        "Use cd operator to open the unresolved message channel.",
        "",
        "example:",
        "  ls",
        "  cd depot01",
        "  cd system",
        "  cd operator"
      ]);
      return;
    }

    if (command === "open operator" || command === "open operator/" || command === "cd operator" || command === "cd operator/") {
      openOperatorChannel();
      return;
    }

    if (command === "open system" || command === "open system/" || command === "cd system" || command === "cd system/") {
      openSolarSystemIndex();
      return;
    }

    if (command === "open depot01" || command === "open depot01/" || command === "cd depot01" || command === "cd depot01/") {
      DeadDropConsole.openDepot(
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
      DeadDropConsole.openDepot(
        "DEPOT02 // RELAY DATA AND MESSAGE PINGS",
        ["Entry", "Type", "From", "Route", "To", "Status"],
        [
          ["#1", "ping",      "St-Gate",    "out",  "Pyro-RAB-03",    "Timedout 650ms"],
          ["#2", "msg",       "Alu",        "out",  "Banu-X9",        "Delivered, OutBound"],
          ["#3", "ping",      "Nyx",        "in",   "StL$",           "Data package"],
          ["#4", "package",   "Pyro",       "in",   "Stl$",           { text: "TDQgU2hhbGxvdyBGaWVsZHMgU3RhdGlvbg==", className: "is-payload" }],
          ["#6", "ack",       "Pyro",       "in",   "St-Gate",        "Delivered, InBound"],
          ["#7", "packet",    "StL$",       "out",  "carrier",        "WeightMismatch"],
          ["#8", "burst",     "unknown",    "in",   "StL$",           "Fragmented"]
        ],
        [
          "validation: ID-413",
          "carrier note: message weight exceeds goods declaration"
        ]
      );
      return;
    }

    if (command === "open depot03" || command === "open depot03/" || command === "cd depot03" || command === "cd depot03/") {
      DeadDropConsole.openDepot(
        "DEPOT03 // BANU EXCHANGE FRAGMENTS",
        ["Timestamp", "Type", "ID", "Status"],
        [
          ["2926-06-02 20:03:09", "TRADE", "ID-622", "Delivered, InBound"],
          ["2926-06-02 20:04:27", "TRADE", "ID-622", "Delivered, OutBound"]
        ],
        ["translation confidence too low for recovery"]
      );
      return;
    }

    if (command.startsWith("open ") || command.startsWith("cd ")) {
      DeadDropConsole.appendLine("depot not found", "err");
      return;
    }

    if (command === "status") {
      DeadDropConsole.appendBlock([
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
      DeadDropConsole.appendBlock([
        "USER:       ECHO-07",
        "SESSION:    provisional",
        "CLEARANCE:  recovery console",
        `MARKER:     ${locationMarkerRecovered ? "L4 Shallow Fields Station" : "[unresolved]"}`
      ]);
      return;
    }

    if (command === "trace") {
      DeadDropConsole.appendBlock([
        "TRACE 01: regen receipt exists, completion event missing",
        "TRACE 02: transition checksum does not match clinic ledger",
        "TRACE 03: Banu trade traffic overlaps with final imprint ping",
        "TRACE 04: illegal device appears in route metadata",
        "TRACE 05: human broker identity unresolved"
      ]);
      return;
    }

    if (command === "dead-drop") {
      DeadDropConsole.appendBlock([
        "A dead drop is a handoff without a meeting.",
        "This one hides inside ordinary cargo traffic.",
        "The broker thought they were moving sealed goods.",
        "The payload behaved like memory."
      ], "warn");
      return;
    }

    if (command === "riddle") {
      riddleArmed = true;
      DeadDropConsole.appendBlock([
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
        DeadDropConsole.appendLine("no active riddle", "err");
        return;
      }

      if (answer === "l4" || answer === "lagrange4" || answer === "lagrangepoint4") {
        DeadDropConsole.appendBlock([
          "LOCATION CLUE ACCEPTED",
          "Dead drop relay marker recovered:",
          "L4 LAGRANGE REGION",
          "Illegal device signature: intermittent / low-power / trade-band masked"
        ], "warn");
        return;
      }

      DeadDropConsole.appendLine("location rejected", "err");
      return;
    }

    if (command === "clear" || command === "cls") {
      DeadDropConsole.resetOutput();
      riddleArmed = false;
      return;
    }

    DeadDropConsole.appendLine("command not recognized", "err");
  }

  return {
    resetState,
    run
  };
})();
