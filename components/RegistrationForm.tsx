/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { Loader2, AlertCircle } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";
import { apiClient } from "@/lib/api/client";

// Form validation schemas
const inviteFormSchema = z.object({
  code: z.string().min(6, "Invite code must be at least 6 characters"),
});

const registrationFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  walletAddress: z
    .string()
    .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address"),
});

type InviteFormValues = z.infer<typeof inviteFormSchema>;
type RegistrationFormValues = z.infer<typeof registrationFormSchema>;

export function RegistrationForm() {
  const [step, setStep] = useState(1);
  const { toast } = useToast();

  // Form for invite code step
  const inviteForm = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      code: "",
    },
  });

  // Form for registration step
  const registrationForm = useForm<RegistrationFormValues>({
    resolver: zodResolver(registrationFormSchema),
    defaultValues: {
      email: "",
      walletAddress: "",
    },
  });

  const verifyCodeMutation = useMutation({
    mutationFn: apiClient.verifyCode,
    onSuccess: () => {
      setStep(2);
      toast({
        title: "Code Verified",
        description: "Your invite code is valid. Please complete registration.",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Invalid Code",
        description: error.message,
      });
    },
  });

  // Email availability check
  const emailQuery = useQuery({
    queryKey: ["emailCheck", registrationForm.watch("email")],
    queryFn: () => apiClient.checkEmail(registrationForm.watch("email")),
    enabled:
      !!registrationForm.watch("email") &&
      !registrationForm.formState.errors.email,
    retry: false,
  });

  const walletQuery = useQuery({
    queryKey: ["walletCheck", registrationForm.watch("walletAddress")],
    queryFn: () =>
      apiClient.checkWallet(registrationForm.watch("walletAddress")),
    enabled:
      !!registrationForm.watch("walletAddress") &&
      !registrationForm.formState.errors.walletAddress,
    retry: false,
  });

  const registerMutation = useMutation({
    mutationFn: apiClient.reserve,
    onSuccess: () => {
      registrationForm.reset();
      inviteForm.reset();
      setStep(1);
      toast({
        title: "Success!",
        description: "Registration completed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "Registration Failed",
        description: error.message,
      });
    },
  });

  const connectWallet = async () => {
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

      registrationForm.setValue("walletAddress", accounts[0], {
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

  const onSubmitInviteCode = async (data: InviteFormValues) => {
    verifyCodeMutation.mutate(data.code);
  };

  const onSubmitRegistration = async (data: RegistrationFormValues) => {
    try {
      if (emailQuery.isError || walletQuery.isError) {
        toast({
          variant: "destructive",
          title: "Validation Error",
          description: "Please check email and wallet address availability.",
        });
        return;
      }
      const message = `Register with invite code: ${inviteForm.getValues(
        "code"
      )}`;
      const signature = await window?.ethereum?.request?.({
        method: "personal_sign",
        params: [message, data.walletAddress],
      });

      registerMutation.mutate({
        ...data,
        code: inviteForm.getValues("code"),
        signature,
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signature Failed",
        description: error.message,
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Registration</CardTitle>
        <CardDescription>
          {step === 1
            ? "Enter your invite code to begin"
            : "Complete your registration"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {step === 1 ? (
          <Form {...inviteForm} key={1}>
            <form
              onSubmit={inviteForm.handleSubmit(onSubmitInviteCode)}
              className="space-y-4"
              key={1}
            >
              <FormField
                control={inviteForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Invite Code</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your invite code"
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                        disabled={verifyCodeMutation.isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="w-full"
                disabled={
                  !inviteForm.formState.isValid || verifyCodeMutation.isPending
                }
              >
                {verifyCodeMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Verify Code
              </Button>
            </form>
          </Form>
        ) : (
          <Form {...registrationForm} key={2}>
            <form
              onSubmit={registrationForm.handleSubmit(onSubmitRegistration)}
              className="space-y-4"
            >
              <FormField
                control={registrationForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email"
                          disabled={registerMutation.isPending}
                        />
                      </FormControl>
                      <FormMessage />
                      {emailQuery.isError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {emailQuery.error instanceof Error
                              ? emailQuery.error.message
                              : "Email verification failed"}
                          </AlertDescription>
                        </Alert>
                      )}
                    </FormItem>
                  </FormItem>
                )}
              />

              <FormField
                control={registrationForm.control}
                name="walletAddress"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Wallet Address</FormLabel>
                    <div className="space-y-2">
                      {field.value ? (
                        <div className="flex items-center gap-2">
                          <Input {...field} disabled className="flex-1" />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={connectWallet}
                            disabled={registerMutation.isPending}
                          >
                            Change
                          </Button>
                        </div>
                      ) : (
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full"
                          onClick={connectWallet}
                          disabled={registerMutation.isPending}
                        >
                          Connect Wallet
                        </Button>
                      )}
                      <FormMessage />
                      {walletQuery.isError && (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            {walletQuery.error instanceof Error
                              ? walletQuery.error.message
                              : "Wallet verification failed"}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full"
                disabled={
                  !registrationForm.formState.isValid ||
                  emailQuery.isError ||
                  walletQuery.isError ||
                  registerMutation.isPending
                }
              >
                {registerMutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Complete Registration
              </Button>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}
