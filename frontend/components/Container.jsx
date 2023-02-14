export const Container = ({ children, className, center, ...props }) => (
    <div
        className={`container mx-auto px-2 md:px-4 ${className} ${center ? "flex flex-col items-center" : ""}`}
        {...props}
    >
        {children}
    </div>
)

export default Container;