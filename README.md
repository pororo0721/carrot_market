# Carrot Market
Serverless Carrot Market Clone using NextJS, Tailwind, Prisma, PlanetScale and Cloudflare.

### Getting Started


```bash
npx create-next-app@latest
# or
yarn create next-app
```


### NextJS, React latest version installed (React 18 version as of Feb. 2022)

``` npm i next@latest react@rc react-dom@rc ```

### Get started with Tailwind CSS

```npm install -D tailwindcss postcss autoprefixer ```

### After the installation is complete:

Run ```npm run dev```or ```yarn dev ```to start the development server on http://localhost:3000.

### Preview

1.Log In
- Token generation upon entering email or mobile phone number
- create user
- Storing user information in session through iron session when entering token

![enter](https://user-images.githubusercontent.com/79802132/207609782-371e59f9-2f34-44d4-b711-aff397148734.png)

<hr />

2. product upload
- Enter product information
- Pass the data entered in useForm to useMutaion that performs post fetch.
- Create a product when clicking the Upload iteam button
- Receive the data transmitted to the server through req.body and write the required data into the model created through prisma.

![home](https://user-images.githubusercontent.com/79802132/207612671-9ffa4368-5aa1-4833-ba63-758950207c9b.png)


