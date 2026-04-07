import AvatarInitials from "@/shared/components/AvatarInitials";
import { useSelectProfile } from "@/stores/selectors/profile.selectors";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const ProfileAvatar = () => {
  const profileName = useSelectProfile().name;

  return (
    <div id="tour-profile">
      <Link to="/profile" aria-label="Edit profile">
        <motion.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <AvatarInitials name={profileName} className="h-12 w-12 cursor-pointer" />
        </motion.div>
      </Link>
    </div>
  );
};

export default ProfileAvatar;
