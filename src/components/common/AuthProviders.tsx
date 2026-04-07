"use client";

import { Provider } from "react-redux";
import { store } from "@/redux/store";

interface AuthProvidersProps {
  children: React.ReactNode;
}

export default function AuthProviders({ children }: AuthProvidersProps) {
  return <Provider store={store}>{children}</Provider>;
}
