import { useState } from "react";
import SearchBar from "./SearchBar";
import { useNavigate } from "react-router-dom";
import HometapTitle from "./HometapTitle";

const HomePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (searchTerm.trim()) {
      navigate(`/properties?address=${encodeURIComponent(searchTerm)}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <HometapTitle />
      <SearchBar
        handleClick={handleSearch}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </div>
  );
};

export default HomePage;
