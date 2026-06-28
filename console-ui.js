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

  function appendDepotList(depots, onOpen) {
    const list = document.createElement("div");
    list.className = "depot-list";

    depots.forEach((depot) => {
      const button = document.createElement("button");
      button.className = "depot-list-item";
      button.type = "button";
      button.addEventListener("click", () => onOpen(depot.id));

      const permissions = document.createElement("span");
      permissions.className = "depot-list-permissions";
      permissions.textContent = depot.permissions;

      const name = document.createElement("span");
      name.className = "depot-list-name";
      name.textContent = `${depot.id}/`;

      const description = document.createElement("span");
      description.className = "depot-list-description";
      description.textContent = `[${depot.description}]`;

      button.append(permissions, name, description);
      list.appendChild(button);
    });

    DeadDropDom.consoleOutput.appendChild(list);
    DeadDropDom.consoleOutput.scrollTop = DeadDropDom.consoleOutput.scrollHeight;
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

  function openLogDepot(title, entries) {
    DeadDropDom.depotTitle.textContent = title;
    DeadDropDom.depotContent.innerHTML = "";

    const wrapper = document.createElement("section");
    wrapper.className = "log-depot";

    const toolbar = document.createElement("div");
    toolbar.className = "log-toolbar";

    const searchLabel = document.createElement("label");
    searchLabel.className = "log-search";
    searchLabel.htmlFor = "log-search-input";
    searchLabel.textContent = "Search";

    const searchInput = document.createElement("input");
    searchInput.id = "log-search-input";
    searchInput.type = "search";
    searchInput.placeholder = "Search log";
    searchInput.autocomplete = "off";
    searchInput.spellcheck = false;

    const filterLabel = document.createElement("label");
    filterLabel.className = "log-filter";
    filterLabel.htmlFor = "log-level-filter";
    filterLabel.textContent = "Level";

    const levelFilter = document.createElement("select");
    levelFilter.id = "log-level-filter";
    ["all", "debug", "info", "warn", "error"].forEach((level) => {
      const option = document.createElement("option");
      option.value = level;
      option.textContent = level.toUpperCase();
      levelFilter.appendChild(option);
    });

    const count = document.createElement("span");
    count.className = "log-count";

    const output = document.createElement("div");
    output.className = "log-output";
    output.setAttribute("role", "log");
    output.setAttribute("aria-live", "polite");

    function render() {
      const query = searchInput.value.trim().toLowerCase();
      const level = levelFilter.value;
      const matches = entries.filter((entry) => {
        const line = `${entry.timestamp} ${entry.level} ${entry.source} ${entry.message}`.toLowerCase();
        return (level === "all" || entry.level === level) && (!query || line.includes(query));
      });

      output.innerHTML = "";
      count.textContent = `${matches.length}/${entries.length}`;

      matches.forEach((entry) => {
        const line = document.createElement("div");
        line.className = `log-line log-line-${entry.level}`;
        line.textContent = `${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.source}: ${entry.message}`;
        output.appendChild(line);
      });

      if (!matches.length) {
        const empty = document.createElement("div");
        empty.className = "log-line log-line-empty";
        empty.textContent = "No matching log entries.";
        output.appendChild(empty);
      }
    }

    searchInput.addEventListener("input", render);
    levelFilter.addEventListener("change", render);

    toolbar.append(searchLabel, searchInput, filterLabel, levelFilter, count);
    wrapper.append(toolbar, output);
    DeadDropDom.depotContent.appendChild(wrapper);

    DeadDropDom.consoleScreen.hidden = true;
    DeadDropDom.depotScreen.hidden = false;
    searchInput.focus();
    render();
  }

  function closeDepot() {
    DeadDropDom.depotScreen.hidden = true;
    DeadDropDom.consoleScreen.hidden = false;
    DeadDropDom.consoleInput.focus();
  }

  return {
    appendLine,
    appendBlock,
    appendDepotList,
    resetOutput,
    appendGrid,
    openDepot,
    openLogDepot,
    closeDepot
  };
})();
