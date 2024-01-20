<script lang="ts" setup>
const { openOauth2Page } = useAccount();
</script>

<template>
  <Card>
    <CardHeader>
      <CardTitle>Вход в аккаунт</CardTitle>
      <CardDescription>Для продолжения, нужно войти в аккаунт</CardDescription>
    </CardHeader>
    <CardContent>
      <Button @click="openOauth2Page()" class="w-full">Войти через Discord</Button>
    </CardContent>
  </Card>
</template>

<style lang="scss" scoped></style>