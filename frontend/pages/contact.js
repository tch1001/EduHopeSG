import React, { useState } from 'react';
import { useFormik } from "formik";
import Link from 'next/link'
import Button from "../components/Button";
import Container from "../components/Container";
import FormErrorDisplay from "../components/FormErrorDisplay";

import useAxios from "../helpers/useAxios";
import Yup from "../helpers/Yup";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { faTiktok as faTikTok, faInstagram, faTelegram } from '@fortawesome/free-brands-svg-icons'

import styles from '../styles/Contact.module.css'

const Contact = () => {
    const [sending, setSending] = useState(false);
    const request = useAxios();

    const MessageSchema = Yup.object({
        name: Yup.string()
            .min(3, "Name has to be at least 3 characters")
            .max(35, "Name is too long")
            .matches(/^[A-Z][a-zA-Z]*(?:\s[A-Z][a-zA-Z]*)*$/, "Capitalise the first letter of every word")
            .required("Required"),
        email: Yup.string()
            .email("Invalid email address")
            .required("Required")
            .max(320, "Email address too long"),
        message: Yup.string()
            .min(32, "Message is too short (at least 32 characters)")
            .max(8000, "Message is too long (at most 8,000 characters)")
            .required("Message is required")

    });

    const sendMessage = async (data) => {
        setSending(true);

        request({
            method: "post",
            path: "/contact",
            data
        })
            .finally(() => setSending(false));
    };

    const formik = useFormik({
        validationSchema: MessageSchema,
        onSubmit: sendMessage,
        initialValues: {
            name: "",
            email: "",
            message: ""
        },
    });

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
                                <Button className={styles.contactSocialMedia} role="button">
                                    Tutee Sign-Up
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                            <Link href="https://forms.gle/rGfEasoyakNT4oMb8" target="_blank" passHref>
                                <Button className={styles.contactSocialMedia} role="button">
                                    Tutor Sign-Up
                                </Button>
                            </Link>
                        </div>
                        <div className="mt-3 sm:mt-0 sm:ml-3">
                            <Link href="https://forms.gle/1URf8q3MxHeFzefF9" target="_blank" passHref>
                                <Button className={styles.contactSocialMedia} role="button">
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
                                    <Button className={styles.contactSocialMedia} role="button">
                                        <FontAwesomeIcon icon={faTelegram} size="2xl" />
                                        <div className="hidden lg:block">Telegram</div>
                                    </Button>
                                </Link>
                                <Link href="https://www.instagram.com/eduhopesg/" target="_blank" passHref>
                                    <Button className={styles.contactSocialMedia} role="button">
                                        <FontAwesomeIcon icon={faInstagram} size="2xl" />
                                        <div className="hidden lg:block">Instagram</div>
                                    </Button>
                                </Link>
                                <Link href="https://www.tiktok.com/@eduhopesg" target="_blank" passHref>
                                    <Button className={styles.contactSocialMedia} role="button">
                                        <FontAwesomeIcon icon={faTikTok} size="2xl" />
                                        <div className="hidden lg:block">TikTok</div>
                                    </Button>
                                </Link>
                                <a href="mailto:eduhopesg@gmail.com">
                                    <Button className={styles.contactSocialMedia} role="button">
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
                                    <FormErrorDisplay field="name" formik={formik} />
                                    <label for="name" className="text-sm font-medium text-gray-900 block mb-2">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        placeholder="Name"
                                        autoComplete="name"
                                        required
                                        className={styles.input}
                                        {...formik.getFieldProps("name")}
                                    />
                                </div>
                                <div className="col-span-6 sm:col-span-3">
                                    <FormErrorDisplay field="email" formik={formik} />
                                    <label for="email" className="text-sm font-medium text-gray-900 block mb-2">Email</label>
                                    <input
                                        type="text"
                                        name="email"
                                        id="email"
                                        placeholder="Email address"
                                        autoComplete="email"
                                        required
                                        className={styles.input}
                                        {...formik.getFieldProps("email")}
                                    />
                                </div>
                                <div className="col-span-full mb-5">
                                    <FormErrorDisplay field="message" formik={formik} />
                                    <label for="message" className="text-sm font-medium text-gray-900 block mb-2">Message</label>
                                    <textarea
                                        type="text"
                                        rows="6"
                                        id="message"
                                        placeholder="Type your message here..."
                                        required
                                        className="bg-gray-50 resize-none border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-cyan-600 focus:border-cyan-600 block w-full p-4"
                                        {...formik.getFieldProps("message")}
                                    />
                                </div>
                            </div>
                            <Button onClick={formik.handleSubmit} disabled={sending}>{sending ? "Sending..." : "Send"}</Button>
                        </form>
                    </div>
                </div>
            </main>
        </Container>
    )
}

export default Contact