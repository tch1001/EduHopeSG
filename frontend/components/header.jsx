import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Button } from './button';
import { Icon } from "./icon";

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

    const handleLoginRoute = (e) => {
        e.preventDefault();
        router.push("/login")
    }

    const handleNavbar = (e) => {
        e.preventDefault();
        setNavbar(!navbar);
    }

    return (
        <header className={`px-12 py-2 bg-blue text-sm font-medium ${navbar ? "rounded-b-md" : ""}`}>
            <div className="flex flex-row w-full justify-between">
                <Image
                    className="rounded-full md:w-11 h-auto"
                    alt="Eduhope logo"
                    src="/logo.png"
                    width={55}
                    height={55}
                    onClick={() => router.push("/")}
                />
                <nav className="hidden sm:flex flex-row gap-x-5 my-auto">
                    <div className="flex flex-row gap-x-5 my-auto">
                        <Links />
                    </div>
                    <Button onClick={handleLoginRoute}>
                        Login
                    </Button>
                </nav>
                <Button className="sm:hidden" onClick={handleNavbar}>
                    <Icon icon="hamburger-3" />
                </Button>
            </div>
            <nav className={`flex flex-col items-center justify-center space-y-2 py-2 text-base ${navbar ? "block" : "hidden"}`}>
                <Links />
                <Button onClick={(handleLoginRoute)}>
                    Login
                </Button>
            </nav>
        </header>
    );
};