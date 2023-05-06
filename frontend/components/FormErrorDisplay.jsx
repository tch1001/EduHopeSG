export const FormErrorDisplay = ({ field, formik }) => {
    if (!formik.touched[field] || !formik.errors[field]) return;

    return (
        <div className=" text-red-500 font-extralight text-xs">
            {formik.errors[field]}
        </div>
    )
}

export default FormErrorDisplay;