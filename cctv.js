const DeadDropCctv = (() => {
  const fragment = DeadDropDom.cctvFragment;
  const video = DeadDropDom.cctvVideo;
  const closeButton = DeadDropDom.closeCctvButton;
  const title = document.querySelector("#cctv-title");
  const kicker = fragment.querySelector(".eyebrow");
  const stamp = fragment.querySelector(".cctv-stamp");
  const state = fragment.querySelector(".cctv-state");
  const footerLines = fragment.querySelectorAll(".cctv-footer span");
  const source = video.querySelector("source");
  const unlockedFragments = new Set();
  let activeFragmentId = "l4-cam-03";
  let recoveryTone = null;

  const fragments = {
    "l4-cam-03": {
      title: "L4 Commodity Bay // CAM-03",
      kicker: "Recovered surveillance fragment",
      src: "Videos/CCTVL4.mp4",
      stamp: "2926-06-01 01:10:55 // L4-COMM-BAY",
      state: "PARTIAL // RECOVERY TONE",
      footer: [
        "LOCATION HINT // L4 COMMODITY BAY",
        "FRAME LOSS: 17% // SUBJECT UNRESOLVED"
      ]
    }
  };

  function getRecoveryTone() {
    if (!recoveryTone) {
      recoveryTone = new Audio("Audio/L4CCTV_Shime.mp3");
      recoveryTone.preload = "auto";
      recoveryTone.volume = 0.45;
    }

    return recoveryTone;
  }

  function playRecoveryTone() {
    const tone = getRecoveryTone();
    tone.pause();
    tone.currentTime = 0;
    tone.play().catch(() => {});
  }

  function stopRecoveryTone() {
    if (!recoveryTone) return;

    recoveryTone.pause();
    recoveryTone.currentTime = 0;
  }

  function applyFragment(fragmentId) {
    const entry = fragments[fragmentId] || fragments["l4-cam-03"];
    activeFragmentId = fragmentId;
    title.textContent = entry.title;
    kicker.textContent = entry.kicker;
    stamp.textContent = entry.stamp;
    state.textContent = entry.state;
    footerLines.forEach((line, index) => {
      line.textContent = entry.footer[index] || "";
    });

    if (source.getAttribute("src") !== entry.src) {
      source.setAttribute("src", entry.src);
      video.load();
    }
  }

  function show(fragmentId = activeFragmentId) {
    if (!unlockedFragments.has(fragmentId)) return false;

    applyFragment(fragmentId);
    fragment.hidden = false;
    document.body.classList.add("cctv-open");
    video.currentTime = 0;
    video.play().then(playRecoveryTone).catch(() => playRecoveryTone());
    closeButton.focus();
    return true;
  }

  function hide() {
    if (fragment.hidden) return;
    fragment.hidden = true;
    document.body.classList.remove("cctv-open");
    video.pause();
    stopRecoveryTone();
    if (!DeadDropDom.consoleScreen.hidden) DeadDropDom.consoleInput.focus();
  }

  function unlock(fragmentId = activeFragmentId, { autoplay = false, autoplayDelay = 450 } = {}) {
    unlockedFragments.add(fragmentId);
    applyFragment(fragmentId);
    if (autoplay) window.setTimeout(() => show(fragmentId), autoplayDelay);
  }

  function disable(fragmentId = activeFragmentId) {
    unlockedFragments.delete(fragmentId);
    if (fragmentId === activeFragmentId) hide();
  }

  function setUnlocked(value) {
    if (value) {
      unlock("l4-cam-03");
      return;
    }

    unlockedFragments.clear();
    hide();
  }

  function isUnlocked(fragmentId = activeFragmentId) {
    return unlockedFragments.has(fragmentId);
  }

  closeButton.addEventListener("click", hide);
  video.addEventListener("play", playRecoveryTone);
  video.addEventListener("pause", stopRecoveryTone);
  video.addEventListener("ended", stopRecoveryTone);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !fragment.hidden) hide();
  });

  return { disable, hide, isUnlocked, setUnlocked, show, unlock };
})();
