const TourIcon = ({ height }: { height: number }) => {
  return (
    <div
      style={{
        backgroundColor: "#f3f3f3",
        height,
        width: height,
        borderRadius: (height / 18) * 30,
        backgroundImage: "url(images/tour_logo.png)",
        backgroundPosition: "center",
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        padding: height / 6,
        boxShadow:
          "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)",
      }}
    />
  );
};

export default TourIcon;
