"use client";
import { AppBar, IconButton, styled, Toolbar, Typography } from "@mui/material";

export const MuiToolBar = styled(Toolbar)({
  height: "50px !important",
  minHeight: "50px !important",
});

const Header = () => {
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
      </MuiToolBar>
    </AppBar>
  );
};

export { Header };
