import { useState } from "react";

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

const dragonboneSwordRecipe = {
  name: "Dragonbone Sword",
  ingredients: [
    { name: "Dragon Bone", quantity: 1 },
    { name: "Leather Strips", quantity: 1 },
    { name: "Ebony Ingot", quantity: 1 },
  ],
  skill: "Smithing",
  skillLevel: 100,
  type: "Dragonbone",
};

function Recipes() {
  const [recipes, setRecipes] = useState([
    daedricSwordRecipe,
    dragonboneSwordRecipe,
  ]);

  const list = (
    <ol>
      {recipes.map((recipe, index) => (
        <li key={index}>
          <h3>
            {recipe.name} - requires {recipe.skillLevel}lvl {recipe.skill}
          </h3>
          <ul>
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>
                {ingredient.name} x {ingredient.quantity}
              </li>
            ))}
          </ul>
        </li>
      ))}
    </ol>
  );

  return list;
}

export default Recipes;
