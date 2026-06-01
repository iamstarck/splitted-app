import { useLocation } from "react-router-dom"
import { HelpCircleIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { driver, DriveStep } from "driver.js"

const HelpGuide = () => {
  const location = useLocation()

  const startTour = () => {
    const isHome = location.pathname === "/"
    const isNewBill = location.pathname === "/new"
    const isEditBill = location.pathname.startsWith("/edit/")
    const isScanBill = location.pathname === "/scan-bill"
    const isProfile = location.pathname === "/profile"
    const isFriends = location.pathname === "/friends"
    const isBillDetail = location.pathname.startsWith("/bill/")

    let steps: DriveStep[] = []

    const themeStep: DriveStep = {
      element: "#tour-theme",
      popover: {
        title: "Mood Setter",
        description:
          "Switch to dark mode if your eyes (or your soul) need a break.",
        side: "bottom",
        align: "start"
      }
    }

    const profileStep: DriveStep = {
      element: "#tour-profile",
      popover: {
        title: "The Accountant",
        description:
          "Tap here to manage your profile. Try to use a name your friends actually recognize.",
        side: "bottom",
        align: "start"
      }
    }

    if (isHome) {
      steps = [
        {
          element: "#tour-create-bill",
          popover: {
            title: "The Reckoning",
            description:
              "Kick off a new split from scratch. Type in the damage and make sure no one 'forgets' their share this time. Boss move.",
            side: "bottom",
            align: "center"
          }
        },
        {
          element: "#tour-scan-bill",
          popover: {
            title: "The Easy Way (Soon!)",
            description:
              "Dreaming of just snapping a photo? Our AI is still in training. For now, keep those thumbs moving!",
            side: "bottom",
            align: "center"
          }
        },
        {
          element: "#tour-friends-list",
          popover: {
            title: "The Buddies",
            description:
              "Your master list of debtors. Add your buddies here first before you can group them up.",
            side: "bottom",
            align: "center"
          }
        },
        {
          element: "#tour-friends-group",
          popover: {
            title: "The Gang (Soon!)",
            description:
              "Group your favorite freeloaders so you don't have to pick them one by one. Patience, it's coming soon!",
            side: "bottom",
            align: "center"
          }
        },
        profileStep,
        themeStep
      ]
    } else if (isNewBill || isEditBill) {
      steps = [
        {
          element: "#tour-meta-section",
          popover: {
            title: "Name the Disaster",
            description:
              "Give this bill a solid information so you don't forget why you're suddenly broke.",
            side: "top"
          }
        },
        {
          element: "#tour-people-section",
          popover: {
            title: "The Suspects",
            description:
              "Who's in? Add your friends to the list before they try to sneak away.",
            side: "top"
          }
        },
        {
          element: "#tour-items-section",
          popover: {
            title: "The Damage",
            description:
              "List the items and pin them to whoever actually ate them. No freeloading!",
            side: "top"
          }
        },
        {
          element: "#tour-charges-section",
          popover: {
            title: "Hidden Fees",
            description:
              "Tax and service charges. Add them here so everyone shares the pain.",
            side: "top"
          }
        },
        {
          element: "#tour-summary",
          popover: {
            title: "The Verdict",
            description:
              "The math is done. Now no one can use the 'I forgot my wallet' excuse.",
            side: "top"
          }
        }
      ]
    } else if (isScanBill) {
      steps = [
        {
          popover: {
            title: "Hold it Right There",
            description:
              "Keep your hands steady. If the receipt is a mess, just upload a photo from your gallery."
          }
        }
      ]
    } else if (isProfile) {
      steps = [
        {
          popover: {
            title: "Identity Check",
            description:
              "Update your display name here. Make it something your friends will actually recognize."
          }
        }
      ]
    } else if (isFriends) {
      steps = [
        {
          popover: {
            title: "The Inner Circle",
            description:
              "Manage your buddies. Remember: one friend, one slot. Don't try to clone them."
          }
        }
      ]
    } else if (isBillDetail) {
      steps = [
        {
          popover: {
            title: "The Proof",
            description:
              "Here's the breakdown. Share it with the group as solid evidence of who owes what."
          }
        }
      ]
    } else {
      steps = [profileStep, themeStep]
    }

    const driverObj = driver({
      showProgress: true,
      animate: true,
      popoverClass: "driverjs-theme",
      smoothScroll: false,
      nextBtnText: "Next",
      prevBtnText: "Previous",
      doneBtnText: "Done",
      steps: steps.filter(step => {
        if (!step.element) return true

        return document.querySelector(step.element as string) !== null
      })
    })

    driverObj.drive()
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={startTour}
      className="relative shrink-0"
      aria-label="Interactive Tour Guide"
    >
      <HelpCircleIcon className="size-4" />
    </Button>
  )
}

export default HelpGuide
