import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <button onClick={() => navigate("/login")}>로그인</button>
    </div>
  );
}

export default Home;
