import { useContext } from "react";
import Button from "./Button";
import { dialogSettingsContext } from "../helpers/dialogContext";

import styles from "../styles/dialog.module.css";


export function Dialog() {
    const { dialogSettings, closeDialog } = useContext(dialogSettingsContext);


    return (
        <div
            className="transition ease-in-out duration-200"
            style={{ opacity: dialogSettings.display ? 100 : 0 }}
        >
            {
                dialogSettings.display && (
                    <div className={styles.background} onClick={closeDialog}>
                        <div
                            className={styles.dialog}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={styles.title}>{dialogSettings.title}</div>
                            <div className={styles.message}>{dialogSettings.message}</div>
                            <div className={styles.buttonGroup}>
                                {
                                    dialogSettings.buttons.map(({ callback, bg, text }, index) => (
                                        <Button
                                            key={index}
                                            onClick={callback}
                                            className={`${bg} ${styles.button}`}
                                        >
                                            {text}
                                        </Button>
                                    ))
                                }
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}

