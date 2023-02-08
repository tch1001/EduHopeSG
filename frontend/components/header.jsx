import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import { Button } from './button';

export const Header = () => {
    const router = useRouter();

    const handleLoginRoute = (e) => {
        e.preventDefault();
        router.push("/login")
    }

    return (
        <header>
            <div className="flex flex-row w-full justify-between px-12 py-2 bg-blue">
                <Image className="rounded-full" alt="Eduhope logo" src="/logo.png" width={55} height={55} />
                <nav className="flex flex-row gap-x-5 my-auto text-sm font-medium">
                    <div className="flex flex-row gap-x-5 my-auto">
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
                    </div>
                    <Button onClick={handleLoginRoute}>
                        Login
                    </Button>
                </nav>
            </div>
        </header>
    );
};