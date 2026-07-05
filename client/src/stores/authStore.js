import { defineStore } from 'pinia'
import { ref } from 'vue'
import { post } from '../services/api'
import { useRouter } from 'vue-router'

export const useAuthStore = defineStore('auth', () => {
    const router  = useRouter()
    const usuario = ref(JSON.parse(localStorage.getItem('usuario')) || null)
    const token   = ref(localStorage.getItem('token') || null)

    const login = async (email, password) => {
        const res = await post('/auth/login', {
            USU_email: email,
            USU_password: password
        })
        if (res.token) {
            token.value   = res.token
            usuario.value = res.usuario
            localStorage.setItem('token',   res.token)
            localStorage.setItem('usuario', JSON.stringify(res.usuario))
            if (res.usuario.USU_role === 'admin') {
                router.push('/admin')
            } else {
                router.push('/')
            }
        }
        return res
    }

    const register = async (datos) => {
        return await post('/auth/register', datos)
    }

    const logout = () => {
        token.value   = null
        usuario.value = null
        localStorage.removeItem('token')
        localStorage.removeItem('usuario')
        router.push('/login')
    }

    const isLoggedIn = () => !!token.value
    const isAdmin    = () => usuario.value?.USU_role === 'admin'

    return { usuario, token, login, register, logout, isLoggedIn, isAdmin }
})