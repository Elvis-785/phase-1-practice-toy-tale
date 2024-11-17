// let addToy = false;

// document.addEventListener("DOMContentLoaded", () => {
//   const addBtn = document.querySelector("#new-toy-btn");
//   const toyFormContainer = document.querySelector(".container");
//   addBtn.addEventListener("click", () => {
//     // hide & seek with the form
//     addToy = !addToy;
//     if (addToy) {
//       toyFormContainer.style.display = "block";
//     } else {
//       toyFormContainer.style.display = "none";
//     }
//   });
// });


document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.querySelector("#toy-collection");
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  const toyForm = document.querySelector(".add-toy-form");

  // Show and hide the form
  addBtn.addEventListener("click", () => {
    toyFormContainer.style.display = toyFormContainer.style.display === "block" ? "none" : "block";
  });

  // Fetch and render toys
  fetch("http://localhost:3000/toys")
    .then(response => response.json())
    .then(toys => {
      toys.forEach(renderToy);
    });

  function renderToy(toy) {
    const div = document.createElement("div");
    div.className = "card";
    div.innerHTML = `
      <h2>${toy.name}</h2>
      <img src="${toy.image}" class="toy-avatar" />
      <p>${toy.likes} Likes</p>
      <button class="like-btn" id="${toy.id}">Like ❤️</button>
    `;
    toyCollection.appendChild(div);

    // Add event listener for like button
    const likeBtn = div.querySelector(".like-btn");
    likeBtn.addEventListener("click", () => {
      toy.likes++;
      updateLikes(toy);
    });
  }

  // Add a new toy
  toyForm.addEventListener("submit", event => {
    event.preventDefault();
    const toyName = toyForm.name.value;
    const toyImage = toyForm.image.value;
    
    fetch("http://localhost:3000/toys", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        name: toyName,
        image: toyImage,
        likes: 0
      })
    })
    .then(response => response.json())
    .then(toy => {
      renderToy(toy);
      toyForm.reset();
      toyFormContainer.style.display = "none";
    });
  });

  // Update toy likes
  function updateLikes(toy) {
    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: toy.likes
      })
    })
    .then(response => response.json())
    .then(updatedToy => {
      const toyCard = document.getElementById(updatedToy.id).parentElement;
      toyCard.querySelector("p").textContent = `${updatedToy.likes} Likes`;
    });
  }
});
