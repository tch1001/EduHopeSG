import { useState, useContext } from "react"
import Button from "./Button"
import Card from "./Card"

import useAxios from "../helpers/useAxios"
import { dialogSettingsContext } from "../helpers/dialogContext"

export const PendingTuteeCard = ({tutee, pendingTutees, setPendingTutees, acceptedTutees, setAcceptedTutees, index}) => {
    const [loading, setLoading] = useState(false)

    const { dialogSettings, setDialogSettings, closeDialog, displayErrorDialog } = useContext(dialogSettingsContext);

    const request = useAxios()

    const handleAccept = async (tuteeData, index) => {
        const { id, given_name, family_name, relationship_id } = tuteeData

        if (loading) return;
        setLoading(true);

        try {
            const response = await request({
                method: "get",
                path: `/tutor/accept/${id}?relationshipID=${relationship_id}`
            });

            const updatedPendingTutees = [...pendingTutees]
            updatedPendingTutees.splice(index, 1)
            setPendingTutees(updatedPendingTutees)
            setAcceptedTutees([...acceptedTutees, { ...tuteeData }])

            setDialogSettings({
                title: 'Thank You!',
                message: `You can now view ${given_name} ${family_name}'s contact information under "Accepted Tutees".`,
                display: true,
                buttons: [{ text: "Close", bg: "bg-aqua", callback: closeDialog }],
            });
        } catch (err) {
            displayErrorDialog(err)

        } finally {
            setLoading(false);
        }
    }

    const handleReject = async (tuteeData, index) => {
        const { id, given_name, family_name, subject, relationship_id } = tuteeData

        if (loading) return;  

        const executeReject = async () => {
            if (loading) return;
            setLoading(true);      

            try {
                const response = await request({
                    method: "get",
                    path: `/tutor/reject/${id}?relationshipID=${relationship_id}`
                });

                const updatedPendingTutees = [...pendingTutees]
                updatedPendingTutees.splice(index, 1)
                setPendingTutees(updatedPendingTutees)

                closeDialog()

            } catch (err) {
                setDialogSettings({
                    title: err.name.toUpperCase(),
                    message: `${err.message}. ${err.details}.`,
                    display: true,
                    buttons: [{ text: "Close", bg: "bg-aqua", callback: closeDialog }],
                });

            } finally {
                setLoading(false);
            }
        }

        setDialogSettings({
            title: "Confirmation",
            message: `Please confirm that you want to decline ${given_name} ${family_name}'s request for ${subject} tutoring. This action is irreversible.`,
            buttons: [
                { text: "Cancel", bg: "bg-aqua", callback: closeDialog },
                { text: "Confirm", bg: "bg-sky-blue", callback: executeReject }
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
            </div>
            <div className="flex flex-row gap-2 mt-2">
                <Button
                    onClick={() => handleAccept(tutee, index)}
                    loading={loading}>
                    {loading ? "" : "Accept"}
                </Button>
                <Button
                    onClick={() => handleReject(tutee, index)}
                    loading={loading}
                    style={loading ? {} : { backgroundColor: "rgb(191, 231, 255, 0.2)" }}>
                    {loading ? "" : "Decline"}
                </Button>
            </div>
        </Card>
    )
}

export default PendingTuteeCard