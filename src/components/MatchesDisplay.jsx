import axios from "axios";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
// import { useCookies } from "react-cookie";

const MatchesDisplay = ({ matches }) => {
  // const [cookies] = useCookies(["user"]);
  const [matchedProfiles, setMatchedProfiles] = useState(null);

  // const userId = cookies.userId;

  const matchedUserIds = matches.map(({ user_id }) => user_id);

  const getMatches = async () => {
    try {
      if (matchedUserIds) {
        const response = await axios.get("http://localhost:8080/users", {
          params: { userIds: JSON.stringify(matchedUserIds) },
        });
        const data = await response.data;
        setMatchedProfiles(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  console.log(matchedProfiles);

  useEffect(() => {
    getMatches();
  }, [matchedUserIds]);

  return <div>MatchesDisplay</div>;
};

MatchesDisplay.propTypes = {
  matches: PropTypes.array.isRequired,
};

export default MatchesDisplay;
