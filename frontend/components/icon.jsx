import dynamic from "next/dynamic"
// icons are sourced from https://heroicons.com/

export const Icon = ({ icon, className = "w-6 h-6 stroke-1", ...props }) => {
    const SVG = dynamic(() => import(`../icons/${icon}.jsx`).then((mod) => mod.default));
    return <SVG className={className} {...props} />;
}