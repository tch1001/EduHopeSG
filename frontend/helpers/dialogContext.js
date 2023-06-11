import { useState, createContext } from "react";

export const dialogSettingsContext = createContext(null);

function DialogContext({ children }) {
    const [dialogSettings, setDialogSettings] = useState({
        title: '',
        message: '',
        buttons: [], // Each button is represented by an object with 3 properties: text, bg and callback.
        display: false
    });

    const closeDialog = () => {
        setDialogSettings({ ...dialogSettings, display: false });
    }


    return (
        <dialogSettingsContext.Provider value={{ dialogSettings, setDialogSettings, closeDialog }}>
            {children}
        </dialogSettingsContext.Provider>
    );
}

export default DialogContext