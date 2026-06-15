const DeadDropReward = (() => {
  let rewardEffectTimer = null;

  function playSound() {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const context = new AudioContext();
    const master = context.createGain();
    master.gain.setValueAtTime(0.0001, context.currentTime);
    master.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.025);
    master.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.62);
    master.connect(context.destination);

    [220, 330, 440].forEach((frequency, index) => {
      const osc = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + index * 0.09;
      osc.type = "triangle";
      osc.frequency.setValueAtTime(frequency, start);
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.5, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
      osc.connect(gain);
      gain.connect(master);
      osc.start(start);
      osc.stop(start + 0.3);
    });

    window.setTimeout(() => context.close(), 900);
  }

  function hide() {
    if (rewardEffectTimer) {
      window.clearTimeout(rewardEffectTimer);
      rewardEffectTimer = null;
    }

    DeadDropDom.rewardEffect.hidden = true;
    document.body.classList.remove("reward-effect-active");
  }

  function show({ kicker, title, duration = 1500, playSound = true }) {
    DeadDropDom.rewardKicker.textContent = kicker;
    DeadDropDom.rewardTitle.textContent = title;

    if (playSound) DeadDropReward.playSound();
    if (rewardEffectTimer) window.clearTimeout(rewardEffectTimer);

    document.body.classList.remove("reward-effect-active");
    DeadDropDom.rewardEffect.hidden = true;
    void DeadDropDom.rewardEffect.offsetWidth;
    DeadDropDom.rewardEffect.hidden = false;
    void document.body.offsetWidth;
    document.body.classList.add("reward-effect-active");

    rewardEffectTimer = window.setTimeout(hide, duration);
  }

  function triggerGoalEffect() {
    show({
      kicker: "Location Marker Recovered",
      title: "L4 Shallow Fields Station"
    });
  }

  return {
    hide,
    show,
    playSound,
    triggerGoalEffect
  };
})();
