import dynamic from "next/dynamic"
// icons are sourced from https://heroicons.com/

import Image from 'next/image';

export const Icon = ({ icon, height = 32, width = 32, className, ...props }) => (
    <Image
        priority
        src={`/icons/${icon}.svg`}
        height={height}
        width={width}
        className={`w-6 h-6 stroke-1 ${className}`}
        {...props}
    />
)

export default Icon;