-- Existing users must reset their password before they can authenticate.
ALTER TABLE "User"
ADD COLUMN "passwordHash" TEXT NOT NULL DEFAULT '!password-reset-required!';

ALTER TABLE "User"
ALTER COLUMN "passwordHash" DROP DEFAULT;
