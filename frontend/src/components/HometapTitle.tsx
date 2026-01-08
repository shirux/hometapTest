import { useNavigate } from "react-router-dom";

const HometapTitle: React.FC = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/");
  };

  return (
    <h1 className="text-4xl font-bold text-gray-800 mb-6">
      <a onClick={handleClick} style={{ cursor: "pointer" }}>
        Hometap Property Detail Search
      </a>
    </h1>
  );
};

export default HometapTitle;
