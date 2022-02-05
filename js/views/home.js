"use strict";
import utility from "../utility/utility.js";
import Restaurant from "./restaurant.js";
class Home {
  constructor() {
    this.restaurants = [];
    this.html = null;
    this.searchKey = null;
    this.filterBy = null;
    this.sortBy = "name";
    this.showOnlyFavourites = localStorage.getItem("mydata-fav") === "true";
    this.init();
  }

  init() {
    this.getData().then(() => {
      this.render();
      this.addEvents();
    });
  }

  getData() {
    return utility.getJSONData("./js/utility/sampledata.json").then(data => {
      let localStorageData = utility.getFromLocalStorage("mydata");
      let map = {};
      localStorageData.forEach(res => {
        map[res.id] = res
      });
      
      this.restaurants = data.map(rest => {
        rest.isFavourite = map[rest.id] ? map[rest.id].isFavourite : false;
        return new Restaurant(rest);
      });
    });
  }

  render() {
    let template = `<div class="home">
        <div class="header">
          <input class="search" placeholder="search restaurant"></input>
          <div class="sorting">
            <span>Sort By</span>
            <select id="sorting">
              <option value="name">Name</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div class="filtering">
            <span>Filter By</span>
            <select id="filtering">
              <option value="">All</option>
              <option value="biryani">Biryani</option>
              <option value="burger">Burger</option>
              <option value="chinese">Chinese</option>
              <option value="ice cream">Ice Cream</option>
            </select>
          </div>
          <button class="favourites"> Show only Favourites
          </button>
        </div>
        <div class="restuarants">
        </div>
      </div>`;
    this.html = utility.getHTML(template);
    const container = document.querySelector("#maincontainer");
    container.appendChild(this.html);
    this.updateFavBtnStyle();
    this.generateRestaurantsView(this.restaurants);
  }

  generateRestaurantsView() {
    const restaurantsContainer = this.html.querySelector(".restuarants");
    restaurantsContainer.innerHTML = "";
    let restuarants = this.restaurants;
    restuarants = this.restaurants.filter(res => {
      let match = this.showOnlyFavourites ? res.isFavourite : true;
      if (match && this.searchKey) {
        match = res.name.toLowerCase().indexOf(this.searchKey) > -1;
      }
      if (match && this.filterBy) {
        match = res.tags.indexOf(this.filterBy) > -1;
      }
      return match;
    });
    if (restuarants) {
      if (this.sortBy) {
        restuarants = restuarants.sort((r1, r2) => {
          return r1[this.sortBy] < r2[this.sortBy] ? 0 : -1;
        });
      }
      if (restaurantsContainer) {
        restuarants.forEach(restaurant => {
          restaurantsContainer.appendChild(restaurant.html);
        });
      }
    }
  }

  addEvents() {
    this.handleSearch();
    this.handleFilter();
    this.handleSort();
    this.toggleFavourite();
    this.applyFavouriteFilter();
  }

  handleSearch() {
    const search = this.html.querySelector("input");
    if (search) {
      let searchCallback = utility.debounce(event => {
        event.preventDefault();
        event.stopPropagation();
        this.searchKey = this.html.querySelector("input").value.toLowerCase();
        this.generateRestaurantsView();
      }, 400);
      utility.addEventListener("keyup", search, event => searchCallback(event));
    }
  }

  handleFilter() {
    const filter = this.html.querySelector("#filtering");
    utility.addEventListener("change", filter, event => {
      event.stopPropagation();
      this.filterBy = this.html.querySelector("#filtering").value;
      this.generateRestaurantsView();
    });
  }

  handleSort() {
    const sortBy = this.html.querySelector("#sorting");
    utility.addEventListener("change", sortBy, event => {
      event.stopPropagation();
      this.sortBy = this.html.querySelector("#sorting").value;
      this.generateRestaurantsView();
    });
  }

  toggleFavourite() {
    const restuarantsContainer = this.html.querySelector(".restuarants");
    utility.addEventListener("click", restuarantsContainer, event => {
      event.stopPropagation();
      if (event.target.dataset.key) {
        const id = event.target.dataset.key;
        const selectedRestaurant = this.restaurants.find(res => res.id === id);
        if (selectedRestaurant) {
          selectedRestaurant.toggleFavourite();
          this.updateLocalStorage();
        }
      }
    });
  }

  applyFavouriteFilter() {
    const filter = this.html.querySelector(".favourites");
    utility.addEventListener("click", filter, event => {
      event.stopPropagation();
      this.showOnlyFavourites = !this.showOnlyFavourites;
      this.updateFavBtnStyle();
      this.generateRestaurantsView();
      utility.resetLocalStorage("mydata-fav", this.showOnlyFavourites);
    });
  }

  updateFavBtnStyle() {
    this.html
      .querySelector(".favourites")
      .classList.toggle("selected", this.showOnlyFavourites);
  }

  updateLocalStorage() {
    utility.resetLocalStorage("mydata", this.restaurants);
  }
}
export default Home;
