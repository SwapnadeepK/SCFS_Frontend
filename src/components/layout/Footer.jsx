import {
  Box,
  Typography,
  IconButton,
  Divider,
  Link,
  List,
  ListItem,
} from "@mui/material";

import Grid from "@mui/material/Grid";

import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import LanguageIcon from "@mui/icons-material/Language";

const Footer = () => {
  return (
    <Box
  component="footer"
  sx={{
    background: "#1a237e",
    color: "#fff",
    px: { xs: 3, md: 8 },
    py: 5,

    // ✅ FIX: align with sidebar
  }}
>
      <Grid
  container
  spacing={4}
  sx={{
    mt: 0,
    width: "100%", // ✅ FULL WIDTH
  }}
>
        {/* LEFT SECTION */}
        <Grid item xs={12} md={4}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box
              component="img"
              src="/vtu-logo.png"
              alt="VTU Logo"
              sx={{ width: 60 }}
            />
            <Typography variant="h6">VTU Belagavi</Typography>
          </Box>

          <Typography variant="body2" sx={{ mt: 2 }}>
            Visvesvaraya Technological University (VTU), Belagavi —
            empowering education with smart digital solutions.
          </Typography>
        </Grid>

        {/* QUICK LINKS */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Quick Links
          </Typography>

          {/* ✅ FIX: use List instead of Box li */}
          <List dense sx={{ p: 0 }}>
            <ListItem sx={{ px: 0 }}>
              <Link
                href="https://vtu.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                underline="hover"
              >
                VTU Official Website
              </Link>
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <Link
                href="https://results.vtu.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                underline="hover"
              >
                VTU Results Portal
              </Link>
            </ListItem>

            <ListItem sx={{ px: 0 }}>
              <Link
                href="https://vtu.ac.in/en/contact-us/"
                target="_blank"
                rel="noopener noreferrer"
                color="inherit"
                underline="hover"
              >
                Contact VTU
              </Link>
            </ListItem>
          </List>
        </Grid>

        {/* CONNECT */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Connect With Us
          </Typography>

          <Box display="flex" gap={1} mb={2}>
            <IconButton color="inherit">
              <FacebookIcon />
            </IconButton>
            <IconButton color="inherit">
              <TwitterIcon />
            </IconButton>
            <IconButton color="inherit">
              <LinkedInIcon />
            </IconButton>
            <IconButton color="inherit">
              <LanguageIcon />
            </IconButton>
          </Box>

          <Typography variant="body2">
            Email: support@vtu-fees.com
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", my: 3 }} />

      <Typography align="center" variant="body2">
        © 2026 VTU Smart College Fees Management System
      </Typography>
    </Box>
  );
};

export default Footer;