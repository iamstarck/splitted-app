import { Route, Routes, useLocation } from "react-router-dom"
import { ThemeProvider } from "./components/common/theme-provider"
import HomePage from "./pages/HomePage"
import ProfilePage from "./pages/ProfilePage"
import NewBillPage from "./pages/NewBillPage"
import { Toaster } from "./components/ui/sonner"
import { useLayoutEffect, type ReactNode } from "react"
import BillDetailPage from "./pages/BillDetailPage"
import EditBillPage from "./pages/EditBillPage"
import FriendListPage from "./pages/FriendListPage"
import { AnimatePresence, domAnimation, LazyMotion } from "motion/react"

const Wrapper = ({ children }: { children: ReactNode }) => {
  const location = useLocation()

  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [location.pathname])

  return children
}

const AnimatedRoutes = () => {
  const location = useLocation()

  return (
    <AnimatePresence>
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/friends" element={<FriendListPage />} />
        <Route path="/new" element={<NewBillPage />} />
        <Route path="/detail/:billId" element={<BillDetailPage />} />
        <Route path="/edit/:billId" element={<EditBillPage />} />
      </Routes>
    </AnimatePresence>
  )
}

const App = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="splitted-theme">
      <LazyMotion features={domAnimation}>
        <Wrapper>
          <AnimatedRoutes />
          <Toaster />
        </Wrapper>
      </LazyMotion>
    </ThemeProvider>
  )
}

export default App
