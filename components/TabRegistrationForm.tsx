/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { InviteRegistrationForm } from "./InviteRegistrationForm";
import { NFTRegistrationForm } from "./NFTRegistrationForm";

export function RegistrationForm() {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Registration</CardTitle>
        <CardDescription>Choose your registration method</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="invite">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="invite">Invite Code</TabsTrigger>
            <TabsTrigger value="nft">NFT Staking</TabsTrigger>
          </TabsList>

          <TabsContent value="invite">
            <InviteRegistrationForm />
          </TabsContent>

          <TabsContent value="nft">
            <NFTRegistrationForm />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
