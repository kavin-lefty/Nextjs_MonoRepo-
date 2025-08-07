
function requireEnv(variable: string | undefined, name: string): string {
  if (!variable) {
    throw new Error(`❌ Missing environment variable: ${name}`);
  }
  return variable;
}

export const MONGODB_URL = requireEnv(process.env.NEXT_PUBLIC_MONGO_URI, "NEXT_PUBLIC_MONGO_URI");
export const STR_DB_NAME = requireEnv(process.env.NEXT_PUBLIC_STR_DB_NAME, "NEXT_PUBLIC_STR_DB_NAME");
