import { queryAPI } from "./api";

global.fetch = jest.fn();

describe("queryAPI", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should make a GET request and parse response", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ foo: "bar" }),
    });
    const result = await queryAPI<{ foo: string }>("test-endpoint");
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("test-endpoint"),
      expect.objectContaining({ method: "GET" }),
    );
    expect(result).toEqual({ foo: "bar" });
  });

  it("should make a POST request with body", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
    const body = { a: 1 };
    await queryAPI("post-endpoint", { method: "POST", body });
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining("post-endpoint"),
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify(body),
      }),
    );
  });

  it("should add Authorization header if needAuth is true", async () => {
    localStorage.setItem("auth_token", "abc123");
    (fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => ({ ok: 1 }),
    });
    await queryAPI("auth-endpoint", { needAuth: true });
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: "Bearer abc123" }),
      }),
    );
  });

  it("should throw error if response is not ok", async () => {
    (fetch as jest.Mock).mockResolvedValue({
      ok: false,
      json: async () => ({ message: "fail" }),
    });
    await expect(queryAPI("fail-endpoint")).rejects.toThrow("fail");
  });

  it("should return null if parseResponse is false", async () => {
    (fetch as jest.Mock).mockResolvedValue({ ok: true });
    const result = await queryAPI("no-parse", { parseResponse: false });
    expect(result).toBeNull();
  });
});
