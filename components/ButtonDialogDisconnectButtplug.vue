<script lang="ts" setup>
import { X } from 'lucide-vue-next';
const { connected, disconnect } = useButtplug();
</script>

<template>
  <AlertDialog>
    <AlertDialogTrigger as-child>
      <Button variant="outline" size="sm" :disabled="!connected">
        <X class="w-4 h-4 mr-2" />
        <span>Отключиться</span>
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Отключение от Intiface Central</AlertDialogTitle>
        <AlertDialogDescription>
          Отключение остановит все подключенные устройства и игра больше не сможет взаимодействовать с ними.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Отмена</AlertDialogCancel>
        <AlertDialogAction @click="disconnect">Отключиться</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>

<style lang="scss" scoped>

</style>
