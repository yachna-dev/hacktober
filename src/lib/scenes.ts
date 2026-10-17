import type { VoiceId } from "./audio/engine";

export interface SceneLayer {
  id: VoiceId;
  label: string;
  hint: string;
  volume: number;
}

export interface Scene {
  id: string;
  name: string;
  latin: string;
  tagline: string;
  emoji: string;
  accent: string;
  palette: [string, string, string];
  particle: "dust" | "rain" | "float";
  layers: SceneLayer[];
}

export const SCENES: Scene[] = [
  {
    id: "saloon",
    name: "डीलक्स सैलून",
    latin: "The Saloon",
    tagline: "Clippers, old tape, and unhurried talk",
    emoji: "💈",
    accent: "#ff8a4c",
    palette: ["#1c0d08", "#3a1710", "#5c2612"],
    particle: "dust",
    layers: [
      { id: "buzz", label: "Clipper", hint: "pehli machine ka buzz", volume: 0.55 },
      { id: "snips", label: "Scissors", hint: "kai-chi, kai-chi", volume: 0.4 },
      { id: "radio", label: "Purana radio", hint: "90s ki dhun", volume: 0.6 },
      { id: "murmur", label: "Baithak", hint: "log baat karte hue", volume: 0.35 },
      { id: "hum", label: "Fan / cooler", hint: "slow hum", volume: 0.3 },
    ],
  },
  {
    id: "bus",
    name: "लोकल बस",
    latin: "The Bus",
    tagline: "Window seat, evening light, conductor's whistle",
    emoji: "🚌",
    accent: "#f2b06b",
    palette: ["#141018", "#2a1c14", "#3f2a17"],
    particle: "dust",
    layers: [
      { id: "hum", label: "Engine", hint: "dheemi dhadkan", volume: 0.6 },
      { id: "traffic", label: "Sarak", hint: "bahar ki bheed", volume: 0.4 },
      { id: "horn", label: "Horn", hint: "door se…", volume: 0.45 },
      { id: "radio", label: "Radio", hint: "driver ka gaana", volume: 0.5 },
      { id: "murmur", label: "Sawariyan", hint: "logon ki khushbu-wali awaaz", volume: 0.3 },
    ],
  },
  {
    id: "cafe",
    name: "बारिशी कॉफ़ी",
    latin: "Rainy Cafe",
    tagline: "Rain on the window, cup on the saucer",
    emoji: "🌧️",
    accent: "#7fb2ff",
    palette: ["#080f1e", "#101a33", "#16294a"],
    particle: "rain",
    layers: [
      { id: "rain", label: "Baarish", hint: "khaas par sheeshe pe", volume: 0.55 },
      { id: "murmur", label: "Halki baatein", hint: "coffee shop ki goonj", volume: 0.35 },
      { id: "clinks", label: "Cup & chammach", hint: "chhota-sa clink", volume: 0.35 },
      { id: "radio", label: "Soft tunes", hint: "piano jaise sur", volume: 0.5 },
      { id: "hum", label: "AC", hint: "steady hum", volume: 0.25 },
    ],
  },
  {
    id: "shaam",
    name: "गलियारे की शाम",
    latin: "Gully Evening",
    tagline: "Chirping birds, distant traffic, a fading sky",
    emoji: "🌆",
    accent: "#ff7ac0",
    palette: ["#180a1c", "#2c1230", "#46193a"],
    particle: "float",
    layers: [
      { id: "traffic", label: "Dur ki sarak", hint: "shehar ki saans", volume: 0.42 },
      { id: "murmur", label: "Gali", hint: "log, bacche, duniya", volume: 0.33 },
      { id: "birds", label: "Chidiya", hint: "ghar wapas", volume: 0.4 },
      { id: "radio", label: "Chhat pe radio", hint: "halki dhun", volume: 0.45 },
      { id: "hum", label: "Ghar ki goonj", hint: "garam hawa", volume: 0.28 },
    ],
  },
];

export function getScene(id: string): Scene {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}
