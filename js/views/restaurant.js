"use strict";
import utility from "../utility/utility.js";
class Restaurant {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.eta = data.eta;
    this.tags = data.tags;
    this.rating = data.rating;
    this.html = null;
    this.isFavourite = !!data.isFavourite;
    this.init();
  }

  init() {
    this.render();
  }

  render() {
    let template = `<div class="restaurant">
                      <i class="fa fa-star" aria-hidden="true" data-key=${
                        this.id
                      }></i>
                      <div class="img-holder">
                        <img>
                      </div>
                      <div class="restaurant-info">
                        <div class="Name"><b>Name: </b>${this.name}</div>
                        <div class="ETA"><b>ETA: </b>${this.eta}</div>
                        <div class="Rating"><b>Rating: </b>${this.rating}</div>
                        <div class="Rating"><b>Tags: </b>${this.tags}</div>
                      </div>
                    </div>`;
    this.html = utility.getHTML(template);
    this.updateFavStyle();
  }

  toggleFavourite() {
    this.isFavourite = !this.isFavourite;
    this.updateFavStyle();
  }

  updateFavStyle() {
    this.html
      .querySelector(".fa-star")
      .classList.toggle("selected", this.isFavourite);
  }
}
export default Restaurant;
