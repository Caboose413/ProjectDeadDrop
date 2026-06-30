const DeadDropSecrets = (() => {
  const secrets = {
    l4FieldCode: {
      salt: [74, 19, 208, 91, 6, 144, 37],
      fingerprints: [
        1081245788,
        3206927697,
        700925250
      ]
    }
  };

  function normalizeInput(value) {
    return String(value)
      .trim()
      .toLowerCase()
      .replace(/[._]+/g, "-")
      .replace(/\s+/g, " ");
  }

  function fingerprint(value, salt) {
    const normalized = normalizeInput(value);
    let hash = 2166136261;

    salt.forEach((byte) => {
      hash ^= byte & 255;
      hash = Math.imul(hash, 16777619);
    });

    for (let index = 0; index < normalized.length; index += 1) {
      hash ^= normalized.charCodeAt(index);
      hash = Math.imul(hash, 16777619);
    }

    hash ^= normalized.length;
    hash = Math.imul(hash ^ (hash >>> 16), 2246822507);
    hash = Math.imul(hash ^ (hash >>> 13), 3266489909);
    hash ^= hash >>> 16;

    return hash >>> 0;
  }

  function getSecret(id) {
    return secrets[id] || null;
  }

  function matches(id, value) {
    const secret = getSecret(id);
    if (!secret) return false;

    return secret.fingerprints.includes(fingerprint(value, secret.salt));
  }

  function appearsIn(id, value) {
    if (matches(id, value)) return true;

    const normalized = normalizeInput(value);
    const tokens = normalized.match(/[a-z0-9-]+/g) || [];
    return tokens.some((token) => matches(id, token));
  }

  return {
    appearsIn,
    matches
  };
})();
