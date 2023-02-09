import Link from 'next/link';
import Image from 'next/image';
import { Button } from './button';

const FooterLinkSection = () => {

}

export const Footer = () => {
    return (
        <footer className="bg-blue text-sm px-12 p-5">
            <div className="flex flex-wrap flex-row gap-y-5 lg:gap-y-0 gap-x-12 justify-evenly">
                <Image src="/logo.png" className="w-32 h-auto" width={93} height={126} />
                <div className="flex flex-col gap-y-0.5">
                    <p className="text-xs uppercase font-semibold text-gray-800">Subjects</p>
                    <Link href="/subjects?stream=n_level" passHref>
                        GCE N-Level tutors
                    </Link>
                    <Link href="/subjects?stream=o_level" passHref>
                        GCE O-Level tutors
                    </Link>
                    <Link href="/subjects?stream=a_level" passHref>
                        GCE A-Level tutors
                    </Link>
                    <Link href="/subjects?stream=ip" passHref>
                        IP tutors
                    </Link>
                    <Link href="/subjects?stream=ib" passHref>
                        IB tutors
                    </Link>
                </div>
                <div className="flex flex-col gap-y-0.5">
                    <p className="text-xs uppercase font-semibold text-gray-800">About</p>
                    <Link href="/about" passHref>
                        About us
                    </Link>
                    <Link href="/team" passHref>
                        Our team
                    </Link>
                    <Link href="/tutor-registration" passHref>
                        Become a tutor
                    </Link>
                    <Link href="/contact" passHref>
                        Contact us
                    </Link>
                    <Link href="/faq" passHref>
                        FAQ
                    </Link>
                </div>
                <div className="flex flex-col gap-y-0.5">
                    <p className="text-xs uppercase font-semibold text-gray-800">Legal</p>
                    <Link href="/terms" passHref>
                        Terms of Service
                    </Link>
                    <Link href="/privacy" passHref>
                        Privacy Policy
                    </Link>
                    <Link href="/guidelines/tutor" passHref>
                        Tutor guidelines
                    </Link>
                    <Link href="/guidelines/tutee" passHref>
                        Tutee guidelines
                    </Link>
                </div>
                <div className="flex flex-col gap-1">
                    <div>
                        <p className="text-xs uppercase font-semibold text-gray-800">Connect with us</p>
                        <div className="grid grid-cols-3 gap-x-2 my-1">
                            <Image className="rounded-full md:w-11 h-auto" src="/images/facebook.png" width={43} height={43} />
                            <Image className="rounded-full md:w-11 h-auto" src="/images/instagram.png" width={43} height={43} />
                            <Image className="rounded-full md:w-11 h-auto" src="/images/email.png" width={43} height={43} />
                        </div>
                    </div>
                    <div>
                        <p className="text-xs uppercase font-semibold text-gray-800">Supported by</p>
                        <Image className="md:w-11 h-auto" src="/images/msf.png" width={43} height={43} />
                    </div>
                </div>
            </div>
            <p className="text-white text-xs text-center mt-5">Copyright © 2023 EduHope. All rights reserved.</p>
        </footer>
    )
}