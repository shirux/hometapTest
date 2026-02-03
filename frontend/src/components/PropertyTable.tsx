import { IProvider } from "../interfaces";
import { PropertyModel } from "../models/property.model";

interface PropertyComparisonProps {
  providers: IProvider;
}

const PropertyTable: React.FC<PropertyComparisonProps> = ({ providers }) => {
  const providerKeys = Object.keys(providers).sort();
  const propertyModels: Record<string, PropertyModel> = {};
  providerKeys.forEach((key) => {
    propertyModels[key] = new PropertyModel(providers[key]);
  });
  const propertyConfigs = PropertyModel.getPropertyConfigs();

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        Normalized Address:{" "}
        {providerKeys[0] && providers[providerKeys[0]]?.normalizedAddress}
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
            {propertyConfigs.map((config) => (
              <tr key={config.key} className="hover:bg-gray-50">
                <td className="p-3 border-b text-gray-700">{config.label}</td>
                {providerKeys.map((providerName) => (
                  <td
                    key={providerName}
                    className={`p-3 border-b text-center font-medium ${
                      config.key === "salePrice"
                        ? "text-green-600 font-semibold"
                        : "text-gray-900"
                    }`}
                  >
                    {propertyModels[providerName].format(config.key)}
                  </td>
                ))}
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
            {propertyConfigs.map((config) => (
              <div
                key={config.key}
                className="flex justify-between py-2 border-b border-gray-200 last:border-0"
              >
                <span className="text-gray-700 font-medium">
                  {config.label}
                </span>
                <span
                  className={`font-semibold ${
                    config.key === "salePrice"
                      ? "text-green-600"
                      : "text-gray-900"
                  }`}
                >
                  {propertyModels[providerName].format(config.key)}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyTable;
