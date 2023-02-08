import Link from 'next/link';
import Image from 'next/image';

export const Header = () => {
    return (
        <header>
            <div className="flex flex-row w-full justify-between px-12 py-2 bg-blue">
                <Image className="rounded-full" alt="Eduhope logo" src="/logo.png" width={55} height={55} />
                <nav className="flex flex-row gap-x-5 my-auto text-xl font-medium">
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
                </nav>
            </div>
        </header>
    );
};