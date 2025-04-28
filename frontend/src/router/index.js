import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Authentication from '../views/Authentication.vue';
import Budgets from '../views/Budgets.vue';
import BudgetDetails from '../views/BudgetDetails.vue';
import Transactions from '@/components/Transactions.vue';
import CreateTransaction from '@/components/CreateTransaction.vue';
import Categories from '../views/Categories.vue'; 
import EditProfile from '../views/EditProfile.vue';
import AdminUsers from '../views/AdminUsers.vue';
import PageNotFound from '../views/PageNotFound.vue';





const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/auth',
    name: 'authentication',
    component: Authentication
  },
  {
    path: '/budgets',
    name: 'budgets',
    component: Budgets
  },
  {
    path: '/budget/:id',
    name: 'budget-details',
    component: BudgetDetails
  },
  {
    path: '/create-budget',
    name: 'create-budget',
    component: () => import('../views/CreateBudget.vue')
  },
  { path: '/transactions', component: Transactions },
  { path: '/create-transaction', component: CreateTransaction },
  {
    path: '/categories',
    name: 'Categories',
    component: Categories,  // Page de gestion des catégories
  },
  {
    path: '/edit-profile',
    name: 'edit-profile',
    component: EditProfile
  },
  {
    path: '/admin/users',
    name: 'admin-users',
    component: AdminUsers
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: PageNotFound
  },
  
];

const router = createRouter({
  history: createWebHistory('/'),
  routes
});

export default router;
