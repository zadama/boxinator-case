import React, { useEffect, useState } from "react";

import PrivateLayout from "../../layouts/PrivateLayout";
import { useAuth } from "../../context/auth";
import { getAccount } from "../../api/user";

import "./style.scss";

import ProfileMenu from "./ProfileComponents/ProfileMenu";
import ProfileInformation from "./ProfileComponents/ProfileInformation";

const ProfilePage = () => {
  const auth = useAuth();
  const [data, setData] = useState(null);

  const [showProfile, setShowProfile] = useState(false);
  const [showShipments, setShowShipments] = useState(false);
  const [title, setTitle] = useState("");

  const renderProfilePageWithData = async () => {
    try {
      const token = await auth.getUserToken();

      const { data: thisAccount } = await getAccount(token, auth.user.email);

      setData(thisAccount.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    renderProfilePageWithData();
  }, []);

  /*
  const handleMenuClick = (event, value) => {
    if (value === "profile") {
      setTitle(data.firstName + "'s Profile Information");
      setShowShipments(false);
      setShowProfile(!showProfile);
    } else if (value === "shipments") {
      setTitle(data.firstName + "'s Shipments");
      setShowProfile(false);
      setShowShipments(!showShipments);
    }
  };*/

  return (
    <PrivateLayout>
      <div className="profile-page">
        <section>
          {!data ? (
            <div>loading....</div>
          ) : (
            <div>
              {!title ? (
                <h3>Welcome back, "{data.firstName}"</h3>
              ) : (
                <h3>{title}</h3>
              )}
            </div>
          )}
        </section>
        <section style={{ paddingBottom: "25px" }}>
          <ProfileInformation />
        </section>
      </div>
    </PrivateLayout>
  );
};

export default ProfilePage;
