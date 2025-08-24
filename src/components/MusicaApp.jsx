import React, { useEffect, useRef, useState } from "react";

export default function MusicaApp({
  src = "/musica-app.mp3",
  volume = 0.25,
  loop = true,
  btnSize = 36,
  consentKey = "bgmConsent", // guarda consentimiento tras primer unmute manual
}) {
  const audioRef = useRef(null);
  const [muted, setMuted] = useState(false); // objetivo: empezar con sonido
  const [needsInteract, setNeedsInteract] = useState(false);
  const [consented, setConsented] = useState(
    () => localStorage.getItem(consentKey) === "1"
  );
  const playingRef = useRef(false);

  const tryPlay = async (preferAudible = true) => {
    const el = audioRef.current;
    if (!el || playingRef.current) return false;
    playingRef.current = true;
    try {
      if (preferAudible) {
        el.muted = false;
        await el.play();
        setMuted(false);
        setNeedsInteract(false);
        return true;
      }
      el.muted = true;
      await el.play();
      setMuted(true);
      setNeedsInteract(true);
      return true;
    } catch {
      setNeedsInteract(true);
      return false;
    } finally {
      playingRef.current = false;
    }
  };

  // Reintentos en el montaje + control de visibilidad/focus
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = Math.min(1, Math.max(0, volume));
    el.loop = loop;

    const preferAudible = consented || !muted;

    const kicks = [
      setTimeout(() => tryPlay(preferAudible), 50),
      setTimeout(() => tryPlay(preferAudible), 400),
      setTimeout(() => tryPlay(preferAudible), 1500),
    ];

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        tryPlay(preferAudible);
      } else {
        if (el && !el.paused) el.pause(); // pestaña oculta → pausa
      }
    };

    const onFocus = () => tryPlay(preferAudible);
    const onBlur = () => {
      if (el && !el.paused) el.pause(); // ventana pierde foco → pausa
    };

    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    // primer gesto del usuario: intentamos dejarlo audible
    const onFirstGesture = async () => {
      await tryPlay(true);
      removeGestureListeners();
    };
    const addGestureListeners = () => {
      window.addEventListener("pointerdown", onFirstGesture, { once: true });
      window.addEventListener("touchstart", onFirstGesture, { once: true });
      window.addEventListener("keydown", onFirstGesture, { once: true });
      window.addEventListener("scroll", onFirstGesture, { once: true, passive: true });
      window.addEventListener("mousemove", onFirstGesture, { once: true });
      window.addEventListener("wheel", onFirstGesture, { once: true, passive: true });
    };
    const removeGestureListeners = () => {
      window.removeEventListener("pointerdown", onFirstGesture);
      window.removeEventListener("touchstart", onFirstGesture);
      window.removeEventListener("keydown", onFirstGesture);
      window.removeEventListener("scroll", onFirstGesture);
      window.removeEventListener("mousemove", onFirstGesture);
      window.removeEventListener("wheel", onFirstGesture);
    };

    addGestureListeners();

    return () => {
      kicks.forEach(clearTimeout);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
      removeGestureListeners();
      if (audioRef.current) audioRef.current.pause();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [consented, volume, loop]);

  // sincroniza mute con el <audio>
  useEffect(() => {
    if (audioRef.current) audioRef.current.muted = muted;
  }, [muted]);

  const toggleMute = async () => {
    const next = !muted;
    setMuted(next);
    await tryPlay(!next); // si vamos a desmutear, preferimos audible
    if (!next) {
      localStorage.setItem(consentKey, "1");
      setConsented(true);
    }
  };

  useEffect(() => {
    const onUnlock = async () => {
      await tryPlay(true);
      localStorage.setItem(consentKey, "1");
      setConsented(true);
      setMuted(false);
      setNeedsInteract(false);
    };
    window.addEventListener("bgm:unlockAudio", onUnlock);
    return () => window.removeEventListener("bgm:unlockAudio", onUnlock);
  }, []);

  const iconSize = Math.max(14, Math.round(btnSize * 0.5));
  const btnStyle = {
    position: "fixed",
    right: 20,
    bottom: 22,
    zIndex: 1099,
    width: btnSize,
    height: btnSize,
    borderRadius: "50%",
    border: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,.22)",
    transition: "transform .12s ease, background .15s ease",
    background: muted ? "#ffffff" : "#1976d2",
    color: muted ? "#333" : "#fff",
    transform: muted ? "scale(1.0)" : "scale(1.04)",
  };

  const title = needsInteract
    ? muted
      ? "Activar sonido"
      : "Intentar reproducir"
    : muted
      ? "Activar sonido"
      : "Silenciar";

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        playsInline
        style={{ display: "none" }}
      />
      <button aria-label={title} title={title} onClick={toggleMute} style={btnStyle}>
        <span style={{ fontSize: iconSize, lineHeight: 1 }}>
          {muted ? "🔇" : "🔊"}
        </span>
      </button>
    </>
  );
}
