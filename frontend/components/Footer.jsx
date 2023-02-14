import Link from 'next/link';
import Image from 'next/image';

const ICON_SIZE = 48;
const ICON_QUALITY = 60;

const FooterSectionHeader = ({ children }) => (
    <p className="mb-1.5 text-xs uppercase font-semibold text-gray-800">
        {children}
    </p>
)

export const Footer = () => {
    return (
        <footer className="bg-blue text-md md:text-sm px-12 p-5">
            <div className="grid gap-8 xs:gap-5 grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-5">
                <Image src="/logo.png" alt="EduHope logo" className="w-32 h-auto" width={93} height={126} quality={50} />
                <div>
                    <FooterSectionHeader>Subjects</FooterSectionHeader>
                    <div className="flex flex-col gap-y-2 md:gap-y-0.5">
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
                </div>
                <div>
                    <FooterSectionHeader>About</FooterSectionHeader>
                    <div className="flex flex-col gap-y-2 md:gap-y-0.5">
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
                </div>
                <div>
                    <FooterSectionHeader>Legal</FooterSectionHeader>
                    <div className="flex flex-col gap-y-2 md:gap-y-0.5">
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
                </div>
                <div className="flex flex-col gap-1.5">
                    <div>
                        <FooterSectionHeader>Connect with us</FooterSectionHeader>
                        <div className="grid grid-cols-3 gap-2 my-1">
                            <Link href="https://t.me/eduhopesg/" target="_blank" passHref>
                                <Image
                                    className="rounded-full md:w-11 h-auto"
                                    src="/images/telegram.png"
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    quality={ICON_QUALITY}
                                    alt="Our Telegram channel"
                                />
                            </Link>
                            <Link href="https://www.instagram.com/eduhopesg/" target="_blank" passHref>
                                <Image
                                    className="rounded-full md:w-11 h-auto"
                                    src="/images/instagram.png"
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    quality={ICON_QUALITY}
                                    alt="Our Instagram account"

                                />
                            </Link>
                            <Link href="https://www.tiktok.com/@eduhopesg" target="_blank" passHref>
                                <Image
                                    className="rounded-full md:w-11 h-auto"
                                    src="/images/tiktok.png"
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    quality={ICON_QUALITY}
                                    alt="Our TikTok account"
                                />
                            </Link>
                            <Link href="mailto:contact@eduhopesg.com" passHref>
                                <Image
                                    className="rounded-full md:w-11 h-auto"
                                    src="/images/email.png"
                                    width={ICON_SIZE}
                                    height={ICON_SIZE}
                                    quality={ICON_QUALITY}
                                    alt="Our email address"
                                />
                            </Link>
                        </div>
                    </div>
                    <div>
                        <FooterSectionHeader>Supported by</FooterSectionHeader>
                        <Image
                            className="md:w-11 h-auto"
                            src="/images/msf.png"
                            width={ICON_SIZE}
                            height={ICON_SIZE}
                            quality={1}
                            alt="Ministry of Social and Family Development logo"
                        />
                    </div>
                </div>
            </div>
            <p className="text-gray-600 text-xs text-center mt-5">Copyright © 2023 EduHope. All rights reserved.</p>
        </footer>
    )
}

export default Footer;