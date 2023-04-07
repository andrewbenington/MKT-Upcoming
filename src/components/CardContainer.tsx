import { Card } from "@mui/material";

interface CardContainerProps {
  key: string;
  children: any;
  isMobile: boolean;
  style?: any 
}

const CardContainer = (props: CardContainerProps) => {
  const { children, isMobile, key, style = {} } = props;
  return (
    <Card
      key={key}
      style={{
        margin: 20,
        marginTop: 0,
        padding: isMobile ? "5px 5px" : "10px 0px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage:
          "url(https://mariokart8.nintendo.com/assets/img/bgs/tires.jpg)",
          ...style
      }}
    >
      {children}
    </Card>
  );
};

export default CardContainer;
