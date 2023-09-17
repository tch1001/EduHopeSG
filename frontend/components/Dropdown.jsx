import styles from "../styles/dropdown.module.css";

export const DropdownMenu = ({ children, dropdownContent }) => {
    return (
        <div className={styles.dropdown}>
            {children}
            <div className={styles['dropdown-content']}>
                {dropdownContent}
            </div>
        </div>

    )
}