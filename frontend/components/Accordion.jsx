import { useState } from "react";
import { Icon } from "./Icon";

const AccordionItem = ({ header, body }) => {
    const [toggle, setToggle] = useState(false);
    
    const handleToggle = () => {
        setToggle(!toggle);
    }
    
    return (
        <div className="p-3">
            <button
                className={`flex flex-row justify-between text-left w-full font-semibold ${toggle ? "text-dark-blue" : ""}`}
                onClick={handleToggle}
            >
                <span>{header}</span>
                <Icon
                    className={toggle ? "rotate-180" : ""}
                    icon="chevron-down"
                    alt=""
                    width={3}
                    height={3}
                />
            </button>
            <div
                className="mt-4"
                style={{ display: toggle ? "" : "none" }}
            >
                {body}
            </div>
        </div>
    );
}

export const Accordion = ({ items }) => {
    return (
        <div className="border boarder-grey-600 divide-y bg-white rounded-lg">
            {
                items.map(({ header, body }, key) => (
                    <AccordionItem key={key} header={header} body={body} />
                ))
            }
        </div>
    );
}

export default Accordion;