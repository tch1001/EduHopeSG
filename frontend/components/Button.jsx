import Link from "next/link";
import Spinner from "./Spinner";
import styles from "../styles/button.module.css"

export const Button = ({
    secondary = false,
    loading = false,
    href,
    children,
    ...props
}) => {
    const ButtonComponent = (
        <button
            className={`${styles.button} ${secondary ? styles.secondary : ""}`}
            disabled={loading}
            {...props}
        >
            {loading && <Spinner/>}
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