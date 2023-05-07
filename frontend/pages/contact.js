import Head from 'next/head'
import Image from 'next/image';
import Link from 'next/link'
import styles from '../styles/Contact.module.css'
import Button from "../components/Button";
import Container from "../components/Container";
import React, { useState } from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTiktok, faInstagram, faTelegram } from '@fortawesome/free-brands-svg-icons'

const Contact = () => {
    const [status, setStatus] = useState("Submit");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus("Sending...");
        const { name, email, message } = e.target.elements;
        let details = {
            name: name.value,
            email: email.value,
            message: message.value,
        };
        await fetch("http://localhost:3000/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(details),
        });

        setStatus("Submit");
    };

    return (
        <Container className="p-6 max-w-5xl">
            <div>
                <h1 className="text-3xl font-bold">Contact Us</h1>
                <p className="text-xl">Questions? We are more than happy to answer!</p>
            </div>

            <main className="flex flex-col gap-12 py-8">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold">Join our organisation!</h2>
                    <div className="sm:flex sm:justify-center lg:justify-evenly">
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                            <Link href="https://forms.gle/go6DKruGaZUyQwLp9" target="_blank" passHref>
                                <Button className={`${styles.contactSocialMedia} flex relative bg-blue items-center rounded-lg box-border cursor-pointer h-12 select-none touch-manipulation gap-2`} role="button">
                                    Tutee Sign-Up
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                            <Link href="https://forms.gle/rGfEasoyakNT4oMb8" target="_blank" passHref>
                                <Button className={`${styles.contactSocialMedia} flex relative bg-blue items-center rounded-lg box-border cursor-pointer h-12 select-none touch-manipulation gap-2`} role="button">
                                    Tutor Sign-Up
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                            <Link href="https://forms.gle/1URf8q3MxHeFzefF9" target="_blank" passHref>
                                <Button className={`${styles.contactSocialMedia} flex relative bg-blue items-center rounded-lg box-border cursor-pointer h-12 select-none touch-manipulation gap-2`} role="button">
                                    EXCO Sign-Up
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Connect With Us!</h2>

                    <div className="flex flex-col md:flex-row">
                        <div className="flex-1 m-6">
                            <div className="flex flex-wrap justify-evenly">
                                <Link href="https://t.me/eduhopesg/" target="_blank" passHref>
                                    <Button className={`${styles.contactSocialMedia} flex relative bg-blue items-center rounded-lg box-border cursor-pointer h-12 select-none touch-manipulation gap-2`} role="button">
                                        <FontAwesomeIcon icon={faTelegram} size="2xl" />
                                        <div className="hidden lg:block">Telegram</div>
                                    </Button>
                                </Link>
                                <Link href="https://www.instagram.com/eduhopesg/" target="_blank" passHref>
                                    <Button className={`${styles.contactSocialMedia} flex relative bg-blue items-center rounded-lg box-border cursor-pointer h-12 select-none touch-manipulation gap-2`} role="button">
                                        <FontAwesomeIcon icon={faInstagram} size="2xl" />
                                        <div className="hidden lg:block">Instagram</div>
                                    </Button>
                                </Link>
                                <Link href="https://www.tiktok.com/@eduhopesg" target="_blank" passHref>
                                    <Button className={`${styles.contactSocialMedia} flex relative bg-blue items-center rounded-lg box-border cursor-pointer h-12 select-none touch-manipulation gap-2`} role="button">
                                        <FontAwesomeIcon icon={faTiktok} size="2xl" />
                                        <div className="hidden lg:block">TikTok</div>
                                    </Button>
                                </Link>
                                <a href="mailto:eduhopesg@gmail.com">
                                    <Button className={`${styles.contactSocialMedia} flex relative bg-blue items-center rounded-lg box-border cursor-pointer h-12 select-none touch-manipulation gap-2`} role="button">
                                        <FontAwesomeIcon icon={faEnvelope} size="2xl" />
                                        <div className="hidden lg:block">Email</div>
                                    </Button>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Message Us!</h2>
                    <div className="space-y-6">
                        <form>
                            <div className="grid grid-cols-6 gap-6">
                                <div className="col-span-6 sm:col-span-3">
                                    <label for="name" className="text-sm font-medium text-gray-900 block mb-2">Name</label>
                                    <input className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" type="text" name="name" id="name" placeholder="Name" required />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <label for="name" className="text-sm font-medium text-gray-900 block mb-2">Email</label>
                                    <input className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-2.5" type="email" name="email" id="email" placeholder="Email Address" required />
                                </div>
                                <div className="col-span-full mb-5">
                                    <label for="message" className="text-sm font-medium text-gray-900 block mb-2">Message</label>
                                    <textarea className="bg-gray-50 resize-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4" rows="6" id="message" placeholder="Type your message here..." required />
                                </div>
                            </div>
                            <div>
                                <Button class="py-3 px-8" type="submit">{status}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </Container>
    )
}

export default Contact