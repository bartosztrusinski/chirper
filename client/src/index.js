import "./styles/index.scss";

const daedricSwordRecipe = {
  name: "Daedric Sword",
  ingredients: [
    { name: "Daedra Heart", quantity: 1 },
    { name: "Leather Strips", quantity: 1 },
    { name: "Ebony Ingot", quantity: 2 },
  ],
  skill: "Smithing",
  skillLevel: 90,
  type: "Daedric",
};

console.log("Daedric sword recipe: ", daedricSwordRecipe);

console.log([1, 3, 5].includes(3));

console.log({ ...daedricSwordRecipe, name: "Daedric Greatsword" });

console.log(Object.values(daedricSwordRecipe));
