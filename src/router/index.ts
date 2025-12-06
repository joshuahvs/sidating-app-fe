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
import LoginView from '@/views/LoginView.vue'
import RegisterView from '@/views/RegisterView.vue'
import { toast } from 'vue-sonner'
import { isAuthenticated, isAdmin, canAccessProfile } from '@/lib/rbac'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
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

// Navigation guard for RBAC
router.beforeEach((to, _, next) => {
  const publicPaths = new Set<string>(['/', '/login', '/register'])
  const protectedPaths = ['/profiles', '/profiles/add', '/posts']
  const auth = isAuthenticated()

  // Redirect unauthenticated users trying to access protected routes
  if (!auth && protectedPaths.some((p) => to.path.startsWith(p)) && !publicPaths.has(to.path)) {
    toast.error('Token expired, please log in again')
    return next('/login')
  }

  // Allow public routes
  if (publicPaths.has(to.path)) return next()

  // RBAC rules
  if (to.path === '/profiles' && !isAdmin()) {
    toast.error('Forbidden')
    return next('/')
  }

  if (to.path === '/profiles/add' && !isAdmin()) {
    toast.error('Forbidden')
    return next('/')
  }

  if (to.path.startsWith('/profiles/') && to.params.id && !canAccessProfile(String(to.params.id))) {
    toast.error('Forbidden')
    return next('/')
  }

  // Default allow
  next()
})

export default router
