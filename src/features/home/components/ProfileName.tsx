import { useSelectProfileName } from "@/stores/selectors/profile.selectors";

const ProfileName = () => {
  const profileName = useSelectProfileName();

  return <p className="text-xl">Wassap, {profileName}</p>;
};

export default ProfileName;
