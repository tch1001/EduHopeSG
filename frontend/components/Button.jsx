import Link from "next/link";

export const Button = ({ secondary = false, href, children, ...props }) => {
    const styling = secondary ? "boarder-grey-600 bg-white" : "border-sky-blue bg-[#bfe7ff]";

    const ButtonComponent = (
        <button className={`border ${styling} px-6 py-2 rounded-md`} {...props}>
            {children}
        </button>
    );

    if (href) {
        return (
            <Link href={href} passHref>
                {ButtonComponent}
            </Link>
        )
    }

    return ButtonComponent;
}

export default Button;