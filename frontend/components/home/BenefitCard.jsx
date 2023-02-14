import Image from "next/image";

export const BenefitCard = ({ illustration, tagline, description, alternate = false }) => {
    const flexDirection = "flex-col md:flex-row";
    const padding = "sm:w-9/12 md:w-full lg:w-3/4 xl:w-9/12 p-8 sm:px-16 sm:py-12";
    const colorStyling = alternate ? "border-dark-aqua bg-aqua" : "border-gray-200 bg-gray-50";

    let compoundedClassName = `flex gap-12 ${flexDirection} ${padding} border ${colorStyling} rounded-xl items-center`;


    return (
        <div className={compoundedClassName}>
            {
                alternate ?
                    (
                        <>
                            <Image className="w-fit md:w-1/2" src={illustration} alt="" width={300} height={300} />
                            <div className="text-black">
                                <p className="uppercase text-2xl font-medium">{tagline}</p>
                                <p className="text-base">{description}</p>
                            </div>
                        </>
                    ) :
                    (
                        <>
                            <div className="text-black">
                                <p className="uppercase text-2xl font-medium">{tagline}</p>
                                <p className="text-base">{description}</p>
                            </div>
                            <Image className="w-fit md:w-1/2" src={illustration} alt="" width={300} height={300} />
                        </>
                    )
            }
        </div>
    )
}

export default BenefitCard;