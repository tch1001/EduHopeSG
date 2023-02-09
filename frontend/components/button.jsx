export const Button = ({ children, secondary = false, ...props }) => {
    const styling = secondary ? "boarder-grey-600 bg-white" : "border-sky-blue bg-[#bfe7ff]";

    return (
        <button className={`border ${styling} px-6 py-2 rounded-md`} {...props}>
            {children}
        </button>
    )
}