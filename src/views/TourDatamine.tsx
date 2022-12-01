import { Card } from "@mui/material";
import CourseIcon from "../components/CourseIcon";
import course_data_nonlocal_images from "../data/course_data_nonlocal_images.json";
import { MissingTrack } from "../utils/fetchData";
import { useState, useMemo, useEffect } from "react";
import { formatPlatform } from "../utils/utils";
import { Course, Game } from "../utils/types";

const courseData = course_data_nonlocal_images as unknown as {
  [platform: string]: Game;
};

const TourDatamine = ({ missingTracks }: { missingTracks: MissingTrack[] }) => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobile = useMemo(() => width <= 768, [width]);

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        backgroundImage: "linear-gradient(180deg,#e60012 0,#ca0000 100%)",
        minHeight: "100vh",
        flex: 1,
      }}
    >
      {missingTracks.map((courseGap: MissingTrack) => {
        console.log(courseGap);
        let possibleCourses: Course[] = [];
        let beforeCourse: any;
        if (courseGap.before) {
          if (courseGap.battle) {
            beforeCourse = (courseData[
              formatPlatform(courseGap.before.platform)
            ].battleCourses ?? {})[courseGap.before.name];
          } else {
            let courses =
              courseData[formatPlatform(courseGap.before.platform)].courses;
            if (courses) {
              beforeCourse = courses[courseGap.before.name];
              if (!beforeCourse) {
                beforeCourse = Object.values(
                  courseData[formatPlatform(courseGap.before.platform)]
                    .courses ?? {}
                )?.find((course) =>
                  course.otherNames?.includes(courseGap.before?.name ?? "")
                );
                beforeCourse.altName = courseGap.before.name;
              }
            }
          }
        }
        let afterCourse: any;
        if (courseGap.after) {
          if (courseGap.after.class === "Battle") {
            afterCourse = (courseData[formatPlatform(courseGap.after.platform)]
              .battleCourses ?? {})[courseGap.after.name];
          } else {
            let courses =
              courseData[formatPlatform(courseGap.after.platform)].courses;
            if (courses) {
              afterCourse = courses[courseGap.after.name];
              if (!afterCourse) {
                afterCourse = Object.values(
                  courseData[formatPlatform(courseGap.after.platform)]
                    .courses ?? {}
                )?.find((course) =>
                  course.otherNames?.includes(courseGap.after?.name ?? "")
                );
                afterCourse.altName = courseGap.after.name;
              }
            }
          }
        }

        let games = [];
        if (courseGap.after?.class === courseGap.before?.class) {
          games = Object.values(courseData)
            .map((game) => game.tourPrefix)
            .filter(
              (game) =>
                (!beforeCourse ||
                  game.localeCompare(beforeCourse.tourPlatform) <= 0) &&
                (!afterCourse ||
                  game.localeCompare(afterCourse.tourPlatform) >= 0)
            )
            .sort((a, b) => a.localeCompare(b));
        } else {
          if (
            courseGap.after?.class === "Classic" ||
            courseGap.after?.class === "Battle"
          ) {
            games.push(
              ...Object.values(courseData)
                .map((game) => game.tourPrefix)
                .filter(
                  (game) =>
                    game.localeCompare(courseGap.after?.platform ?? "") >= 0
                )
                .sort((a, b) => a.localeCompare(b))
            );
          } else if (courseGap.after?.class === "New") {
            games.push("mob");
          }
          if (
            courseGap.before?.class === "Classic" ||
            courseGap.before?.class === "Battle"
          ) {
            games.push(
              ...Object.values(courseData)
                .map((game) => game.tourPrefix)
                .filter(
                  (game) =>
                    game.localeCompare(courseGap.before?.platform ?? "") <= 0
                )
                .sort((a, b) => a.localeCompare(b))
            );
          } else if (courseGap.before?.class === "New") {
            games.push("mob");
          }
        }

        games.forEach((game) => {
          let potentialCourses =
            (courseGap.battle
              ? courseData[formatPlatform(game)].battleCourses
              : courseData[formatPlatform(game)].courses) ?? {};
          if (courseGap.battle) {
            console.log(courseGap);
          }
          let coursesToAdd = Object.values(potentialCourses)
            .sort((a, b) => a.tourName.localeCompare(b.tourName))
            .map((course) => {
              if (!course.inTour) {
                let fittingName = [
                  course.tourName,
                  ...(course.otherNames ? course.otherNames : []),
                ].find(
                  (courseName) =>
                    (!beforeCourse ||
                      game !== beforeCourse.tourPlatform ||
                      courseName
                        .toUpperCase()
                        .localeCompare(beforeCourse.tourName.toUpperCase()) <
                        0) &&
                    (!afterCourse ||
                      game !== afterCourse.tourPlatform ||
                      courseName
                        .toUpperCase()
                        .localeCompare(afterCourse.tourName.toUpperCase()) > 0)
                );
                if (fittingName) {
                  return {
                    ...course,
                    altName:
                      fittingName === course.tourName ? undefined : fittingName,
                  };
                }
              }
              return undefined;
            });
          let definedCoursesToAdd = coursesToAdd.filter(
            (course) => !!course
          ) as Course[];
          definedCoursesToAdd.sort((a, b) =>
            (a.altName ?? a.tourName).localeCompare(b.altName ?? b.tourName)
          );
          possibleCourses.push(...definedCoursesToAdd);
        });

        return (
          possibleCourses.length > 0 && (
            <Card
              key={courseGap.after?.name + "-" + courseGap.before?.name}
              style={{
                margin: 20,
                marginTop: 0,
                padding: isMobile ? "5px 5px" : "10px 0px",
                width: "100%",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundImage:
                  "url(https://mariokart8.nintendo.com/assets/img/bgs/tires.jpg)",
              }}
            >
              {isMobile && (
                <h3 style={{ marginTop: 10, marginBottom: 0 }}>{`Gap Size: ${
                  courseGap.gap ?? "???"
                }`}</h3>
              )}
              <div
                style={{
                  height: "100%",
                  width: isMobile ? "100%" : 190,
                  maxWidth: "calc(100% - 80px)",
                  display: "flex",
                  alignItems: "flex-start",
                  flexDirection: isMobile ? "row" : "column",
                  padding: isMobile ? "5px 15px 15px 15px" : 15,
                }}
              >
                {!isMobile && (
                  <h3 style={{ marginTop: 0, marginBottom: 5 }}>{`Gap Size: ${
                    courseGap.gap ?? "???"
                  }`}</h3>
                )}
                {courseGap.after && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: isMobile ? "center" : "space-between",
                      alignItems: isMobile ? "center" : "flex-start",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        marginBottom: 0,
                        fontWeight: "bold",
                      }}
                    >
                      After:
                    </p>
                    <CourseIcon
                      course={afterCourse}
                      height={70}
                      showIndicators={false}
                    />
                  </div>
                )}
                {courseGap.before && (
                  <div
                    style={{
                      width: "100%",
                      display: "flex",
                      flexDirection: isMobile ? "column" : "row",
                      justifyContent: isMobile ? "center" : "space-between",
                      alignItems: isMobile ? "center" : "flex-start",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 12,
                        marginBottom: 0,
                        fontWeight: "bold",
                      }}
                    >
                      Before:
                    </p>
                    <CourseIcon
                      course={
                        beforeCourse ?? {
                          displayName: courseGap.before.name,
                          displayPlatform: formatPlatform(
                            courseGap.before.platform
                          ),
                        }
                      }
                      height={70}
                      showIndicators={false}
                      battle={courseGap.battle}
                    />
                  </div>
                )}
              </div>
              <div style={{ flex: 1, height: "100%" }}>
                <h3
                  style={{
                    marginTop: 0,
                    marginBottom: isMobile ? 15 : 5,
                    marginLeft: 5,
                    width: isMobile ? "auto" : "fit-content",
                  }}
                >{`Possible Courses:`}</h3>
                <div
                  style={{
                    flexWrap: "wrap",
                    display: "flex",
                    flex: 1,
                    margin: 5,
                    justifyContent: isMobile ? "center" : "flex-start",
                  }}
                >
                  {possibleCourses.map((pCourse) => {
                    return (
                      <CourseIcon
                        course={pCourse}
                        height={104}
                        key={`${afterCourse?.tourName}-${pCourse.tourName}-${beforeCourse?.tourName}`}
                        battle={courseGap.battle}
                      />
                    );
                  })}
                </div>
              </div>
            </Card>
          )
        );
      })}
    </div>
  );
};

export default TourDatamine;
