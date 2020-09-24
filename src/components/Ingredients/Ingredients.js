import React, { useEffect, useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import Search from "./Search";
import IngredientList from "./IngredientList";

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
    console.log("Rendering Ingredients", userIngredients);
  }, [userIngredients]);

  const addIngredientHandler = (ingredient) => {
    fetch("https://react-hook-update-6a174.firebaseio.com/ingredients.json", {
      method: "POST",
      body: JSON.stringify(ingredient),
      headers: { "Content-Type": "application/json" },
    })
      .then((response) => {
        return response.json();
      })
      .then((responseData) => {
        setUserIngredients((prevIngredients) => [
          ...prevIngredients,
          { id: responseData.name, ...ingredient },
        ]);
      });
  };

  const filteredIngredientHandler = useCallback((filteredIngredient) => {
    setUserIngredients(filteredIngredient);
  }, []);

  const removeIngredientHandler = (ingredientId) => {
    fetch(
      `https://react-hook-update-6a174.firebaseio.com/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    ).then((response) => {
      setUserIngredients((prevIngredient) =>
        prevIngredient.filter((ingredients) => ingredients.id !== ingredientId)
      );
    });
  };

  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler} />
      <section>
        <Search onLoadingsIngredient={filteredIngredientHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={(ingredient) => {
            removeIngredientHandler(ingredient);
          }}
        />
      </section>
    </div>
  );
};

export default Ingredients;
