<template>
  <div
    class="
      flex
      justify-between
      text-xs
      leading-5
      tracking-wider
      shadow-md
      pr-2
    ">
    <div class="flex items-center gap-x-2">
      <div
        class="
          flex
          items-center
          gap-x-2
          from-primary-50
          to-primary-400
          bg-gradient-to-tr
          pl-2
          pr-4
          text-white
          rounded
          h-full
        ">
        <el-icon :size="24">
          <SuccessFilled />
        </el-icon>
        <p>{{ data.status }}</p>
      </div>
      <div class="flex items-center text-primary-500 gap-x-2">
        <span class="hidden lg:flex">
          <el-icon size="20"><DocumentChecked /></el-icon>
        </span>
        <span class="text-sm text-gray-700 tracking-wider">單號</span>
        <p class="text-sm font-bold tracking-wide">#{{ data?.id }}</p>
      </div>
    </div>
    <el-dropdown @command="handleCommand">
    <span class="flex items-center text-xs text-gray-50 border rounded py-1 px-2 tracking-widest bg-primary-500 my-1">
      變更狀態<el-icon class="el-icon--right"><arrow-down /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="cancel">已取消</el-dropdown-item>
        <el-dropdown-item command="finish">已完成</el-dropdown-item>
        <el-dropdown-item command="back" disabled divided>處理中</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
    <!-- <div class="text-gray-500 flex items-center gap-x-2 py-1">
    <div class="cursor-pointer bg-gray-100 px-3 tracking-wider rounded py-1 hover:text-primary-500 hover:shadow">完成</div>
    <div class="cursor-pointer bg-gray-100 px-3 tracking-wider rounded py-1 hover:text-red-400 hover:shadow">取消</div>
    </div> -->
    <!-- <div class="text-gray-500 flex items-center gap-x-2">
      <div>
      <div class="flex justify-end">
        <p>{{ data?.payStatus }}</p>
      </div>
      <div class="flex justify-between">
        <p>訂單金額：</p>
        <p class="text-primary-500">{{ data?.total.toLocaleString() }}</p>
      </div> </div>
 </div> -->
  </div>
</template>
<script setup>
const props = defineProps({
  data:{type:Object, default:()=>{}},
})
</script>