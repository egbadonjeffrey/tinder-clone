/* eslint-disable react/prop-types */
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const ChatHeader = ({ user }) => {
  const [cookies, setCookie, removeCookie] = useCookies(["user"]);

  const navigate = useNavigate();

  const logout = () => {
    removeCookie("UserId", cookies.userId);
    removeCookie("AuthToken", cookies.AuthToken);
    navigate("/");
    window.location.reload();
  };

  // console.log(user);
  return (
    <div className="chat-container-header">
      <div className="profile">
        <div className="img-container">
          <img
            src={user && user.url}
            alt={"photo of " + (user && user.first_name)}
          />
        </div>
        <h3>{user && user.first_name}</h3>
      </div>
      <i className="log-out-icon" onClick={logout}>
        Logout
      </i>
    </div>
  );
};

export default ChatHeader;
