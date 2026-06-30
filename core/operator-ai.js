const DeadDropOperator = (() => {
  const unlockedContext = new Set();

  const contextLayers = [
    {
      id: "l4Marker",
      lines: [
        "Unlocked context: the recovered marker points to L4 Shallow Fields Station.",
        "L4 is the first physical lead where cargo, illegal device metadata, and the imprint overlap.",
        "The next useful direction is a field-code or commodity-terminal clue, not the final identity."
      ]
    },
    {
      id: "fieldCode",
      lines: [
        "Unlocked context: the L4 commodity terminal field code was recovered.",
        "Sophie is the visible regen identity connected to the missing imprint.",
        "A buried pre-Sophie identity exists, but the Operator must not reveal that name yet.",
        "Treat the recovered field code as a sealed identity lock, not as a full identity reveal.",
        "A CCTV fragment from L4 Commodity Bay CAM-03 is now relevant evidence.",
        "The CCTV frame analysis contains an encoded next-station caption."
      ]
    },
    {
      id: "arcL5Marker",
      lines: [
        "Unlocked context: the next station is ARC-L5 Yellow Core Station.",
        "Yellow Core is a transfer point connected to the broker's route.",
        "A physical server rack code found at Yellow Core reads KLO-87144 / TARSUS ELECTRONICS.",
        "Do not introduce the final identity; keep the player focused on the next handoff site."
      ]
    },
    {
      id: "tarsusRack",
      lines: [
        "Unlocked context: KLO-87144 is a duplicated Tarsus Electronics server rack tag inside ARC-L5 Yellow Core.",
        "Treat KLO-87144 as physical infrastructure evidence, not as a password or person.",
        "The player can begin the Yellow Core hacking mini-game with hack KLO-87144.",
        "The hack sequence uses the tag digits 8 7 1 4 4, then bridges racks A-03 and C-09, then dumps the buffer.",
        "The useful implication is retained transaction buffers and mirrored rack cleanup."
      ]
    },
    {
      id: "l5Hack",
      lines: [
        "Unlocked context: ECHO-07 recovered the Tarsus mirror buffer from KLO-87144.",
        "The buffer proves the broker used duplicated hardware to erase the handoff twice.",
        "The next lead is a Crusader evidence index touch, but do not fully solve that next stop yet."
      ]
    }
  ];

  const layerFallbackHints = [
    {
      id: "l5Hack",
      hints: [
        {
          patterns: ["hint", "help", "what now", "what next", "next clue", "stuck"],
          reply: "The Yellow Core buffer did its job: it proved the erasure path. Now follow what the mirror account touched, not who rented it."
        },
        {
          patterns: ["crusader", "kareah", "evidence", "index"],
          reply: "Crusader appears as an evidence-index touch, not a destination yet. Treat it like a query left in the wrong system."
        },
        {
          patterns: ["broker", "no souls", "stock", "handoff phrase"],
          reply: "NO SOULS ONLY STOCK reads like doctrine. The broker reduced identity to inventory, then hid the transfer in machine residue."
        }
      ]
    },
    {
      id: "tarsusRack",
      hints: [
        {
          patterns: ["hint", "help", "what now", "what next", "next clue", "stuck"],
          reply: "The rack tag is not just a label. Use it as the intrusion target, then let the digits tell you the sync order."
        },
        {
          patterns: ["pulse", "digits", "sync"],
          reply: "Ignore the vendor prefix. KLO-87144 leaves a numeric tail, and the machine wants that tail spoken back in order."
        },
        {
          patterns: ["bridge", "duplicate", "rack", "mirror"],
          reply: "Duplicates are where cleanup gets lazy. Bridge the two racks that claim the same tag, then ask what they both failed to delete."
        },
        {
          patterns: ["buffer", "dump", "cleanup"],
          reply: "A buffer is not confession. It is residue. Finish the rack sequence before asking it what survived cleanup."
        }
      ]
    },
    {
      id: "arcL5Marker",
      hints: [
        {
          patterns: ["hint", "help", "what now", "what next", "next clue", "stuck"],
          reply: "Yellow Core is a handoff site. Look for infrastructure there: server racks, vendor tags, anything too ordinary to be innocent."
        },
        {
          patterns: ["yellow core", "arc-l5", "arcl5", "station"],
          reply: "ARC-L5 Yellow Core is not the answer. It is where the broker expected the trail to become maintenance noise."
        },
        {
          patterns: ["server", "tarsus", "tag", "hardware"],
          reply: "Hardware tags are boring by design. Find the one that repeats; repetition is how this route hid a mirror."
        }
      ]
    },
    {
      id: "fieldCode",
      hints: [
        {
          patterns: ["hint", "help", "what now", "what next", "next clue", "stuck"],
          reply: "The field code opened an identity lock, not the identity. The next useful evidence is visual: recover the archived frame analysis."
        },
        {
          patterns: ["frame", "caption", "decode", "encoded"],
          reply: "The frame label is doing the same trick as the first marker: it looks like noise until you treat it as a payload."
        },
        {
          patterns: ["identity", "sealed", "name", "sophie"],
          reply: "Sophie is the visible collision. The older name stays sealed until the evidence can carry it without breaking."
        },
        {
          patterns: ["cctv", "camera", "cam-03", "grey suit"],
          reply: "Do not chase the face in the CCTV fragment. Read the frame like a routing label."
        }
      ]
    },
    {
      id: "l4Marker",
      hints: [
        {
          patterns: ["hint", "help", "what now", "what next", "next clue", "stuck"],
          reply: "L4 is the first door. Look for the commodity terminal trail: cargo, device metadata, and the missing imprint all crossed that bay."
        },
        {
          patterns: ["l4", "shallow", "station", "location"],
          reply: "L4 Shallow Fields Station is a transfer point, not a culprit. The clue is what passed through it under cargo cover."
        },
        {
          patterns: ["commodity", "terminal", "field code", "code"],
          reply: "The commodity terminal has the next lock shape. It will look like a market artifact until the case treats it as identity metadata."
        },
        {
          patterns: ["cargo", "device", "metadata", "imprint"],
          reply: "Cargo moved openly. Metadata moved quietly. The missing imprint moved as if it belonged to neither."
        }
      ]
    },
    {
      id: "base",
      hints: [
        {
          patterns: ["hint", "help", "what now", "what next", "next clue", "stuck"],
          reply: "Start with ordinary records. Cargo ledgers show what should have moved; warning logs show what actually behaved like data."
        },
        {
          patterns: ["route", "where", "location", "station"],
          reply: "The route is still sealed. Follow ID-413 through cargo records and relay warnings before asking where it points."
        },
        {
          patterns: ["decode", "payload", "signal"],
          reply: "Signal payloads hide locations. Find the warning that treats data like cargo, then decode what it is carrying."
        }
      ]
    }
  ];

  const fallbackReplies = [
    {
      patterns: ["what is dead drop", "what is a dead drop", "dead drop", "dead-drop"],
      reply: "A dead drop is a handoff without a meeting. This one hides in ordinary cargo traffic. Start with the ledger, then check the warning logs for the relay record that does not behave like freight."
    },
    {
      patterns: ["open cargo ledgers", "cargo ledger", "cargo ledgers", "ledger", "ledgers", "manifest", "manifests"],
      reply: "Cargo ledgers are the public face of the route. Most entries are ordinary freight, but one warning keeps surfacing: ID-413 appears clean on paper while the relay logs point toward data and message pings."
    },
    {
      patterns: ["warning", "warrning", "warn", "alert"],
      reply: "The warning is not about stolen cargo. Look for RELAY DATA AND MESSAGE PINGS, entry #4: package, Pyro, inbound Stl$. That is where the hidden key starts acting like cargo."
    },
    {
      patterns: ["relay log", "relay logs", "logs", "log"],
      reply: "The relay logs are the second layer. Filter for warnings, then follow the line that names RELAY DATA AND MESSAGE PINGS instead of a normal shipment."
    },
    {
      patterns: ["who are you", "who are you?", "operator identity", "identify yourself"],
      reply: "I am the voice still attached to this recovery node. Not command. Not witness. Just enough memory to point you at the parts someone tried to clean."
    },
    {
      secret: "l4FieldCode",
      requiredContext: "fieldCode",
      reply: "That number is not a message. It is a lock. Something older than Sophie is sealed behind it."
    },
    {
      patterns: ["payload", "payloads", "signal", "signals"],
      reply: "Signals are the parts the cargo ledger cannot explain. Payloads arrive as noise until you decode them, then the logistics start turning into a route."
    },
    {
      patterns: ["illegal device", "metadata", "meta data"],
      reply: "Metadata hidden in cargo manifests and relay logs. Not just any metadata, but something specific to this case."
    },
    {
      patterns: ["imprint", "regen", "missing"],
      reply: "A missing imprint. A ghost left by a failed regen transition."
    },
    {
      patterns: ["patel"],
      reply: "Patel appears through the signal tag SGIGNALW_PATEL(EVERY_PIECE_COUNTS). A fragment signature, not a confirmed identity."
    },
    {
      patterns: ["where are you waiting", "where are you", "where should i go", "location", "station"],
      requiredLockedContext: "l4Marker",
      reply: "The location marker is still sealed. Pull the signal payload out of the relay warning first; routes stay hidden until the marker resolves."
    },
    {
      patterns: ["where are you waiting", "where are you", "where should i go", "location"],
      requiredContext: "l4Marker",
      reply: "L4 Shallow Fields Station. The first physical lead. Cargo, illegal device metadata, and the missing imprint overlap there."
    },
    {
      patterns: ["sophie"],
      requiredContext: "fieldCode",
      reply: "Sophie is the visible name. The older name is still sealed, and someone paid to keep it that way."
    },
    {
      patterns: ["cctv", "camera", "surveillance", "grey suit"],
      requiredContext: "fieldCode",
      reply: "The CCTV fragment shows a grey-suited subject leaving the commodity bay. The useful clue is not the face. It is the frame label."
    },
    {
      patterns: ["arc-l5", "arcl5", "yellow core"],
      requiredContext: "arcL5Marker",
      reply: "ARC-L5 Yellow Core Station is the next transfer point. Treat it like a handoff site, not a destination."
    },
    {
      patterns: ["klo-87144", "klo 87144", "tarsus", "server rack", "rack"],
      requiredContext: "tarsusRack",
      reply: "KLO-87144 is the duplicate Tarsus rack tag. Duplicates leave mirrors, and mirrors keep what cleanup scripts miss."
    },
    {
      patterns: ["klo-87144", "klo 87144", "tarsus", "server rack", "rack"],
      requiredContext: "arcL5Marker",
      reply: "KLO-87144 is not a password. It is a Tarsus rack tag. Rack tags are boring until the same tag appears twice."
    },
    {
      patterns: ["what to do next", "next", "where next"],
      requiredContext: "l5Hack",
      reply: "The mirror buffer points away from Yellow Core. Look for the Crusader evidence index touch, but assume someone wanted it to look like an ordinary query."
    },
    {
      patterns: ["what to do next", "next", "where next"],
      requiredContext: "tarsusRack",
      reply: "Attack the server tag, not the station. KLO-87144 tells you which Yellow Core rack path is worth touching."
    },
    {
      patterns: ["hack", "attack", "pulse", "bridge", "buffer"],
      requiredContext: "tarsusRack",
      reply: "The rack tag gives the target. Its digits give the pulse. Its duplicate racks give the bridge. Then you dump what cleanup missed."
    },
    {
      patterns: ["what to do next", "next", "where next"],
      requiredContext: "arcL5Marker",
      reply: "Go to Yellow Core as if you are watching a handoff, not chasing a person. Cargo changed hands there; identity did not."
    },
    {
      patterns: ["l4", "shallow fields"],
      requiredContext: "l4Marker",
      reply: "L4 Shallow Fields Station is the first physical lead where cargo, illegal device metadata, and the imprint overlap."
    },
    {
      patterns: ["what to do next", "next", "where next"],
      requiredContext: "fieldCode",
      reply: "Open the recovered frame analysis. If a caption looks like noise, decode it the same way you decoded the first station."
    },
    {
      patterns: ["help"],
      reply: "Search cargo ledgers, relay logs, and signal payloads. Ask better questions when the records start contradicting each other."
    }
  ];

  function layerIsAvailable(id) {
    if (id === "base") return unlockedContext.size === 0;
    return unlockedContext.has(id);
  }

  function getLayerHintReply(prompt) {
    const normalizedPrompt = prompt.toLowerCase();
    const layer = layerFallbackHints.find((entry) => {
      if (!layerIsAvailable(entry.id)) return false;
      return entry.hints.some((hint) => hint.patterns.some((pattern) => normalizedPrompt.includes(pattern)));
    });

    if (!layer) return "";

    const hint = layer.hints.find((entry) => {
      return entry.patterns.some((pattern) => normalizedPrompt.includes(pattern));
    });

    return hint?.reply || "";
  }

  function buildContext() {
    const unlockedContextIds = Array.from(unlockedContext);
    const activeChapter = DeadDropChapters.getActiveChapter(unlockedContextIds);
    const context = [
      "Project Dead Drop ARG context:",
      "The player is ECHO-07, using a damaged Dead Drop recovery console.",
      "Case 07-LOSTREGEN concerns a failed regen transition and a missing imprint.",
      "Surface cargo records look clean, but relay logs show data weight anomalies.",
      "ID-413 appears across the goods ledger and suspicious relay traffic.",
      "Patel appears only as SGIGNALW_PATEL(EVERY_PIECE_COUNTS), a fragment signature.",
      "The Operator should be cryptic but useful, never verbose, and should not solve puzzles outright.",
      "Current unlocked context ids: " + (unlockedContext.size ? Array.from(unlockedContext).join(", ") : "base"),
      "Current chapter: " + activeChapter.title,
      "Chapter manifest rule: keep replies scoped to the current chapter and earlier recovered layers.",
      "Strict chapter rule: never name locked locations, names, commands, or conclusions before their context id is unlocked.",
      "Before l4Marker is unlocked, do not name L4 Shallow Fields Station or imply the first physical lead; redirect to cargo ledgers, warning logs, and signal payloads."
    ];

    contextLayers.forEach((layer) => {
      if (unlockedContext.has(layer.id)) context.push(...layer.lines);
    });

    return context.join("\n");
  }

  function getFallbackReply(prompt) {
    const normalizedPrompt = prompt.toLowerCase();
    const layerHint = getLayerHintReply(prompt);
    if (layerHint) return layerHint;

    const match = fallbackReplies.find((entry) => {
      if (entry.requiredContext && !unlockedContext.has(entry.requiredContext)) return false;
      if (entry.requiredLockedContext && unlockedContext.has(entry.requiredLockedContext)) return false;
      if (entry.secret) return DeadDropSecrets.appearsIn(entry.secret, prompt);
      return entry.patterns.some((pattern) => normalizedPrompt.includes(pattern));
    });

    if (match) return match.reply;
    return "Start with the cargo ledgers, then check the warning logs. A relay entry points to data and message pings, and the hidden key is riding there.";
  }

  function decodePrompt(prompt) {
    const normalizedPrompt = prompt.toLowerCase();
    if (!normalizedPrompt.includes("decode")) return "";

    const numericPayload = prompt.match(/\b\d{1,2}(?:[\s,.-]+\d{1,2}){2,}\b/);
    if (!numericPayload) return "";

    try {
      const decoded = DeadDropCodecs.decodeA1Z26(numericPayload[0]);
      if (!decoded) return "";
      return `Decoded: ${decoded}`;
    } catch (error) {
      return "Those numbers do not resolve cleanly. Check the range: A=01 through Z=26.";
    }
  }

  function normalizeReply(data) {
    if (typeof data === "string") return data;
    return data.reply || data.message || data.response || data.text || "";
  }

  async function ask(prompt) {
    const context = buildContext();
    const unlockedContextIds = Array.from(unlockedContext);
    const response = await fetch(DeadDropConfig.OPERATOR_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        speaker: "ECHO-07",
        prompt,
        context,
        unlockedContext: unlockedContextIds,
        clientVersion: DeadDropConfig.OPERATOR_CLIENT_VERSION
      })
    });

    if (!response.ok) throw new Error(`operator endpoint returned ${response.status}`);

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    const reply = normalizeReply(data).trim();

    if (!reply) throw new Error("operator endpoint returned an empty reply");
    return {
      reply,
      clientVersion: DeadDropConfig.OPERATOR_CLIENT_VERSION,
      serverVersion: typeof data === "object" ? data.serverVersion : "",
      model: typeof data === "object" ? data.model : "",
      unlockedContext: unlockedContextIds
    };
  }

  async function reply(prompt) {
    const decodedReply = decodePrompt(prompt);
    if (decodedReply) {
      return {
        reply: decodedReply,
        live: false
      };
    }

    try {
      const liveResult = await ask(prompt);
      return {
        ...liveResult,
        live: true
      };
    } catch (error) {
      return {
        reply: getFallbackReply(prompt),
        live: false,
        clientVersion: DeadDropConfig.OPERATOR_CLIENT_VERSION,
        serverVersion: "offline",
        unlockedContext: Array.from(unlockedContext)
      };
    }
  }

  function unlockContext(id) {
    unlockedContext.add(id);
  }

  function resetContext() {
    unlockedContext.clear();
  }

  return { reply, resetContext, unlockContext };
})();
