import Link from "next/link";

export const Card = ({ children, className, href, ...props }) => {
    const CardComponent = (
        <div className={`border boarder-grey-600 bg-white rounded-lg object-contain ${className}`} {...props}>
            {children}
        </div>
    )

    if (href) {
        return (
            <Link href={href} passHref>
                {CardComponent}
            </Link>
        )
    }

    return CardComponent;
}

export default Card;