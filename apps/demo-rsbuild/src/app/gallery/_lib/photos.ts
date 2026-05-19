export interface Photo {
  id: string;
  title: string;
  hue: number;
  caption: string;
}

export const PHOTOS: Photo[] = [
  { id: "1", title: "Coral reef", hue: 12, caption: "Warm pinks and oranges." },
  { id: "2", title: "Citrus grove", hue: 70, caption: "Sun on yellow leaves." },
  {
    id: "3",
    title: "Moss forest",
    hue: 140,
    caption: "Damp green underbrush.",
  },
  { id: "4", title: "Glacier", hue: 200, caption: "Blue ice in deep shadow." },
  { id: "5", title: "Twilight", hue: 270, caption: "Violet sky, last light." },
  {
    id: "6",
    title: "Sunset cliff",
    hue: 330,
    caption: "Red rock against the sea.",
  },
];

export function getPhoto(id: string): Photo | null {
  return PHOTOS.find((p) => p.id === id) ?? null;
}
