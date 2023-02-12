import Image from "next/image"

export const Card = ({ children, className }) => {
    return (
        <div className={`border boarder-grey-600 bg-white rounded-lg max-w-sm overflow-hidden object-contain ${className}`}>
            {children}
        </div>
    )
}