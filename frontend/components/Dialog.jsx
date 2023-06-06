import { dialogSettingsContext } from "../helpers/dialogContext";
import { useContext } from "react";

export function Dialog() {

    const { dialogSettings, setDialogSettings } = useContext(dialogSettingsContext);
    const closeDialog = () => {
        setDialogSettings({
            title: '',
            message: '',
            buttons: [], // Each button is represented by an object with 3 properties: text, bg and callback.
            display: false
        })
    }

    if (!dialogSettings.display) return

    return (
        <div className="fixed inset-0 bg-black/50" onClick={closeDialog}>
            <div className="flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-xl" onClick={(e) => e.stopPropagation()}>
                <div className="text-2xl text-dark-blue font-bold text-center">{dialogSettings.title}</div>
                <div className="text-base text-black text-center">{dialogSettings.message}</div>
                <div className="flex flex-row flex-wrap gap-4 m-auto">
                    {dialogSettings.buttons.map((button_props, index) => {
                        return (
                            <button
                                key={index}
                                onClick={button_props.callback}
                                className={`p-2.5 ${button_props.bg} text-white border-none cursor-pointer rounded-lg`}
                            >{button_props.text}</button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
}

