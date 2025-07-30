import { Slot, useRouter, useRootNavigationState } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { getCurrentSession } from "./lib/appwrite";

export default function RootLayout() {
  const router = useRouter();
  const navigationState = useRootNavigationState();
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!navigationState?.key) return;

    const checkSession = async () => {
      const isLoggedIn = await getCurrentSession();

      if (!isLoggedIn) {
        router.replace("/auth");
      }

      setCheckingSession(false);
    };

    checkSession();
  }, [navigationState?.key]);



  return <Slot />;
}
