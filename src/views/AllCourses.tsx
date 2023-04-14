import { useEffect, useState } from "react";
import CardContainer from "../components/CardContainer";
import CourseIcon from "../components/CourseIcon";
import { Game } from "../utils/types";
import { viewContainerStyle } from "./styles";

const AllCourses = ({
  courseData,
}: {
  courseData: {
    [platform: string]: Game;
  };
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  function handleWindowSizeChange() {
    setIsMobile(window.innerWidth <= 768);
  }

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return (
    <div className="App" style={viewContainerStyle}>
      {Object.entries(courseData).map(([platform, game]: [string, Game]) => {
        return (
          <CardContainer
            key={game.gameName}
            isMobile={isMobile}
            style={{ flexDirection: "column" }}
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
          </CardContainer>
        );
      })}
    </div>
  );
};

export default AllCourses;
