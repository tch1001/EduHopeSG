import Image from "next/image"
import { Card } from "./card"

export const SubjectCard = ({ image, title, subtitle, body }) => {
    return (
        <Card>
            {
                image && <Image src={image} width={382} height={200} alt="" />
            }
            <div className="pt-2 pb-4 px-6">
                {
                    title && <p className="font-medium text-lg text-aqua">{title}</p>
                }
                {
                    subtitle && <p className="font-medium text-sm text-dark-blue">{subtitle}</p>
                }
                {
                    body && <p>{body}</p>
                }
            </div>
        </Card>
    )
}