const DeadDropStarMap = (() => {
  const map = DeadDropDom.starMap;
  const closeButton = DeadDropDom.closeStarMapButton;
  let activeHint = null;

  function randomizeOrbitPhases() {
    map.querySelectorAll(".planet-orbit").forEach((orbit) => {
      const speed = window.getComputedStyle(orbit).getPropertyValue("--speed").trim();
      const seconds = Number.parseFloat(speed);
      if (!Number.isFinite(seconds) || seconds <= 0) return;

      orbit.style.setProperty("--phase", `${-(Math.random() * seconds).toFixed(2)}s`);
    });
  }

  function show() {
    map.hidden = false;
    document.body.classList.add("star-map-open");
    map.classList.remove("is-l4-revealed");
    map.classList.remove("is-arcl5-revealed");

    if (activeHint) {
      void map.offsetWidth;
      map.classList.add(`is-${activeHint}-revealed`);
    }

    closeButton.focus();
  }

  function hide() {
    if (map.hidden) return;
    map.hidden = true;
    map.classList.remove("is-l4-revealed");
    map.classList.remove("is-arcl5-revealed");
    document.body.classList.remove("star-map-open");
    if (!DeadDropDom.consoleScreen.hidden) DeadDropDom.consoleInput.focus();
  }

  function setHint(hint) {
    activeHint = hint;
    map.classList.remove("is-l4-revealed");
    map.classList.remove("is-arcl5-revealed");
    if (hint && !map.hidden) map.classList.add(`is-${hint}-revealed`);
  }

  function setL4HintVisible(visible) {
    setHint(visible ? "l4" : null);
  }

  closeButton.addEventListener("click", hide);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !map.hidden) hide();
  });

  randomizeOrbitPhases();

  return { show, hide, setHint, setL4HintVisible };
})();
