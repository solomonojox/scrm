import { BookOpen, Menu } from "lucide-react";
import { Link } from "react-router-dom";
import imageAssets from "../../assets/imageAssets";

const Navbar = () => {
  return (
    <nav className="bg-white border-b border-orange-100 sticky top-0 z-40 shadow-sm">
      <div className="flex items-center justify-between px-6 py-4">
        {/* LEFT */}
        <div className="flex items-center space-x-4">
          <button className="lg:hidden text-gray-600 hover:text-orange-600">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center space-x-3">
            <div className="flex flex-col items-center">
              <Link to="/">
                <img
                  src={imageAssets.logo}
                  alt="EduCat logo"
                  width={96}
                  height={44}
                  className="block"
                />
              </Link>
              <p className="text-xs text-gray-500">Computer Based Testing System</p>
            </div>
            <div>{/* <h1 className="text-xl font-bold text-orange-600">Educat CBT</h1> */}</div>
          </div>
        </div>

        {/* RIGHT - Not Authenticated Buttons */}
        <div className="hidden md:flex items-center space-x-3">
          <Link
            to="/cbt/login"
            className="px-4 py-2 text-sm font-semibold text-orange-600 border border-orange-300 
            rounded-lg hover:bg-orange-50 transition"
          >
            Login
          </Link>

          <Link
            to="/cbt/registerschool"
            className="px-4 py-2 text-sm font-semibold text-white bg-orange-500 
            rounded-lg hover:bg-orange-600 transition"
          >
            Register School
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
