import AvatarInitials from "@/shared/components/AvatarInitials"
import { useSelectProfile } from "@/stores/selectors/profile.selectors"
import { Link } from "react-router-dom"
import { m } from "motion/react"

const ProfileAvatar = () => {
  const profileName = useSelectProfile().name

  return (
    <div id="tour-profile">
      <Link to="/profile" aria-label="Edit profile">
        <m.div
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <AvatarInitials
            name={profileName}
            className="size-12 cursor-pointer"
          />
        </m.div>
      </Link>
    </div>
  )
}

export default ProfileAvatar
