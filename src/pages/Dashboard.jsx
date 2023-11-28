import React, { useCallback, useEffect, useState } from "react";
import TinderCard from "react-tinder-card";
import ChatContainer from "../components/ChatContainer";
import { useCookies } from "react-cookie";
import axios from "axios";

// Static data moved outside the component
const characters = [
  {
    name: "Richard Cypher",
    url: "https://imgur.com/oPj4A8u.jpg",
  },
  {
    name: "James Cypher",
    url: "https://imgur.com/OckVkRo.jpg",
  },
];

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);
  const [lastDirection, setLastDirection] = useState();
  const [genderedUsers, setGenderedUsers] = useState(null);

  const userId = cookies.userId;

  // console.log(userId);

  const getUser = async () => {
    try {
      const response = await axios.get("http://localhost:8080/user", {
        params: { userId },
      });

      const data = await response.data;
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };
  const getGenderedUsers = async () => {
    console.log(user);

    try {
      if (user) {
        const response = await axios.get(
          "http://localhost:8080/gendered-users",
          {
            params: { gender: user?.gender_identity },
          }
        );

        const data = await response.data;
        setGenderedUsers(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUser();
  }, []);

  useEffect(() => {
    if (user) {
      getGenderedUsers();
    }
  }, [user]);

  const updatedMatches = async (matchedUserId) => {
    try {
      const response = await axios.put("http://localhost:8080/addmatch", {
        userId,
        matchedUserId,
      });

      if (response.status === 200);

      getUser();
    } catch (error) {
      console.log(error);
    }
  };

  console.log("user", user);
  // console.log("GenderedUsers ", genderedUsers);

  const swiped = (direction, swipedUserId) => {
    console.log(swipedUserId);
    if (direction === "right") {
      updatedMatches(swipedUserId);
    }
    setLastDirection(direction);
  };

  const outOfFrame = (name) => {
    console.log(name + " left the screen");
  };

  const matchedUserIds = user?.matches
    .map(({ user_id }) => user_id)
    .concat(userId);

  const filterGenderedUsers =
    Array.isArray(genderedUsers) &&
    genderedUsers?.filter(
      (genderedUser) => !matchedUserIds.includes(genderedUser.user_id)
    );

  return (
    <>
      {user && (
        <div className="dashboard">
          <ChatContainer user={user} />

          <div className="swipe-container">
            <div className="card-container">
              {Array.isArray(filterGenderedUsers) &&
                filterGenderedUsers?.map((genderedUser) => (
                  <TinderCard
                    className="swipe"
                    key={genderedUser.first_name}
                    onSwipe={(dir) => swiped(dir, genderedUser.user_id)}
                    onCardLeftScreen={() => outOfFrame(genderedUser.first_name)}
                  >
                    <div
                      style={{ backgroundImage: `url(${genderedUser.url})` }}
                      className="card"
                    >
                      <h3>{genderedUser.first_name}</h3>
                    </div>
                  </TinderCard>
                ))}

              <div className="swipe-info">
                {lastDirection && <p>You swiped {lastDirection}</p>}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
