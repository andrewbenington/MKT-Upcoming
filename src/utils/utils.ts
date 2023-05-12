import { levenshteinEditDistance } from 'levenshtein-edit-distance';
import course_data_nonlocal_images from '../data/course_data_nonlocal_images.json';
import { Game } from './types';

const courseData = course_data_nonlocal_images as unknown as {
  [platform: string]: Game;
};

const replacements: { [index: string]: string } = {
  agb: 'GBA',
  gc: 'GCN',
  sfc: 'SNES',
  mob: 'Tour',
  wii: 'Wii',
  u: 'Wii U',
};

export const formatPlatform = (platform: string) => {
  return platform in replacements
    ? replacements[platform]
    : platform.toUpperCase();
};

export const courseFromCodeName = (
  codeName: string,
  platform: string,
  isBattle: boolean
) => {
  const game = courseData[formatPlatform(platform)];
  const courses = isBattle ? game.battleCourses : game.courses;
  let foundCourse;
  if (courses) {
    foundCourse = courses[codeName] ?? courses[`${codeName}s`];
    if (!foundCourse) {
      foundCourse = Object.values(courses).find((course) =>
        [...(course.otherNames ?? []), course.tourName]?.some(
          (name) => levenshteinEditDistance(name, codeName) < 5
        )
      );
      if (foundCourse) {
        foundCourse.altName = codeName;
      }
    }
  }
  return foundCourse;
};
