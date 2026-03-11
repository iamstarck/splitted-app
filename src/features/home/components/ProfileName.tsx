import { useSelectProfile } from "@/stores/selectors/profile.selectors";

const ProfileName = () => {
  const profileName = useSelectProfile().name;

  return <p className="text-xl">Wassap, {profileName}</p>;
};

export default ProfileName;
