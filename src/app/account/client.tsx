"use client";

import useSupabaseUser from "@/hooks/useSupabaseUser";
import { Avatar, Button, Card, CardBody, CardHeader, Divider, Spinner } from "@heroui/react";
import { env } from "@/utils/env";
import { User, Logout } from "@/utils/icons";
import { signOut } from "@/actions/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";
import ApiKeysSection from "./ApiKeysSection";

export default function AccountDetails() {
  const { data: user, isLoading } = useSupabaseUser();
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  if (isLoading) {
    return (
      <div className="flex h-[50vh] w-full items-center justify-center">
        <Spinner size="lg" color="primary" />
      </div>
    );
  }

  if (!user) return null;

  const handleLogout = async () => {
    setLoggingOut(true);
    await signOut();
    router.push("/auth");
  };

  const username = user.username || "User";
  const avatar = `${env.NEXT_PUBLIC_AVATAR_PROVIDER_URL}?seed=${encodeURIComponent(username || user.email || "guest")}&size=120&backgroundColor=b8d2a8,8dc4bc`;

  return (
    <div className="flex w-full flex-col items-center justify-center pt-10 md:pt-20">
      <Card className="w-full max-w-md bg-white/5 p-4 shadow-lg backdrop-blur-md">
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar
            showFallback
            src={avatar}
            className="size-24 text-large"
            fallback={<User size={40} />}
          />
          <div className="flex flex-col items-center">
            <h1 className="text-2xl font-bold">{username}</h1>
            <p className="text-muted text-sm">{user.email}</p>
          </div>
        </CardHeader>
        <Divider className="my-4 bg-white/10" />
        <CardBody className="flex flex-col gap-4">
          <div className="flex w-full flex-col gap-1">
            <span className="text-muted text-xs uppercase tracking-wider">Account ID</span>
            <span className="truncate text-sm font-medium">{user.id}</span>
          </div>
          <div className="flex w-full flex-col gap-1">
            <span className="text-muted text-xs uppercase tracking-wider">Provider</span>
            <span className="text-sm font-medium capitalize">{user.app_metadata?.provider || "Email"}</span>
          </div>
          <div className="flex w-full flex-col gap-1">
            <span className="text-muted text-xs uppercase tracking-wider">Created At</span>
            <span className="text-sm font-medium">
              {new Date(user.created_at).toLocaleDateString()}
            </span>
          </div>

          <Button
            color="danger"
            variant="flat"
            isLoading={loggingOut}
            startContent={!loggingOut && <Logout size={18} />}
            onPress={handleLogout}
            className="mt-6 font-semibold"
          >
            Sign Out
          </Button>
        </CardBody>
      </Card>

      <ApiKeysSection />
    </div>
  );
}
