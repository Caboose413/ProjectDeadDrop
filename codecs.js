const DeadDropCodecs = (() => {
  function decodeHex(hex) {
    return hex.match(/.{1,2}/g).map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
  }

  const signalCodecs = {
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

  function getSignalCodec(type) {
    return Object.entries(signalCodecs).find(([name]) => {
      return name === type;
    });
  }

  function listSignalCodecs() {
    return Object.entries(signalCodecs).map(([name, codec]) => {
      return `  ${name} - ${codec.label}`;
    });
  }

  return {
    decodeHex,
    getSignalCodec,
    listSignalCodecs
  };
})();
