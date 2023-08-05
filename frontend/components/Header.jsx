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
                <Link href="/subjects" className="hover:text-dark-blue" onClick={async () => { await router.push("/subjects"); setNavbar(false) }}>
                    Find a tutor
                </Link>
                {
                    user.id ? (
                        <>
                            {user.is_tutor && <Link href="/manage-tutees" className="hover:text-dark-blue" onClick={async () => { await router.push("/manage-tutees"); setNavbar(false) }}>My tutees</Link>}
                            <Link href="/manage-tutors" className="hover:text-dark-blue" onClick={async () => { await router.push("/manage-tutors"); setNavbar(false) }}>My tutors</Link>
                            <Link href="/edit-profile" className="hover:text-dark-blue" onClick={async () => { await router.push("/edit-profile"); setNavbar(false) }}>Edit profile</Link>
                        </>
                    ) : (
                        <>
                            <Link href="/signup/tutor" className="hover:text-dark-blue" onClick={async () => { await router.push("/signup/tutor"); setNavbar(false) }}>Become a Tutor</Link>
                            <Link href="/faq" className="hover:text-dark-blue" onClick={async () => { await router.push("/faq"); setNavbar(false) }}>FAQ</Link>
                            <Link href="/about" className="hover:text-dark-blue" onClick={async () => { await router.push("/about"); setNavbar(false) }}>About us</Link>
                        </>
                    )
                }
            </>
        )
    }

    const HiddenLinks = () => {
        if (!user.id) {
            return (
                <Button secondary href={`/login?originalURL=${router.asPath}`} className="hover:text-dark-blue" onClick={async () => { await router.push(`/login?originalURL=${router.asPath}`); setNavbar(false) }}>
                    Login
                </Button>
            )
        }
        return (
            <>
                <Link href="/faq" className="hover:text-dark-blue" onClick={async () => { await router.push("/faq"); setNavbar(false) }}>FAQ</Link>
                <Link href="/about" className="hover:text-dark-blue" onClick={async () => { await router.push("/about"); setNavbar(false) }}>About us</Link>                
                <div className="hover:text-dark-blue" onClick={async () => { logout(); window.location.href = "/"}}>Logout</div>
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