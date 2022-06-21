import { FieldErrors, useForm } from "react-hook-form";



// Better errors(set, clear, display   )
// Have control over inputs



interface LoginForm{
    username: string;
    password: string;
    email: string;
    errors?: string;
}

export default function Forms() {
    const {register, handleSubmit, formState: {errors}, setError} = useForm<LoginForm>({
        mode: "onChange",
    });
    const onValid = (data:LoginForm) =>{
        console.log('valid');
    };
    const onInvalid = (errors:FieldErrors) =>{
        console.log('invalid', errors);
        setError("errors",{message:"Backed is offline sorry."});
    }

    return(
        <form onSubmit={handleSubmit(onValid, onInvalid)}>
            <input {...register("username", {
                required: "Username is required",
                minLength: {
                    value: 5,
                    message: "Username must be at least 5 characters"
                }
            })} type="text" placeholder="Username"  />
            <input {...register("email", {
                required: "Email is required",
                validate:{
                    notGmail: (value) => !value.includes("@gmail.com") || "Must not be a gmail account"
                }
            })} type="email" placeholder="Email" className={`${Boolean(errors.email?.message) ? "border-x-red-500":""}`} />
            {errors.email?.message}
            <input {...register("password", {
                required: "Password is required",
            })} type="password" placeholder="Password" />
            <input type="submit" value="Submit" />
            {errors.errors?.message}
        </form>
        
    );
}