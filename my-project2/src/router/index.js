import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Profile from '@/components/user/Profile'
import SignIn from '@/components/user/SignIn'
import SignUp from '@/components/user/SignUp'
import SubmitDesign from '@/components/designs/SubmitDesign'
import Gallery from '@/components/Gallery'
import ModifyStream from '@/components/designs/edit/ModifyStream'
import AuthGuard from './auth-guard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/submitdesign',
      name: 'SubmitDesign',
      component: SubmitDesign,
      beforeEnter: AuthGuard
    },
    {
      path: '/modifyStream/:id',
      name: '/ModifyStream',
      component: ModifyStream,
			props: true,
			beforeEnter: AuthGuard
    
    },
    {
      path: '/profile',
      name: 'Profile',
      component: Profile,
      beforeEnter: AuthGuard
    },
		{
      path: '/gallery',
      name: 'Gallery',
      component: Gallery,
      beforeEnter: AuthGuard
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: SignIn
    },
    {
      path: '/signup',
      name: 'SignUp',
      component: SignUp
    },
  ],
  mode: 'history'
})
