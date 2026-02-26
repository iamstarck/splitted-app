import AvatarInitials from "@/shared/components/AvatarInitials";
import { useSelectProfileName } from "@/stores/selectors/profile.selectors";

const ProfileAvatar = () => {
  const profileName = useSelectProfileName();

  return <AvatarInitials name={profileName} className="h-12 w-12" />;
};

export default ProfileAvatar;
