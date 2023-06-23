import { useState } from "react"
import Container from "../components/Container"
import { PendingTutorCard } from "../components/PendingTutorCard"
import { AcceptedTutorCard } from "../components/AcceptedTutorCard"

import useAxios from "../helpers/useAxios"

const ManageTutors = ({ initPendingTutors, initAcceptedTutors, error }) => {
    const [pendingTutors, setPendingTutors] = useState(initPendingTutors)
    const [acceptedTutors, setAcceptedTutors] = useState(initAcceptedTutors)

    console.log(pendingTutors)
    console.log(acceptedTutors)
    if (error) {
        return <div>{error}</div>
    }

    return (
        <Container className="flex flex-col gap-6 p-6 max-w-5xl">
            <h1 className="text-2xl font-bold">Tutor Requests</h1>
            {pendingTutors.length == 0 && (
                <p>You do not have any pending tutor requests.</p>
            )}
            {pendingTutors.map((tutor, index) => (
                <PendingTutorCard
                    key={index}
                    tutor={tutor}
                    index={index}
                    pendingTutors={pendingTutors}
                    setPendingTutors={setPendingTutors}
                    acceptedTutors={acceptedTutors}
                    setAcceptedTutors={setAcceptedTutors}
                />
            ))}
            <h1 className="text-2xl font-bold">Accepted Tutors</h1>
            {acceptedTutors.length == 0 && (
                <p>You do not have any existing tutors.</p>
            )}
            {acceptedTutors.map((tutor, index) => (
                <AcceptedTutorCard
                    key={index}
                    tutor={tutor}
                    index={index}
                    pendingTutors={pendingTutors}
                    setPendingTutors={setPendingTutors}
                    acceptedTutors={acceptedTutors}
                    setAcceptedTutors={setAcceptedTutors}
                />
            ))}
        </Container>
    )

}

export default ManageTutors


export const getServerSideProps = async ({ req }) => {

    const request = useAxios()

    try {
        const response = await request({
            method: "get",
            path: "/tutee/relationships",
            headers: {
                Cookie: req.headers.cookie
            }
        });
        console.log(response)

        const pendingTutors = response.filter(relationship => relationship.status == "PENDING")
        const acceptedTutors = response.filter(relationship => relationship.status == "ACCEPTED")

        // Exclude contact information of pending tutors from the payload for privacy & security reasons
        pendingTutors.forEach(relationship => {
            relationship.telegram = null
            relationship.email = null
        })

        console.log(pendingTutors)
        console.log(acceptedTutors)
        return {
            props: {
                initPendingTutors: pendingTutors,
                initAcceptedTutors: acceptedTutors
            }
        }

    } catch (e) {
        if (e.status == 401) {
            return {
                redirect: {
                    destination: '/login?originalURL=/manage-tutors',
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