import { Card } from "@mui/material";
import { Course } from "../utils/types";
import EightDXIcon from "./EightDXIcon";
import TourIcon from "./TourIcon";
import existingAssets from "../consts/existingAssets";

interface CourseIconProps {
  course: Course;
  height: number;
  showIndicators?: boolean;
  showDataminedAssets?: boolean;
}

const CourseIcon = ({
  course,
  height,
  showIndicators = true,
  showDataminedAssets = true,
}: CourseIconProps) => {
  return (
    <Card
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
            fontWeight: course && existingAssets.includes(
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
  );
};

export default CourseIcon;
