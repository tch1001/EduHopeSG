import dynamic from "next/dynamic"
export const Icon = ({ icon, ...props }) => {
    const SVG = dynamic(() => import(`../icons/${icon}.jsx`).then((mod) => mod.default));
    return <SVG {...props} />;
}