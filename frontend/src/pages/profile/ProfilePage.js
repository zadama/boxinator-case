import React, { useEffect, useState } from "react";

import PrivateLayout from "../../layouts/PrivateLayout";
import { useAuth } from "../../context/auth";
import { getAccount } from "../../api/user";

import "./style.scss";

import ProfileInformation from "./ProfileComponents/ProfileInformation";

const ProfilePage = () => {
  const auth = useAuth();
  const [data, setData] = useState(null);

  const [title, setTitle] = useState("");

  const renderProfilePageWithData = async () => {
    try {
      const token = await auth.getUserToken();

      const { data: thisAccount } = await getAccount(token, auth.user.email);

      setData(thisAccount.data);
    } catch (error) {}
  };

  useEffect(() => {
    renderProfilePageWithData();
  }, []);

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
