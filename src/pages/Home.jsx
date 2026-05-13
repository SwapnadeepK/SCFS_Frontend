import { Box } from "@mui/material";
import Carousel from "../components/layout/Carousel";

const Home = () => {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden", // ✅ HARD STOP SCROLL
      }}
    >
      <Carousel />
    </Box>
  );
};

export default Home;