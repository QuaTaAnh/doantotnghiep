import React from "react";
import NoImage from "../../assets/images/noImage.jpg";
import { Avatar, Box, Button, Card, Grid, Typography } from "@mui/material";
import { IUser } from "../../type";
import { useNavigate } from "react-router";
import { formatDate } from "../../common/formatDate";

const CardProfile: React.FC<{ data: IUser | null }> = ({ data }) => {
  const navigate = useNavigate();

  const handleClickFollow = () => {
    navigate("/follow", { state: { data } });
  };

  return (
    <Grid container spacing={2}>
      <Grid item md={12}>
        <Card sx={{ padding: "20px", marginLeft: "20px", borderRadius: "0" }}>
          <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
            <Avatar
              alt="Avatar"
              sx={{ marginRight: "10px", width: "100px", height: "100px" }}
              src={data?.avatar ?? NoImage}
            />
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            marginTop={"10px"}
          >
            <Typography sx={{ fontSize: "16px", color: "#000" }}>
              Họ tên: {data?.name}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            marginTop={"10px"}
            sx={{ cursor: "pointer" }}
            onClick={handleClickFollow}
          >
            <Typography sx={{ fontSize: "16px", color: "#000" }}>
              Người theo dõi:
              <span
                style={{
                  cursor: "pointer",
                  padding: "0 4px",
                  color: "#fa6819",
                }}
              >
                {data?.follower?.length}
              </span>
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#000" }}>
              Đang theo dõi:
              <span
                style={{
                  cursor: "pointer",
                  padding: "0 4px",
                  color: "#fa6819",
                }}
              >
                {data?.following?.length}
              </span>
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            marginTop={"10px"}
          >
            <Typography sx={{ fontSize: "16px", color: "#000" }}>
              Số điện thoại: {data?.phone}
            </Typography>
            <Typography sx={{ fontSize: "16px", color: "#000" }}>
              Zalo: {data?.zalo}
            </Typography>
          </Box>
          <Box
            display={"flex"}
            alignItems={"center"}
            justifyContent={"space-between"}
            marginTop={"10px"}
          >
            <Typography sx={{ fontSize: "16px", color: "#000" }}>
              Đã tham gia: {formatDate(data?.createdAt)}
            </Typography>
          </Box>
          <Button
            fullWidth
            sx={{
              color: "#fa6819",
              marginTop: "20px",
              border: "1px solid #ccc",
              "&:hover": {
                color: "#fff",
                backgroundColor: "#fa6819",
              },
            }}
            onClick={() => navigate("/edit-profile")}
          >
            Update
          </Button>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CardProfile;
