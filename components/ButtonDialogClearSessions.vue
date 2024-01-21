<script lang="ts" setup>
import { Ban } from 'lucide-vue-next';
const { pending, resetSessions } = useAccount();
</script>

<template>
  <Tooltip>
    <AlertDialog>
      <TooltipTrigger as-child>
        <AlertDialogTrigger as-child>
          <Button variant="outline" size="icon" :disabled="pending"><Ban class="w-4 h-4" /></Button>
        </AlertDialogTrigger>
      </TooltipTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие не может быть отменено. Вы выйдете из аккаунта на всех устройствах, включая это. Все сессии станут невалидны.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction @click="resetSessions">Завершить все сессии</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
    <TooltipContent>Завершить все сессии</TooltipContent>
  </Tooltip>
</template>

<style lang="scss" scoped>

</style>
