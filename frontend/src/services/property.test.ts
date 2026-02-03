import { describe, it, expect, vi, beforeEach } from "vitest";

const backendApiUrl = "http://localhost:3000";

// Mock import.meta.env before importing the module
vi.stubEnv("VITE_BACKEND_API_URL", backendApiUrl);

const { fetchPropertyDetails } = await import("./property");

describe("fetchPropertyDetails", () => {
  const address = "123 Main St";

  // Mock the fetch function
  beforeEach(() => {
    vi.resetAllMocks(); // Reset mocks before each test
    globalThis.fetch = vi.fn();
  });

  it("fetches property details successfully", async () => {
    // Mock a successful fetch response
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        providers: {
          "Provider 1": { "Normalized Address": "123 Main St" },
        },
      }),
    });

    const result = await fetchPropertyDetails(address);

    // Assert fetch was called with the correct URL
    expect(fetch).toHaveBeenCalledWith(
      `${backendApiUrl}/properties?address=123%20Main%20St`,
    );

    // Assert the response matches the mocked data
    expect(result).toEqual({
      providers: {
        "Provider 1": { "Normalized Address": "123 Main St" },
      },
    });
  });

  it("throws an error when the response is not ok", async () => {
    // Mock a failed fetch response
    (fetch as unknown as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      ok: false,
    });

    await expect(fetchPropertyDetails(address)).rejects.toThrow(
      "Network response was not ok",
    );
  });

  it("throws an error when fetch fails", async () => {
    // Mock a network error
    (fetch as unknown as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new Error("Network error"),
    );

    await expect(fetchPropertyDetails(address)).rejects.toThrow(
      "Network error",
    );
  });
});
