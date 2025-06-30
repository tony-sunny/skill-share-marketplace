import { render } from "@testing-library/react";
import React from "react";
import { RequireAuth } from "./require-auth";

jest.mock("next/navigation", () => ({
  useRouter: () => ({ replace: jest.fn() }),
  usePathname: () => "/protected",
  useSearchParams: () => ({ toString: () => "" }),
}));

describe("RequireAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("renders children if token exists", () => {
    localStorage.setItem("auth_token", "abc");
    const { getByText } = render(
      <RequireAuth>
        <div>Secret</div>
      </RequireAuth>,
    );
    expect(getByText("Secret")).toBeInTheDocument();
  });

  it("redirects to login if no token", () => {
    const replace = jest.fn();
    jest
      .spyOn(require("next/navigation"), "useRouter")
      .mockReturnValue({ replace });
    render(
      <RequireAuth>
        <div>Secret</div>
      </RequireAuth>,
    );
    expect(replace).toHaveBeenCalledWith(
      "/auth/login?callbackUrl=%2Fprotected",
    );
  });

  it("redirects with query params if present", () => {
    const replace = jest.fn();
    jest
      .spyOn(require("next/navigation"), "useRouter")
      .mockReturnValue({ replace });
    jest
      .spyOn(require("next/navigation"), "useSearchParams")
      .mockReturnValue({ toString: () => "foo=bar" });
    render(
      <RequireAuth>
        <div>Secret</div>
      </RequireAuth>,
    );
    expect(replace).toHaveBeenCalledWith(
      "/auth/login?callbackUrl=%2Fprotected%3Ffoo%3Dbar",
    );
  });
});
