import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'

export const MONEDAS = {
    USD: { simbolo: '$',      nombre: 'Dólar estadounidense', tasaPEN: 3.75 },
    PEN: { simbolo: 'S/',     nombre: 'Sol peruano',           tasaPEN: 1 },
    EUR: { simbolo: '€',      nombre: 'Euro',                  tasaPEN: 4.05 },

    // Latinoamérica
    MXN: { simbolo: 'MX$',    nombre: 'Peso mexicano',         tasaPEN: 0.20 },
    COP: { simbolo: 'COP$',   nombre: 'Peso colombiano',       tasaPEN: 0.00091 },
    CLP: { simbolo: 'CLP$',   nombre: 'Peso chileno',          tasaPEN: 0.0039 },
    ARS: { simbolo: 'AR$',    nombre: 'Peso argentino',        tasaPEN: 0.0032 },
    BRL: { simbolo: 'R$',     nombre: 'Real brasileño',        tasaPEN: 0.67 },
    UYU: { simbolo: 'UY$',    nombre: 'Peso uruguayo',         tasaPEN: 0.094 },
    BOB: { simbolo: 'Bs',     nombre: 'Boliviano',             tasaPEN: 0.54 },
    PYG: { simbolo: '₲',      nombre: 'Guaraní paraguayo',     tasaPEN: 0.00051 },
    GTQ: { simbolo: 'Q',      nombre: 'Quetzal guatemalteco',  tasaPEN: 0.49 },
    VES: { simbolo: 'Bs.S',   nombre: 'Bolívar venezolano',    tasaPEN: 0.063 },

    // Asia
    CNY: { simbolo: 'CN¥',    nombre: 'Yuan chino',            tasaPEN: 0.52 },
    JPY: { simbolo: 'JP¥',    nombre: 'Yen japonés',           tasaPEN: 0.024, decimales: 0 },
    KRW: { simbolo: '₩',      nombre: 'Won surcoreano',        tasaPEN: 0.0027, decimales: 0 },
}

const MONEDA_POR_DEFECTO = 'USD'

export const useCurrencyStore = defineStore('currency', () => {
    const guardada = localStorage.getItem('modyn_currency')
    const codigo = ref(guardada && MONEDAS[guardada] ? guardada : MONEDA_POR_DEFECTO)

    watch(codigo, (nuevo) => {
        localStorage.setItem('modyn_currency', nuevo)
    })

    const actual = computed(() => MONEDAS[codigo.value])

    const cambiar = (nuevoCodigo) => {
        if (MONEDAS[nuevoCodigo]) codigo.value = nuevoCodigo
    }

    // Convierte un monto guardado en soles (PEN) a la moneda seleccionada por el usuario
    const convertir = (montoPEN) => {
        const monto = Number(montoPEN) || 0
        return monto / actual.value.tasaPEN
    }

    // Formatea un monto guardado en soles (PEN) según la moneda seleccionada, ej: "$13.31", "S/ 49.90", "JP¥ 1234"
    const formatear = (montoPEN) => {
        const convertido = convertir(montoPEN)
        const decimales = actual.value.decimales ?? 2
        return `${actual.value.simbolo} ${convertido.toFixed(decimales)}`
    }

    return { codigo, actual, MONEDAS, cambiar, convertir, formatear }
})
