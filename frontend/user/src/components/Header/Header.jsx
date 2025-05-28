import { NavLink } from "react-router-dom";
import logo from "../../assets/logo.jpg"; 

function Header() {
  const navItems = [
    "Home",
    "About Us",
    "Events",
    "Branch",
    "Gallery",
    "Contact",
    "Membership",
  ];

  return (
    <header className="bg-[#0c1c35] text-white">
      <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="REST Logo" className="w-10 h-10 rounded-full" />
          <h1 className="text-xl font-bold">R.E.S.T</h1>
        </div>
        <nav className="space-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item}
              to={
                item === "Home"
                  ? "/"
                  : `/${item.toLowerCase().replace(/\s+/g, "")}`
              }
              className={({ isActive }) =>
                `px-3 py-1 rounded-full transition ${
                  isActive ? "bg-black text-white" : "hover:underline"
                }`
              }
            >
              {item}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}

export default Header;
