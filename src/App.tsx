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
import "./App.css";
import EightDXIcon from "./components/EightDXIcon";
import TourIcon from "./components/TourIcon";
import { fetchData, MissingTrack } from "./utils/fetchData";
import { formatPlatform } from "./utils/utils";
import AllCourses from "./views/AllCourses";
import TourDatamine from "./views/TourDatamine";
import course_data_nonlocal_images from "./data/course_data_nonlocal_images.json";
import { Game } from "./utils/types";

const courseData = course_data_nonlocal_images as unknown as {
  [platform: string]: Game;
};
const drawerWidth = 240;

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [width, setWidth] = useState<number>(window.innerWidth);
  const [page, setPage] = useState(
    localStorage.getItem("stored-page") ?? "Tour Datamine"
  );
  const [missingTracks, setMissingTracks] = useState<MissingTrack[]>([]);
  const isMobile = useMemo(() => width <= 768, [width]);
  const [inTourMap, setInTourMap] = useState<{
    [platform: string]: string[];
  }>({
    SNES: [],
    N64: [],
    GBA: [],
    GCN: [],
    DS: [],
    Wii: [],
    "3DS": [],
    "Wii U": [],
    Tour: [],
    NSW: [],
  });

  function handleWindowSizeChange() {
    setWidth(window.innerWidth);
  }

  const getCourses = async () => {
    // let storedMissingTracks = localStorage.getItem("missing-tracks");
    const courses = await fetchData();
    if (courses) {
      let coursesToAdd: {
        [platform: string]: string[];
      } = {
        SNES: [],
        N64: [],
        GBA: [],
        GCN: [],
        DS: [],
        Wii: [],
        "3DS": [],
        "Wii U": [],
        Tour: [],
      };
      courses.tracks.forEach((track) => {
        let platform = formatPlatform(track.platform);
        if (platform in courseData) {
          let courses =
            track.class === "Battle"
              ? courseData[platform].battleCourses
              : courseData[platform].courses;
          if (courses) {
            let fullCourse = courses[track.name];
            if (fullCourse) {
              coursesToAdd[fullCourse.displayPlatform].push(
                fullCourse.displayName
              );
            }
          }
        }
      });
      setInTourMap(coursesToAdd);
      setMissingTracks(courses.missingTracks);
      localStorage.setItem(
        "missing-tracks",
        JSON.stringify(courses.missingTracks)
      );
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    getCourses();
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}>
      {isMobile && (
        <AppBar
          position="static"
          style={{ backgroundColor: "white", color: "#ca0000" }}
        >
          <Toolbar>
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
              {page}
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
          {["Tour Datamine", "All Courses"].map((text, index) => (
            <ListItem
              key={text}
              disablePadding
              style={{ backgroundColor: page === text ? "#ccc" : "#fff" }}
            >
              <ListItemButton
                onClick={() => {
                  setPage(text);
                  localStorage.setItem("stored-page", text);
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
                      {text}
                    </p>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
          {/* <ListItem disablePadding>
            <Button
              variant="contained"
              style={{
                backgroundColor: "#ca0000",
                fontFamily: "'Verdana', sans-serif",
                margin: "auto",
                marginTop: 10
              }}
              onClick={getCourses}
            >
              Force Refresh
            </Button>
          </ListItem> */}
        </List>
        <div style={{ flex: 1 }}></div>
        <List>
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
          {page === "All Courses" ? (
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
          ) : (
            <ListItem disablePadding>
              <p
                style={{
                  textAlign: "center",
                  fontStyle: "italic",
                  flex: "1 1 30%",
                  fontSize: 10
                }}
              >
                (Italics)
              </p>
              <p style={{ marginRight: 5, flex: "1 1 70%" }}>
                Japanese name
              </p>
            </ListItem>
          )}
        </List>
      </Drawer>
      {page === "Tour Datamine" ? (
        <TourDatamine missingTracks={missingTracks} />
      ) : (
        <AllCourses inTour={inTourMap} />
      )}
    </Box>
  );
}

export default App;
