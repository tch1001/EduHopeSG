import { useContext } from "react";
import { dialogSettingsContext } from "../helpers/dialogContext";

const dialogTestPage = () => {

    const { dialogSettings, setDialogSettings } = useContext(dialogSettingsContext);

    const onClickButton = () => {
        setDialogSettings({
            title: 'TEST',
            message: 'This is a test',
            buttons: [
                { text: "Close", bg: "bg-dark-aqua", callback: () => { console.log("Close"); setDialogSettings({ display: false }) } },
                { text: "Open", bg: "bg-dark-blue", callback: () => { console.log("Open") } }
            ], // Each button is represented by an object with 3 properties: text, bg and callback.
            display: true
        })
    }

    return (
        <button className="p-6 bg-gray-200 m-auto" onClick={onClickButton}>Trigger dialog</button>
    )
}

export default dialogTestPage