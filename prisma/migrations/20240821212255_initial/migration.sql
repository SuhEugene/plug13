-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(20) NOT NULL,
    "username" VARCHAR(32) NOT NULL,
    "token_version" SMALLINT NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "connection_strings" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "value" CHAR(10) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT now(),
    "owner_id" VARCHAR(20) NOT NULL,
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "connection_strings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_id_key" ON "users"("id");

-- AddForeignKey
ALTER TABLE "connection_strings" ADD CONSTRAINT "connection_strings_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
