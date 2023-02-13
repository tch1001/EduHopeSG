import Image from "next/image"
import { Card } from "./card"

export const SubjectCard = ({ image, name, stream, tutors, ...props }) => {
    return (
        <Card {...props}>
            {
                image && <Image src={image} width={382} height={200} alt="" />
            }
            <div className="pt-2 pb-4 px-6">
                {
                    name && <p className="font-medium text-lg text-dark-aqua">{name}</p>
                }
                {
                    stream && <p className="font-medium text-sm text-dark-blue">{stream}</p>
                }
                {
                    tutors && <p>{tutors} tutors are available to teach</p>
                }
            </div>
        </Card>
    )
}