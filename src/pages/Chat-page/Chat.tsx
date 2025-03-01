const ChatPage = () => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    window.location.href = "/login";
  };
  return <div>
    <button className="btn btn-primary" onClick={handleLogout}>
            Logout
          </button>
  </div>;
};
export default ChatPage;
