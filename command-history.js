const DeadDropCommandHistory = (() => {
  const history = [];
  let index = 0;
  let draft = "";

  function hasHistory() {
    return history.length > 0;
  }

  function record(rawCommand) {
    if (!rawCommand.trim()) return;

    history.push(rawCommand);
    index = history.length;
    draft = "";
  }

  function reset() {
    history.length = 0;
    index = 0;
    draft = "";
  }

  function browse(direction, currentValue) {
    if (!hasHistory()) return currentValue;

    if (direction === "previous") {
      if (index === history.length) {
        draft = currentValue;
      }
      index = Math.max(0, index - 1);
    } else {
      index = Math.min(history.length, index + 1);
    }

    return history[index] || draft;
  }

  return {
    hasHistory,
    record,
    reset,
    browse
  };
})();
