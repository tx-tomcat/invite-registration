import { z } from "zod";

export const nftFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  tokenId: z.number().min(0, "Token ID is required"),
});

export const inviteFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
  inviteCode: z.string().min(1, "Invite code is required"),
});

export type NFTFormValues = z.infer<typeof nftFormSchema>;
export type InviteFormValues = z.infer<typeof inviteFormSchema>;
