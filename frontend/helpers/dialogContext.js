import { useState, createContext } from "react";

export const dialogSettingsContext = createContext(null);



function DialogContext({ children }) {
    const [dialogSettings, setDialogSettings] = useState({
        title: '',
        message: '',
        buttons: [], // Each button is represented by an object with 3 properties: text, bg and callback.
        display: false
    });


    return (
        <dialogSettingsContext.Provider value={{ dialogSettings, setDialogSettings }}>
            {children}
        </dialogSettingsContext.Provider>
    );
}

export default DialogContext