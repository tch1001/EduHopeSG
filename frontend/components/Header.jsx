import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './Button';
import { Icon } from "./Icon";
import useUser from '../helpers/useUser';

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
    const [navbar, setNavbar] = useState(false);

    const [userMenuStates, setUserMenuStates] = useState({
        left: 0,
        top: 0,
        display: "none"
    });

    const [user, { logout }] = useUser();

    useEffect(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 640) setNavbar(false);
        })
    }, [])

    const handleNavbar = (e) => {
        e.preventDefault();
        setNavbar(!navbar);
    }

    const UserSection = () => {
        if (!user.id) {
            return (
                <Button secondary href="/login">
                    Login
                </Button>
            )
        }

        return (
            <div
                onMouseEnter={handleUserActions}
                onMouseLeave={handleUserActions}
                onTouchStart={handleUserActions}
                onTouchEnd={handleUserActions}
            >
                <div
                    id="user-bar"
                    className="flex flex-row gap-1 items-center"
                >
                    <Icon
                        icon="user-circle"
                        className="w-6 h-6"
                        alt=""
                        width={3}
                        height={3}
                    />
                    <Icon
                        icon="chevron-down"
                        className="w-4 h-4"
                        alt=""
                        width={3}
                        height={3}
                    />
                </div>
                <div
                    id="user-menu"
                    className="z-10 p-2 text-base  border border-black bg-white rounded absolute min-w-[154px]"
                    style={{ ...userMenuStates }}
                >
                    <div>Tutee Dashboard</div>
                    <div>Tutor Dashboard</div>
                    <div>Settings</div>
                    <div onClick={logout}>Logout</div>
                </div>

            </div>
        )
    }

    function handleUserActions(e) {
        e.preventDefault();

        const { display } = userMenuStates;

        const displays = {
            "none": "initial",
            "initial": "none"
        }

        const { offsetLeft, offsetTop, offsetHeight } = document.getElementById("user-bar");

        console.log(offsetLeft, offsetTop)

        setUserMenuStates({
            left: offsetLeft - 154 / 2,
            top: offsetTop + offsetHeight + 4,
            display: displays[display]
        });
    }

    return (
        <header className={`px-12 py-2 bg-blue text-sm font-medium ${navbar ? "rounded-b-md" : ""}`}>
            <div className="flex flex-row w-full justify-between">
                <Link href="/" passHref>
                    <Image
                        className="rounded-full md:w-11 h-auto"
                        alt="Eduhope logo"
                        src="/logo.png"
                        quality={1}
                        width={55}
                        height={55}
                    />
                </Link>
                <nav className="hidden sm:flex flex-row gap-x-5 my-auto">
                    <div className="flex flex-row gap-x-5 my-auto">
                        <Links />
                    </div>
                    <UserSection />
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
                <UserSection />
            </nav>
        </header>
    );
};

export default Header;