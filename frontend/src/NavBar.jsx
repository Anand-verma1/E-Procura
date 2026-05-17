import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/spring_lab.png";

function NavBar() {
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/", { replace: true });
  };

  return (
    <nav className="bg-[var(--primaryAccent)] text-white px-4 sm:px-6 py-3 shadow-md">
      <div className="flex justify-between items-center flex-wrap gap-2">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="SPring Labs Logo"
            className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
          />

          <div className="flex flex-col leading-tight">
            <span className="text-lg sm:text-2xl font-bold">E-Procura</span>
            <span className="text-xs text-white/80">by SPrIng Labs</span>
          </div>
        </Link>

        {/* Right Side */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          {token ? (
            <>
              {/* Role-based Dashboard */}
              {role === "PI" && (
                <Link to="/pi-dashboard" className="hover:underline text-sm sm:text-base">
                  PI Dashboard
                </Link>
              )}

              {role === "RND" && (
                <Link to="/rnd-dashboard" className="hover:underline text-sm sm:text-base">
                  R&D Dashboard
                </Link>
              )}

              {role === "DORD" && (
                <Link to="/DORD-dashboard" className="hover:underline text-sm sm:text-base">
                  DORD Dashboard
                </Link>
              )}

              {/* User Info */}
              <span className="text-xs sm:text-sm bg-white/20 px-2 sm:px-3 py-1 rounded-lg">
                {name} ({role})
              </span>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded-lg text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/" className="hover:underline text-sm sm:text-base">
              SignUp/Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
