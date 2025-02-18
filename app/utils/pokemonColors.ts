export const pokemonTypes = [
  "Colorless",
  "Darkness",
  "Dragon",
  "Fairy",
  "Fighting",
  "Fire",
  "Grass",
  "Lightning",
  "Metal",
  "Psychic",
  "Water",
];

export const typeColors: { [key: string]: [string, string] } = {
  Colorless: ["#D4D4D4", "#F5F5F5"], // Argenté
  Darkness: ["#3B1F1F", "#8B0000"], // Rouge sombre
  Dragon: ["#5400A8", "#FFB400"], // Violet électrique → Jaune
  Fairy: ["#FF1493", "#FFD700"], // Rose néon → Or
  Fighting: ["#FF4500", "#FF0000"], // Orange intense → Rouge
  Fire: ["#FF0000", "#FFA500"], // Rouge vif → Orange
  Grass: ["#00FF00", "#228B22"], // Vert néon → Vert foncé
  Lightning: ["#FFFF00", "#FFD700"], // Jaune éclatant → Doré
  Metal: ["#C0C0C0", "#808080"], // Métallisé → Gris acier
  Psychic: ["#FF00FF", "#8A2BE2"], // Magenta fluo → Violet profond
  Water: ["#0080FF", "#00FFFF"], // Bleu intense → Cyan
};
