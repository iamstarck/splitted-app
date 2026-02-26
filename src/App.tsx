import { useRoutes } from "react-router-dom";
import { ThemeProvider } from "./components/common/theme-provider";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import NewBillPage from "./pages/NewBillPage";

const Routes = () => {
  const element = useRoutes([
    { path: "/", element: <HomePage /> },
    { path: "/profile", element: <ProfilePage /> },
    { path: "/new", element: <NewBillPage /> },
  ]);

  return element;
};

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="splitted-theme">
      <Routes />
    </ThemeProvider>
  );
};

export default App;
