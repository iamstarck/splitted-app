import { ModeToggle } from "@/components/common/ModeToggle";
import BackButton from "../shared/components/BackButton";
import HelpGuide from "@/shared/components/HelpGuide";
import { UserIcon } from "lucide-react";
import ProfileForm from "../features/profile/components/ProfileForm";
import Footer from "../shared/components/Footer";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";
import { useSelectProfile } from "@/stores/selectors/profile.selectors";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/shared/animations/PageTransition";
import { motion } from "framer-motion";

const ProfilePage = () => {
  const navigate = useNavigate();

  const profileName = useSelectProfile().name;

  return (
    <PageTransition>
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl min-h-screen justify-between">
        <div className="w-full">
          <header className="flex flex-col p-6 max-w-2xl justify-between w-full gap-6">
            <div className="flex items-center justify-between w-full">
              <BackButton onClick={() => navigate("/")} />
              <div className="flex items-center gap-4 max-md:gap-2">
                <ProfileAvatar />
                <HelpGuide />
                <ModeToggle />
              </div>
            </div>

            <motion.h1
              className="text-4xl font-bold flex items-center gap-4"
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] as const }}
            >
              <UserIcon size={"36px"} /> Your Profile
            </motion.h1>
          </header>

          <motion.main
            className="flex flex-col items-center p-6 w-full gap-8"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              <div className="w-full space-y-4">
                <h2 className="text-xl">
                  Current Name:
                  <span className="ml-2 text-xl font-semibold">
                    {profileName}
                  </span>
                </h2>
                <ProfileForm />
              </div>
            </div>
          </motion.main>
        </div>

        <Footer />
      </div>
    </div>
    </PageTransition>
  );
};

export default ProfilePage;
