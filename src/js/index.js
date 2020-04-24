import Search from "./models/Search";
import * as searchView from "./views/searchView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** GLOBAL STATE OF THE APP
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

const controlSearch = async () => {
  // 1. Get the query from the view
  const query = searchView.getInput();
  // console.log(query);

  if (query) {
    // 2. New search object and add it to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearRusults();
    renderLoader(elements.searchRes);

    // 4. Search for recepies
    await state.search.getResults();

    // 5. Render results on UI
    clearLoader();
    // console.log(state.search.results);
    searchView.renderResults(state.search.results);
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent the page from reloading
  controlSearch();
});
