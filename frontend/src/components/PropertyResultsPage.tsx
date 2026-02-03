import React, { useEffect, useRef, useState } from "react";
import { fetchPropertyDetails } from "../services/property";
import SearchBar from "./SearchBar";
import { useNavigate, useSearchParams } from "react-router-dom";
import HometapTitle from "./HometapTitle";
import PropertyTable from "./PropertyTable";
import { IProvider } from "../interfaces";

const PropertyResultsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [apiResponse, setApiResponse] = useState<IProvider | null>(null);
  const [loading, setLoading] = useState(false);

  const searchInProgress = useRef(false);

  const performSearch = async (address: string) => {
    if (!address.trim() || searchInProgress.current) return;

    searchInProgress.current = true;
    setLoading(true);
    setError(null);
    try {
      const data = await fetchPropertyDetails(address);
      setApiResponse(data.providers);
    } catch (error) {
      setApiResponse(null);
      setError(error instanceof Error ? error.message : "Unknown error");
    } finally {
      searchInProgress.current = false;
      setLoading(false);
    }
  };

  useEffect(() => {
    const address = searchParams.get("address");
    if (address) {
      setSearchTerm(address);
      performSearch(address);
    }
  }, [searchParams]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    navigate(`/properties?address=${encodeURIComponent(searchTerm)}`, {
      replace: true,
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <HometapTitle />
      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        disabled={loading}
        handleClick={handleSearch}
      />
      {loading && (
        <div className="mt-6 bg-blue-100 p-4 rounded-md w-full max-w-xl text-center text-blue-800">
          Loading property details...
        </div>
      )}
      {!loading && apiResponse && <PropertyTable providers={apiResponse} />}
      {!loading && error && (
        <div className="mt-6 bg-red-200 p-4 rounded-md w-full max-w-xl text-left text-red-800">
          Error: {error}
        </div>
      )}
    </div>
  );
};

export default PropertyResultsPage;
