import { dialogSettingsContext } from "../helpers/dialogContext";
import { useContext } from "react";
import Button from "./Button";

export function Dialog() {
    const { dialogSettings, closeDialog } = useContext(dialogSettingsContext);


    return (
        <div
            className="transition ease-in-out duration-200"
            style={{ opacity: dialogSettings.display ? 100 : 0 }}
        >
            {
                dialogSettings.display && (
                    <div className="fixed inset-0 bg-black/50 " onClick={closeDialog}>
                        <div
                            className="flex flex-col gap-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg min-w-sm"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="text-2xl text-dark-blue font-bold text-center">{dialogSettings.title}</div>
                            <div className="text-base text-black">{dialogSettings.message}</div>
                            <div className="flex flex-row flex-wrap gap-4 ml-auto">
                                {
                                    dialogSettings.buttons.map(({ callback, bg, text }, index) => (
                                        <Button
                                            key={index}
                                            onClick={callback}
                                            className={`px-2 py-1.5 ${bg} text-white border-none cursor-pointer rounded-md`}
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

