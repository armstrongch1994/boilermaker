/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */

// this is saying take the default from our navbar (which is the connected component ) and export it as something thats named Navbar

export { default as Navbar } from './navbar';
export { default as MainNav } from './MainNav';
export { default as UserHome } from './User-home';
export { Login, Signup } from './auth-form';

/**
 * this index file is really used like an index, we pull in all of the components we've created and organize them into an easily usable group of components and then export them
 */
