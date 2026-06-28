const DeadDropConsole = (() => {
  function appendLine(text, className = "sys") {
    const line = document.createElement("div");
    line.className = className;
    line.textContent = text;
    DeadDropDom.consoleOutput.appendChild(line);
    DeadDropDom.consoleOutput.scrollTop = DeadDropDom.consoleOutput.scrollHeight;
  }

  function appendBlock(lines, className = "sys") {
    lines.forEach((line) => appendLine(line, className));
  }

  function resetOutput() {
    DeadDropDom.consoleOutput.innerHTML = "";
    appendBlock([
      "[ DEAD DROP :: RECOVERY CONSOLE ]",
      "[ SESSION: PROVISIONAL ]",
      "[ TYPE HELP FOR COMMANDS ]",
      ""
    ]);
  }

  function createGridBlock(title, columns, rows, footerLines = []) {
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

    return wrapper;
  }

  function appendGrid(title, columns, rows, footerLines = []) {
    DeadDropDom.consoleOutput.appendChild(createGridBlock(title, columns, rows, footerLines));
    DeadDropDom.consoleOutput.scrollTop = DeadDropDom.consoleOutput.scrollHeight;
  }

  function openDepot(title, columns, rows, footerLines = []) {
    DeadDropDom.depotTitle.textContent = title;
    DeadDropDom.depotContent.innerHTML = "";
    DeadDropDom.depotContent.appendChild(createGridBlock(title, columns, rows, footerLines));
    DeadDropDom.consoleScreen.hidden = true;
    DeadDropDom.depotScreen.hidden = false;
    DeadDropDom.backToConsoleButton.focus();
  }

  function closeDepot() {
    DeadDropDom.depotScreen.hidden = true;
    DeadDropDom.consoleScreen.hidden = false;
    DeadDropDom.consoleInput.focus();
  }

  return {
    appendLine,
    appendBlock,
    resetOutput,
    appendGrid,
    openDepot,
    closeDepot
  };
})();
