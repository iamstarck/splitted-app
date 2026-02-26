import { ModeToggle } from "@/components/common/ModeToggle";
import { Button } from "@/components/ui/button";
import BillListSection from "@/features/home/components/BillListSection";
import HomeMenuButton from "@/features/home/components/HomeMenuButton";
import ProfileName from "@/features/home/components/ProfileName";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";
import EmptyListPlaceholder from "@/shared/components/EmptyListPlaceholder";
import Footer from "@/shared/components/Footer";
import { ListIcon, PlusIcon, UserIcon } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col items-center w-full max-w-2xl m-4 min-h-screen justify-between">
        <div className="w-full">
          <header className="flex items-start p-6 max-w-2xl justify-between w-full">
            <div>
              <h1 className="text-4xl font-bold select-none">Splitted</h1>
              <ProfileName />
            </div>

            <div className="flex items-center gap-4">
              <ProfileAvatar />
              <ModeToggle />
            </div>
          </header>

          <main className="flex flex-col justify-center items-center p-6 w-full gap-6">
            <div className="flex gap-4">
              <HomeMenuButton
                text="Profile"
                icon={<UserIcon />}
                pageRef="profile"
              />
            </div>

            <div className="flex flex-col items-center justify-center gap-6 text-center w-full">
              <Button size={"lg"} className="w-md" asChild>
                <Link to={"/new"} className="flex items-center gap-1">
                  <PlusIcon />
                  Create New Bill
                </Link>
              </Button>

              <EmptyListPlaceholder
                icon={<ListIcon size={90} />}
                message="No saved bill yet"
                subMessage="Create your first bill"
              />

              <div className="hidden">
                <BillListSection />
              </div>
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default HomePage;
