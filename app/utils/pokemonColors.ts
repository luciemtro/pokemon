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

export const typeColors: { [key: string]: [string, string, string] } = {
  Colorless: ["#BEBEBE", "#F5F5F5", "#D4D4D4"], // Gris clair → Blanc éclatant → Argenté
  Darkness: ["#2B0F0F", "#8B0000", "#4C1C1C"], // Marron foncé → Rouge sang → Rouge brunâtre
  Dragon: ["#3A007A", "#FFB400", "#5A2D91"], // Violet profond → Jaune vif → Mauve
  Fairy: ["#D40078", "#FF1493", "#FFC0CB"], // Rose foncé → Rose fluo → Rose clair
  Fighting: ["#C53000", "#FF4500", "#FF8C00"], // Rouge brûlé → Orange intense → Orange clair
  Fire: ["#B22222", "#FF0000", "#FFA07A"], // Rouge foncé → Rouge vif → Rouge orangé clair
  Grass: ["#008000", "#00FF00", "#32CD32"], // Vert foncé → Vert néon → Vert clair
  Lightning: ["#CCCC00", "#FFFF00", "#FFD700"], // Jaune foncé → Jaune éclatant → Doré
  Metal: ["#808080", "#C0C0C0", "#DCDCDC"], // Gris acier → Argenté → Gris clair
  Psychic: ["#6A0DAD", "#FF00FF", "#DA70D6"], // Violet foncé → Magenta fluo → Violet doux
  Water: ["#0047AB", "#0080FF", "#ADD8E6"], // Bleu roi → Bleu intense → Bleu clair
};
