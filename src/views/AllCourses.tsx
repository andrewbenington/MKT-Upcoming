import { Card } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import CourseIcon from "../components/CourseIcon";
import course_data_nonlocal_images from "../data/course_data_nonlocal_images.json";
import { Game } from "../utils/types";

const courseData = course_data_nonlocal_images as unknown as {
  [platform: string]: Game;
};

const AllCourses = () => {
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
      }}
    >
      {Object.entries(courseData).map(([platform, game]: [string, Game]) => {
        return (
          <Card
            style={{
              margin: 20,
              marginTop: 0,
              padding: isMobile ? "5px 5px" : "10px 0px",
              width: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              backgroundImage: "url(https://mariokart8.nintendo.com/assets/img/bgs/tires.jpg)",
            }}
          >
            <h3 style={{ marginTop: 0, marginBottom: 5 }}>{game.gameName}</h3>

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
                .map((course) => {
                  return <CourseIcon course={course} height={104} />;
                })}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default AllCourses;
