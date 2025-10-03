import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import PostView from '../views/PostView.vue'
import CreatePostView from '../views/CreatePostView.vue'
import DetailPostView from '../views/DetailPostView.vue'
import EditPostView from '../views/EditPostView.vue'
import DetailProfileView from '../views/DetailProfileView.vue'
import CreateProfileView from '../views/CreateProfileView.vue'
import EditProfileView from '../views/EditProfileView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    // Post routes
    {
      path: '/posts',
      name: 'posts',
      component: PostView,
    },
    {
      path: '/posts/add',
      name: 'create-post',
      component: CreatePostView,
    },
    {
      path: '/posts/:id',
      name: 'detail-post',
      component: DetailPostView,
    },
    {
      path: '/posts/:id/edit',
      name: 'edit-post',
      component: EditPostView,
    },
    {
      path: '/profiles',
      name: 'profile',
      component: ProfileView,
    },
    {
      path: '/profiles/:id',
      name: 'detail-profile',
      component: DetailProfileView,
    },
    {
      path: '/profiles/add',
      name: 'create-profile',
      component: CreateProfileView,
    },
    {
      path: '/profiles/:id/edit',
      name: 'edit-profile',
      component: EditProfileView,
    }
  ],
})

export default router
