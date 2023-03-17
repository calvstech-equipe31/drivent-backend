-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "dayId" INTEGER NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "localId" INTEGER NOT NULL,
    "startHour" VARCHAR(255) NOT NULL,
    "endHour" VARCHAR(255) NOT NULL,
    "duration" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "capacity" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL,
    "updatedAt" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_name_key" ON "Location"("name");

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_fk0" FOREIGN KEY ("dayId") REFERENCES "Day"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_fk1" FOREIGN KEY ("localId") REFERENCES "Location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
