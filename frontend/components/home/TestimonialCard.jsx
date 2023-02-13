import { Card } from "../Card"

export const TestimonialCard = ({
    testimonial,
    name,
    member_since,
    stream,
    institution,
    tutor = true,
    ...props
}) => {
    return (
        <Card className="pt-2 pb-4 px-6 min-w-[28rem] snap-start" {...props}>
            <p className="font-medium text-base">"{testimonial}"</p>
            <div className="text-sm mt-3">
                <p className="text-dark-blue">— {name}. {tutor ? "Tutor" : "Tutee"} since {member_since}</p>
                <p className="font-medium">{stream} {tutor ? "tutor" : "tutee"}. Studying in {institution}</p>
            </div>
        </Card>
    )
}