import { useContext } from "react";
import { AppContext } from "./AppContext";

const Overlay = () => {
  const { isOverlayVisible } = useContext(AppContext);
// console.log("stc", overlayColor)
  if (!isOverlayVisible) return null;

  return (
    <div className="fixed top-0 right-0 h-screen w-screen z-50 flex justify-center items-center bg-gray-100 opacity-[70%]">
      <div className={`animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary`}></div>
    </div>
  );
};

export default Overlay;





