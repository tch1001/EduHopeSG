import { useState } from "react"
import Container from "../components/Container"
import { PendingTuteeCard } from "../components/PendingTuteeCard"
import { AcceptedTuteeCard } from "../components/AcceptedTuteeCard"

import useAxios from "../helpers/useAxios"

const ManageTutees = ({ initPendingTutees, initAcceptedTutees, error }) => {
    const [pendingTutees, setPendingTutees] = useState(initPendingTutees)
    const [acceptedTutees, setAcceptedTutees] = useState(initAcceptedTutees)

    if (error) {
        return <div>{error}</div>
    }

    return (
        <Container className="flex flex-col gap-6 p-6 max-w-5xl">
            <h1 className="text-2xl font-bold">Tutee Requests {`(${pendingTutees.length})`}</h1>
            {pendingTutees.length == 0 && (
                <div className="flex flex-col gap-1">
                    <p>{"You do not have any pending tutee requests."}</p>
                    <p> {"We'll send you an email notification when a student requests for your tutoring services!"}</p>
                    <p>{"In the meantime, you can browse the "} <a href="/subjects" className="underline text-dark-blue hover:text-blue">Find a tutor</a> {" page to view your profile!"}</p>
                </div>
            )}
            {pendingTutees.map((tutee, index) => (
                <PendingTuteeCard
                    key={tutee.relationship_id}
                    tutee={tutee}
                    index={index}
                    pendingTutees={pendingTutees}
                    setPendingTutees={setPendingTutees}
                    acceptedTutees={acceptedTutees}
                    setAcceptedTutees={setAcceptedTutees}
                />
            ))}
            <h1 className="text-2xl font-bold">Accepted Tutees {`(${acceptedTutees.length})`}</h1>
            {acceptedTutees.length == 0 && (
                <p>You do not have any existing tutees.</p>
            )}
            {acceptedTutees.map((tutee, index) => (
                <AcceptedTuteeCard
                    key={tutee.relationship_id}
                    tutee={tutee}
                    index={index}
                    pendingTutees={pendingTutees}
                    setPendingTutees={setPendingTutees}
                    acceptedTutees={acceptedTutees}
                    setAcceptedTutees={setAcceptedTutees}
                />
            ))}
        </Container>
    )

}

export default ManageTutees


export const getServerSideProps = async ({ req }) => {

    const request = useAxios()

    try {
        const response = await request({
            method: "get",
            path: "/tutor/relationships",
            headers: {
                Cookie: req.headers.cookie
            }
        });
        console.log(response)

        const pendingTutees = response.filter(relationship => relationship.status == "PENDING")
        const acceptedTutees = response.filter(relationship => relationship.status == "ACCEPTED")
        return {
            props: {
                initPendingTutees: pendingTutees,
                initAcceptedTutees: acceptedTutees
            }
        }

    } catch (e) {
        if (e.status == 401) {
            return {
                redirect: {
                    destination: '/login?originalURL=/manage-tutees',
                    permanent: false,
                },
            }
        }

        else {
            return {
                props: {
                    error: "Error: " + e.message
                }
            }
        }
    }

}