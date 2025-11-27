import { Box, Grid, MenuItem, Select, TextField } from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { CreatePostForm, District, Province, Ward } from "../../../type";
import { useTranslation } from "react-i18next";
import MapCustom from "../../../components/Map";

interface AddressFieldsProps {
  setPayload: any;
  hidden?: boolean;
  setAddressChanged?: any;
}

const Address: React.FC<AddressFieldsProps> = ({
  setPayload,
  hidden,
  setAddressChanged,
}: AddressFieldsProps) => {
  const { t } = useTranslation();
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [province, setProvince] = useState<string>("");
  const [districts, setDistricts] = useState<District[]>([]);
  const [district, setDistrict] = useState<string>("");
  const [wards, setWards] = useState<Ward[]>([]);
  const [ward, setWard] = useState<string>("");
  const [provinceSelected, setProvinceSelected] = useState<boolean>(false);
  const [districtSelected, setDistrictSelected] = useState<boolean>(false);
  const [wardSelected, setWardSelected] = useState<boolean>(false);
  const [apartmentNumber, setApartmentNumber] = useState<string>("");

  useEffect(() => {
    if (setAddressChanged) {
      if (provinceSelected && districtSelected && wardSelected) {
        setAddressChanged(true);
      }
    }
  }, [setAddressChanged, provinceSelected, districtSelected, wardSelected]);

  const address: string = `${apartmentNumber ? `${apartmentNumber},` : ""} ${
    ward ? `${wards?.find((item) => item.ward_id === ward)?.ward_name},` : ""
  } ${
    district
      ? `${
          districts?.find((item) => item.district_id === district)
            ?.district_name
        },`
      : ""
  } ${
    province
      ? provinces?.find((item) => item.province_id === province)?.province_name
      : ""
  }`;

  useEffect(() => {
    const getProvince = async () => {
      try {
        const res = await axios.get("https://provinces.open-api.vn/api/p/");
        if (res.status === 200) {
          // Convert data structure to match existing format
          const formattedProvinces = res.data.map((item: any) => ({
            province_id: item.code.toString(),
            province_name: item.name,
          }));
          setProvinces(formattedProvinces);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    getProvince();
  }, []);

  useEffect(() => {
    setDistrict("");
    const getDistrict = async () => {
      try {
        const res = await axios.get(
          `https://provinces.open-api.vn/api/p/${province}?depth=2`
        );
        if (res.status === 200) {
          // Convert data structure to match existing format
          const formattedDistricts = res.data.districts.map((item: any) => ({
            district_id: item.code.toString(),
            district_name: item.name,
          }));
          setDistricts(formattedDistricts);
        }
      } catch (error) {
        console.error("Error fetching districts:", error);
      }
    };
    province && getDistrict();
    !province && setDistricts([]);
  }, [province]);

  useEffect(() => {
    setWard("");
    const getWard = async () => {
      try {
        const res = await axios.get(
          `https://provinces.open-api.vn/api/d/${district}?depth=2`
        );
        if (res.status === 200) {
          // Convert data structure to match existing format
          const formattedWards = res.data.wards.map((item: any) => ({
            ward_id: item.code.toString(),
            ward_name: item.name,
          }));
          setWards(formattedWards);
        }
      } catch (error) {
        console.error("Error fetching wards:", error);
      }
    };
    district && getWard();
    !district && setWards([]);
  }, [district]);

  useEffect(() => {
    setPayload((prev: CreatePostForm) => ({
      ...prev,
      address: address,
    }));
  }, [address, setPayload]);

  return (
    <Grid container spacing={2}>
      <Grid item md={hidden ? 12 : 7}>
        <Grid container spacing={2} marginBottom={2}>
          <Grid item md={4}>
            <label htmlFor="">{t("province")}</label>
            <Select
              fullWidth
              sx={{ height: "40px", marginTop: "10px" }}
              value={province}
              onChange={(e) => {
                setProvince(e.target.value);
                setProvinceSelected(true);
              }}
            >
              {provinces.map((prov: Province) => (
                <MenuItem key={prov.province_id} value={prov.province_id}>
                  {prov.province_name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item md={4}>
            <label htmlFor="">{t("district")}</label>
            <Select
              fullWidth
              sx={{ height: "40px", marginTop: "10px" }}
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setDistrictSelected(true);
              }}
              disabled={!provinceSelected}
            >
              {districts.map((dis: District) => (
                <MenuItem key={dis.district_id} value={dis.district_id}>
                  {dis.district_name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item md={4}>
            <label htmlFor="">{t("ward")}</label>
            <Select
              fullWidth
              sx={{ height: "40px", marginTop: "10px" }}
              value={ward}
              onChange={(e) => {
                setWard(e.target.value);
                setWardSelected(true);
              }}
              disabled={!districtSelected}
            >
              {wards.map((war: Ward) => (
                <MenuItem key={war.ward_id} value={war.ward_id}>
                  {war.ward_name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
        </Grid>
        {!hidden && (
          <>
            <label htmlFor="">{t("homeNumber")}</label>
            <TextField
              size="small"
              fullWidth
              margin="normal"
              onChange={(e) => {
                setApartmentNumber(e.target.value);
              }}
            />
          </>
        )}
        <label htmlFor="">{t("addressExact")}</label>
        <TextField
          size="small"
          fullWidth
          margin="normal"
          value={address}
          InputProps={{
            readOnly: true,
            sx: {
              backgroundColor: "#ccc",
            },
          }}
        />
      </Grid>
      {!hidden ? (
        <Grid item md={5}>
          <Box sx={{ height: "300px" }}>
            <MapCustom address={address} />
          </Box>
        </Grid>
      ) : (
        <></>
      )}
    </Grid>
  );
};

export default Address;
