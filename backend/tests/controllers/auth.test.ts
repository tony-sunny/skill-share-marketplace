import { signUp, login } from "../../src/controllers/auth";
import { constants } from "node:http2";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../src/models/user", () => ({
  createUser: jest.fn(),
  findUserByEmail: jest.fn(),
}));

jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const { createUser, findUserByEmail } = require("../../src/models/user");

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  res.end = jest.fn().mockReturnValue(res);
  return res;
};

describe("auth controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("signUp", () => {
    it("should create user if not exists", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed");
      const req: any = {
        body: { email: "a@b.com", password: "pw", foo: "bar" },
      };
      const res = mockRes();
      await signUp(req, res);
      expect(findUserByEmail).toHaveBeenCalledWith("a@b.com");
      expect(bcrypt.hash).toHaveBeenCalledWith("pw", 10);
      expect(createUser).toHaveBeenCalledWith({
        foo: "bar",
        email: "a@b.com",
        password_hash: "hashed",
      });
      expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_CREATED);
      expect(res.end).toHaveBeenCalled();
    });

    it("should return conflict if user exists", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue({ id: 1 });
      const req: any = { body: { email: "a@b.com", password: "pw" } };
      const res = mockRes();
      await signUp(req, res);
      expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_CONFLICT);
      expect(res.end).toHaveBeenCalled();
    });
  });

  describe("login", () => {
    it("should return token if credentials valid", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: "a@b.com",
        role: "user",
        password_hash: "hashed",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("token");
      const req: any = { body: { email: "a@b.com", password: "pw" } };
      const res = mockRes();
      process.env.JWT_SECRET = "secret";
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(constants.HTTP_STATUS_OK);
      expect(res.json).toHaveBeenCalledWith({ token: "token" });
    });

    it("should return 401 if user not found", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue(null);
      const req: any = { body: { email: "a@b.com", password: "pw" } };
      const res = mockRes();
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(
        constants.HTTP_STATUS_UNAUTHORIZED,
      );
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });

    it("should return 401 if password invalid", async () => {
      (findUserByEmail as jest.Mock).mockResolvedValue({
        id: 1,
        email: "a@b.com",
        role: "user",
        password_hash: "hashed",
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);
      const req: any = { body: { email: "a@b.com", password: "pw" } };
      const res = mockRes();
      await login(req, res);
      expect(res.status).toHaveBeenCalledWith(
        constants.HTTP_STATUS_UNAUTHORIZED,
      );
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
    });
  });
});
