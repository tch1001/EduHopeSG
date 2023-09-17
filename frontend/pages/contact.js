import React, { useState } from 'react';
import { useFormik } from "formik";
import Link from 'next/link';
import Image from 'next/image';
import Button from "../components/Button";
import Container from "../components/Container";
import FormErrorDisplay from "../components/FormErrorDisplay";

import useAxios from "../helpers/useAxios";
import Yup from "../helpers/Yup";

import styles from '../styles/contact.module.css';

const ICON_SIZE = 36;
const ICON_QUALITY = 60;

const Contact = ({ joinUs, connectUs }) => {
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
                    <div className="sm:w-full flex flex-wrap justify-evenly lg:justify-evenly">
                        {
                            joinUs.map(({ url, name }, i) => (
                                <div className="mt-3 sm:mt-0 sm:ml-3" key={i}>
                                    <Link href={url} target="_blank" passHref>
                                        <Button className={styles.contactSocialMedia} role="button">
                                            {name}
                                        </Button>
                                    </Link>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <h2 className="text-xl font-bold">Connect With Us!</h2>

                    <div className="flex flex-col md:flex-row">
                        <div className="flex-1">
                            <div className="flex flex-wrap justify-evenly">
                                {
                                    connectUs.map(({ url, name, altText, image }, i) => (
                                        <Link href={url} target="_blank" passHref key={i}>
                                            <Button className={styles.contactSocialMedia} role="button">
                                                <Image
                                                    className="rounded-full md:w-9 h-auto"
                                                    src={image}
                                                    alt={altText}
                                                    width={ICON_SIZE}
                                                    height={ICON_SIZE}
                                                    quality={ICON_QUALITY}
                                                />
                                                <div className="hidden lg:block">{name}</div>
                                            </Button>
                                        </Link>
                                    ))
                                }
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
                                    <label htmlFor="name" className="text-sm font-medium text-gray-900 block mb-2">Name</label>
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
                                    <label htmlFor="email" className="text-sm font-medium text-gray-900 block mb-2">Email</label>
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
                                    <label for="category" className="text-sm font-medium text-gray-900 block mb-2">Category</label>
                                    <select
                                        name="category"
                                        id="category"
                                        className={styles.input} required>
                                        <option value="" disabled selected hidden>Select Category...</option>
                                        <option value="general">General Enquiries</option>
                                        <option value="technical">Technical Issues</option>
                                        <option value="">Others</option>
                                    </select>
                                </div>
                                <div className="col-span-full mb-5">
                                    <FormErrorDisplay field="message" formik={formik} />
                                    <label htmlFor="message" className="text-sm font-medium text-gray-900 block mb-2">Message</label>
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

export const getStaticProps = async () => {
    return {
        props: {
            connectUs: [
                {
                    url: "https://t.me/eduhopesg/",
                    image: "/images/telegram.png",
                    altText: "Our Telegram channel",
                    name: "Telegram"
                },
                {
                    url: "https://www.instagram.com/eduhopesg/",
                    image: "/images/instagram.png",
                    altText: "Our Instagram account",
                    name: "Instagram"
                },
                {
                    url: "https://www.tiktok.com/@eduhopesg",
                    image: "/images/tiktok.png",
                    altText: "Our TikTok account",
                    name: "TikTok"
                },
                {
                    url: "mailto:eduhopesg@gmail.com",
                    image: "/images/email.png",
                    altText: "Our email address",
                    name: "Email"
                },
            ],
            joinUs: [
                {
                    url: "https://forms.gle/go6DKruGaZUyQwLp9",
                    name: "Sign up as a tutee"
                },
                {
                    url: "https://forms.gle/rGfEasoyakNT4oMb8",
                    name: "Sign up as a tutor"
                },
                {
                    url: "https://forms.gle/1URf8q3MxHeFzefF9",
                    name: "Join as an EXCO"
                },
            ]
        }
    }
}

export default Contact