import Search from "./models/Search";

/** GLOBAL STATE OF THE APP
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

const controlSearch = async () => {
  // 1. Get the query from the view
  const query = "pizza"; // DOOOO

  if (query) {
    // 2. New search object and add it to state
    state.search = new Search(query);

    // 3. Prepare UI for results

    // 4. Search for recepies
    await state.search.getResults();

    // 5. Render results on UI
    console.log(state.search.results);
  }
};

document.querySelector(".search").addEventListener("submit", (e) => {
  e.preventDefault(); // prevent the page from reloading
  controlSearch();
});
