const env = process.env.NODE_ENV;
async function main() {
    if (env === 'test') {
        const { seedTest } = await Promise.resolve().then(() => require('./seed-test'));
        await seedTest();
    }
    else {
        const { seedDev } = await Promise.resolve().then(() => require('./seed-dev'));
        await seedDev();
    }
}
main()
    .then(() => {
    console.log(`Prisma seed executed for env=${process.env.NODE_ENV}`);
})
    .catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map