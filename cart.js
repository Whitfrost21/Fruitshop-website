let iconCart = document.querySelector(".icon-tab");
let body = document.querySelector("body");
let closeCart = document.querySelector(".close");
let listproductHtml = document.querySelector(".listproduct");
let listcartHtml = document.querySelector(".listcart");
let listcartspan = document.querySelector(".icon-tab span");
let checkout = document.querySelector(".checkOut");
let submit = document.querySelector(".submit");
let listproduct = [];
let carts = [];

iconCart.addEventListener("click", () => {
  body.classList.toggle("showcart");
});

closeCart.addEventListener("click", () => {
  body.classList.toggle("showcart");
});

checkout.addEventListener("click", () => {
  document.getElementById("popup").style.display = "block";
});

submit.addEventListener("click", () => {
  document.getElementById("popup").style.display = "none";
  Addcarttomemory();
});

const Adddatatohtml = () => {
  listproductHtml.innerHTML = "";
  if (listproduct.length > 0) {
    listproduct.forEach((product) => {
      let newProduct = document.createElement("div");
      newProduct.classList.add("item");
      newProduct.dataset.id = product.id;
      newProduct.innerHTML = `
      <img src="${product.image}" alt="image" />
      <h2>${product.name}</h2>
      <div class="price">$${product.price}</div>
      <button class="addtocart">Add to Cart</button>`;
      listproductHtml.appendChild(newProduct);
    });
  }
};

listproductHtml.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (positionClick.classList.contains("addtocart")) {
    let product_id = positionClick.parentElement.dataset.id;
    Addtocart(product_id);
  }
});

const Addtocart = (product_id) => {
  let positionThisProductIncart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (carts.length <= 0) {
    carts = [
      {
        product_id: product_id,
        quantity: 1,
      },
    ];
  } else if (positionThisProductIncart < 0) {
    carts.push({
      product_id: product_id,
      quantity: 1,
    });
  } else {
    carts[positionThisProductIncart].quantity++;
  }
  AddcarttoHtml();
  Addcarttomemory();
};

const Addcarttomemory = () => {
  localStorage.setItem("carts", JSON.stringify(carts));
};

const AddcarttoHtml = () => {
  listcartHtml.innerHTML = "";
  let totalQuantity = 0;
  if (carts.length > 0) {
    carts.forEach((cart) => {
      totalQuantity += cart.quantity;
      let newCart = document.createElement("div");
      newCart.classList.add("item");
      newCart.dataset.id = cart.product_id;
      let positionProduct = listproduct.findIndex(
        (value) => value.id == cart.product_id
      );
      let info = listproduct[positionProduct];
      newCart.innerHTML = `
      <div class="image">
      <img src="${info.image}" alt="" />
      </div>
      <div class="name">${info.name}</div>
      <div class="totalPrice">$${info.price * cart.quantity}</div>
      <div class="quantity">
      <span class="minus"><</span>
      <span>${cart.quantity}</span>
      <span class="plus">></span>
      </div>`;
      listcartHtml.appendChild(newCart);
    });
    listcartspan.innerText = totalQuantity;
  }
};

listcartHtml.addEventListener("click", (event) => {
  let positionClick = event.target;
  if (
    positionClick.classList.contains("minus") ||
    positionClick.classList.contains("plus")
  ) {
    let product_id = positionClick.parentElement.parentElement.dataset.id;
    let type = positionClick.classList.contains("plus") ? "plus" : "minus";
    ChangeQuantity(product_id, type);
  }
});

const ChangeQuantity = (product_id, type) => {
  let positionitemincart = carts.findIndex(
    (value) => value.product_id == product_id
  );
  if (positionitemincart >= 0) {
    if (type === "plus") {
      carts[positionitemincart].quantity++;
    } else {
      carts[positionitemincart].quantity--;
      if (carts[positionitemincart].quantity <= 0) {
        carts.splice(positionitemincart, 1);
      }
    }
  }
  Addcarttomemory();
  AddcarttoHtml();
};

const initApp = () => {
  fetch("product.json")
  .then((response) => response.json())
  .then((data) => {
    listproduct = data;
    Adddatatohtml();
    if (localStorage.getItem("carts")) {
      carts = JSON.parse(localStorage.getItem("carts"));
      AddcarttoHtml();
    }
  });
};

initApp();
