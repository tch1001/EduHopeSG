import { useState, useContext } from "react"
import Button from "./Button"
import Card from "./Card"
import Image from "next/image"

import useAxios from "../helpers/useAxios"
import { dialogSettingsContext } from "../helpers/dialogContext"

const ICON_SIZE = 48;
const ICON_QUALITY = 60;

export const AcceptedTutorCard = ({ tutor, acceptedTutors, setAcceptedTutors, index }) => {
    const [loading, setLoading] = useState(false)

    const { dialogSettings, setDialogSettings, closeDialog } = useContext(dialogSettingsContext);

    const request = useAxios()

    const handleRemove = (tutorData, index) => {
        const { id, given_name, family_name, subject, relationship_id } = tutorData

        if (loading) return;

        const executeRemove = async () => {
            if (loading) return;
            setLoading(true);

            try {
                const response = await request({
                    method: "delete",
                    path: `/tutee/relationship/${id}?relationshipID=${relationship_id}`
                });

                const updatedAcceptedTutors = [...acceptedTutors]
                updatedAcceptedTutors.splice(index, 1)
                setAcceptedTutors(updatedAcceptedTutors)

                closeDialog()

            } catch (err) {
                setDialogSettings({
                    title: err.name,
                    message: `${err.message}. ${err.details}`,
                    display: true,
                    buttons: [{ text: "Close", bg: "bg-aqua", callback: closeDialog }],
                });

            } finally {
                setLoading(false);
            }
        }

        setDialogSettings({
            title: "Confirmation",
            message: `Please confirm that you want to end your ${subject} tutoring relationship with ${given_name} ${family_name}. This action is irreversible`,
            buttons: [
                { text: "Cancel", bg: "bg-aqua", callback: closeDialog },
                { text: "Confirm", bg: "bg-sky-blue", callback: executeRemove }
            ],
            display: true
        })
    }

    return (
        <Card className="flex flex-col gap-3 py-4 px-6 max-w-full" key={tutor.relationship_id}>
            <div>
                <h1 className="text-xl font-bold">{tutor.subject}</h1>
            </div>
            <div className="flex flex-col gap-4">
                <div>
                    <p className="text-dark-blue font-bold">
                        {`${tutor.given_name} ${tutor.family_name}`}, {" "}
                        <span className="text-black font-semibold">{tutor.school}</span>
                    </p>
                    <p className="text-black italic">{tutor.level_of_education}</p>
                    <p className="mt-2 mb-2">{tutor.description}</p>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold">{"Preferred Consultation Mode(s)"}</h3>
                    <ul className="flex flex-col gap-2 list-disc ml-5">
                        {tutor.preferred_communications.map((method, index) => <li key={index}>{method.split("_").join(" ")}</li>)}
                    </ul>
                </div>
                <div className="flex flex-col gap-2">
                    <h3 className="text-base font-bold">Contact Information</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                className="rounded-full md:w-9 h-auto"
                                src="/images/telegram.png"
                                alt="Tutor's Telegram Handle"
                                width={ICON_SIZE}
                                height={ICON_SIZE}
                                quality={ICON_QUALITY}
                            />
                            <p>{tutor.telegram}</p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                className="rounded-full md:w-9 h-auto"
                                src="/images/email.png"
                                alt="Tutor's Email"
                                width={ICON_SIZE}
                                height={ICON_SIZE}
                                quality={ICON_QUALITY}
                            />
                            <p>{tutor.email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-4">
                <Button
                    onClick={() => handleRemove(tutor, index)}
                    loading={loading}>
                    {loading ? "" : "Remove"}
                </Button>
            </div>
        </Card>
    )
}