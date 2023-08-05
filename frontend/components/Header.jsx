import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from './Button';
import { Icon } from "./Icon";
import useUser from '../helpers/useUser';
import { DropdownMenu } from './Dropdown';

export const Header = () => {
    const [navbar, setNavbar] = useState(false);
    const [user, { logout }] = useUser();
    const router = useRouter()

    useEffect(() => {
        window.addEventListener("resize", () => {
            if (window.innerWidth >= 640) setNavbar(false);
        })
    }, [])

    const handleNavbar = (e) => {
        e.preventDefault();
        setNavbar(!navbar);
    }

    // TODO: Show "my tutors" if user has tutors or have tutor requests

    const Links = () => {
        return (
            <>
                <Link href="/subjects" passHref>
                    Find a tutor
                </Link>          
                <Link href="/about" passHref>
                    About us
                </Link>
                {
                    user.id ? (
                        <>
                            {user.is_tutor && <Link href="/manage-tutees" passHref>My tutees</Link>}
                            <Link href="/manage-tutors" passHref>My tutors</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/faq" passHref>FAQ</Link>
                            <Link href="/signup/tutor" passHref>Become a Tutor</Link>                                  
                        </>
                    )
                }
            </>
        )
    }

    const HiddenLinks = () => {
        return (
            <>
                <Link href="/edit-profile" passHref>Edit profile</Link>
                <div onClick={() => logout() && (window.location.href = "/")}>Logout</div>
            </>
        )
    }

    const HiddenSection = () => {
        if (!user.id) {
            return (
                <Button secondary href={`/login?originalURL=${router.asPath}`}>
                    Login
                </Button>
            )
        }

        return (
            <div>
                <DropdownMenu dropdownContent={HiddenLinks()}>
                    <div
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
                </DropdownMenu>

            </div>
        )
    }

    return (
        <header className={`px-14 py-2 bg-blue text-sm font-medium ${navbar ? "rounded-b-md" : ""}`}>
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
                    <HiddenSection />
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
                <HiddenLinks />
            </nav>
        </header>
    );
};

export default Header;