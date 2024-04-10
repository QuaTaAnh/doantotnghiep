import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import NoImage from "../../assets/images/noImage.jpg";
import SettingsIcon from "@mui/icons-material/Settings";
import NotificationsIcon from "@mui/icons-material/Notifications";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuIcon from "@mui/icons-material/Menu";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { logout as logoutFunction } from "../../utils/auth";
import { showSnackbar } from "../../redux/snackbarRedux";
import { routes } from "../../config/routes";
import SearchInput from "../../components/SearchInput";
import { Link, useNavigate } from "react-router-dom";

const SETTINGS = [
  {
    id: 1,
    icon: <PersonIcon fontSize="small" />,
    title: "Thông tin cá nhân",
  },
  {
    id: 2,
    icon: <LogoutIcon fontSize="small" />,
    title: "Đăng xuất",
  },
];

const Header: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState<null | HTMLElement>(null);

  const { user } = useSelector((state: RootState) => state.user);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setOpenMenu(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setOpenMenu(null);
  };

  const handleLogout = () => {
    try {
      logoutFunction(dispatch);
      localStorage.removeItem("access_token");
      dispatch(
        showSnackbar({ message: "Đăng xuất thành công", type: "success" })
      );
      window.location.href = routes.login;
    } catch (error) {
      console.log(error);
      dispatch(showSnackbar({ message: "Đã xảy ra lỗi", type: "error" }));
    }
  };

  const handleOpenProfile = () => {
    navigate(`/profile`);
  };

  return (
    <div>
      <AppBar position="fixed" sx={{ height: "88px", backgroundColor: "#FFF" }}>
        <Container maxWidth="xl" sx={{ height: "100%" }}>
          <Toolbar disableGutters sx={{ height: "100%" }}>
            <Link to={routes.home} style={{ textDecoration: "none" }}>
              <Typography
                variant="h5"
                sx={{
                  mr: 4,
                  display: { md: "flex" },
                  alignContent: "center",
                  fontWeight: 600,
                  letterSpacing: ".05rem",
                  color: "#3C64B1",
                  cursor: "pointer",
                }}
              >
                Z-LEARN
              </Typography>
            </Link>
            <Box>
              <SearchInput />
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: { md: "flex", xs: "none" } }}>
              <IconButton size="large">
                <Badge badgeContent={6} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              <IconButton size="large">
                <Badge badgeContent={9} color="error">
                  <SettingsIcon />
                </Badge>
              </IconButton>
              <Tooltip title="Open settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar alt="Avatar" src={user?.avatar ?? NoImage} />
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                anchorEl={openMenu}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(openMenu)}
                onClose={handleCloseUserMenu}
              >
                {SETTINGS.map((setting, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => {
                      handleCloseUserMenu();
                      setting.id === 2 && handleLogout();
                      setting.id === 1 && handleOpenProfile();
                    }}
                  >
                    {setting.icon}
                    <Typography textAlign="center" fontSize={14}>
                      {setting.title}
                    </Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                // onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    </div>
  );
};

export default Header;
