export function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`${name} não definida.`);
    process.exit(1);
  }
  return value;
}
