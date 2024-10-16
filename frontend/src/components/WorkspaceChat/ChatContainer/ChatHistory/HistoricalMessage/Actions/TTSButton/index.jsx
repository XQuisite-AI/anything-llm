import { useEffect, useState } from "react";
import NativeTTSMessage from "./native";
import AsyncTTSMessage from "./asyncTts";
import PiperTTSMessage from "./piperTTS";
import System from "@/models/system";

export default function TTSMessage({ slug, chatId, message, role = null }) {
  const [settings, setSettings] = useState({});
  const [provider, setProvider] = useState("native");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getSettings() {
      const _settings = await System.keys();
      setProvider(_settings?.TextToSpeechProvider ?? "native");
      setSettings(_settings);
      setLoading(false);
    }
    getSettings();
  }, []);

  if (!chatId || loading) return null;

  switch (provider) {
    case "openai":
    case "elevenlabs":
      return <AsyncTTSMessage slug={slug} chatId={chatId} role={role} />;
    case "piper_local":
      return (
        <PiperTTSMessage
          voiceId={settings?.TTSPiperTTSVoiceModel}
          message={message}
          role={role}
        />
      );
    default:
      return <NativeTTSMessage message={message} role={role}/>;
  }
}
