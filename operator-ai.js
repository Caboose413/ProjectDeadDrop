const DeadDropOperator = (() => {
  const fallbackReplies = [
    {
      patterns: ["260913081"],
      reply: "A cryptic signal tag. SGIGNALW_PATEL(260913081)."
    },
    {
      patterns: ["payload", "payloads", "signal"],
      reply: "Signal payloads hide locations. Cargo ledgers hide routes. Decoded messages slowly turn logistics into a ghost story."
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
      patterns: ["amelia", "boyd"],
      reply: "Amelia Boyd was supposed to be forgotten. You found her anyway."
    },
    {
      patterns: ["l4", "shallow fields"],
      reply: "L4 Shallow Fields Station is the first physical lead where cargo, illegal device metadata, and the imprint overlap."
    },
    {
      patterns: ["help"],
      reply: "Search cargo ledgers, relay logs, and signal payloads. Ask better questions when the records start contradicting each other."
    }
  ];

  function buildContext() {
    return [
      "Project Dead Drop ARG context:",
      "The player is ECHO-07, using a damaged Dead Drop recovery console.",
      "Case 07-LOSTREGEN concerns a failed regen transition and a missing imprint.",
      "Surface cargo records look clean, but relay logs show data weight anomalies.",
      "ID-413 appears across the goods ledger and suspicious relay traffic.",
      "The recovered marker points to L4 Shallow Fields Station.",
      "Patel appears only as SGIGNALW_PATEL(EVERY_PIECE_COUNTS), a fragment signature.",
      "Amelia Boyd is the buried person at the center of the haunting.",
      "The Operator should be cryptic but useful, never verbose, and should not solve puzzles outright."
    ].join("\n");
  }

  function getFallbackReply(prompt) {
    const normalizedPrompt = prompt.toLowerCase();
    const match = fallbackReplies.find((entry) => {
      return entry.patterns.some((pattern) => normalizedPrompt.includes(pattern));
    });

    if (match) return match.reply;
    return "Cargo ledgers hide routes. Signal payloads hide locations. Decoded messages slowly turn logistics into a ghost story.";
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
    const response = await fetch(DeadDropConfig.OPERATOR_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        speaker: "ECHO-07",
        prompt,
        context: buildContext()
      })
    });

    if (!response.ok) throw new Error(`operator endpoint returned ${response.status}`);

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    const reply = normalizeReply(data).trim();

    if (!reply) throw new Error("operator endpoint returned an empty reply");
    return reply;
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
      return {
        reply: await ask(prompt),
        live: true
      };
    } catch (error) {
      return {
        reply: getFallbackReply(prompt),
        live: false
      };
    }
  }

  return { reply };
})();
