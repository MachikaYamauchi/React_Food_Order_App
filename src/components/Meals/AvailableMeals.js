import { useEffect, useState } from "react";

import classes from "./AvailableMeals.module.css";
import Card from "../UI/Card";
import MealItem from "./MealItem/MealItem";

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  useEffect(() => {
    // Inside of the useeffect, cannot use async directrly, so set the fucntion fetchMeals() and set async inside of the function
    const fetchMeals = async() => {
      const response = await fetch('https://food-order-app-88517-default-rtdb.firebaseio.com/meals.json');
      const responseData = await response.json();

      if(!response.ok) {
        throw new Error("Something went wrong")
      }

      const loadedMeals = [];

      for(const key in responseData) {
        loadedMeals.push({
          id:key,
          name:responseData[key].name,
          description:responseData[key].description,
          price:responseData[key].price
        })
      }
      setMeals(loadedMeals);
      setIsLoading(false);
    }

    // throw error in fetchMeals function -> it resolves coz async return promises
    // catch the error
    fetchMeals().catch((error) => {
      setIsLoading(false);
      setHttpError(error.message);
    })
    
  }, []);

  // when it is Loadign, we do not want to show the <MealItem /> section, so we set this if sentence.
  if(isLoading) {
    return (
      <section className={classes.MealsLoading}>
        <p>Loading...</p>
      </section>
    )
  }

  // if error happes, show this insted of <MealItem /> 
  if(httpError) {
    return (
      <section className={classes.MealsError}>
        <p>{httpError}</p>
      </section>
    )
  }

  const mealsList = meals.map((meal) => (
    <MealItem
      id= {meal.id}
      key={meal.id}
      name={meal.name}
      description={meal.description}
      price={meal.price}
    />
  ));
  return (
    <section className={classes.meals}>
      <Card>
        <ul>{mealsList}</ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
