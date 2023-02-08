export const Button = ({ children, ...props }) => {
    return (
        <button className="border border-sky-blue bg-[#bfe7ff] px-6 py-2 rounded-md" {...props}>
            {children}
        </button>
    )
}