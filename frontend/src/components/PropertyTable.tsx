interface PropertyData {
  order: number;
  normalizedAddress: string;
  squareFootage: number;
  lotSize: number;
  yearBuilt: number;
  propertyType: string;
  bedrooms: number;
  bathrooms: number;
  roomCount: number;
  septicSystem: boolean;
  salePrice: number;
  [key: string]: any;
}

interface PropertyComparisonProps {
  providers: {
    [key: string]: PropertyData;
  };
}

type PropertyConfig = {
  key: keyof PropertyData;
  label: string;
  format: (value: any) => string;
};

const PropertyTable: React.FC<PropertyComparisonProps> = ({ providers }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("en-US").format(num);
  };

  const properties: PropertyConfig[] = [
    {
      key: "squareFootage",
      label: "Square Footage",
      format: (v) => formatNumber(v),
    },
    {
      key: "lotSize",
      label: "Lot Size (Acres)",
      format: (v) => (v != null ? v.toString() : "N/A"),
    },
    {
      key: "yearBuilt",
      label: "Year Built",
      format: (v) => (v != null ? v.toString() : "N/A"),
    },
    { key: "propertyType", label: "Property Type", format: (v) => v || "N/A" },
    {
      key: "bedrooms",
      label: "Bedrooms",
      format: (v) => (v != null ? v.toString() : "N/A"),
    },
    {
      key: "bathrooms",
      label: "Bathrooms",
      format: (v) => (v != null ? v.toString() : "N/A"),
    },
    {
      key: "roomCount",
      label: "Room Count",
      format: (v) => (v != null ? v.toString() : "N/A"),
    },
    {
      key: "septicSystem",
      label: "Septic System",
      format: (v) => (v != null ? (v ? "Yes" : "No") : "N/A"),
    },
    { key: "salePrice", label: "Sale Price", format: (v) => formatCurrency(v) },
  ];

  const normalizeProviderData = (data: any): PropertyData => {
    const mappings = {
      squareFootage: ["squareFootage", "SquareFootage", "square_footage"],
      lotSize: [
        "lotSizeAcres",
        "LotSizeAcres",
        "lot_size_acres",
        "lotSizeSqft",
        "LotSizeSqFt",
      ],
      yearBuilt: ["yearBuilt", "YearBuilt"],
      propertyType: ["propertyType", "PropertyType", "property_type"],
      bedrooms: ["bedrooms", "Bedrooms", "bedroom_count"],
      bathrooms: ["bathrooms", "Bathrooms", "bathroom_count"],
      roomCount: ["roomCount", "RoomCount", "room_count"],
      septicSystem: ["septicSystem", "SepticSystem", "septic_system"],
      salePrice: ["salePrice", "SalePrice", "sale_price"],
      normalizedAddress: [
        "normalizedAddress",
        "NormalizedAddress",
        "normalized_address",
        "formattedAddress",
        "formattedAddress",
        "formatted_address",
      ],
      order: ["order"],
    };

    const findValue = (
      possibleKeys: string[],
      defaultValue: any = null
    ): any => {
      for (const key of possibleKeys) {
        if (data[key] !== undefined) {
          return data[key];
        }
        if (data.features && data.features[key] !== undefined) {
          return data.features[key];
        }
      }
      return defaultValue;
    };

    let lotSize = findValue(mappings.lotSize);
    if (
      lotSize &&
      (data.lotSizeSqFt !== undefined || data.LotSizeSqFt !== undefined)
    ) {
      lotSize = (lotSize / 43560).toFixed(2);
    }

    return {
      squareFootage: findValue(mappings.squareFootage, 0),
      lotSize: parseFloat(lotSize) || 0,
      yearBuilt: findValue(mappings.yearBuilt, 0),
      propertyType: findValue(mappings.propertyType, ""),
      bedrooms: findValue(mappings.bedrooms, 0),
      bathrooms: findValue(mappings.bathrooms, 0),
      roomCount: findValue(mappings.roomCount, 0),
      septicSystem: findValue(mappings.septicSystem, false),
      salePrice: findValue(mappings.salePrice, 0),
      normalizedAddress: findValue(mappings.normalizedAddress, ""),
      order: findValue(mappings.order, 99),
    };
  };

  const providerKeys = Object.keys(providers).sort();
  const normalizedProviders: { [key: string]: PropertyData } = {};
  providerKeys.forEach((providerName) => {
    normalizedProviders[providerName] = normalizeProviderData(
      providers[providerName]
    );
  });

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Normalized Address:{" "}
        {`${normalizedProviders["Provider 1"]?.normalizedAddress}`}
      </h1>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left p-3 bg-gray-50 font-semibold text-gray-700 border-b">
                Property Details
              </th>
              {providerKeys.map((providerName) => (
                <th
                  key={providerName}
                  className="text-center p-3 bg-gray-900 text-white font-semibold border-b"
                >
                  {providerName}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {properties.map((prop) => (
              <tr key={prop.key} className="hover:bg-gray-50">
                <td className="p-3 border-b text-gray-700">{prop.label}</td>
                {providerKeys.map((providerName) => {
                  const value = normalizedProviders[providerName][prop.key];
                  return (
                    <td
                      key={providerName}
                      className={`p-3 border-b text-center font-medium ${
                        prop.key === "salePrice"
                          ? "text-green-600 font-semibold"
                          : "text-gray-900"
                      }`}
                    >
                      {prop.format(value)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {providerKeys.map((providerName) => (
          <div
            key={providerName}
            className="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <h3 className="text-center font-semibold text-white bg-gray-900 rounded py-2 mb-4">
              {providerName}
            </h3>
            {properties.map((prop) => {
              const value = normalizedProviders[providerName][prop.key];
              return (
                <div
                  key={prop.key}
                  className="flex justify-between py-2 border-b border-gray-200 last:border-0"
                >
                  <span className="text-gray-700 font-medium">
                    {prop.label}
                  </span>
                  <span
                    className={`font-semibold ${
                      prop.key === "salePrice"
                        ? "text-green-600"
                        : "text-gray-900"
                    }`}
                  >
                    {prop.format(value)}
                  </span>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyTable;
