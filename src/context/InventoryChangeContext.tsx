import { createContext, useContext } from "react";
import { useInventoryChangesWS } from "../hooks/useInventoryChanges";

const InventoryChangeContext = createContext<any>(null);

export function InventoryChangeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const value = useInventoryChangesWS();

  return (
    <InventoryChangeContext.Provider value={value}>
      {children}
    </InventoryChangeContext.Provider>
  );
}

export const useInventoryChangeContext = () => {
  const ctx = useContext(InventoryChangeContext);

  if (!ctx) {
    throw new Error(
      "useInventoryChangeContext must be used inside InventoryChangeProvider"
    );
  }

  return ctx;
};