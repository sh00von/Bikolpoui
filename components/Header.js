// components/Header.js
import Link from 'next/link';

const Header = () => {
  return (
    <div className="navbar bg-base-100 shadow-md">
      <div className="flex-1">
        <Link href="/">
          <span className="btn btn-ghost text-xl">BikOlpoo</span>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/">
              <span className="hover:underline">Home</span>
            </Link>
          </li>
          <li>
            <Link href="/products">
              <span className="hover:underline">Products</span>
            </Link>
          </li>
          {/* Add more menu items here if needed */}
        </ul>
      </div>
    </div>
  );
};

export default Header;
