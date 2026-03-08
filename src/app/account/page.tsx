import { siteConfig } from "@/config/site";
import { Metadata, NextPage } from "next/types";
import { cache, Suspense } from "react";
import dynamic from "next/dynamic";
import { createClient } from "@/utils/supabase/server";

const UnauthorizedNotice = dynamic(() => import("@/components/ui/notice/Unauthorized"));
const AccountDetails = dynamic(() => import("./client"));

export const metadata: Metadata = {
  title: `Account | ${siteConfig.name}`,
  description: "Manage your Cinema Dekhi profile and basic data.",
};

const getUser = cache(async () => {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
});

const AccountPage: NextPage = async () => {
  const { user, error } = await getUser();

  return (
    <Suspense>
      {error || !user ? (
        <UnauthorizedNotice
          title="Sign in to viw your account"
          description="Create a free account or login to access your profile."
        />
      ) : (
        <AccountDetails />
      )}
    </Suspense>
  );
};

export default AccountPage;
