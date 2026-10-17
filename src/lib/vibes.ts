import type { Scene } from "./scenes";
import type { LocalTrack } from "./tracks";

export interface Vibe extends Scene {
  photo?: string;
  tracks?: LocalTrack[];
}

export const VIBES: Vibe[] = [
  {
    id: "saloon",
    emoji: "💈",
    name: "डीलक्स सैलून",
    latin: "Deluxe Saloon",
    tagline: "Clipper, purana tape, aur befaaltu baatein",
    accent: "#ff8a4c",
    palette: ["#1c0d08", "#3a1710", "#5c2612"],
    particle: "dust",
    photo: "/saloon-bg.jpg",
    layers: [
      { id: "buzz", label: "Clipper", hint: "pehli machine ka buzz", volume: 0.55 },
      { id: "snips", label: "Scissors", hint: "kai-chi, kai-chi", volume: 0.4 },
      { id: "radio", label: "Purana radio", hint: "90s ki dhun", volume: 0.6 },
      { id: "murmur", label: "Baithak", hint: "log baat karte hue", volume: 0.35 },
      { id: "hum", label: "Fan / cooler", hint: "slow hum", volume: 0.3 },
    ],
    tracks: [
      { title: "Is Tarah Aashiqui Ka", artist: "Kumar Sanu", src: "/audio/saloon/01-is-tarah-aashiqui-ka.mp3" },
      { title: "Jaadu Teri Nazar", artist: "Udit Narayan", src: "/audio/saloon/02-jaadu-teri-nazar.mp3" },
      { title: "Mujhse Mohabbat Ka Izhaar", artist: "Kumar Sanu & Alka Yagnik", src: "/audio/saloon/03-mujhse-mohabbat-ka-izhaar.mp3" },
      { title: "Saloon Classic", artist: "Purana cassette", src: "/audio/saloon/04-saloon-classic.mp3" },
    ],
  },
  {
    id: "barish",
    emoji: "🌧️",
    name: "रेनिंग बारिश",
    latin: "Raining Barish",
    tagline: "Khidki pe boondein, chai thandi na ho jaaye",
    accent: "#7fb2ff",
    palette: ["#07101d", "#112138", "#1c3354"],
    particle: "rain",
    layers: [
      { id: "rain", label: "Baarish", hint: "khaas par sheeshe pe", volume: 0.6 },
      { id: "radio", label: "Slow tunes", hint: "piano jaise sur", volume: 0.4 },
      { id: "clinks", label: "Chai & chammach", hint: "chhota-sa clink", volume: 0.35 },
      { id: "murmur", label: "Halki baatein", hint: "kamre ki goonj", volume: 0.3 },
      { id: "hum", label: "AC / fan", hint: "steady hum", volume: 0.25 },
    ],
    tracks: [
      { title: "Kabhi Jo Baadal Barse", artist: "Arijit Singh", src: "/audio/barish/01-kabhi-jo-baadal-barse.mp3" },
      { title: "Rafta Rafta", artist: "Atif Aslam", src: "/audio/barish/02-rafta-rafta.mp3" },
      { title: "Tere Liye", artist: "Atif Aslam & Shreya Ghoshal", src: "/audio/barish/03-tere-liye.mp3" },
    ],
  },
  {
    id: "light",
    emoji: "🕯️",
    name: "लाइट चली गई",
    latin: "Light Chali Gai",
    tagline: "Candle jalao, sab chup-chaap… sirf shehar ki awaaz",
    accent: "#ffc861",
    palette: ["#0a0906", "#241a0e", "#3a2a12"],
    particle: "dust",
    layers: [
      { id: "murmur", label: "Dabi awaazein", hint: "padosi ki baatein", volume: 0.5 },
      { id: "hum", label: "Sannata", hint: "gehari goonj", volume: 0.35 },
      { id: "traffic", label: "Dur ki sarak", hint: "bahar ka shehar", volume: 0.3 },
      { id: "radio", label: "Transistor", hint: "battery wala radio", volume: 0.25 },
      { id: "birds", label: "Titaliyan", hint: "chhat pe", volume: 0.12 },
    ],
    tracks: [
      { title: "Jaadu Teri Nazar", artist: "Udit Narayan", src: "/audio/saloon/02-jaadu-teri-nazar.mp3" },
      { title: "Kabhi Jo Baadal Barse", artist: "Arijit Singh", src: "/audio/barish/01-kabhi-jo-baadal-barse.mp3" },
    ],
  },
  {
    id: "barati",
    emoji: "🥁",
    name: "बिन बुलाये बाराती",
    latin: "Bin Bulaye Barati",
    tagline: "Horn, dhol aur poori gali jag gayi",
    accent: "#ff6fae",
    palette: ["#1b0714", "#3a0f2c", "#5c1938"],
    particle: "dust",
    photo: "/vibes/barati/bg.jpg",
    layers: [
      { id: "horn", label: "Horn", hint: "koi rasta do!", volume: 0.55 },
      { id: "murmur", label: "Bheed", hint: "log, bacche, shor", volume: 0.5 },
      { id: "clinks", label: "Ghungroo", hint: "thoda-sa chhanak", volume: 0.35 },
      { id: "traffic", label: "Gaadiyan", hint: "gali me jam", volume: 0.3 },
      { id: "buzz", label: "Generator", hint: "bina rukey buzz", volume: 0.2 },
    ],
    tracks: [
      { title: "Chunnari Chunnari", artist: "Abhijeet & Anuradha Sriram", src: "/audio/barati/01-chunnari-chunnari.mp3" },
      { title: "Gallan Goodiyaan", artist: "Farhan Akhtar & ensemble", src: "/audio/barati/02-gallan-goodiyaan.mp3" },
      { title: "Oh Ho Ho Ho (Remix)", artist: "Zack Knight & Jasmin Walia", src: "/audio/barati/03-oh-ho-ho-ho-remix.mp3" },
    ],
  },
  {
    id: "chai",
    emoji: "☕",
    name: "चाय की टपरी",
    latin: "Chai Ki Tapri",
    tagline: "Kadak chai, biscuit aur siyasat",
    accent: "#ffb26b",
    palette: ["#150f08", "#31200f", "#4a3016"],
    particle: "dust",
    photo: "/vibes/chai/bg.jpg",
    layers: [
      { id: "clinks", label: "Katori & chammach", hint: "chai ke toast", volume: 0.5 },
      { id: "murmur", label: "Tapri baatein", hint: "ghar, cricket, neta ji", volume: 0.45 },
      { id: "traffic", label: "Sadak", hint: "paas ki bheed", volume: 0.35 },
      { id: "hum", label: "Stove", hint: "dheemi aanch", volume: 0.25 },
      { id: "birds", label: "Kabootar", hint: "chaari pe", volume: 0.15 },
    ],
    tracks: [
      { title: "Jaadu Teri Nazar", artist: "Udit Narayan", src: "/audio/chai/01-jaadu-teri-nazar.mp3" },
    ],
  },
  {
    id: "diwali",
    emoji: "🧹",
    name: "दिवाली की सफाई",
    latin: "Diwali Ki Safai",
    tagline: "Jhaadu, kone, purani tasveerein",
    accent: "#ffd76b",
    palette: ["#1a0f04", "#3a2410", "#5c3a15"],
    particle: "dust",
    layers: [
      { id: "murmur", label: "Ghar ki baatein", hint: "kaun kya karega", volume: 0.45 },
      { id: "birds", label: "Chidiya", hint: "aangan me", volume: 0.4 },
      { id: "snips", label: "Jhaadu", hint: "kya-broom, kya-broom", volume: 0.35 },
      { id: "clinks", label: "Taash ke patte", hint: "gerha, chhota", volume: 0.3 },
      { id: "traffic", label: "Bahar", hint: "colony ki awaaz", volume: 0.2 },
    ],
    tracks: [
      { title: "Gallan Goodiyaan", artist: "Farhan Akhtar & ensemble", src: "/audio/barati/02-gallan-goodiyaan.mp3" },
      { title: "Chunnari Chunnari", artist: "Abhijeet & Anuradha Sriram", src: "/audio/barati/01-chunnari-chunnari.mp3" },
    ],
  },
  {
    id: "bus",
    emoji: "🚌",
    name: "बस वाले भैया",
    latin: "Bus Wale Bhaiya",
    tagline: "Window seat, evening light, conductor ki seeti",
    accent: "#f2b06b",
    palette: ["#141018", "#2a1c14", "#3f2a17"],
    particle: "dust",
    photo: "/vibes/bus/bg.jpg",
    layers: [
      { id: "hum", label: "Engine", hint: "dheemi dhadkan", volume: 0.6 },
      { id: "traffic", label: "Sarak", hint: "bahar ki bheed", volume: 0.45 },
      { id: "horn", label: "Horn", hint: "door se…", volume: 0.5 },
      { id: "radio", label: "Driver ka radio", hint: "loud gaana", volume: 0.5 },
      { id: "murmur", label: "Sawariyan", hint: "logon ki pink noise", volume: 0.3 },
    ],
    tracks: [
      { title: "Rafta Rafta", artist: "Atif Aslam", src: "/audio/barish/02-rafta-rafta.mp3" },
      { title: "Tere Liye", artist: "Atif Aslam & Shreya Ghoshal", src: "/audio/barish/03-tere-liye.mp3" },
    ],
  },
  {
    id: "bartan",
    emoji: "🍽️",
    name: "बर्तन बैडी",
    latin: "Bartan Baddie",
    tagline: "Thaala, saabun, aur ek gaana jo pasand hai",
    accent: "#7fe0d0",
    palette: ["#071614", "#0f2c28", "#164740"],
    particle: "dust",
    photo: "/vibes/bartan/bg.jpg",
    layers: [
      { id: "clinks", label: "Bartan", hint: "khankh-hankh", volume: 0.6 },
      { id: "murmur", label: "Mummy ki daant", hint: "halki-sarki", volume: 0.4 },
      { id: "radio", label: "Gaana", hint: "loudspeaker", volume: 0.35 },
      { id: "hum", label: "Paani", hint: "tap ka hum", volume: 0.3 },
    ],
    tracks: [
      { title: "Maahi", artist: "From Raaz - The Mystery Continues", src: "/audio/bartan/01-maahi.mp3" },
      { title: "O Mere Khuda", artist: "Atif Aslam & Garima Jhingon", src: "/audio/bartan/02-o-mere-khuda.mp3" },
    ],
  },
  {
    id: "qawali",
    emoji: "🎤",
    name: "क़व्वाली",
    latin: "Qawali",
    tagline: "Dham-dham, haath ki taali aur choomaq",
    accent: "#e0a3ff",
    palette: ["#120718", "#2a1030", "#42184a"],
    particle: "dust",
    photo: "/vibes/qawali/bg.jpg",
    layers: [
      { id: "radio", label: "Harmonium", hint: "khich ke sur", volume: 0.6 },
      { id: "murmur", label: "Mehfil", hint: "wah-wah", volume: 0.5 },
      { id: "clinks", label: "Taali", hint: "dham-dham", volume: 0.35 },
      { id: "hum", label: "Dholak", hint: "gehari thap", volume: 0.3 },
    ],
    tracks: [
      { title: "Dekhte Dekhte", artist: "Atif Aslam", src: "/audio/qawali/01-dekhte-dekhte.mp3" },
    ],
  },
];

export const FALLBACK_TRACKS: LocalTrack[] = VIBES[0].tracks ?? [];

export function getVibe(id: string): Vibe {
  return VIBES.find((vibe) => vibe.id === id) ?? VIBES[0];
}
