import type {UseFormRegisterReturn} from "react-hook-form";

interface InputProps {
    label: string;
    name: string;
    kind?: "text" | "phone" | "price" | "chat";
    type: string;
    register: UseFormRegisterReturn;
    required: boolean;
  }
  
  export default function Input({
    label,
    name,
    kind="text" ,
    register,
    type,
    required,
  }: InputProps) {
    return (
      <div>
        <label
          className="mb-1 block text-sm font-medium text-gray-700"
          htmlFor={name}
        >
          {label}
        </label>
        {kind === "text" ? (
          <div className="rounded-md relative flex  items-center shadow-sm">
            <input
              id={name}
              required={required}
              {...register}
              type={type}
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        ) : null}
        {kind === "price" ? (
          <div className="rounded-md relative flex  items-center shadow-sm">
            <div className="absolute left-0 pointer-events-none pl-3 flex items-center justify-center">
              <span className="text-gray-500 text-sm">$</span>
            </div>
            <input
              id={name}
              required={required}
              {...register}
              type={type}
              className="appearance-none pl-7 w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
            <div className="absolute right-0 pointer-events-none pr-3 flex items-center">
              <span className="text-gray-500">KRW</span>
            </div>
          </div>
        ) : null}
        {kind === "phone" ? (
          <div className="flex rounded-md shadow-sm">
            <span className="flex items-center justify-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 select-none text-sm">
              +82
            </span>
            <input
              id={name}
              required={required}
              {...register}
              type={type}
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md rounded-l-none shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
          </div>
        ) : null}
        {kind === "chat" ? (
          <div className="flex rounded-md shadow-sm">
            <input
              id={name}
              required={required}
              {...register}
              type={type}
              className="appearance-none w-full px-3 py-2 border border-gray-300 rounded-md rounded-l-none shadow-sm placeholder-gray-400 focus:outline-none focus:ring-orange-500 focus:border-orange-500"
            />
        <div className="absolute top-0.5 right-1.5 text-orange-500 hover:text-orange-600">
        <button className="flex items-center justify-center  select-none text-sm">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                  clipRule="evenod"
                />
              </svg>
            </button>
          </div>
        </div>
      ) : null}


      </div>

    );
  }