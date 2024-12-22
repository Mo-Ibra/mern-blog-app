"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

const Header = () => {

  const { user, logout } = useAuth();

  console.log(user);

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="text-sm md:text-2xl font-bold text-gray-800">
          My Blog
        </Link>
        <nav>
          <ul className="flex space-x-4">
            <li>
              <Link href="/" className="text-sm md:text-base text-gray-600 hover:text-gray-800">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-sm md:text-base text-gray-600 hover:text-gray-800">
                About
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className="text-sm md:text-base text-gray-600 hover:text-gray-800"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>
        <div className="flex space-x-2">
          {user && user ? (
            <>
              <Button variant="outline" asChild>
                <Link href="/profile">Profile</Link>
              </Button>
              <Button type="submit" onClick={logout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" asChild>
                <Link href="/auth/login">Log In</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;