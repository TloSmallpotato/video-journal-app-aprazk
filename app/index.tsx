
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  // TESTING MODE: Always redirect to profile page (home)
  // Authentication bypassed for testing purposes
  return <Redirect href="/(tabs)/profile" />;
}
