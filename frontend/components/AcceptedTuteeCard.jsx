import { useState, useContext } from "react"
import Button from "./Button"
import Card from "./Card"
import Image from "next/image"

import useAxios from "../helpers/useAxios"
import { dialogSettingsContext } from "../helpers/dialogContext"

const ICON_SIZE = 48;
const ICON_QUALITY = 60;

export const AcceptedTuteeCard = ({tutee, acceptedTutees, setAcceptedTutees, index}) => {
    const [loading, setLoading] = useState(false)

    const { dialogSettings, setDialogSettings, closeDialog, displayErrorDialog } = useContext(dialogSettingsContext);

    const request = useAxios()

    const handleRemove = (tuteeData, index) => {
        const { id, given_name, family_name, subject, relationship_id } = tuteeData

        if (loading) return;

        const executeRemove = async () => {
            if (loading) return;
            setLoading(true);

            try {
                const response = await request({
                    method: "delete",
                    path: `/tutor/relationship/${id}?relationshipID=${relationship_id}`
                });

                const updatedAcceptedTutees = [...acceptedTutees]
                updatedAcceptedTutees.splice(index, 1)
                setAcceptedTutees(updatedAcceptedTutees)

                closeDialog()

            } catch (err) {
                displayErrorDialog(err)

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
        <Card className="flex flex-col gap-3 py-4 px-6 max-w-full">
            <div>
                <h1 className="text-xl font-bold">{tutee.subject}</h1>
            </div>
            <div>
                <p className="text-dark-blue font-bold">
                    {`${tutee.given_name} ${tutee.family_name}`}, {" "}
                    <span className="text-black font-semibold">{tutee.school}</span>
                </p>
                <p className="text-black italic">{tutee.level_of_education}</p>
                <p className="mt-2 mb-2">{tutee.description}</p>
                <div className="flex flex-col gap-2 mt-5 mb-2">
                    <h3 className="text-base font-bold">Contact Information</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                className="rounded-full md:w-9 h-auto"
                                src="/images/telegram.png"
                                alt="Tutee's Telegram Handle"
                                width={ICON_SIZE}
                                height={ICON_SIZE}
                                quality={ICON_QUALITY}
                            />
                            <p>{tutee.telegram}</p>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <Image
                                className="rounded-full md:w-9 h-auto"
                                src="/images/email.png"
                                alt="Tutee's Email"
                                width={ICON_SIZE}
                                height={ICON_SIZE}
                                quality={ICON_QUALITY}
                            />
                            <p>{tutee.email}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-2">
                <Button
                    onClick={() => handleRemove(tutee, index)}
                    loading={loading}>
                    {loading ? "" : "Remove"}
                </Button>
            </div>
        </Card>
    )
}