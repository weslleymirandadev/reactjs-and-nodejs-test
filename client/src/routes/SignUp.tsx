import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { SiHiveBlockchain } from "react-icons/si";

const schema = z.object({
    username: z.string().min(3, { message: "Username must be at least 3 characters" }),
    email: z.string().email({ message: "Invalid E-mail" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    repeatPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
});

type FormData = z.infer<typeof schema>;

export function SignUp() {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const navigate = useNavigate();

    const { register, handleSubmit, formState: { errors, isSubmitting, isValid } } = useForm<FormData>({
        resolver: zodResolver(schema),
        mode: "onChange",
    });

    async function onSubmit(data: FormData) {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await api.post('/auth/signup', {
                username: data.username,
                email: data.email,
                password: data.password,
            });

            if (response.data.message) {
                setSuccess("Account created successfully! Redirecting to sign in...");
                setTimeout(() => {
                    navigate('/sign-in', { state: { fromSignUp: true } });
                }, 2000);
            }
        } catch (err: any) {
            if (err.response?.data?.message) {
                setError(err.response.data.message);
            } else if (err.response?.status === 403) {
                setError("User with this email already exists");
            } else {
                setError("An error occurred during registration");
            }
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex justify-center items-center align-middle w-full min-h-screen">
            <section className="max-w-[350px] w-full p-4 bg-white rounded shadow-md">
                <h1 className="text-3xl flex items-center gap-2 mb-5 font-bold bg-gradient-to-r from-blue-600 to-indigo-400 text-transparent bg-clip-text">
                    <SiHiveBlockchain className="text-blue-600" />
                    <span>Sign Up</span>
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                    <div className="relative">
                        <input
                            type="text"
                            {...register("username")}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
                            autoComplete="username"
                            placeholder=" "
                        />
                        <label className="absolute pointer-events-none left-3 top-2 text-gray-500 transition-all duration-200 peer-focus:text-blue-500 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:-translate-x-0 outline-none peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1">
                            Username<span className="text-red-500">*</span>
                        </label>
                        {errors.username && <span className="text-red-500 text-xs mt-1">{errors.username.message}</span>}
                    </div>
                    <div className="relative">
                        <input
                            type="email"
                            {...register("email")}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer"
                            autoComplete="email"
                            placeholder=" "
                        />
                        <label className="absolute pointer-events-none left-3 top-2 text-gray-500 transition-all duration-200 peer-focus:text-blue-500 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:-translate-x-0 outline-none peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1">
                            E-mail<span className="text-red-500">*</span>
                        </label>
                        {errors.email && <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>}
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password")}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer pr-10"
                            autoComplete="new-password"
                            placeholder=" "
                        />
                        <label className="absolute pointer-events-none left-3 top-2 text-gray-500 transition-all duration-200 peer-focus:text-blue-500 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:-translate-x-0 outline-none peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1">
                            Password<span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            tabIndex={-1}
                            className="absolute cursor-pointer right-3 top-5 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.password && <span className="text-red-500 text-xs mt-1">{errors.password.message}</span>}
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("repeatPassword")}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer pr-10"
                            autoComplete="new-password"
                            placeholder=" "
                        />
                        <label className="absolute pointer-events-none left-3 top-2 text-gray-500 transition-all duration-200 peer-focus:text-blue-500 peer-focus:text-sm peer-focus:-translate-y-5 peer-focus:-translate-x-0 outline-none peer-focus:bg-white peer-focus:px-1 peer-[:not(:placeholder-shown)]:text-sm peer-[:not(:placeholder-shown)]:-translate-y-4 peer-[:not(:placeholder-shown)]:bg-white peer-[:not(:placeholder-shown)]:px-1">
                            Repeat Password<span className="text-red-500">*</span>
                        </label>
                        <button
                            type="button"
                            tabIndex={-1}
                            className="absolute cursor-pointer right-3 top-5 -translate-y-1/2 text-gray-500 hover:text-blue-600"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                        {errors.repeatPassword && <span className="text-red-500 text-xs mt-1">{errors.repeatPassword.message}</span>}
                    </div>
                    <button
                        type="submit"
                        className={`bg-blue-600 text-white py-2 rounded font-semibold transition ${(!isValid || isLoading) ? 'opacity-60 cursor-not-allowed' : 'hover:bg-indigo-500 cursor-pointer'}`}
                        disabled={!isValid || isSubmitting || isLoading}
                    >
                        {isLoading ? "Creating account..." : "Sign Up"}
                    </button>
                </form>

                <div className="relative mt-5 flex flex-col justify-between items-center">
                    <hr className="border border-stone-300 absolute w-full" />
                    <p className="text-stone-300 absolute m-0 bg-white p-1 font-bold top-[-15px]">OR</p>
                </div>

                <p className="mt-5 text-gray-600">Already have an account?</p>

                <Link
                    to="/sign-in"
                    className="inline-block w-full text-center mt-2 px-4 py-2 rounded bg-gradient-to-br from-blue-600 to-indigo-400 text-white font-semibold"
                >
                    Sign In
                </Link>
            </section>
        </main>
    );
} 