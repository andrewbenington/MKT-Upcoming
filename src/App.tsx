import MenuIcon from "@mui/icons-material/Menu";
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import ReactGA from "react-ga4";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import EightDXIcon from "./components/EightDXIcon";
import TourIcon from "./components/TourIcon";
import course_data_nonlocal_images from "./data/course_data_nonlocal_images.json";
import { MissingTrack, fetchData } from "./utils/fetchData";
import { Game } from "./utils/types";
import { courseFromCodeName, formatPlatform } from "./utils/utils";
import AllCourses from "./views/AllCourses";
import Credits from "./views/Credits";
import TourDatamine from "./views/TourDatamine";
const drawerWidth = 240;

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const page = useLocation();
  const navigate = useNavigate();
  const [courseData, setCourseData] = useState(
    course_data_nonlocal_images as unknown as {
      [platform: string]: Game;
    }
  );
  const [missingTracks, setMissingTracks] = useState<MissingTrack[]>([]);
  const isMobile = useMemo(() => width <= 768, [width]);
  const pageTitles: { [key: string]: string } = {
    "/tour-datamine": "Tour Datamine",
    "/all-courses": "All Courses",
    "/credits": "Credits",
  };

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  const getCourses = async () => {
    // let storedMissingTracks = localStorage.getItem("missing-tracks");
    const tourCourses = await fetchData();
    if (tourCourses) {
      tourCourses.tracks
        .filter((track) => track && track.class !== "Remix")
        .forEach((track) => {
          const foundCourse = courseFromCodeName(
            track.name,
            track.platform,
            track.class === "Battle"
          );
          const game = courseData[formatPlatform(track.platform)];
          const courses =
            track.class === "Battle" ? game.battleCourses : game.courses;
          if (foundCourse && courses) {
            delete courses[foundCourse.tourName];
            courses[track.name] = {
              ...foundCourse,
              tourName: track.name,
              inTour: true,
            };
            if (track.class === "Battle") {
              courseData[formatPlatform(track.platform)].battleCourses =
                courses;
            } else {
              courseData[formatPlatform(track.platform)].courses = courses;
            }
            setCourseData(courseData);
          }
        });

      setMissingTracks(tourCourses.missingTracks);
      localStorage.setItem(
        "missing-tracks",
        JSON.stringify(tourCourses.missingTracks)
      );
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    getCourses();
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
    // eslint-disable-next-line
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      {isMobile && (
        <AppBar
          position="static"
          style={{ backgroundColor: "white", color: "#ca0000" }}
        >
          <Toolbar style={{minHeight: undefined}}>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => {
                setDrawerOpen(!drawerOpen);
              }}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
              fontStyle={{
                fontFamily: '"Verdana", sans-serif',
                fontWeight: "bold",
              }}
            >
              {pageTitles[page.pathname]}
            </Typography>
          </Toolbar>
        </AppBar>
      )}
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={!isMobile || drawerOpen}
        onClose={() => setDrawerOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            height: "100%",
            boxSizing: "border-box",
          },
        }}
      >
        <List>
          {["/tour-datamine", "/all-courses", "/credits"].map((path) => (
            <ListItem
              key={path}
              disablePadding
              style={{
                backgroundColor: page.pathname === path ? "#ccc" : "#fff",
              }}
            >
              <ListItemButton
                onClick={() => {
                  navigate(path);
                  ReactGA.send({
                    hitType: "pageview",
                    page: page.pathname,
                    title: pageTitles[path],
                  });
                }}
              >
                <ListItemText
                  primary={
                    <p
                      style={{
                        fontWeight: "bold",
                        margin: 0,
                      }}
                    >
                      {pageTitles[path]}
                    </p>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <div style={{ flex: 1 }}></div>
        <List>
          {page.pathname !== "/credits" ? (
            <ListItem disablePadding>
              <p
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  flex: "1 1 30%",
                }}
              >
                Bold
              </p>
              <p style={{ marginRight: 5, flex: "1 1 70%" }}>
                Assets Datamined for Tour
              </p>
            </ListItem>
          ) : (
            <div />
          )}
          <ListItem disablePadding>
            <div
              style={{
                flex: "1 1 30%",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <EightDXIcon height={18} />
            </div>
            <p style={{ marginRight: 10, flex: "1 1 70%" }}>
              In Mario Kart 8 DX (Or Datamined)
            </p>
          </ListItem>
          {page.pathname === "/all-courses" ? (
            <ListItem disablePadding>
              <div
                style={{
                  flex: "1 1 30%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <TourIcon height={18} />
              </div>
              <p style={{ marginRight: 10, flex: "1 1 70%" }}>
                In Mario Kart Tour
              </p>
            </ListItem>
          ) : page.pathname === "/tour-datamine" ? (
            <ListItem disablePadding>
              <p
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                  flex: "1 1 30%",
                  fontSize: 10,
                }}
              >
                (Italics)
              </p>
              <p style={{ marginRight: 5, flex: "1 1 70%" }}>Internal name</p>
            </ListItem>
          ) : (
            <div />
          )}
        </List>
      </Drawer>
      <Routes>
        <Route path="/" element={<Navigate to="/tour-datamine" />} />
        <Route
          path="/tour-datamine"
          element={
            <TourDatamine
              missingTracks={missingTracks}
              courseData={courseData}
            />
          }
        />
        <Route
          path="/all-courses"
          element={<AllCourses courseData={courseData} />}
        />
        <Route path="/credits" element={<Credits />} />
      </Routes>
    </Box>
  );
}

export default App;
