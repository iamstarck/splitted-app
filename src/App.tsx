import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "./components/common/theme-provider";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewBillPage from "./pages/NewBillPage";
import { Toaster } from "./components/ui/sonner";
import { useDataStore } from "./stores/useDataStore";
import { useEffect } from "react";

const Routes = () => {
  const element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/new", element: <NewBillPage /> },
  ]);

  return element;
};

const App = () => {
  const { loadDummyBills } = useDataStore();

  useEffect(() => {
    loadDummyBills();
  }, [loadDummyBills]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="splitted-theme">
      <Routes />
      <Toaster />
    </ThemeProvider>
  );
};

export default App;
