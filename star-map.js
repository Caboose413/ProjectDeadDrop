const DeadDropStarMap = (() => {
  const map = DeadDropDom.starMap;
  const closeButton = DeadDropDom.closeStarMapButton;

  function show() {
    map.hidden = false;
    document.body.classList.add("star-map-open");
    closeButton.focus();
  }

  function hide() {
    if (map.hidden) return;
    map.hidden = true;
    document.body.classList.remove("star-map-open");
    if (!DeadDropDom.consoleScreen.hidden) DeadDropDom.consoleInput.focus();
  }

  closeButton.addEventListener("click", hide);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !map.hidden) hide();
  });

  return { show, hide };
})();
