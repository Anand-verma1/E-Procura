// import { Link } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";

function NavBar() {
  return(
    <><h1>nav</h1></>
  )
}
//   const { user, logout } = useAuth();

//   return (
//     <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
//       <div className="container">
//         <Link className="navbar-brand fw-bold text-white" to="/">
//           Procure Management System
//         </Link>

//         <div className="collapse navbar-collapse">
//           <ul className="navbar-nav ms-auto">
//             {user ? (
//               <>
//                 {user.role === "PI" && (
//                   <>
//                     <li className="nav-item">
//                       <Link className="nav-link text-white" to="/dashboard">
//                         Dashboard
//                       </Link>
//                     </li>
//                     <li className="nav-item">
//                       <Link className="nav-link text-white" to="/division/sampleProject">
//                         New Project
//                       </Link>
//                     </li>
//                   </>
//                 )}

//                 {user.role === "RND" && (
//                   <li className="nav-item">
//                     <Link className="nav-link text-white" to="/dashboard">
//                       R&D Dashboard
//                     </Link>
//                   </li>
//                 )}

//                 {user.role === "DEAN" && (
//                   <li className="nav-item">
//                     <Link className="nav-link text-white" to="/dashboard">
//                       Dean Dashboard
//                     </Link>
//                   </li>
//                 )}

//                 <li className="nav-item">
//                   <button
//                     className="nav-link text-white"
//                     onClick={logout}
//                   >
//                     Logout
//                   </button>
//                 </li>
//               </>
//             ) : (
//               <li className="nav-item">
//                 <Link className="nav-link text-white" to="/">
//                   Login
//                 </Link>
//               </li>
//             )}
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

export default NavBar;
