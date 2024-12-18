// lib/api/client.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "/api",
});

export const apiClient = {
  verifyCode: async (code: string) => {
    const { data } = await api.get(`/verifyCode?code=${code}`);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },

  checkEmail: async (email: string) => {
    const { data } = await api.get(`/isEmailUsed?email=${email}`);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },

  checkWallet: async (wallet: string) => {
    const { data } = await api.get(`/isWalletUsed?wallet=${wallet}`);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },

  reserve: async (payload: {
    code: string;
    email: string;
    walletAddress: string;
    signature: string;
  }) => {
    const { data } = await api.post("/reserve", payload);
    if (!data.success) {
      throw new Error(data.message);
    }
    return data;
  },
};
