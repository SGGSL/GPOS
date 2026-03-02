import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // Connection
  const connectionUrl = ref(localStorage.getItem('connectionUrl') || '')

  // Auth
  const cashierName = ref(localStorage.getItem('cashierName') || '')
  const terminalName = ref(localStorage.getItem('terminalName') || '')
  const roleLabel = ref(localStorage.getItem('roleLabel') || 'Cashier')
  const isLoggedIn = ref(!!localStorage.getItem('cashierName'))

  // Session
  const sessionActive = ref(false)
  const sessionStartTime = ref(null)

  // Cart
  const cartItems = ref([])
  const taggedCustomer = ref(null)
  const assignedSalesperson = ref(null)
  const holdBills = ref([])

  // Computed
  const cartTotal = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.price * item.qty, 0)
  )
  const cartCount = computed(() =>
    cartItems.value.reduce((sum, item) => sum + item.qty, 0)
  )

  function setConnection(url) {
    connectionUrl.value = url
    localStorage.setItem('connectionUrl', url)
  }

  function login(data) {
    cashierName.value = data.cashierName || 'Cashier'
    terminalName.value = data.terminalName || 'Terminal-01'
    roleLabel.value = data.roleLabel || 'Cashier'
    isLoggedIn.value = true
    localStorage.setItem('cashierName', cashierName.value)
    localStorage.setItem('terminalName', terminalName.value)
    localStorage.setItem('roleLabel', roleLabel.value)
  }

  function logout() {
    cashierName.value = ''
    terminalName.value = ''
    isLoggedIn.value = false
    sessionActive.value = false
    cartItems.value = []
    taggedCustomer.value = null
    localStorage.removeItem('cashierName')
    localStorage.removeItem('terminalName')
    localStorage.removeItem('roleLabel')
  }

  function toggleSession() {
    if (!sessionActive.value) {
      sessionActive.value = true
      sessionStartTime.value = new Date()
      localStorage.setItem('sessionStartTime', sessionStartTime.value.toLocaleString())
    } else {
      sessionActive.value = false
      sessionStartTime.value = null
      localStorage.removeItem('sessionStartTime')
    }
  }

  function addToCart(product) {
    const existing = cartItems.value.find(i => i.id === product.id)
    if (existing) {
      existing.qty++
    } else {
      cartItems.value.push({ ...product, qty: 1 })
    }
  }

  function removeFromCart(productId) {
    cartItems.value = cartItems.value.filter(i => i.id !== productId)
  }

  function updateQty(productId, delta) {
    const item = cartItems.value.find(i => i.id === productId)
    if (item) {
      item.qty = Math.max(1, item.qty + delta)
    }
  }

  function clearCart() {
    cartItems.value = []
    taggedCustomer.value = null
    assignedSalesperson.value = null
  }

  function setCustomer(customer) {
    taggedCustomer.value = customer
  }

  function setSalesperson(person) {
    assignedSalesperson.value = person
  }

  return {
    connectionUrl, cashierName, terminalName, roleLabel, isLoggedIn,
    sessionActive, sessionStartTime,
    cartItems, taggedCustomer, assignedSalesperson, holdBills,
    cartTotal, cartCount,
    setConnection, login, logout, toggleSession,
    addToCart, removeFromCart, updateQty, clearCart, setCustomer, setSalesperson,
  }
})
