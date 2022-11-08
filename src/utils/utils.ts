export const realCourseName = (platform: string, name: string) => {
  const aliases: { [index: string]: string } = {
    "DS Killer Ship": "Airship Fortress",
    "N64 Mario Circuit": "Mario Raceway",
    "N64 Luigi Circuit": "Luigi Raceway",
    "N64 Peach Circuit": "Royal Raceway",
    "GBA Cheep Cheep Island": "Cheep-Cheep Island",
  };
  if (platform + " " + name in aliases) {
    return aliases[platform + " " + name];
  } else return name;
};

const replacements: { [index: string]: string } = {
  agb: "GBA",
  gc: "GCN",
  sfc: "SNES",
  mob: "Tour",
  wii: "Wii",
  u: "Wii U"
};

export const formatPlatform = (platform: string) => {
  return platform in replacements
    ? replacements[platform]
    : platform.toUpperCase();
};