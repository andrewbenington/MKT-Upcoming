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
        let beforeCourse =
          courseData[formatPlatform(courseGap.before.platform)].courses[
            courseGap.before.name
          ];
        let afterCourse =
          courseData[formatPlatform(courseGap.after.platform)].courses[
            courseGap.after.name
          ];
        let possibleCourses: Course[] = [];
        if (beforeCourse.tourPlatform !== "mob") {
          if (beforeCourse.tourPlatform === afterCourse.tourPlatform) {
            Object.values(
              courseData[beforeCourse.displayPlatform].courses
            ).forEach((course) => {
              if (
                course.tourName.localeCompare(beforeCourse.tourName) < 0 &&
                course.tourName.localeCompare(afterCourse.tourName) > 0 &&
                !course.inTour
              ) {
                possibleCourses.push(course);
              }
            });
          } else {
            Object.values(
              courseData[beforeCourse.displayPlatform].courses
            ).forEach((course) => {
              if (
                course.tourName.localeCompare(beforeCourse.tourName) < 0 &&
                !course.inTour
              ) {
                possibleCourses.push(course);
              }
            });
            Object.values(
              courseData[afterCourse.displayPlatform].courses
            ).forEach((course) => {
              if (
                course.tourName.localeCompare(afterCourse.tourName) > 0 &&
                !course.inTour
              ) {
                possibleCourses.push(course);
              }
            });
          }
        } else {
          if (afterCourse.tourName.endsWith("1")) {
            possibleCourses.push({
              tourPlatform: "mob",
              tourName:
                afterCourse.tourName.substring(
                  0,
                  afterCourse.tourName.length - 1
                ) + "2",
              displayPlatform: "Tour",
              displayName: afterCourse.displayName + " 2",
              inTour: false,
              image: afterCourse.image,
            });
            possibleCourses.push({
              tourPlatform: "mob",
              tourName:
                afterCourse.tourName.substring(
                  0,
                  afterCourse.tourName.length - 1
                ) + "3",
              displayPlatform: "Tour",
              displayName: afterCourse.displayName + " 3",
              inTour: false,
              image: afterCourse.image,
            });
          }
          if (afterCourse.tourName.endsWith("2")) {
            possibleCourses.push({
              tourPlatform: "mob",
              tourName:
                afterCourse.tourName.substring(
                  0,
                  afterCourse.tourName.length - 1
                ) + "3",
              displayPlatform: "Tour",
              displayName:
                afterCourse.displayName.substring(
                  0,
                  afterCourse.displayName.length - 1
                ) + "3",
              inTour: false,
              image: afterCourse.image,
            });
          }
        }

        return (
          <Card
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
              <h3
                style={{ marginTop: 10, marginBottom: 0 }}
              >{`Gap Size: ${courseGap.gap}`}</h3>
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
                <h3
                  style={{ marginTop: 0, marginBottom: 5 }}
                >{`Gap Size: ${courseGap.gap}`}</h3>
              )}
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
                  course={beforeCourse}
                  height={70}
                  showIndicators={false}
                />
              </div>
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
                {possibleCourses
                  .sort((a, b) => a.displayName.localeCompare(b.displayName))
                  .map((pCourse) => {
                    return (
                      <CourseIcon
                        course={pCourse}
                        height={104}
                        key={`${afterCourse.tourName}-${pCourse.tourName}-${beforeCourse.tourName}`}
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
