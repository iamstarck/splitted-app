import AvatarInitials from "@/shared/components/AvatarInitials";
import { useSelectProfile } from "@/stores/selectors/profile.selectors";

const ProfileAvatar = () => {
  const profileName = useSelectProfile().name;

  return <AvatarInitials name={profileName} className="h-12 w-12" />;
};

export default ProfileAvatar;
