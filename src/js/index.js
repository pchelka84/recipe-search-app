import Search from "./models/Search";
import Recipe from "./models/Recipe";
import List from "./models/List";
import * as searchView from "./views/searchView";
import * as recipeView from "./views/recipeView";
import * as listView from "./views/listView";
import { elements, renderLoader, clearLoader } from "./views/base";

/** GLOBAL STATE OF THE APP
 * - Search object
 * - Current recipe object
 * - Shopping list object
 * - Liked recipes
 */

const state = {};

// TESTING
window.state = state;

/**
 * SEARCH CONTROLLER
 **/
const controlSearch = async () => {
  // 1. Get the query from the view
  const query = searchView.getInput();
  // console.log(query);

  // TESTING
  // const query = "pizza";

  if (query) {
    // 2. New search object and add it to state
    state.search = new Search(query);

    // 3. Prepare UI for results
    searchView.clearInput();
    searchView.clearRusults();
    renderLoader(elements.searchRes);

    try {
      // 4. Search for recepies
      await state.search.getResults();

      // 5. Render results on UI
      clearLoader();
      // console.log(state.search.results);
      searchView.renderResults(state.search.results);
    } catch (err) {
      alert("Something went wrong with the search.");
      clearLoader();
    }
  }
};

elements.searchForm.addEventListener("submit", (e) => {
  e.preventDefault(); // prevent the page from reloading
  controlSearch();
});

// TESTING
// window.addEventListener("load", (e) => {
//   e.preventDefault();
//   controlSearch();
// });

elements.searchResPages.addEventListener("click", (e) => {
  const btn = e.target.closest(".btn-inline");
  // console.log(btn);
  if (btn) {
    const goToPage = parseInt(btn.dataset.goto, 10); // 10 means on base 10 - from 0 tp 9; 2 - binary
    searchView.clearRusults();
    searchView.renderResults(state.search.results, goToPage);
    // console.log(goToPage);
  }
});

/**
 * RECIPE CONTROLLER
 **/

// const r = new Recipe(46956);
// r.getRecipe();
// console.log(r);
const controlRecipe = async () => {
  // Get ID from URL
  const id = window.location.hash.replace("#", "");
  console.log(id);

  if (id) {
    // Prepare UI for changes
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // Highlight selected search item
    if (state.search) searchView.highlightSelected(id);

    // Create new recipe object
    state.recipe = new Recipe(id);

    // TESTING
    // window.r = state.recipe;

    try {
      // Get recipe data and parse ingredients
      await state.recipe.getRecipe();
      // console.log(state.recipe.ingredients);
      state.recipe.parseIngredients();

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();

      // Render recipe
      // console.log(state.recipe);
      clearLoader();
      recipeView.renderRecipe(state.recipe);
    } catch (err) {
      alert("Error processing recipe.");
    }
  }
};

// window.addEventListener("hashchange", controlRecipe);
// window.addEventListener("load", controlRecipe);
// INSTEAD useful when we have numerous different event types
["hashchange", "load"].forEach((event) => {
  window.addEventListener(event, controlRecipe);
});

/**
 * LIST CONTROLLER
 * */
const controlList = () => {
  // Create a new list IF there is none yet
  if (!state.list) state.list = new List();

  // Add each ingredient to the list and UI
  state.recipe.ingredients.forEach((el) => {
    const item = state.list.addItem(el.count, el.unit, el.ingredient);
    listView.renderItem(item);
  });
};

// Handle delete and update list item events
elements.shopping.addEventListener("click", (e) => {
  const id = e.target.closest(".shopping__item").dataset.itemid;

  // Handle delete button
  if (e.target.matches(".shopping__delete, .shopping__delete *")) {
    // Delete from state
    state.list.deleteItem(id);

    // Delete from UI
    listView.deleteItem(id);
  }
});

// Handling recipe button clicks
elements.recipe.addEventListener("click", (e) => {
  if (e.target.matches(".btn-decrease, .btn-decrease *")) {
    // Decrease button is clicked
    if (state.recipe.servings > 1) {
      state.recipe.updateServings("dec");
      recipeView.updateServingsIngredients(state.recipe);
    }
  } else if (e.target.matches(".btn-increase, .btn-increase *")) {
    // Increase button is clicked
    state.recipe.updateServings("inc");
    recipeView.updateServingsIngredients(state.recipe);
  } else if (e.target.matches(".recipe__btn--add, .recipe__btn--add *")) {
    // Add ingredients to shopping list
    controlList();
  }
});

window.l = new List();
