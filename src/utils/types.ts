export interface Game {
  gameName: string;
  gameNumber: number;
  tourPrefix: string;
  displayPrefix: string;
  courses: { [index: string]: Course };
}

export interface Course {
  tourName: string;
  tourPlatform: string;
  displayName: string;
  displayPlatform: string;
  inTour: boolean;
  in8DX?: boolean;
  image: string;
  hypothetical?: boolean;
}
