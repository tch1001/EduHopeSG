import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Button } from './Button';
import { Icon } from "./Icon";

const Links = () => {
    return (
        <>
            <Link href="/subjects" passHref>
                Find a tutor
            </Link>
            <Link href="/about" passHref>
                About us
            </Link>
            <Link href="/faq" passHref>
                FAQ
            </Link>
            <Link href="/get-involved" passHref>
                Get involved
            </Link>
        </>
    )
}


export const Header = () => {
    const router = useRouter();
    const [navbar, setNavbar] = useState(false);

    useEffect(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 640) setNavbar(false);
        })
    }, [])

    const handleNavbar = (e) => {
        e.preventDefault();
        setNavbar(!navbar);
    }

    const LoginButton = () => (
        <Button secondary href="/login">
            Login
        </Button>
    )

    return (
        <header className={`px-12 py-2 bg-blue text-sm font-medium ${navbar ? "rounded-b-md" : ""}`}>
            <div className="flex flex-row w-full justify-between">
                <Image
                    className="rounded-full md:w-11 h-auto"
                    alt="Eduhope logo"
                    src="/logo.png"
                    quality={1}
                    width={55}
                    height={55}
                    onClick={() => router.push("/")}
                />
                <nav className="hidden sm:flex flex-row gap-x-5 my-auto">
                    <div className="flex flex-row gap-x-5 my-auto">
                        <Links />
                    </div>
                    <LoginButton />
                </nav>
                <Button
                    className="sm:hidden"
                    onClick={handleNavbar}
                    aria-label="Dropdown menu for navigation links"
                >
                    <Icon icon="hamburger-3" alt="" />
                </Button>
            </div>
            <nav className={`flex flex-col items-center justify-center gap-y-3 py-2 text-base ${navbar ? "block" : "hidden"}`}>
                <Links />
                <LoginButton />
            </nav>
        </header>
    );
};