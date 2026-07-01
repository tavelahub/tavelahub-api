-- CreateTable
CREATE TABLE "RefeshToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RefeshToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RefeshToken_token_key" ON "RefeshToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "RefeshToken_userId_key" ON "RefeshToken"("userId");

-- AddForeignKey
ALTER TABLE "RefeshToken" ADD CONSTRAINT "RefeshToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
