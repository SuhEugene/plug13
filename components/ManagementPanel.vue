<script lang="ts" setup>
</script>

<template>
  <div class="w-full flex flex-col lg:flex-row gap-4">
    <div class="flex flex-col gap-4 md:flex-row lg:flex-col lg:basis-[384px]">
      <UserAccountCard class="flex-grow md:my-auto lg:my-0 lg:flex-grow-0" />
      <CodeStringCard class="md:max-w-sm lg:max-w-none" />
    </div>
    <ButtplugCard class="flex-grow lg:min-h-[80vh]" />
  </div>
</template>

<style lang="scss" scoped></style>
