<template>
  <div class="grid grid-cols-3">
    <section class="cols-span-1">
      <PreOrderCard
        v-for="order in state.tableData"
        :key="order.id"
        :status="state.selectedStatus"
        :order="order"
        :type2name="state.type2name" />
    </section>

    <section class="cols-span-2"></section>
  </div>
</template>
<script setup>
import PreOrderCard from '@/components/Card/PreOrderCard.vue'
import GridContent from '@/components/Table/GridContent.vue'
</script>