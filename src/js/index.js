import Search from "./models/Search";

/** GLOBAL STATE OF THE APP
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

const search = new Search("pizza");
console.log(search);
search.getResults();
