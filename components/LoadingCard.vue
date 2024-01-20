<script lang="ts" setup>
import { Loader2 } from 'lucide-vue-next';
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle class="flex flex-row items-center gap-2"><Loader2 class="animate-spin h-4 w-4" /> Пожалуйста, подождите...</CardTitle>
      <CardDescription>Загружаем информацию об аккаунте</CardDescription>
    </CardHeader>
  </Card>
</template>

<style lang="scss" scoped></style>