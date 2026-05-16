export type Album = {
  id: string;
  title: string;
  blurb: string;
  photos: { id: string; title: string; color: string }[];
};

export const ALBUMS: Album[] = [
  {
    id: "alpine",
    title: "Alpine",
    blurb: "High-altitude landscapes from a summer ridge hike.",
    photos: [
      { id: "1", title: "Granite peaks", color: "#7c8aa3" },
      { id: "2", title: "Ridge mist", color: "#5e7287" },
      { id: "3", title: "Glacier lake", color: "#3f6f8a" },
      { id: "4", title: "Pine corridor", color: "#3a5a40" },
    ],
  },
  {
    id: "desert",
    title: "Desert",
    blurb: "Slot canyons and red-rock weathering across two seasons.",
    photos: [
      { id: "1", title: "Desert dawn", color: "#c08756" },
      { id: "2", title: "Crimson canyon", color: "#a4413a" },
      { id: "3", title: "Sage flats", color: "#8a8055" },
      { id: "4", title: "Dune ripples", color: "#d4a574" },
    ],
  },
];

export function findAlbum(id: string): Album | undefined {
  return ALBUMS.find((a) => a.id === id);
}
