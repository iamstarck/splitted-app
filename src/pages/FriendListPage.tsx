import { ModeToggle } from "@/components/common/ModeToggle";
import { ItemGroup } from "@/components/ui/item";
import { ScrollArea } from "@/components/ui/scroll-area";
import PersonItem from "@/shared/components/PersonItem";
import FriendForm from "@/features/friend/components/FriendForm";
import ProfileAvatar from "@/features/profile/components/ProfileAvatar";
import BackButton from "@/shared/components/BackButton";
import EmptyListPlaceholder from "@/shared/components/EmptyListPlaceholder";
import { useSelectFriend } from "@/stores/selectors/friend.selectors";
import { useDataStore } from "@/stores/useDataStore";
import { UsersIcon } from "lucide-react";
import { Footer } from "react-day-picker";
import { useNavigate } from "react-router-dom";

const FriendListPage = () => {
  const navigate = useNavigate();

  const friendList = useSelectFriend();
  const deleteFriend = useDataStore((state) => state.removeFriend);

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
              <UsersIcon size={"36px"} /> Friends
            </h1>
          </header>

          <main className="flex flex-col items-center p-6 w-full gap-8">
            <div className="flex flex-col items-center justify-center gap-6 w-full">
              <FriendForm />

              {friendList.length > 0 ? (
                <ScrollArea className="flex flex-col w-full max-h-150 pr-4  overflow-y-auto">
                  <ItemGroup className="space-y-2 w-full">
                    {friendList.map((friend) => (
                      <PersonItem
                        key={friend.id}
                        person={friend}
                        onAction={deleteFriend}
                      />
                    ))}
                  </ItemGroup>
                </ScrollArea>
              ) : (
                <EmptyListPlaceholder
                  icon={<UsersIcon size={90} />}
                  message="Zero friends here"
                  subMessage="Sad life, go make one"
                />
              )}
            </div>
          </main>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default FriendListPage;
