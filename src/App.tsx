import AppRoutes from "./routes/AppRoutes";
import { InventoryChangeProvider } from "./context/InventoryChangeContext";

export default function App() {
  return (
    <InventoryChangeProvider>
      <AppRoutes />
    </InventoryChangeProvider>
  );
}