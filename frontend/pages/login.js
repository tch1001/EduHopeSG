import { useFormik } from 'formik';
import * as Yup from 'yup';
import Link from "next/link";
import useAxios from "../helpers/useAxios";
import Button from "../components/Button";
import Container from "../components/Container";
import Card from "../components/Card";
import styles from "../styles/login.module.css";

function Login() {
    const LoginSchema = Yup.object({
        email: Yup.string()
            .email("Invalid email address")
            .required("Required"),
        password: Yup.string().required("Required")
    });

    const formik = useFormik({
        initialValues: {
            email: "",
            password: ""
        },
        validationSchema: LoginSchema,
        onSubmit: values => {
            const request = useAxios();
            
            const { response, error, isLoading } = request({
                path: "/user/login",
                method: "post",
                data: values
            });
            
            console.log(response);
            console.log(error);
            console.log(isLoading);
        }
    });

    function FormErrorDisplay({ field }) {
        if (!formik.touched[field] || !formik.errors[field]) return;

        return (
            <div className=" text-red-500 font-extralight text-xs">
                {formik.errors[field]}
            </div>
        )
    }

    return (
        <Container center className="p-6 max-w-5xl">
            <Card className="p-4 m-2">
                <span className="text-2xl font-bold block text-center my-2">Login</span>
                <form
                    className="flex flex-col items-center gap-2"
                    onSubmit={formik.handleSubmit}
                    noValidate
                    autoComplete="off"
                >
                    <div className="w-full max-w-sm px-4 py-2">
                        <FormErrorDisplay field="email"/>
                        <label htmlFor="email">Email address</label>
                        <input
                            type="email"
                            id="email"
                            className={styles.input}
                            {...formik.getFieldProps("email")}
                        />
                    </div>
                    <div className="w-full max-w-sm px-4 py-2">
                        <FormErrorDisplay field="password" />
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            id="password"
                            className={styles.input}
                            {...formik.getFieldProps("password")}
                        />
                    </div>
                    <Button type="submit">Login</Button>
                </form>
            </Card>
            <p>
                New to EduHope?{" "}
                <Link href="/signup" className="link" passHref>Join us Now</Link>
            </p>
        </Container>
    );
}

export default Login;
