const DeadDropCodecs = (() => {
  function decodeHex(hex) {
    return hex.match(/.{1,2}/g).map((byte) => String.fromCharCode(parseInt(byte, 16))).join("");
  }

  function decodeA1Z26(payload) {
    const values = payload.match(/\b\d{1,2}\b/g) || [];
    if (!values.length) return "";

    return values.map((value) => {
      const number = Number(value);
      if (number < 1 || number > 26) throw new Error("A1Z26 value out of range");
      return String.fromCharCode(96 + number);
    }).join("");
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
    a1z26: {
      label: "A1Z26 number string",
      decode: (payload) => decodeA1Z26(payload)
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
    decodeA1Z26,
    decodeHex,
    getSignalCodec,
    listSignalCodecs
  };
})();
