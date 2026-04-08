import { ModeToggle } from "@/components/common/ModeToggle";
import { ItemGroup } from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import PersonItem from "@/shared/components/PersonItem";
import FriendForm from "@/features/friend/components/FriendForm";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";
import BackButton from "@/shared/components/BackButton";
import HelpGuide from "@/shared/components/HelpGuide";
import EmptyListPlaceholder from "@/shared/components/EmptyListPlaceholder";
import { useSelectFriend } from "@/stores/selectors/friend.selectors";
import { useDataStore } from "@/stores/useDataStore";
import { UsersIcon } from "lucide-react";
import Footer from "@/shared/components/Footer";
import { useNavigate } from "react-router-dom";
import PageTransition from "@/shared/animations/PageTransition";
import { StaggerContainer, StaggerItem } from "@/shared/animations/StaggerAnimation";
import { motion } from "framer-motion";

const FriendListPage = () => {
  const navigate = useNavigate();

  const friendList = useSelectFriend();
  const deleteFriend = useDataStore((state) => state.removeFriend);

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
              <UsersIcon size={"36px"} /> Friends
            </motion.h1>
          </header>

          <motion.main
            className="flex flex-col items-center p-6 w-full gap-8"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.15 }}
          >
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              <FriendForm />

              {friendList.length > 0 ? (
                <ScrollArea className="flex flex-col w-full max-h-150 pr-4  overflow-y-auto">
                  <StaggerContainer className="space-y-2 w-full">
                    {friendList.map((friend) => (
                      <StaggerItem key={friend.id}>
                        <ItemGroup>
                          <PersonItem
                            person={friend}
                            onAction={deleteFriend}
                          />
                        </ItemGroup>
                      </StaggerItem>
                    ))}
                  </StaggerContainer>
                </ScrollArea>
              ) : (
                <EmptyListPlaceholder
                  icon={<UsersIcon size={90} />}
                  message="Zero friends here"
                  subMessage="Sad life, go make one"
                />
              )}
            </div>
          </motion.main>
        </div>

        <Footer />
      </div>
    </div>
    </PageTransition>
  );
};

export default FriendListPage;
