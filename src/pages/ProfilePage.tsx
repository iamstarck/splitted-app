import { ModeToggle } from "@/components/common/ModeToggle";
import BackButton from "../shared/components/BackButton";
import { UserIcon } from "lucide-react";
import ProfileForm from "../features/profile/components/ProfileForm";
import Footer from "../shared/components/Footer";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";
import { useSelectProfileName } from "@/stores/selectors/profile.selectors";
import { useNavigate } from "react-router-dom";

const ProfilePage = () => {
  const navigate = useNavigate();

  const profileName = useSelectProfileName();

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl m-4 min-h-screen justify-between">
        <div className="w-full">
          <header className="flex flex-col p-6 max-w-2xl justify-between w-full gap-6">
            <div className="flex items-center justify-between w-full">
              <BackButton onClick={() => navigate("/")} />
              <div className="flex items-center gap-4 max-md:gap-2">
                <ProfileAvatar />
                <ModeToggle />
              </div>
            </div>

            <h1 className="text-4xl font-bold flex items-center gap-4">
              <UserIcon size={"36px"} /> Your Profile
            </h1>
          </header>

          <main className="flex flex-col items-center p-6 w-full gap-8">
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
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default ProfilePage;
