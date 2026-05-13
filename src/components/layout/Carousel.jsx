import { Box, Typography, Button } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/autoplay";
import "swiper/css/pagination"; // ✅ ADD THIS

import { Autoplay } from "swiper/modules";

const slides = [
  {
    title: "Manage Fees Seamlessly",
    subtitle: "Track, Pay and Manage all college fees in one place",
  },
  {
    title: "Secure Online Payments",
    subtitle: "Fast, reliable and secure transactions",
  },
  {
    title: "Real-time Reports",
    subtitle: "Powerful analytics for institutions",
  },
];

const Carousel = () => {
  return (
    <Box
      sx={{
        width: "100%",
        overflow: "hidden",
      }}
    >
      <Swiper
        modules={[Autoplay]}
        autoplay={{ delay: 3000 }}
        loop={true}
        slidesPerView={1}   // ✅ IMPORTANT FIX
        style={{
          width: "100%",
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <Box
              sx={{
                width: "100%",
                height: "70vh",

                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",

                textAlign: "center",
                px: 2,

                background: "linear-gradient(45deg, #3949ab, #1e88e5)",
                color: "#fff",

                overflow: "hidden", // ✅ HARD FIX
              }}
            >
              <Typography
                variant="h3"
                sx={{
                  fontWeight: "bold",
                  maxWidth: "90%",
                }}
              >
                {slide.title}
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  mt: 2,
                  maxWidth: "80%",
                }}
              >
                {slide.subtitle}
              </Typography>

              <Button
                variant="contained"
                sx={{
                  mt: 4,
                  background: "#ffca28",
                  color: "#000",
                  fontWeight: "bold",
                  "&:hover": { background: "#ffc107" },
                }}
              >
                Get Started
              </Button>
            </Box>
          </SwiperSlide>
        ))}
      </Swiper>
    </Box>
  );
};

export default Carousel;