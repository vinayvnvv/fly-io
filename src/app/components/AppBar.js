"use client";
import {
  AppBar,
  Box,
  IconButton,
  styled,
  Toolbar,
  Typography,
} from "@mui/material";

export const MuiToolBar = styled(Toolbar)({
  height: "50px !important",
  minHeight: "50px !important",
});

const Header = ({ children }) => {
  return (
    <AppBar component="nav">
      <MuiToolBar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
        >
          Fly OI
        </Typography>
        <Box flexGrow={1}>{children}</Box>
      </MuiToolBar>
    </AppBar>
  );
};

export { Header };
