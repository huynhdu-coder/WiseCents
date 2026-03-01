-- CreateTable
CREATE TABLE "bank_accounts" (
    "account_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "plaid_item_id" TEXT NOT NULL,
    "plaid_account_id" TEXT NOT NULL,
    "name" VARCHAR(100),
    "official_name" VARCHAR(100),
    "type" VARCHAR(50),
    "subtype" VARCHAR(50),
    "current_balance" DECIMAL(12,2),
    "available_balance" DECIMAL(12,2),
    "nickname" VARCHAR(50),
    "is_hidden" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bank_accounts_pkey" PRIMARY KEY ("account_id")
);

-- CreateTable
CREATE TABLE "goals" (
    "goal_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "name" VARCHAR(100) NOT NULL,
    "target_amount" DECIMAL(12,2),
    "current_amount" DECIMAL(12,2) DEFAULT 0,
    "deadline" DATE,
    "funding_account_id" INTEGER,
    "recurring_amount" DECIMAL(12,2),
    "recurring_frequency" VARCHAR(20),
    "last_recurring_date" DATE,

    CONSTRAINT "goals_pkey" PRIMARY KEY ("goal_id")
);

-- CreateTable
CREATE TABLE "plaid_items" (
    "plaid_id" SERIAL NOT NULL,
    "user_id" INTEGER,
    "plaid_access_token" TEXT NOT NULL,
    "plaid_item_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "access_token_cipher" TEXT,
    "access_token_iv" BYTEA,
    "access_token_tag" BYTEA,
    "cursor" TEXT,

    CONSTRAINT "plaid_items_pkey" PRIMARY KEY ("plaid_id")
);

-- CreateTable
CREATE TABLE "transactions" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "plaid_transaction_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "date" DATE NOT NULL,
    "category_primary" VARCHAR(50),
    "category_detailed" VARCHAR(100),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "user_id" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "phone" VARCHAR(20),
    "dob" DATE,
    "is_admin" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,
    "primary_intent" VARCHAR(50) DEFAULT 'general_budgeting',
    "advice_style" VARCHAR(50) DEFAULT 'balanced',
    "change_tolerance" VARCHAR(50) DEFAULT 'moderate',
    "ai_data_consent" VARCHAR(10),

    CONSTRAINT "users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "goal_contributions" (
    "contribution_id" SERIAL NOT NULL,
    "goal_id" INTEGER NOT NULL,
    "account_id" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "goal_contributions_pkey" PRIMARY KEY ("contribution_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "bank_accounts_plaid_account_id_key" ON "bank_accounts"("plaid_account_id");

-- CreateIndex
CREATE UNIQUE INDEX "plaid_items_plaid_item_id_key" ON "plaid_items"("plaid_item_id");

-- CreateIndex
CREATE INDEX "idx_plaid_items_user_item" ON "plaid_items"("user_id", "plaid_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "transactions_plaid_transaction_id_key" ON "transactions"("plaid_transaction_id");

-- CreateIndex
CREATE INDEX "transactions_user_id_idx" ON "transactions"("user_id");

-- CreateIndex
CREATE INDEX "transactions_account_id_idx" ON "transactions"("account_id");

-- CreateIndex
CREATE INDEX "transactions_date_idx" ON "transactions"("date");

-- CreateIndex
CREATE INDEX "transactions_category_primary_idx" ON "transactions"("category_primary");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_plaid_item_id_fkey" FOREIGN KEY ("plaid_item_id") REFERENCES "plaid_items"("plaid_item_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "bank_accounts" ADD CONSTRAINT "bank_accounts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "fk_goal_funding_account" FOREIGN KEY ("funding_account_id") REFERENCES "bank_accounts"("account_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "goals" ADD CONSTRAINT "goals_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "plaid_items" ADD CONSTRAINT "plaid_items_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "bank_accounts"("account_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "goal_contributions" ADD CONSTRAINT "fk_account" FOREIGN KEY ("account_id") REFERENCES "bank_accounts"("account_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "goal_contributions" ADD CONSTRAINT "fk_goal" FOREIGN KEY ("goal_id") REFERENCES "goals"("goal_id") ON DELETE CASCADE ON UPDATE NO ACTION;
