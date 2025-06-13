<script setup>
import AgentChatInterface from './components/AgentChatInterface.vue'
</script>

<template>
  <header>
    <div class="wrapper">
      <h1>AI E-commerce Assistant (ShopPal)</h1>
    </div>
  </header>

  <main>
    <AgentChatInterface />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
  text-align: center;
  margin-bottom: 20px;
}
h1 {
  font-size: 2.2em;
  color: #333;
}
main {
  display: flex;
  justify-content: center;
  padding: 20px;
}
</style>