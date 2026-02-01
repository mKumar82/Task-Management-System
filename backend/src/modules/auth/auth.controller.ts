import { Request, Response } from "express";
import { registerUser, loginUser, refreshTokens, logoutUser } from "./auth.service";

export const register = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = await registerUser(email, password);
  res.status(201).json({ message: "User registered", userId: user.id });
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const tokens = await loginUser(email, password);
  if (!tokens) {
    return res.status(401).json({ message: "Invalid credentials" });
  }
  res.json(tokens);
};

export const refresh = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  const tokens = await refreshTokens(refreshToken);
  res.json(tokens);
};

export const logout = async (req: Request, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token required" });
  }

  await logoutUser(refreshToken);
  

  res.json({ message: "Logged out successfully" });
};
