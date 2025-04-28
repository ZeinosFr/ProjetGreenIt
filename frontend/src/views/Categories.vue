<template>
    <div class="categories-container">
      <h1>Your Categories</h1>
  
      <!-- Form to Add a New Category -->
      <div class="add-category">
        <h2>Add New Category</h2>
        <form @submit.prevent="createCategory">
          <input 
            v-model="newCategoryName" 
            type="text" 
            placeholder="Category Name" 
            required 
            class="input-field"
          />
          
          <!-- Select Type of Category -->
          <select v-model="newCategoryType" required class="input-field">
            <option value="" disabled>Select Category Type</option>
            <option value="Income">Income</option>
            <option value="Expense">Expense</option>
          </select>
  
          <button type="submit" class="add-btn">Add Category</button>
        </form>
      </div>
  
      <!-- List of Existing Categories -->
      <div class="categories-list">
        <h2>Existing Categories</h2>
        <ul>
          <li 
            v-for="category in categories" 
            :key="category.CategoryID" 
            class="category-item"
          >
            <span class="category-name">{{ category.Name }} - {{ category.Type }}</span>
            <button 
              @click="deleteCategory(category.CategoryID)" 
              class="delete-btn"
            >
              Delete
            </button>
          </li>
        </ul>
      </div>
    </div>
  </template>
  
  <script>
  import axios from "axios";
  import { baseURL } from '@/config';

  export default {
    data() {
      return {
        categories: [],
        newCategoryName: "",
        newCategoryType: "", // Store the selected category type (Income or Expense)
      };
    },
    created() {
      this.fetchCategories();
    },
    methods: {
      // Fetch existing categories
      async fetchCategories() {
        try {
          const response = await axios.get(`${baseURL}/api/categories`, {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
          });
          this.categories = response.data;
        } catch (error) {
          console.error("Error fetching categories:", error);
          alert("Error fetching categories.");
        }
      },
      // Create a new category
      async createCategory() {
        if (!this.newCategoryName.trim()) {
          alert("Category name cannot be empty.");
          return;
        }
        if (!this.newCategoryType) {
          alert("Please select a category type (Income or Expense).");
          return;
        }
  
        try {
          const response = await axios.post(
            `${baseURL}/api/categories`,
            { name: this.newCategoryName.trim(), type: this.newCategoryType },
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          alert(response.data.message);
          this.newCategoryName = ""; // Clear input
          this.newCategoryType = ""; // Clear selected type
          this.fetchCategories(); // Refresh the list
        } catch (error) {
          console.error("Error creating category:", error);
          alert("Error creating category.");
        }
      },
      // Delete a category
      async deleteCategory(categoryId) {
        const confirmDelete = window.confirm("Are you sure you want to delete this category?");
        if (!confirmDelete) return;
  
        try {
          const response = await axios.delete(
            `${baseURL}/api/categories/${categoryId}/delete`,
            {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            }
          );
          alert(response.data.message);
          this.fetchCategories(); // Refresh the list
        } catch (error) {
          console.error("Error deleting category:", error);
          alert("Error deleting category.");
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .categories-container {
    font-family: 'Arial', sans-serif;
    padding: 20px;
    background-color: #f4f7fc;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  }
  
  h1 {
    text-align: center;
    color: #333;
    margin-bottom: 20px;
  }
  
  .add-category,
  .categories-list {
    margin-top: 20px;
    padding: 15px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  .add-category h2,
  .categories-list h2 {
    margin-top: 0;
    color: #2d2d2d;
  }
  
  .input-field {
    width: 100%;
    padding: 10px;
    margin-bottom: 10px;
    font-size: 16px;
    border-radius: 4px;
    border: 1px solid #ccc;
    box-sizing: border-box;
  }
  
  .input-field:focus {
    outline: none;
    border-color: #4c8bf5;
  }
  
  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .category-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    margin-bottom: 10px;
    background-color: #f9f9f9;
    border-radius: 4px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  
  .category-item:hover {
    transform: translateY(-2px);
  }
  
  .category-name {
    font-size: 16px;
    color: #333;
  }
  
  .add-btn,
  .delete-btn {
    background-color: #68a3d6;
    color: white;
    border: none;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.3s ease;
  }
  
  .add-btn:hover,
  .delete-btn:hover {
    background-color: #4a8bb0;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .delete-btn {
    background-color: #ff4d4f;
  }
  
  .delete-btn:hover {
    background-color: #e0433a;
  }
  
  @media (min-width: 768px) {
    .categories-container {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  
    .add-category,
    .categories-list {
      width: 80%;
    }
  }
  </style>
  