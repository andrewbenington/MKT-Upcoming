import { Card } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import CourseIcon from "../components/CourseIcon";
import { Game } from "../utils/types";

const AllCourses = ({
  courseData,
}: {
  courseData: {
    [platform: string]: Game;
  };
}) => {
  const [width, setWidth] = useState<number>(window.innerWidth);
  const isMobile = useMemo(() => width <= 768, [width]);
  // const [modalCourse, setModalCourse] = useState<Course>();

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
      }}
    >
      {Object.entries(courseData).map(([platform, game]: [string, Game]) => {
        return (
          <Card
            key={game.gameName}
            style={{
              margin: 20,
              marginTop: 0,
              padding: isMobile ? "5px 5px" : "10px 0px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage:
                "url(https://mariokart8.nintendo.com/assets/img/bgs/tires.jpg)",
            }}
          >
            <h2 style={{ marginTop: 0, marginBottom: 10 }}>{game.gameName}</h2>
            {game.courses && (
              <>
                <h3 style={{ marginTop: 0, marginBottom: 5 }}>Race Courses</h3>
                <div
                  style={{
                    flexWrap: "wrap",
                    display: "flex",
                    flex: 1,
                    margin: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {Object.values(game.courses)
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .filter((course) => !course.hypothetical)
                    .map((course) => {
                      return (
                        <CourseIcon
                          course={{
                            ...course,
                            inTour: course.inTour,
                          }}
                          height={104}
                          battle
                        />
                      );
                    })}
                </div>
              </>
            )}
            {game.battleCourses && (
              <>
                <h3 style={{ marginTop: 10, marginBottom: 5 }}>
                  Battle Courses
                </h3>
                <div
                  style={{
                    flexWrap: "wrap",
                    display: "flex",
                    flex: 1,
                    margin: 5,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {Object.values(game.battleCourses)
                    .sort((a, b) => a.displayName.localeCompare(b.displayName))
                    .filter((course) => !course.hypothetical)
                    .map((course) => {
                      return (
                        <CourseIcon
                          course={{
                            ...course,
                            inTour: course.inTour,
                          }}
                          height={104}
                          battle
                        />
                      );
                    })}
                </div>
              </>
            )}
          </Card>
        );
      })}
    </div>
  );
};

export default AllCourses;
