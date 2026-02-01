import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";
import { hashPassword, comparePassword } from "../../utils/hash";
import { jwtConfig } from "../../config/jwt";
import prisma from "../../prisma/client";

const accessTokenOptions: SignOptions = {
  expiresIn: jwtConfig.accessTokenExpiry as SignOptions["expiresIn"],
};

const refreshTokenOptions: SignOptions = {
  expiresIn: jwtConfig.refreshTokenExpiry as SignOptions["expiresIn"],
};

export const registerUser = async (email: string, password: string) => {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("User already exists");

  const hashed = await hashPassword(password);

  const user = await prisma.user.create({
    data: { email, password: hashed },
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new Error("Invalid credentials");

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new Error("Invalid credentials");

  const payload: JwtPayload & { userId: string } = {
    userId: user.id,
  };

  const accessToken = jwt.sign(
    payload,
    jwtConfig.accessTokenSecret,
    accessTokenOptions,
  );

  const refreshToken = jwt.sign(
    payload,
    jwtConfig.refreshTokenSecret,
    refreshTokenOptions,
  );

  await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken, refreshToken };
};
export const logoutUser = async (refreshToken: string) => {
  console.log("LOGOUT TOKEN:", refreshToken);
  
   const decoded = jwt.verify(
     refreshToken,
     jwtConfig.refreshTokenSecret,
   ) as JwtPayload & { userId: string };

   await prisma.refreshToken.deleteMany({
     where: {
       userId: decoded.userId,
     },
   });
};

export const refreshTokens = async (token: string) => {
  // 1. check if token exists in DB
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
  });

  if (!storedToken) {
    throw new Error("Invalid refresh token");
  }

  // 2. verify JWT
  const decoded = jwt.verify(
    token,
    jwtConfig.refreshTokenSecret,
  ) as JwtPayload & { userId: string };

  // 3. delete old refresh token (rotation)
  await prisma.refreshToken.delete({
    where: { token },
  });

  // 4. generate new tokens
  const payload = { userId: decoded.userId };

  const newAccessToken = jwt.sign(
    payload,
    jwtConfig.accessTokenSecret,
    accessTokenOptions,
  );

  const newRefreshToken = jwt.sign(
    payload,
    jwtConfig.refreshTokenSecret,
    refreshTokenOptions,
  );

  // 5. store new refresh token
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: decoded.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken: newAccessToken,
    refreshToken: newRefreshToken,
  };
};
