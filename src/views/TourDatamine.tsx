import { Card } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import CourseIcon from "../components/CourseIcon";
import { MissingTrack } from "../utils/fetchData";
import { Course, Game } from "../utils/types";
import { courseFromCodeName, formatPlatform } from "../utils/utils";

const TourDatamine = ({
  missingTracks,
  courseData,
}: {
  missingTracks: MissingTrack[];
  courseData: {
    [platform: string]: Game;
  };
}) => {
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
        let possibleCourses: Course[] = [];
        let beforeCourse: any;
        if (courseGap.before) {
          beforeCourse = courseFromCodeName(
            courseGap.before.name,
            courseGap.before.platform,
            courseGap.before.class === "Battle"
          );
        }
        let afterCourse: any;
        if (courseGap.after) {
          afterCourse = courseFromCodeName(
            courseGap.after.name,
            courseGap.after.platform,
            courseGap.after.class === "Battle"
          );
        }
        // if (!afterCourse) {
        //   console.log(courseGap.after, "not found");
        // }
        // if (!beforeCourse) {
        //   console.log(courseGap.before, "not found");
        // }
        let games = [];
        // if both are new, classic, etc
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
        );
      })}
    </div>
  );
};

export default TourDatamine;
