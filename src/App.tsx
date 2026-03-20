import { useLocation, useRoutes } from "react-router-dom";
import { ThemeProvider } from "./components/common/theme-provider";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewBillPage from "./pages/NewBillPage";
import { Toaster } from "./components/ui/sonner";
import { useLayoutEffect, type ReactNode } from "react";
import BillDetailPage from "./pages/BillDetailPage";
import EditBillPage from "./pages/EditBillPage";
import FriendListPage from "./pages/FriendListPage";
import ScanBillPage from "./pages/ScanBillPage";

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
    { path: "/friends", element: <FriendListPage /> },
    { path: "/new", element: <NewBillPage /> },
    { path: "/scan-bill", element: <ScanBillPage /> },
    { path: "/detail/:billId", element: <BillDetailPage /> },
    { path: "/edit/:billId", element: <EditBillPage /> },
  ]);

  return element;
};

const App = () => {
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
