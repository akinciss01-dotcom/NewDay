"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import React, { useState, useEffect } from 'react'; // <-- Yeni Eklendi

// 1. Tip Tanımlaması (API'den gelen veriye uyumlu)
interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory: string;
  strInstructions: string;
  ingredients: string[]; // Önceden birleştirilmiş içerik listesi
}

export function RecipeWidget() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRandomRecipes = async () => {
    setIsLoading(true);
    setError(null);
    const fetchedMeals: Recipe[] = [];
    const API_URL = 'https://www.themealdb.com/api/json/v1/1/random.php';

    for (let i = 0; i < 3; i++) {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error(`HTTP Error: ${response.status}`);
        const data = await response.json();

        if (data.meals?.[0]) {
          const meal = data.meals[0];

          // Malzemeleri birleştir
          const ingredients: string[] = [];
          for (let j = 1; j <= 20; j++) {
            const ingredient = meal[`strIngredient${j}`];
            const measure = meal[`strMeasure${j}`];
            if (ingredient && ingredient.trim() !== "") {
              ingredients.push(`${measure ? measure : ""} ${ingredient}`.trim());
            }
          }

          fetchedMeals.push({
            idMeal: meal.idMeal,
            strMeal: meal.strMeal,
            strMealThumb: meal.strMealThumb,
            strCategory: meal.strCategory,
            strInstructions: meal.strInstructions,
            ingredients: ingredients
          });
        }
      } catch (err) {
        console.error("Fetch Error:", err);
      }
    }
    setRecipes(fetchedMeals);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchRandomRecipes();
  }, []);

  const renderContent = () => {
    if (isLoading) return <div className="text-center py-10 text-primary animate-pulse">Loading recipes...</div>;
    if (error) return <div className="text-center py-10 text-red-500">Error: {error}</div>;

    // DETAY GÖRÜNÜMÜ
    if (selectedRecipe) {
      return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <Button variant="ghost" size="sm" onClick={() => setSelectedRecipe(null)} className="mb-2 -ml-2 text-muted-foreground hover:text-primary">
            ← Back to Recipes
          </Button>

          <div className="relative aspect-video w-full rounded-lg overflow-hidden shadow-md">
            <img src={selectedRecipe.strMealThumb} alt={selectedRecipe.strMeal} className="w-full h-full object-cover" />
            <div className="absolute top-2 right-2">
              <Badge className="bg-white/90 text-black shadow-sm">{selectedRecipe.strCategory}</Badge>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-foreground">{selectedRecipe.strMeal}</h3>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-primary">Ingredients</h4>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground list-disc pl-4">
              {selectedRecipe.ingredients.map((ing, idx) => (
                <li key={idx}>{ing}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="font-semibold text-sm text-primary">Instructions</h4>
            <p className="text-xs text-muted-foreground leading-relaxed whitespace-pre-line">
              {selectedRecipe.strInstructions}
            </p>
          </div>
        </div>
      );
    }

    // LİSTE GÖRÜNÜMÜ
    return (
      <div className="space-y-3">
        {recipes.map((recipe) => (
          <button
            key={recipe.idMeal}
            onClick={() => setSelectedRecipe(recipe)}
            className="w-full p-4 rounded-xl bg-gradient-to-br from-primary/5 to-secondary/5 border border-primary/10 hover:border-primary/30 transition-all text-left group hover:scale-[1.02] active:scale-[0.98]"
          >
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                <img src={recipe.strMealThumb} alt={recipe.strMeal} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {recipe.strMeal}
                </h4>
                <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                  <span className="bg-primary/10 px-2 py-0.5 rounded text-primary font-medium">{recipe.strCategory}</span>
                </div>
              </div>
              <div className="text-primary/50 group-hover:text-primary group-hover:translate-x-1 transition-all">
                →
              </div>
            </div>
          </button>
        ))}
        <Button variant="outline" size="sm" onClick={fetchRandomRecipes} className="w-full mt-2 text-xs">
          ↻ Refresh Recipes
        </Button>
      </div>
    );
  };


  return (
    <Card className="border-2 border-primary/20 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10">
        <div className="flex items-center gap-2">
          {/* SVG ikon kodu aynı kalabilir */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <CardTitle className="text-lg">Healthy Recipes</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Render içeriği buraya yerleşecek */}
        {renderContent()}
      </CardContent>
    </Card>
  )
}