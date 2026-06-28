const DeadDropCommands = (() => {
  let riddleArmed = false;
  let locationMarkerRecovered = false;

  const logDepotEntries = [
    { level: "info", timestamp: "2926-06-01 00:04:01.891", source: "comms", message: "payload routed to dead-drop buffer 0x0D awaiting retrieval" },
    { level: "info", timestamp: "2926-06-01 00:13:01.889", source: "net", message: "bandwidth rx 14.1 Mbps / tx 11.3 Mbps, burst from dead-drop retrieval" },
    { level: "info", timestamp: "2926-06-01 00:13:44.667", source: "comms", message: "dead-drop 0x0D retrieved by authorized agent, buffer cleared" },
    { level: "debug", timestamp: "2926-06-01 01:08:12.447", source: "route", message: "shallow-field handshake accepted by local relay cache" },
    { level: "info", timestamp: "2926-06-01 01:10:55.019", source: "cargo_ref", message: "manifest 413-B linked to commodity bay marker: WiDoW / SLAM / Maze" },
    { level: "debug", timestamp: "2926-06-01 03:14:08.201", source: "tunnel_mgr", message: "tun2 established via BANU_TRADE_LANE" },
    { level: "debug", timestamp: "2926-06-01 03:14:08.204", source: "cipher", message: "CHACHA20-POLY1305 / PFS yes / rekey in 44s" },
    { level: "warn", timestamp: "2926-06-01 03:14:08.205", source: "status", message: "established with unverified peer" },
    { level: "debug", timestamp: "2926-06-01 03:18:22.640", source: "rnr_sync", message: "paired rest-stop identifiers: shallow field -> adjacent glen" },
    { level: "info", timestamp: "2926-06-01 05:42:10.332", source: "broker", message: "counterparty handle SAH'TUL requested glen-side dead-drop confirmation" },
    { level: "warn", timestamp: "2926-06-01 06:11:09.513", source: "crusec_mirror", message: "Kareah evidence index queried without civilian authorization" },
    { level: "info", timestamp: "2926-06-01 09:25:44.918", source: "salvage_ref", message: "Brio's Breaker Yard listed as disposal fallback for carrier shell" },
    { level: "warn", timestamp: "2926-06-01 17:42:33.003", source: "audio_cap", message: "speaker identification unknown; no voiceprint match in UEE registry" },
    { level: "warn", timestamp: "2926-06-01 17:42:33.005", source: "audio_cap", message: "transmission appears to loop; repeating pattern detected" },
    { level: "error", timestamp: "2926-06-01 17:42:33.111", source: "ami_analysis", message: "targeted psychological message detected" },
    { level: "debug", timestamp: "2926-06-01 17:42:34.012", source: "route", message: "blackhole entry VANDUUL_NET suppressed by policy filter" },
    { level: "warn", timestamp: "2926-06-02 02:40:17.229", source: "hex_watch", message: "Grim HEX contact observed replaying broker phrase: no souls, only stock" },
    { level: "error", timestamp: "2926-06-02 04:03:51.776", source: "ami_analysis", message: "memory-pattern checksum repeated after buffer clear" }
  ];

  const logLevelClasses = {
    debug: "sys",
    info: "echo",
    warn: "warn",
    error: "err"
  };

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

  function printLogDepot(level = "all") {
    const validLevels = ["all", "debug", "info", "warn", "error"];
    if (!validLevels.includes(level)) {
      DeadDropConsole.appendLine(`unsupported log verbosity: ${level}`, "err");
      DeadDropConsole.appendLine("usage: logs <all|debug|info|warn|error>", "sys");
      return;
    }

    DeadDropConsole.appendLine(`LOG DEPOT // verbosity=${level}`, "warn");

    logDepotEntries
      .filter((entry) => level === "all" || entry.level === level)
      .forEach((entry) => {
        const line = `${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.source}: ${entry.message}`;
        DeadDropConsole.appendLine(line, logLevelClasses[entry.level]);
      });
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
        "logs     - <level> print log depot entries",
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
      DeadDropConsole.appendDepotList([
        { id: "depot01", permissions: "drwxr-x---", description: "grey-market goods manifest" },
        { id: "depot02", permissions: "drwxr-x---", description: "relay data and message pings" },
        { id: "depot03", permissions: "drwxr-x---", description: "banu exchange fragments" },
        { id: "depot04", permissions: "-rw-r-----", description: "relay log depot" },
        { id: "depot05", permissions: "-rw-r-----", description: "audio intercept transcript" },
        { id: "system", permissions: "drwxr-x---", description: "recovered Stanton navigation index" },
        { id: "operator", permissions: "crw-r-----", description: "unresolved message channel" }
      ], (depotId) => run(`cd ${depotId}`));
      return;
    }

    if (command === "logs" || command.startsWith("logs ")) {
      const level = command.split(/\s+/)[1] || "all";
      if (level === "help" || level === "--help") {
        DeadDropConsole.appendBlock([
          "logs prints relay log entries by verbosity.",
          "",
          "usage:",
          "  logs",
          "  logs all",
          "  logs debug",
          "  logs info",
          "  logs warn",
          "  logs error"
        ]);
        return;
      }
      printLogDepot(level);
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
        "Click a depot entry or use cd <depot> to inspect a depot manifest.",
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
          ["#1", "Aluminum", "40 scu", "ARC-L1 Wide Forest", "> shallow node", "Grim HEX", "Delivered, OutBound"],
          ["#2", "Titanium", "12 scu", "Port Tressler", "> Everus Harbor", "Baijini Point", "Delivered, InBound"],
          ["#3", "Medical supplies", "25 scu", "Orison General", "> shallow node", "Brio's Breaker Yard", "Delivered, OutBound"],
          ["#4", "WiDoW", "4 scu", "Jumptown", "> Grim HEX", "adjacent R&R", "Delayed, No Questions"],
          ["#5", "SLAM", "6 scu", "Raven's Roost", "> shallow node", "Grim HEX", "Delivered, Masked"],
          ["#6", "Maze", "2 scu", "Paradise Cove", "> Brio's", "Security Post Kareah", "Hold, Seized"],
          ["#7", "Med-gel", "2 scu", "Clinic", "> shallow node", "Pyro jump staging", "Hold, Audit"],
          ["#8", "Human tissue samples", "1 scu", "New Babbage Interstellar", "> adjacent R&R", "[redacted]", "Manifest mismatch"],
          ["#9", "Scrap electronics", "18 scu", "HUR-L1 Green Glade", "> adjacent R&R", "Brio's Breaker Yard", "Delivered, Shell Only"],
          ["#10", "Unlisted data core", "0 scu", "Unknown clinic", "> Banu-X9", "glen-side drop", "WeightMismatch"]
        ],
        [
          "validation: ID-413",
          "carrier note: goods ledger is clean; data channel reviewed separately",
          "audit note: entries #8 and #10 report mass without matching commodity declaration"
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
          ["#5", "ack",       "Pyro",       "in",   "St-Gate",        "Delivered, InBound"],
          ["#6", "packet",    "StL$",       "out",  "carrier",        "WeightMismatch"],
          ["#7", "burst",     "unknown",    "in",   "StL$",           "Fragmented"],
          ["#8", "route",     "shallow",    "tun2", "glen",           "Paired relay"],
          ["#9", "msg",       "Grim HEX",   "tun2", "B.G.",           "Broker phrase"],
          ["#10", "mirror",   "Kareah",     "in",   "operator",       "Evidence index denied"],
          ["#11", "ping",     "Brio's",     "out",  "carrier shell",  "Salvage fallback"],
          ["#12", "packet",   "unknown",    "null", "VANDUUL_NET",    "Blackholed"]
        ],
        [
          "validation: ID-413",
          "carrier note: message weight exceeds goods declaration",
          "operator note: paired relay entries usually indicate a second in-game stop"
        ]
      );
      return;
    }

    if (command === "open depot03" || command === "open depot03/" || command === "cd depot03" || command === "cd depot03/") {
      DeadDropConsole.openDepot(
        "DEPOT03 // BANU EXCHANGE FRAGMENTS",
        ["Timestamp", "Type", "ID", "Route", "Status"],
        [
          ["2926-06-02 20:03:09", "TRADE", "ID-622", "Banu-X9 -> shallow field", "Delivered, InBound"],
          ["2926-06-02 20:04:27", "TRADE", "ID-622", "shallow field -> +1 rest-stop", "Delivered, OutBound"],
          ["2926-06-02 20:06:02", "OFFER", "SAH'TUL", "B.G. / no questions", "Credit accepted"],
          ["2926-06-02 20:08:44", "CLAIM", "ID-413", "No Questions", "Human asset disputed"],
          ["2926-06-02 20:11:30", "VOID", "RED-GLASS", "Grim HEX", "Route cold"],
          ["2926-06-02 20:14:01", "ESCROW", "ASH-BOX", "Brio's", "Payment dispute"],
          ["2926-06-02 20:18:19", "NOTICE", "KAREAH-SEIZURE", "Crusader", "Evidence mirror requested"],
          ["2926-06-02 20:21:55", "TRANSFER", "UNLISTED", "Pyro staging", "Deferred"]
        ],
        [
          "translation confidence partial",
          "cold routes may contain lore but should not block progress"
        ]
      );
      return;
    }

    if (command === "open depot04" || command === "open depot04/" || command === "cd depot04" || command === "cd depot04/") {
      DeadDropConsole.openLogDepot("DEPOT04 // RELAY LOG DEPOT", logDepotEntries);
      return;
    }

    if (command === "open depot05" || command === "open depot05/" || command === "cd depot05" || command === "cd depot05/") {
      DeadDropConsole.openDepot(
        "DEPOT05 // AUDIO INTERCEPT TRANSCRIPT",
        ["Time", "Speaker", "Confidence", "Transcript"],
        [
          ["17:42:33.001", "UNKNOWN", "31%", "Can you hear me?"],
          ["17:42:33.894", "AMI", "system", "loop detected; transmission repeats every 19.4 seconds"],
          ["17:42:35.210", "UNKNOWN", "29%", "I do not know if this is still my voice."],
          ["17:42:36.602", "OPERATOR", "local", "Identify yourself."],
          ["17:42:38.008", "UNKNOWN", "34%", "They moved me through the trade lane."],
          ["17:42:41.550", "UNKNOWN", "22%", "Shallow fields was only the first door."],
          ["17:42:44.991", "AMI", "system", "semantic match: shallow field"],
          ["17:42:47.301", "UNKNOWN", "27%", "Find the glen. Do not trust the broker."],
          ["17:42:50.018", "AMI", "system", "semantic match: B.G. / adjacent rest-stop"],
          ["17:42:53.770", "UNKNOWN", "18%", "No souls, only stock."],
          ["17:42:57.403", "AMI", "system", "psychological targeting confirmed"],
          ["17:43:01.000", "UNKNOWN", "12%", "find me"]
        ],
        [
          "transcript source: tun2 / BANU_TRADE_LANE",
          "operator note: low confidence lines require cross-checking against depot02 and depot04"
        ]
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
