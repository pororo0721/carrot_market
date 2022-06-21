import { FieldErrors, useForm } from "react-hook-form";

// Less code
// Better validation
// Better errors(set, clear, display   )
// Have control over inputs
// Dont deal with events
//  Easier Inputs

interface LoginForm{
    username: string;
    password: string;
    email: string;
}

export default function Forms() {
    const {register, handleSubmit} = useForm<LoginForm>();
    const onValid = (data:LoginForm) =>{
        console.log('valid');
    };
    const onInvalid = (errors:FieldErrors) =>{
        console.log('invalid', errors);
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
            })} type="email" placeholder="Email"  />
            <input {...register("password", {
                required: "Password is required",
            })} type="password" placeholder="Password" />
            <input type="submit" value="Submit" />
        </form>
        
    );
}