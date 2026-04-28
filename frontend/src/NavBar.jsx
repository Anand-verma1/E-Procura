import { Link, useNavigate } from "react-router-dom";

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
    <nav className="bg-[var(--primaryAccent)] text-white px-6 py-3 shadow-md">
      <div className="flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold">
          E-Procura
        </Link>

        {/* Right Side */}
        <div className="flex items-center gap-6">
          {token ? (
            <>
              {/* Role-based Dashboard */}
              {role === "PI" && (
                <Link to="/pi-dashboard" className="hover:underline">
                  PI Dashboard
                </Link>
              )}

              {role === "RND" && (
                <Link to="/rnd-dashboard" className="hover:underline">
                  R&D Dashboard
                </Link>
              )}

              {role === "DEAN" && (
                <Link to="/dean-dashboard" className="hover:underline">
                  Dean Dashboard
                </Link>
              )}

              {/* User Info */}
              <span className="text-sm bg-white/20 px-3 py-1 rounded-lg">
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
            <Link to="/" className="hover:underline">
              SignUp/Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;
