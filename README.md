This is FraGa (Francesco Gatti) code assignment from [Ombori](https://github.com/ombori/fullstack-code-test-ts).

## Running the project

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Approach to the task

I decided to try out **Next.js** as framework for this code assignment as i wanted to try out the new router approach from version 13.4

Next.js is a **Server side framework for React**, by default it will do server side rendering and serve the HTML directly. This can be seen in the app/users/[id] page, that loads the user data directly from the server.

When **interactivity** is needed, like in our main page with the list of users, than we can still use React normally with the **"use client"** directive on top of the file. This allow us to use the normal React lifecycles.

I dediced to go with **Tailwindcss** instead of styling everything myself to cut off times and make it easier to work. I still spent a bit of time writing css for the custom animation to mock the one from the video provided.

## Next steps

With some extra time i would probably add some unit and e2e tests for the app.

I would also create more components for the user list, avatar, cards etc so that could be reused in a larger project.

With a couple of days of work it would've been possible to also add a custom Node project to hold all the backend logic and add authentication to see "your profile" too.

Finally a nice addition could've been to add a search on top to search for users.