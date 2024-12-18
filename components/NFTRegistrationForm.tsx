/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { Loader2, AlertCircle } from "lucide-react";
import { useNFTStaking } from "@/hooks/useNFTStaking";
import { nftFormSchema } from "@/lib/validations/registration";
import { NFTFormValues } from "@/lib/validations/registration";

export function NFTRegistrationForm() {
  const [tokenId, setTokenId] = useState<number | null>(null);
  const {
    isStaked,
    remainingTime,
    loading: stakingLoading,
  } = useNFTStaking(tokenId || 0);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<NFTFormValues>({
    resolver: zodResolver(nftFormSchema),
    defaultValues: {
      email: "",
      walletAddress: "",
      tokenId: undefined,
    },
  });

  const onSubmit = async (data: NFTFormValues) => {
    try {
      setIsSubmitting(true);

      // Validate staking requirements
      if (!isStaked) {
        toast({
          variant: "destructive",
          title: "Staking Required",
          description: "You need to stake your NFT for at least a week.",
        });
        return;
      }

      if (remainingTime && remainingTime > 0) {
        toast({
          variant: "destructive",
          title: "Staking Time Requirement",
          description: `Please wait ${Math.ceil(
            remainingTime / (24 * 60 * 60)
          )} more days.`,
        });
        return;
      }

      // Get signature
      const message = `Register with NFT token ID: ${data.tokenId}`;
      if (!window.ethereum) {
        throw new Error(
          "Ethereum provider not found. Please install MetaMask."
        );
      }
      const signature = await window.ethereum.request({
        method: "personal_sign",
        params: [message, data.walletAddress],
      });

      // Add your API call here
      // const response = await registerWithNFT({ ...data, signature });

      toast({
        title: "Registration Successful",
        description: "Your NFT registration has been completed.",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onConnectWallet = async () => {
    try {
      if (typeof window.ethereum === "undefined") {
        toast({
          variant: "destructive",
          title: "MetaMask Required",
          description: "Please install MetaMask to connect your wallet.",
        });
        return;
      }

      if (!window?.ethereum?.request) {
        toast({
          variant: "destructive",
          title: "MetaMask Error",
          description: "MetaMask not properly initialized",
        });
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      form.setValue("walletAddress", accounts[0], {
        shouldValidate: true,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Wallet Connection Failed",
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="tokenId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Token ID</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    field.onChange(value);
                    setTokenId(value);
                  }}
                  placeholder="Enter your NFT token ID"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
              {stakingLoading ? (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Checking staking status...</span>
                </div>
              ) : (
                tokenId !== null &&
                (isStaked ? (
                  <Alert
                    variant={remainingTime > 0 ? "destructive" : "default"}
                  >
                    <AlertDescription>
                      {remainingTime > 0
                        ? `${Math.ceil(
                            remainingTime / (24 * 60 * 60)
                          )} days remaining until eligible`
                        : "Staking requirement met! You can proceed with registration."}
                    </AlertDescription>
                  </Alert>
                ) : (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      This NFT is not staked. Please stake your NFT first.
                    </AlertDescription>
                  </Alert>
                ))
              )}
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="walletAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Wallet Address</FormLabel>
              <div className="space-y-2">
                {field.value ? (
                  <div className="flex items-center gap-2">
                    <Input value={field.value} disabled className="flex-1" />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onConnectWallet}
                      disabled={isSubmitting}
                    >
                      Change
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onConnectWallet}
                    disabled={isSubmitting}
                  >
                    Connect Wallet
                  </Button>
                )}
                <FormMessage />
              </div>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={
            isSubmitting ||
            !form.formState.isValid ||
            (tokenId !== null &&
              (!isStaked || (remainingTime && remainingTime > 0))) === true
          }
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Registering...
            </>
          ) : (
            "Register with NFT"
          )}
        </Button>
      </form>
    </Form>
  );
}
