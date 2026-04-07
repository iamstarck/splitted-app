import { useLocation } from "react-router-dom";
import { HelpCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { driver } from "driver.js";

const HelpGuide = () => {
  const location = useLocation();

  const startTour = () => {
    const isHome = location.pathname === "/";
    const isNewBill = location.pathname === "/new";
    const isEditBill = location.pathname.startsWith("/edit/");
    const isScanBill = location.pathname === "/scan-bill";
    const isProfile = location.pathname === "/profile";
    const isFriends = location.pathname === "/friends";
    const isBillDetail = location.pathname.startsWith("/bill/");

    let steps: any[] = [];

    // Global steps that exist on almost every page header
    const themeStep = { 
      element: "#tour-theme", 
      popover: { title: "Theme", description: "Toggle between light and dark modes.", side: "bottom", align: "start" } 
    };
    const profileStep = { 
      element: "#tour-profile", 
      popover: { title: "Profile", description: "Click your avatar to manage your profile settings.", side: "bottom", align: "start" } 
    };

    if (isHome) {
      steps = [
        { element: "#tour-create-bill", popover: { title: "Create Bill", description: "Start here to manually create a new split bill.", side: "bottom", align: "center" } },
        { element: "#tour-scan-bill", popover: { title: "Scan Receipt", description: "Use camera or upload an image. Our OCR reads the items for you!", side: "bottom", align: "center" } },
        profileStep,
        themeStep
      ];
    } else if (isNewBill || isEditBill) {
      steps = [
        { element: "#tour-meta-section", popover: { title: "Bill Info", description: "Enter the title, date, currency, and any notes.", side: "top" } },
        { element: "#tour-people-section", popover: { title: "Add People", description: "Select from friends or type a new name to add someone to this bill.", side: "top" } },
        { element: "#tour-items-section", popover: { title: "Add Items", description: "List the items and their prices. Then tap on the people to assign who pays what.", side: "top" } },
        { element: "#tour-charges-section", popover: { title: "Tax & Service", description: "Input extra charges. They are automatically proportioned to everyone.", side: "top" } },
        { element: "#tour-summary", popover: { title: "Result Summary", description: "Check out the final calculated splits per person here.", side: "top" } },
      ];
    } else if (isScanBill) {
      steps = [
        { popover: { title: "Camera & Upload", description: "Point your camera at a receipt and hold steady, or switch to gallery to upload an existing receipt photo. Our system will extract the item names and prices." } }
      ];
    } else if (isProfile) {
      steps = [
        { popover: { title: "Your Profile", description: "Update your display name here. Your initials are used for your avatar." } }
      ];
    } else if (isFriends) {
      steps = [
        { popover: { title: "Your Friends", description: "Manage your friends list. Adding friends here makes it easier to select them quickly when splitting a bill later." } }
      ];
    } else if (isBillDetail) {
      steps = [
        { popover: { title: "Bill Summary", description: "This is the final summary. You can see who owes what. Use the top right menu to edit or delete the bill, or download it using the button below." } }
      ];
    } else {
      steps = [
        profileStep,
        themeStep
      ];
    }

    const driverObj = driver({
      showProgress: true,
      animate: false,
      smoothScroll: false,
      nextBtnText: "Next",
      prevBtnText: "Previous",
      doneBtnText: "Done",
      steps: steps.filter(step => {
        // Only include steps where element exists on page, or if it's a floating popover (no element)
        return !step.element || document.querySelector(step.element);
      })
    });

    driverObj.drive();
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={startTour}
      className="relative shrink-0"
      aria-label="Interactive Tour Guide"
    >
      <HelpCircleIcon className="h-4 w-4" />
    </Button>
  );
};

export default HelpGuide;

