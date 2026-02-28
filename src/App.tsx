import { useLocation, useRoutes } from "react-router-dom";
import { ThemeProvider } from "./components/common/theme-provider";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewBillPage from "./pages/NewBillPage";
import { Toaster } from "./components/ui/sonner";
import { useDataStore } from "./stores/useDataStore";
import { useEffect, useLayoutEffect, type ReactNode } from "react";
import BillDetailPage from "./pages/BillDetailPage";

const Wrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation();

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return children;
};

const Routes = () => {
  const element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/new", element: <NewBillPage /> },
    { path: "/detail/:billId", element: <BillDetailPage /> },
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
      <Wrapper>
        <Routes />
        <Toaster />
      </Wrapper>
    </ThemeProvider>
  );
};

export default App;
