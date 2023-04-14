import { useEffect, useState } from "react";
import CardContainer from "../components/CardContainer";
import { viewContainerStyle } from "./styles";

const Credits = () => {
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
    <div
      style={{
        ...viewContainerStyle,
        ...(isMobile
          ? { position: "fixed", top: 48, bottom: 0, minHeight: undefined }
          : {}),
      }}
    >
      <CardContainer
        isMobile={isMobile}
        key="credits"
        style={{
          textAlign: "left",
          alignItems: "start",
          flexDirection: "column",
        }}
      >
        <h3>Credits</h3>
        <p>
          Course gaps are calculated from the Asset IDs parsed from{" "}
          <a href="https://api.karttour.net/id">this website</a>, run by Reddit
          user{" "}
          <a href="https://www.reddit.com/user/Koopavocelot">u/Koopavocelot</a>
        </p>
        <p>
          Images are from{" "}
          <a href="https://www.mariowiki.com">the Super Mario wiki</a>
        </p>
      </CardContainer>
    </div>
  );
};

export default Credits;
