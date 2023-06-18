import { useState, createContext } from "react";

export const dialogSettingsContext = createContext(null);

function DialogContext({ children }) {
    const [dialogSettings, setDialogSettings] = useState({
        title: "",
        message: "",
        // Each button is represented by an object with 3 properties: text, bg and callback.
        buttons: [{ text: "Close", bg: "bg-aqua", callback: closeDialog }],
        display: false
    });

    function openDialog() {
        setDialogSettings({ ...dialogSettings, display: true });
    }

    function closeDialog() {
        setDialogSettings({ ...dialogSettings, display: false });
    }

    return (
        <dialogSettingsContext.Provider value={{ dialogSettings, setDialogSettings, openDialog, closeDialog }}>
            {children}
        </dialogSettingsContext.Provider>
    );
}

export default DialogContext