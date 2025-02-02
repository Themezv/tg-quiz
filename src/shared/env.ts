type EnvVariable = 'TELEGRAM_BOT_TOKEN' | 'APP_STAGE' | 'SITE_URL';

export function env(name: EnvVariable) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing ENV variable: ${name}`);
    }
    return value;
}
