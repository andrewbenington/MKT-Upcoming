import { Box, Card, Modal } from "@mui/material";
import { useState } from "react";
import existingAssets from "../consts/existingAssets";
import course_data_nonlocal_images from "../data/course_data_nonlocal_images.json";
import { Course, Game } from "../utils/types";
import EightDXIcon from "./EightDXIcon";
import TourIcon from "./TourIcon";

interface CourseIconProps {
  course: Course;
  height: number;
  showIndicators?: boolean;
  battle?: boolean;
}

const courseData = course_data_nonlocal_images as unknown as {
  [platform: string]: Game;
};

const CourseIcon = ({
  course,
  height,
  showIndicators = true,
}: // battle = false,
CourseIconProps) => {
  let [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Card
        // onClick={() => {
        //   setIsModalOpen(true);
        //   console.log("card click");
        // }}
        style={{
          position: "relative",
          margin: 5,
          borderRadius: (height / 104) * 8,
          backgroundImage: `url(${course?.image})`,
          backgroundPosition: "bottom",
          backgroundSize: "cover",
          imageRendering: "crisp-edges",
          height,
          width: (height / 104) * 151,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          // cursor: "pointer",
        }}
      >
        <div
          style={{
            height: (height / 104) * 14,
            position: "relative",
            width: "fit-content",
          }}
        >
          <div
            style={{
              height: (height / 104) * 14,
              position: "absolute",
              top: 0,
              left: -1,
            }}
          >
            <svg
              width={(height / 104) * 45}
              height={(height / 104) * 14}
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              display="block"
            >
              <polygon
                points={`0 0 0 ${(height / 104) * 14} ${(height / 104) * 45} ${
                  (height / 104) * 14
                } ${(height / 104) * 35} 0`}
                fill="#f3f3f3"
                stroke-width="5"
              />
            </svg>
          </div>
          <p
            style={{
              fontFamily: "'Verdana', sans-serif",
              fontSize: (height / 104) * 10,
              textShadow: ".5px .5px #3333",
              margin: 0,
              position: "absolute",
              top: (height / 104) * 2,
              width: (height / 104) * 35,
              textAlign: "center",
            }}
          >
            {course?.displayPlatform ?? "???"}
          </p>
        </div>
        <div
          style={{
            backgroundColor: "#f3f3f3",
            padding: "3px 5px",
          }}
        >
          <p
            style={{
              fontFamily: "'Verdana', sans-serif",
              fontSize: (height / 104) * 13,
              textShadow: ".5px .5px #3333",
              fontWeight:
                course &&
                existingAssets.includes(
                  course.displayPlatform + course.tourName
                )
                  ? "bold"
                  : "normal",
              margin: 0,
            }}
          >
            {course?.displayName ?? "???"}
          </p>
        </div>
        {course?.in8DX && showIndicators && (
          <div
            style={{
              position: "absolute",
              left: (height / 104) * 6,
              top: (height / 104) * 6,
            }}
          >
            <EightDXIcon height={(height / 104) * 18} />
          </div>
        )}
        {course?.inTour && showIndicators && (
          <div
            style={{
              position: "absolute",
              right: (height / 104) * 6,
              top: (height / 104) * 6,
            }}
          >
            <TourIcon height={(height / 104) * 18} />
          </div>
        )}
      </Card>
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        sx={{ height: "fit-content", width: "fit-content", margin: "auto" }}
      >
        <Box
          sx={{
            width: 400,
            padding: "20px",
            borderRadius: "8px",
            backgroundImage:
              "url(https://mariokart8.nintendo.com/assets/img/bgs/tires.jpg)",
          }}
        >
          <h3>{course.displayName}</h3>
          <img src={course?.image} alt={course?.displayName}/>
          <h4>Original Game</h4>
          <p>{`${courseData[course.displayPlatform].gameName} (${
            courseData[course.displayPlatform].year
          })`}</p>
        </Box>
      </Modal>
    </>
  );
};

export default CourseIcon;
