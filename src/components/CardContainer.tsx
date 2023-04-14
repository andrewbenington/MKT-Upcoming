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
        marginBottom: 10,
        padding: isMobile ? "5px 5px" : "10px 10px",
        width: isMobile ? "calc(100% - 10px)" : "calc(100% - 20px)",
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
