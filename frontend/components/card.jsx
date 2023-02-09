import Image from "next/image"

export const Card = ({ image, title, subtitle, body }) => {
    return (
        <div className="border boarder-grey-600 bg-white rounded-lg max-w-sm overflow-hidden object-contain">
            {
                image && <Image src={image} width={382} height={200} />
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
        </div>
    )
}